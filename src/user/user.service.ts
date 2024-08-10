import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from 'src/order/schemas/order.schema';
import { Model } from 'mongoose';
import { startOfDay, endOfDay } from 'date-fns';
import { OrderStatus } from 'src/order/schemas/order.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async report(date: string) {
    const start = startOfDay(new Date(date));
    const end = endOfDay(new Date(date));
    console.log(new Date('2024-08-10T12:12:00.800+00:00'));

    console.log(start, end);

    const result = await this.orderModel.aggregate([
      {
        $match: { status: { $ne: OrderStatus.CANCELLED } },
      },
      {
        $facet: {
          totalMetrics: [
            {
              $group: {
                _id: null,
                total_revenue: { $sum: '$totalAmount' },
                total_orders: { $count: {} },
              },
            },
            {
              $project: {
                _id: 0,
                total_revenue: 1,
                total_orders: 1,
              },
            },
          ],
          productCounts: [
            {
              $unwind: '$products',
            },
            {
              $group: {
                _id: '$products.name',
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                product: '$_id',
                count: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          totalMetrics: { $arrayElemAt: ['$totalMetrics', 0] },
          productCounts: 1,
        },
      },
    ]);

    return result[0];
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from 'src/order/schemas/order.schema';
import { Model } from 'mongoose';
import { startOfDay, endOfDay } from 'date-fns';
import { OrderStatus } from 'src/order/schemas/order.schema';
import { RedisCacheService } from 'src/cache/redis.cache';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private redis: RedisCacheService,
  ) {}

  async report(date: string) {
    const start = startOfDay(new Date(date));
    const end = endOfDay(new Date(date));

    const dataFromRedis = await this.redis.get('date');

    if (dataFromRedis) return JSON.parse(dataFromRedis);

    const result = await this.orderModel.aggregate([
      {
        $match: {
          status: { $ne: OrderStatus.CANCELLED },
          createdAt: {
            $gte: new Date(start),
            $lte: new Date(end),
          },
        },
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

    this.redis.set(`${date}`, JSON.stringify(result));

    return result[0];
  }
}

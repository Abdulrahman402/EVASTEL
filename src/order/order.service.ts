import { Injectable } from '@nestjs/common';
import { Order } from './schemas/order.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AddOrderDto, UpdateOrderDto } from './order.dto';
import { Product } from 'src/product/schemas/product.schema';
import { Request } from 'express';
import { CustomException } from 'src/common/filters/custom-exception.filter';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async addOrder(addOrderData: AddOrderDto, req: Request) {
    const products = await this.productModel.find({
      _id: {
        $in: addOrderData.products,
      },
    });

    const totalAmount = products.reduce(
      (sum, product) => sum + Number(product.price),
      0,
    );

    const order = await this.orderModel.create({
      customer: new Types.ObjectId(req['user']._id),
      products: products,
      totalAmount,
    });

    return order.populate('customer', '-password');
  }

  async allOrders() {
    const orders = await this.orderModel
      .find({})
      .populate('customer', '-password');

    if (!orders || orders.length == 0)
      throw new CustomException('No orders found');

    return orders;
  }

  async getOrder(orderId: Types.ObjectId) {
    const order = await this.orderModel
      .findById(orderId)
      .populate('customer', '-password');

    if (!order) throw new CustomException('Order not found');

    return order;
  }

  async updateOrder(orderId: Types.ObjectId, updateData: UpdateOrderDto) {
    const order = await this.orderModel.findById(orderId);

    if (!order) throw new CustomException('Order not found');

    const updatedOrder = await this.orderModel.findOneAndUpdate(
      { _id: orderId },
      updateData,
      { new: true },
    );

    return updatedOrder.populate('customer', '-password');
  }
}

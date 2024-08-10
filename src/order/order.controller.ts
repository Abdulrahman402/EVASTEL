import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { AddOrderDto, UpdateOrderDto } from './order.dto';
import { Request } from 'express';
import { Roles } from 'src/user/roles.decorator';
import { Role } from 'src/user/schemas/user.schema';
import { Types } from 'mongoose';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('add_order')
  @Roles(Role.ADMIN, Role.VISITOR)
  async addOrder(@Req() req: Request, @Body() addOrderData: AddOrderDto) {
    return await this.orderService.addOrder(addOrderData, req);
  }

  @Get('all')
  @Roles(Role.ADMIN)
  async allOrder() {
    return await this.orderService.allOrders();
  }

  @Get('/:order_id')
  @Roles(Role.ADMIN, Role.VISITOR)
  async getOrder(@Param('order_id') orderId: Types.ObjectId) {
    return await this.orderService.getOrder(orderId);
  }

  @Put('/:order_id')
  @Roles(Role.ADMIN, Role.VISITOR)
  async updateOrder(
    @Param('order_id') orderId: Types.ObjectId,
    @Body() updateData: UpdateOrderDto,
  ) {
    return await this.orderService.updateOrder(orderId, updateData);
  }
}

import {
  IsNotEmpty,
  IsMongoId,
  ArrayNotEmpty,
  IsArray,
  IsString,
  IsEnum,
} from 'class-validator';
import { Types } from 'mongoose';
import { OrderStatus } from './schemas/order.schema';

export class AddOrderDto {
  @IsNotEmpty()
  @ArrayNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  products: Types.ObjectId[];
}

export class UpdateOrderDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

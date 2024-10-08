import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from 'src/order/schemas/order.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RedisCacheService } from 'src/cache/redis.cache';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, RedisCacheService],
})
export class UserModule {}

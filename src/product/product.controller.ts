import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Types } from 'mongoose';
import { Roles } from 'src/user/roles.decorator';
import { Role } from 'src/user/schemas/user.schema';
import { ProductDto } from './product.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Roles(Role.ADMIN)
  @Post('add_product')
  async addProduct(@Body() productData: ProductDto) {
    return await this.productService.addProduct(productData);
  }

  @Roles(Role.ADMIN)
  @Put('/:product_id')
  async updateProduct(
    @Body() productData: ProductDto,
    @Param('product_id') product_id: Types.ObjectId,
  ) {
    return await this.productService.updateProduct(product_id, productData);
  }

  @Roles(Role.ADMIN)
  @Delete('/:product_id')
  async deleteProduct(@Param('product_id') product_id: Types.ObjectId) {
    return await this.productService.deleteProduct(product_id);
  }

  @Get('all')
  async all() {
    return await this.productService.allProducts();
  }

  @Get('/:product_id')
  async getProduct(@Param('product_id') product_id: Types.ObjectId) {
    return await this.productService.getProduct(product_id);
  }
}

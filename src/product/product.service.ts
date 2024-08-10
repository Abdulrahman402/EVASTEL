import { Injectable } from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CustomException } from 'src/common/filters/custom-exception.filter';
import { ProductDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async addProduct(addProductData: ProductDto) {
    let product = await this.productModel.findOne({
      name: addProductData.name,
    });
    if (product) throw new CustomException('Product already added');

    product = await this.productModel.create(addProductData);

    return product;
  }

  async updateProduct(
    productId: Types.ObjectId,
    updatedProductData: ProductDto,
  ) {
    const product = await this.productModel.findById({
      _id: productId,
    });
    if (!product) throw new CustomException('Product Not found');

    const updatedProduct = await this.productModel.findOneAndUpdate(
      { _id: productId },
      updatedProductData,
    );

    return updatedProduct;
  }

  async deleteProduct(productId: Types.ObjectId) {
    const product = await this.productModel.findByIdAndUpdate(
      {
        _id: productId,
      },
      { deletedAt: new Date() },
    );

    return `Product ${product.name} Deleted`;
  }

  async getProduct(productId: Types.ObjectId) {
    const product = await this.productModel.findOne({
      _id: productId,
      deletedAt: null,
    });

    if (!product) throw new CustomException('Product Not found');

    return product;
  }

  async allProducts() {
    const products = await this.productModel.find({ deletedAt: null });
    console.log(products);

    if (!products || products.length == 0)
      throw new CustomException('No products found');

    return products;
  }
}

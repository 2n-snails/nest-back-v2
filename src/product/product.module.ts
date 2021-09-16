import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ProductCreateService } from './query/productCreate.query.service';

@Module({
  imports: [AuthModule, UserModule],
  providers: [ProductService, ProductCreateService],
  controllers: [ProductController],
})
export class ProductModule {}

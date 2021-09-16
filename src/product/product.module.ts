import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ProductCreateService } from './query/productCreate.query.service';
import { ProductReadService } from './query/productRead.query.service';
import { ProductUpdateService } from './query/productUpdate.query.service';
import { ProductDeleteService } from './query/productDelete.query.service';

@Module({
  imports: [AuthModule, UserModule],
  providers: [
    ProductService,
    ProductCreateService,
    ProductReadService,
    ProductUpdateService,
    ProductDeleteService,
  ],
  controllers: [ProductController],
})
export class ProductModule {}

import { ChatModule } from './chat/chat.module';
import { Chat } from './entity/chat.entity';
import { Wish } from 'src/entity/wish.entity';
import { State } from './entity/state.entity';
import { Review } from 'src/entity/review.entity';
import { ReComment } from 'src/entity/recomment.entity';
import { Product } from 'src/entity/product.entity';
import { ProductCategory } from 'src/entity/product_category.entity';
import { Category } from 'src/entity/category.entity';
import { Deal } from './entity/deal.entity';
import { User } from 'src/entity/user.entity';
import { AddressCity } from 'src/entity/address_city.entity';
import { AddressArea } from './entity/address_area.entity';
import { Comment } from './entity/comment.entity';
import { Image } from './entity/image.entity';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { RavenModule, RavenInterceptor } from 'nest-raven';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CommonModule } from './common/common.module';
import { ChatGateway } from './chat/chat.gateway';
import { SocketClient } from './entity/socket.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? '.env.development'
          : '.env.test',
      // production 환경일 때는 configModule이 환경변수 파일을 무시한다.
      // prod할 때는 따로 넣기로 하자.
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/src/migrations/*.ts'],
      cli: { migrationsDir: 'src/migrations' },
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      keepConnectionAlive: true,
    }),
    TypeOrmModule.forFeature([
      AddressArea,
      AddressCity,
      Category,
      Chat,
      Comment,
      Deal,
      Image,
      ProductCategory,
      Product,
      ReComment,
      Review,
      State,
      User,
      Wish,
      SocketClient,
    ]),
    AuthModule,
    RavenModule,
    UserModule,
    ProductModule,
    CommonModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor(),
    },
    AppService,
  ],
  exports: [AppService],
})
export class AppModule implements NestModule {
  // 미들웨어들은 consumer에 연결
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

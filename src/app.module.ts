import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'process';
import { AuthService } from './user/auth.service';
import { UtilsService } from './utils/utils.service';
import { CategoryService } from './category/category.service';
import { CategoryController } from './category/category.controller';
import { PostService } from './post/post.service';
import { PostController } from './post/post.controller';
import { CollectionService } from './collection/collection.service';
import { CollectionController } from './collection/collection.controller';
import { OverviewService } from './overview/overview.service';
import { OverviewController } from './overview/overview.controller';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: env.JWT_SIGN_KEY,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [
    AppController,
    UserController,
    CategoryController,
    PostController,
    CollectionController,
    OverviewController,
  ],
  providers: [
    AppService,
    UserService,
    AuthService,
    UtilsService,
    CategoryService,
    PostService,
    CollectionService,
    OverviewService,
  ],
})
export class AppModule {}

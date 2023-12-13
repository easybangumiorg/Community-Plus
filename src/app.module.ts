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

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: env.JWT_SIGN_KEY,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [AppController, UserController, CategoryController],
  providers: [
    AppService,
    UserService,
    AuthService,
    UtilsService,
    CategoryService,
  ],
})
export class AppModule {}

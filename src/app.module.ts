import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { env } from 'process';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: env.JWT_SIGN_KEY,
      signOptions: { expiresIn: '3h' },
    }),
    ScheduleModule.forRoot(),
    UserModule,
    CategoryModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}

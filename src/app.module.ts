import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { env } from 'process';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { CollectionModule } from './collection/collection.module';
import { ChoreographyModule } from './choreography/choreography.module';

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
    CollectionModule,
    ChoreographyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

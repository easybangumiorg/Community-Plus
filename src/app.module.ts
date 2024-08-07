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
import { ParsemethodModule } from './parsemethod/parsemethod.module';
import { PostModule } from './post/post.module';
import { TagModule } from './tag/tag.module';

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
    ParsemethodModule,
    PostModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

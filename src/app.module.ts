import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { BlogsModule } from './blogs/blogs.module';
import { Blog } from './blogs/entities/blog.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: Number(process.env.DATABASE_PORT),
      host: process.env.DATABASE_LOCALHOST,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Blog],
      synchronize: true,
    }),
    UsersModule,
    BlogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

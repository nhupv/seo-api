import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category/entities/category.entity';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ConsoleModule } from 'nestjs-console';
import { TelegramBotModule } from './telegram/telegram.module';
import { BullModule } from '@nestjs/bull';
import { DashboardModule } from './dashboard/dashboard.module';
import { JobsModule } from './jobs/jobs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DomainModule } from './domain/domain.module';
import { TrackingDomainModule } from './tracking-domain/tracking-domain.module';
import * as moment from 'moment-timezone';
import { UsersController } from './users/users.controller';
import { CsvModule } from 'nest-csv-parser';
import { MulterModule } from '@nestjs/platform-express';

@Global()
@Module({
  imports: [
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DB_HOST}:27017/${process.env.DATABASE}`,
      entities: [Category],
      useNewUrlParser: true,
      authSource: 'admin',
      useUnifiedTopology: true,
      logging: true,
      synchronize: true,
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_HOST}:27017/${process.env.DATABASE}?retryWrites=false`,
      {
        dbName: process.env.DATABASE,
        authSource: 'admin',
        user: process.env.DATABASE_USER,
        pass: process.env.DATABASE_PASSWORD,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        retryWrites: false,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      },
    ),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: +configService.get('REDIS_PORT_LOCAL'),
        },
      }),
      inject: [ConfigService],
    }),
    // ElasticsearchModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     node: configService.get('ELASTICSEARCH_NODE'),
    //   }),
    //   inject: [ConfigService],
    // }),
    // CategoriesModule,
    ConsoleModule,
    TelegramBotModule,
    DashboardModule,
    // JobsModule,
    DomainModule,
    TrackingDomainModule,
    CsvModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'Moment',
      useValue: moment,
    },
  ],
  // exports: [ElasticsearchModule, 'Moment'],
  exports: ['Moment'],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(UsersController);
  }
}

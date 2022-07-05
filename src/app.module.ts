import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SearchModule } from './search/search.module';
import { CveModule } from './cve/cve.module';
import { PostsModule } from './posts/posts.module';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { IndexsModule } from './indexs/indexs.module';
import { CategoriesModule } from './categories/categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { PostsController } from './posts/posts.controller';
import { ConsoleModule } from 'nestjs-console';
import { TelegramBotModule } from './telegram/telegram.module';
import { BullModule } from '@nestjs/bull';
import { AnyrunModule } from './anyrun/anyrun.module';
import { MalwareModule } from './malware/malware.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { JobsModule } from './jobs/jobs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SessionModule } from './session/session.module';
import { CveYearlyModule } from './cve-yearly/cve-yearly.module';
import { DomainModule } from './domain/domain.module';
import * as moment from 'moment-timezone';

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
    MongooseModule.forRoot(`mongodb://${process.env.DB_HOST}:27017/`, {
      dbName: process.env.DATABASE,
      authSource: 'admin',
      user: process.env.DATABASE_USER,
      pass: process.env.DATABASE_PASSWORD,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    }),
    // SearchModule,
    // PostsModule,
    // CveModule,
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
    // IndexsModule,
    // CategoriesModule,
    // CategoryModule,
    ConsoleModule,
    TelegramBotModule,
    // AnyrunModule,
    // MalwareModule,
    DashboardModule,
    // JobsModule,
    SessionModule,
    DomainModule,
    // CveYearlyModule,
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
    consumer.apply(LoggerMiddleware).forRoutes(PostsController);
  }
}

import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';


import { KeywordModule } from './api/keyword/keyword.module';
import { VideoModule } from './api/video/video.module';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';

import { CommonModule } from './api/common/common.module';
import { KeywordSubscriber } from '@root/database/subscriber/keyword.subscriber';
import { KeywordUserSubscriber } from './database/subscriber/keywordUser.subscriber';
import { ScheduleModule } from '@nestjs/schedule';
import {
  GoogleTrendService,
  MovieTrendService,
  // NaverDataLabKeyword,
  ScheduleServie,
} from './api/common/services/schedule.service';
import { Movie } from './database/entities/netflixMovie.entity';

export class Config {
  static setENV = () => {
    let envFilePath: string;
    switch (process.env.NODE_ENV) {
      case 'prod':
        envFilePath = '.prod.env';
        break;
      case 'test':
        envFilePath = '.test.env';
        break;
      default:
        envFilePath = '.dev.env';
        break;
    }
    return ConfigModule.forRoot({ envFilePath });
  };

  static setMySQL(isTest: boolean) {
    return TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: 3306,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [__dirname + `/**/*.entity.{js,ts}`],
      subscribers: [KeywordSubscriber, KeywordUserSubscriber],
      synchronize: isTest,
      extra: {
      
        //  sql_mode: "STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION",

  }
    });
  }

  // 0716: sqlite를 이용해 테스트를 진행하면 어떨까 라고 생각했지만 dev환경과 차이가 생각보다
  // 많이 나서 테스트를 진행하지 못했다.
  // static setSqlite() {
  //   return TypeOrmModule.forRoot({
  //      type: 'sqlite',
  //     database: ':memory:',
  //     entities: [__dirname + '/**/*.entity{.ts,.js}'],
  //     synchronize: true,
  //     dropSchema: true,
  //   })
  // }

  static setModule() {
    return [
      AuthModule,
      UserModule,
      VideoModule,
      // CommentModule,
      KeywordModule,
      CommonModule,
    ];
  }
}

@Module({
  imports: [
    Config.setENV(),
    Config.setMySQL(process.env.NODE_ENV === 'test'),
    ...Config.setModule(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Movie]),
  ],
  controllers: [],
  providers: [
    KeywordSubscriber,
    ScheduleServie,
    GoogleTrendService,
    // NaverDataLabKeyword,
    MovieTrendService,
  ],
  exports: [],
})
export class AppModule {
  constructor(private movieTrendService: MovieTrendService) {

    // 키워드 등록
    // this.movieTrendService.getMovieTrend();
    // this.movieTrendService.getSinger()
  }
}

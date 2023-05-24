import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './api/auth/auth.controller';
import { AuthService } from './api/auth/auth.service';
import { UserController } from './api/user/user.controller';
import { UserService } from './api/user/user.service';
import { CommentModule } from './api/comment/comment.module';
import { KeywordModule } from './api/keyword/keyword.module';
import { VideoModule } from './api/video/video.module';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { VideoController } from './api/video/controllers/video.controller';
import { KeywordController } from './api/keyword/keyword.controller';
import { CommonService } from './api/common/services/common.service';
import { CommonResponseDto } from './api/common/dto/response.dto';
import { JwtStrategy } from './api/auth/jwt/jwt.strategy';
import { UserRepositoyry } from './api/user/repositories/user.repository';
import { CommonModule } from './api/common/common.module';
import { KeywordSubscriber } from '@root/database/subscriber/keyword.subscriber';
import { KeywordUserSubscriber } from './database/subscriber/keywordUser.subscriber';
import { ScheduleModule } from '@nestjs/schedule';
import {
  GoogleTrendService,
  MovieTrendService,
  NaverDataLabKeyword,
  ScheduleServie,
} from './api/common/services/schedule.service';
import { VideoService } from './api/video/services/video.service';
import { VideoRepository } from './api/video/repositories/video.repository';
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

  static setMySQL(synchronize: boolean) {
    return TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: 3306,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [__dirname + `/**/*.entity.{js,ts}`],
      subscribers: [KeywordSubscriber, KeywordUserSubscriber],
      synchronize,
    });
  }

  static setModule() {
    return [
      AuthModule,
      UserModule,
      VideoModule,
      CommentModule,
      KeywordModule,
      CommonModule,
    ];
  }
}

@Module({
  imports: [
    Config.setENV(),
    Config.setMySQL(process.env.NODE_ENV == 'prod' ? false : true),
    ...Config.setModule(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Movie]),
  ],
  controllers: [],
  providers: [
    KeywordSubscriber,
    ScheduleServie,
    GoogleTrendService,
    NaverDataLabKeyword,
    MovieTrendService,
  ],
  exports: [],
})
export class AppModule {}

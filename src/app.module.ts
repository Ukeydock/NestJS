import { Module } from '@nestjs/common';
import {
  AppController,
  KeywordController,
  VideoController,
} from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Common } from './database/entities/common.entity';
import { User } from './database/entities/user.entity';
import { Auth } from './database/entities/auth.entity';
import {
  Keyword,
  KeywordUser,
  KeywordVideo,
} from './database/entities/keyword.entity';
import { Video, VideoUser } from './database/entities/video.entity';

export class Config {
  static setENV = () => {
    let envFilePath: string;
    switch (process.env.NODE_ENV) {
      case 'production':
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
      entities: [
        Common,
        User,
        Auth,
        Keyword,
        Video,
        VideoUser,
        KeywordUser,
        KeywordVideo,
      ],
      synchronize,
    });
  }
}

@Module({
  imports: [Config.setENV(), Config.setMySQL(true)],
  controllers: [AppController, KeywordController, VideoController],
  providers: [AppService],
})
export class AppModule {}

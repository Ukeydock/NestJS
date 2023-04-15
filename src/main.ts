import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import {
  HttpExceptionFilter,
  TypeOrmExceptionFilter,
} from './common/middlewares/error/error.middleware';
import { join } from 'path';

class App {
  private logger = new Logger(App.name);
  private PORT: string;
  private corsOriginList: string[];
  private ADMIN_USER: string;
  private ADMIN_PASSWORD: string;
  constructor(private server: NestExpressApplication) {
    this.server = server;

    this.PORT = process.env.SERVER_PORT || '5000';
    this.corsOriginList = process.env.CORS_ORIGIN_LIST
      ? process.env.CORS_ORIGIN_LIST.split(',').map((origin) => origin.trim())
      : ['*'];
    this.ADMIN_USER = process.env.ADMIN_USER || 'admin';
    this.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'pass';
  }

  private setUpBasicAuth() {
    this.server.use(
      ['/docs'],
      expressBasicAuth({
        challenge: true,
        users: {
          [this.ADMIN_USER]: this.ADMIN_PASSWORD,
        },
      }),
    );
  }

  private viewConfigure() {
    this.server.useStaticAssets(join(__dirname, '..', 'src', 'public'));
    this.server.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));
    this.server.setViewEngine('ejs');
  }

  private setUpOpenAPIMidleware() {
    SwaggerModule.setup(
      'docs',
      this.server,
      SwaggerModule.createDocument(
        this.server,
        new DocumentBuilder()
          .setTitle('Ukeydock - API')
          .setDescription(
            `유키독 <br>
              4월 2일 추가 <br>
               Respone규칙 : <br>
               sucess : true fasle
               <br>
               <b> 1. 기본적으로 테이블 이름 + 속성의 이름 예 : (commentComment => comment테이블의 comment속성), (postId => post테이블의 id속성)  <b><br>
               <b> 2. 상태변화는 is로 시작 예 : (isPostLike => 해당 Post의 Like속성의 상태 , 기본적으로 true or false) <b> <br>
               <b> 3. 속성의 수는 count로 시작 예 : (countPostView => 해당 Post의 view의 갯수, 반드시 숫자)
              `,
          )
          .setVersion('0.0.1')
          .addBearerAuth(
            {
              type: 'http',
              scheme: 'bearer',
              name: 'JWT',
              in: 'header',
            },
            'access-token',
          )
          .build(),
      ),
    );
  }

  private async setUpGlobalMiddleware() {
    this.server.enableCors({
      origin: true,
      credentials: true,
    });
    this.server.use(cookieParser());
    this.setUpOpenAPIMidleware();
    this.setUpBasicAuth();
    this.server.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    this.server.useGlobalFilters(new HttpExceptionFilter());
    this.server.useGlobalFilters(new TypeOrmExceptionFilter());

    this.server.use(passport.initialize());
    // this.server.use(passport.session());
    this.server.useGlobalInterceptors(
      new ClassSerializerInterceptor(this.server.get(Reflector)),
    );
  }

  async bootstrap() {
    this.viewConfigure();
    await this.setUpGlobalMiddleware();
    await this.server.listen(this.PORT);
  }

  startLog() {
    if (process.env.NODE_ENV != 'prod') {
      this.logger.log(`✅ Server on http://localhost:${this.PORT}😝`);
    } else {
      this.logger.log(`✅ Server on port ${this.PORT}...`);
    }
  }
}

async function bootstrap() {
  const server = await NestFactory.create<NestExpressApplication>(AppModule);
  const app = new App(server);
  await app.bootstrap();
  app.startLog();
}
bootstrap();

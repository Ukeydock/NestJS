import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
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
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();

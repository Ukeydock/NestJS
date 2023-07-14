import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { Config } from '@root/app.module';



describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        Config.setENV(),
        Config.setMySQL(false),
        
        ,AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
});

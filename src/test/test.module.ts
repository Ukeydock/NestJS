import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';

  export const setTestModule = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        
        AppModule],
    }).compile();

    return moduleFixture;
  }



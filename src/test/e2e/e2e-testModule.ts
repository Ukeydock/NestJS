import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppModule, Config } from "@root/app.module";
import { CreateTestData, entites } from "../test.module";
import { INestApplication } from "@nestjs/common";


export const createTestingModule = async () => {
    let app : INestApplication

    const TestingModule: TestingModule = await Test.createTestingModule({
            imports: [
                Config.setENV(),
    
                TypeOrmModule.forRoot({
                    dropSchema: true,
                    type: 'mysql',
                    host: process.env.MYSQL_HOST,
                    port: 3306,
                    username: process.env.MYSQL_USERNAME,
                    password: process.env.MYSQL_PASSWORD,
                    database: process.env.MYSQL_DATABASE,
                    entities: [`src/**/*.entity.{js,ts}`],
                    synchronize: true,
                    // dropSchema 옵션은 어플리케이션 구동시 스키마들을 모두 삭제함.
                }),
                AppModule,
                TypeOrmModule.forFeature([...entites ]),
            
    
            ],
            providers: [CreateTestData],

        }).compile()


    let createTestData = TestingModule.get<CreateTestData>(CreateTestData);
    await createTestData.createTestData();

    app = TestingModule.createNestApplication();
    await app.init();
    return app
}
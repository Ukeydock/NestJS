import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { createTestingModule } from "./e2e-testModule";

describe('KeywordController (e2e)', () => {
    let app : INestApplication
    beforeAll(async () => {
         app = await createTestingModule()
    })
})
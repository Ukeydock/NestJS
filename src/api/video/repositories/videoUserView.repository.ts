import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { View } from "@root/database/entities/view.entity";
import { Repository } from "typeorm";
import { CreateVideoUserDto } from "../dto/videoUserView/videoUser.dto";

@Injectable()
export class VideoUserRepository {
    constructor(
        @InjectRepository(View)
        protected videoUserViewRepositoy: Repository<View>
    ) { }

    async create(createVideoUserDto: CreateVideoUserDto) {
        const view = new View();
        view.video = createVideoUserDto.videoDbId;
        view.user = createVideoUserDto.userId;

        await this.videoUserViewRepositoy.save(view);

    }
}
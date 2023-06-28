import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { View } from "@root/database/entities/view.entity";
import { Repository } from "typeorm";
import { CreateVideoUserDto, FindAllVideoUserViewDto } from "../dto/videoUserView/videoUser.dto";

@Injectable()
export class VideoUserRepository {
    constructor(
        @InjectRepository(View)
        protected videoUserViewRepositoy: Repository<View>
    ) { }

    async findAllByUserId(findAllVideoUserViewDto: FindAllVideoUserViewDto) {
        const findALlQuery = this.videoUserViewRepositoy.createQueryBuilder("V01")
            .select(`V01.videoId AS videoId`)

        return await findALlQuery.getRawMany();

    }

    async findCountByVideoId(videoId: number) : Promise<{viewCount : number}>  {
        const findALlQuery = this.videoUserViewRepositoy.createQueryBuilder("V01")
            .select(`COUNT(V01.videoId) AS viewCount`)
        findALlQuery.where(`V01.videoId = ${videoId}`)
        return  await findALlQuery.getRawOne();
    }

    async findAllByVideoId(videoId: number) {
        const findALlQuery = this.videoUserViewRepositoy.createQueryBuilder("V01")
            .select(`V01.videoId AS videoId`)
        findALlQuery.where(`V01.videoId = ${videoId}`)

        return await findALlQuery.getRawMany();
    }

    async create(createVideoUserDto: CreateVideoUserDto) {
        const view = new View();
        view.video = createVideoUserDto.videoDbId;
        view.user = createVideoUserDto.userId;

        await this.videoUserViewRepositoy.save(view);

    }

    async updateIsRecentlyByVideoId(videoId: number) {
        await this.videoUserViewRepositoy.update({ video: videoId }, { isRecently: false });
    }
}
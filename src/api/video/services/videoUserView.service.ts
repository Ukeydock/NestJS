import { Injectable } from "@nestjs/common";
import { CreateVideoUserDto } from "../dto/videoUserView/videoUser.dto";
import { VideoUserRepository } from "../repositories/videoUserView.repository";

@Injectable()
export class VideoUserService {
    constructor(

        private readonly videoUserRepository: VideoUserRepository
    ) { }


    async create(createVideoUserDto: CreateVideoUserDto) {
        return await this.videoUserRepository.create(createVideoUserDto);
    }

}



import { Injectable } from "@nestjs/common";
import { CreateVideoUserDto, FindAllVideoUserViewDto } from "../dto/videoUserView/videoUser.dto";
import { VideoUserRepository } from "../repositories/videoUserView.repository";
import { VideoUser } from "@root/database/entities/video.entity";

@Injectable()
export class VideoUserService {
    constructor(

        private readonly videoUserRepository: VideoUserRepository
    ) { }

    /**
     * 
     * @param userId 
     * @param limit 몇개나 조회할지
     * @returns 해당 유저의 비디오 조회기록(중복 체크 안함)
     */
    async findAllByUserId(findAllVideoUserViewDto: FindAllVideoUserViewDto): Promise<VideoUser[]> {
        return await this.videoUserRepository.findAllByUserId(findAllVideoUserViewDto);
    }

    async findCountByVideoId(videoId: number): Promise<{viewCount : number}> {
        return await this.videoUserRepository.findCountByVideoId(videoId);
    }

    async create(createVideoUserDto: CreateVideoUserDto) {
        return await this.videoUserRepository.create(createVideoUserDto);
    }

    async updateIsRecentlyByVideoId(videoId: number): Promise<void> {
        await this.videoUserRepository.updateIsRecentlyByVideoId(videoId);
    }
    

}



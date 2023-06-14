import { ApiProperty, PickType } from "@nestjs/swagger";
import { VideoUser } from "@root/database/entities/video.entity";

export class VideoUserDto extends VideoUser {

    @ApiProperty()
    videoDbId: number;

    @ApiProperty()
    userId: number;

    @ApiProperty({
        default: 100
    })
    limit?: number = 100;
}

export class FindAllVideoUserViewDto extends PickType(VideoUserDto, [
    "userId",
    "limit",
] as const) { }



export class CreateVideoUserDto extends PickType(VideoUserDto, [
    "videoDbId",
    "userId",
] as const) { }
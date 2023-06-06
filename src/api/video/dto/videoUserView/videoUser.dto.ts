import { ApiProperty, PickType } from "@nestjs/swagger";
import { VideoUser } from "@root/database/entities/video.entity";

export class VideoUserDto extends VideoUser {

    @ApiProperty()
    videoDbId: number;

    @ApiProperty()
    userId: number;
}

export class CreateVideoUserDto extends PickType(VideoUserDto, [
    "videoDbId",
    "userId",
] as const) { }
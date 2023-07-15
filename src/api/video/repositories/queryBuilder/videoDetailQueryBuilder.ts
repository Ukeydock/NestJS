import { InjectRepository } from "@nestjs/typeorm";
import { Video } from "@root/database/entities/video.entity";
import { VideoDetail } from "@root/database/entities/videoDetail.entity";
import { Repository, SelectQueryBuilder } from "typeorm";

export class FindVideoDetailQueryBuilder {
  private query: SelectQueryBuilder<Video>;

  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @InjectRepository(VideoDetail)
    private videoDetailRepository: Repository<VideoDetail>,
  ) {}

  private setJoinVideoDetail() {
    this.query.leftJoin(`videoDetail`, `VD01`, `VD01.id = V01.videoDetailId`);

    this.query.addSelect([
      `VD01.platform AS videoPlatform`,
      `VD01.defaultLanguage AS videoDefaultLanguage`,
    ]);
  }

  public async findOneByVideoDbId(videoDbId: number) : Promise<Video> {
    this.query = this.videoRepository
      .createQueryBuilder(`V01`)
      .select([
        `V01.id AS videoDbId`,
        `V01.videoId AS videoId`,
        `V01.createdDate AS videoCreatedDate`,
        `V01.title AS videoTitle`,
        `V01.description AS videoDescription`,
        `V01.viewCount AS videoViewCount`,
        `V01.commentCount AS videoCommentCount`,
        `V01.libraryCount AS videoLibraryCount`,
      ])
      .where(`V01.id = ${videoDbId}`);

    this.setJoinVideoDetail();

    return await this.query.getRawOne();
  }
}
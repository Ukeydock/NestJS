import { Repository, SelectQueryBuilder } from "typeorm";
import { FindAllViewVidoDto } from "../../dto/requestVideo.dto";
import { Video } from "@root/database/entities/video.entity";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class VideoListQueryBuilder {
  protected query: SelectQueryBuilder<Video>;

  @InjectRepository(Video)
  protected videoRepository: Repository<Video>;

 
  
    

  get getQuery() {
    return this.query;
  }

  private setOrder(order : string, sort : `ASC` | `DESC`) {
        this.query.orderBy(`V01.${order}`, sort);

    }

  protected setKeyword(keywordId : number) {
    this.query.innerJoin(`keywordVideo`, `VK01`, `VK01.videoId = V01.id`)
    .innerJoin(`keyword`, `K01`, `K01.id = VK01.keywordId `)
    .addSelect([`K01.id AS videoKeywordId`,`K01.keyword AS videoKeyword`])
    .groupBy(`K01.id, K01.keyword , V01.title , V01.id , VU01.id` )
      
    if(!keywordId) return;
    this.query
    .andWhere(`VK01.keywordId = ${keywordId}`)


  }

  protected setOffset(page : number, limit : number) {
    const offset = (page - 1) * limit;
    this.query.offset(offset);
    this.query.limit(limit);
  }

  public async getRawMany(){
    // this.query.groupBy(`V01.id`);

    return await this.query.getRawMany()
  }

    public async getRawOne(){
    // this.query.groupBy(`V01.id`);

    return await this.query.getRawOne()
    }
 
}

@Injectable()
export class VideoListQueryBuilderForView extends VideoListQueryBuilder {
    constructor(){
        super()    
         
    }

    private setQuery() {
        this.query = this.videoRepository
      .createQueryBuilder(`V01`)
      .select([
        `V01.title AS videoTitle`,
        `V01.id AS videoDBId`,
        `V01.thumbnail AS videoThumbnail`,
        `V01.description AS videoDescription`,
        `V01.videoId AS videoId`,
        `V01.viewCount AS videoViewCount`,
      ])
    
    }

    private setCountQuery(){
      this.query = this.videoRepository
      .createQueryBuilder(`V01`)
      .select([
        `COUNT(VU01.id) AS videoCount`
      ])

    }

    private setOrderView(order : FindAllViewVidoDto['order'], sort : FindAllViewVidoDto['sort']) {
    switch (sort) {
        case `date`:
            this.query.orderBy(`VU01.id`, order);
            break;
        case `view`:
            this.query.orderBy(`V01.viewCount`, order);
            break;
        case `comment`:
            this.query.orderBy(`V01.commentCount`, order);
            break;
    }
    }

    private setJoinVideoUser(userId : number) {
        this.query.innerJoin(`videoUserView`, `VU01`, `VU01.videoId = V01.id`)
        .andWhere(`VU01.userId = :userId`, {userId})
        .andWhere(`VU01.isRecently = true`)
        .addSelect([
            `VU01.createdAt AS videoCreatedAt`,

        ])
       
    }

    public async getViewVideoData(userId : number ,keywordId : number, FindAllViewVidoDto : FindAllViewVidoDto){
        this.setQuery()
        this.setJoinVideoUser(userId);
        this.setKeyword(keywordId);
        this.setOrderView(FindAllViewVidoDto.order, FindAllViewVidoDto.sort);
        this.setOffset(FindAllViewVidoDto.page, FindAllViewVidoDto.limit);
        return await this.getRawMany();
    }

    public async getMaxPageNumber(userId : number,keywordId : number, FindAllViewVidoDto : FindAllViewVidoDto){
        this.setCountQuery()
        this.setJoinVideoUser(userId);
        this.setKeyword(keywordId);
        const videoCount = await this.query.getCount()
        return Math.ceil(videoCount / FindAllViewVidoDto.limit) === 0 
        ? 1 
        : Math.ceil(videoCount / FindAllViewVidoDto.limit);
    }

}


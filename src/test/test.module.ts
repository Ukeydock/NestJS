import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@root/database/entities/user.entity';
import { Repository } from 'typeorm';
import { Auth } from '@root/database/entities/auth.entity';
import { Injectable } from '@nestjs/common';
import { Keyword, KeywordUser, KeywordVideo } from '@root/database/entities/keyword.entity';
import { Video } from '@root/database/entities/video.entity';

export const entites = [
  Auth,
  User,
  Keyword,
  KeywordUser,
  Video,
  KeywordVideo,
]


@Injectable()
export class CreateTestData{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,

    @InjectRepository(Keyword)
    private readonly keywordRepository: Repository<Keyword>,

    @InjectRepository(KeywordUser)
    private readonly keywordUserRepository: Repository<KeywordUser>,

    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,

    @InjectRepository(KeywordVideo)
    private readonly keywordVideoRepository: Repository<KeywordVideo>,

  ){}

  // 키워드 생성
  private async createTestKeyword(){
    const keyword1 = await this.keywordRepository.insert({
      keyword: 'test-keyword',
    })
    const keyword2 = await this.keywordRepository.insert({
      keyword: 'test-keyword2',
    })
    const keyword3 = await this.keywordRepository.insert({
      keyword: 'test-keyword3',
    })

  }

  // 비디오를 생성하고 키워드와 연결시키기
  private async createVideo(){

    const createKeywordVideo = async(videoId: number, keywordId: number) =>{
      this.keywordVideoRepository.insert({
        video: { id : videoId },
        keyword: { id : keywordId },
      })
    }        

    const video1 = await this.videoRepository.insert({
      title: 'test-video',
      description: 'test-video-description',
      thumbnail: 'test-video-thumbnail',
      viewCount: 0,
      duration: "10m",
      videoId: "test-video-id",
    })
    createKeywordVideo(video1.identifiers[0].id, 1)
    const video2 = await this.videoRepository.insert({
      title: 'test-video2',
      description: 'test-video-description2',
      thumbnail: 'test-video-thumbnail2',
      viewCount: 0,
      duration: "20m",
      
      videoId: "test-video-id2",
    })
    createKeywordVideo(video2.identifiers[0].id, 2)
    const video3 = await this.videoRepository.insert({
      title: 'test-video3',
      description: 'test-video-description3',
      thumbnail: 'test-video-thumbnail3',
      viewCount: 0,      
      duration: "30m",
      videoId: "test-video-id3",
    })
    createKeywordVideo(video3.identifiers[0].id, 3)
  }

  private async createTestKeywordUser(){
    const keywordUser1 = await this.keywordUserRepository.insert({
      keyword: {id : 1},
      user: {id :1},
    })
    const keywordUser2 = await this.keywordUserRepository.insert({
      keyword: {id :2},
      user: {id : 1},
    })
  }

  private async createTestUser(){
    // 유저가 생성되면 auth도 함께 생성되어야함.
    const createTestAuth = async(userId: number) =>{
        await this.authRepository.insert({
          email: `test${userId}@example.com`,
          snsId: `123456789+${userId}`,
          platform: 'test',
          user: { id : userId },
      })
    }
    // 유저 생성
    const user1 = await this.userRepository.insert({
      nickname: 'test',
      birthday: new Date('1995-01-01'),
      job: 'test-job',
      gender: 'man',
      profileImage: 'test-image',
    })
    await createTestAuth(user1.identifiers[0].id)
    const user2 =await this.userRepository.insert({
      nickname: 'test2',
      birthday: new Date('2005-01-01'),
      job: 'test-job2',
      gender: 'women',
      profileImage: 'test-image2',
    })
    await createTestAuth(user2.identifiers[0].id)
 
}




  public async createTestData(){
    await this.createTestUser() 
    await this.createTestKeyword()
    await this.createTestKeywordUser()
    await this.createVideo()
  }
}




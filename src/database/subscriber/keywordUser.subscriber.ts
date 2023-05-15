import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  Repository,
} from 'typeorm';
import { Keyword, KeywordUser } from '../entities/keyword.entity';

@EventSubscriber()
export class KeywordUserSubscriber
  implements EntitySubscriberInterface<KeywordUser>
{
  constructor(private keyword: Repository<Keyword>) {}

  listenTo() {
    return KeywordUser;
  }

  beforeInsert(event: InsertEvent<KeywordUser>) {
    const keywordId = event.entity.keyword.id;
    console.log(keywordId);
    const keywordCount = this.keyword
      .createQueryBuilder(`K01`)
      .innerJoin(`keywordUser`, `KU01`)
      .where(`K01.id = :keywordId`, { keywordId })
      .getCount();
    console.log(keywordCount);
    const keywordQuery = this.keyword.createQueryBuilder().update();

    // 새로운 User 엔티티가 추가되기 전에 실행됩니다.
  }
}

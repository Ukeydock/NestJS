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

    // 새로운 User 엔티티가 추가되기 전에 실행됩니다.
  }
}

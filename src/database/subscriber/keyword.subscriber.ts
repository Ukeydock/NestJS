import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';
import { Keyword } from '../entities/keyword.entity';

@EventSubscriber()
export class KeywordSubscriber implements EntitySubscriberInterface<Keyword> {
  listenTo() {
    return Keyword;
  }

  beforeInsert(event: InsertEvent<Keyword>) {
    // 새로운 User 엔티티가 추가되기 전에 실행됩니다.
  }
}

# 이곳은 Ukeydock의 백엔드 NestJS 소스코드 로직을 설명하는 문서입니다. 

순서는 다음과 같습니다.
- 폴더구조
- DB구조
- 인프라
- 작업 중 고민한 부분


## 1. 폴더구조
- api 소스코드는 모두 src 폴더 안에 있으며 root에 존재하는 파일들은 소스코드의 설정파일입니다.
- src 안의 폴더구조는 다음과 같습니다.
  - api : 프론트와 통신하는 api 소스코드
    - api 폴더안에서는 common을 제외한 모든 폴더가 동일한 구조를 가집니다.
      - controllers
      - services : 비즈니스 로직
      - repositories : DB와 통신 로직
      - queryBuilder : 다중 조인, where를 설정해 SELECT SQL query를 작성해 반환하는 클래스의 모음
  - database : 테이블의 구조를 정의하는 entity와 subscriber
  - test : test 코드의 모음    

## 2. DB구조
![스크린샷 2023-07-11 오후 3 46 32](https://github.com/Ukeydock/NestJS/assets/71562311/c016bcbf-ab85-4498-8f78-678de157fc70)

주요 테이블의 역할은 다음과 같습니다.
- movie : 넷플릭스 영화의 키워드를 저장해두고 필요한 경우 사용
- keyword : 구글 트랜드, 넷플릭스의 영화 제목 등 유튜브에서 비디오를 생성하면 등록되는 테이블
  - 하나의 키워드는 여러개의 비디오를 가지게 됩니다.
- user : 유저의 기본 정보 테이블. (민감한 정보와 자주 사용하지 않는 데이터를 auth테이블에 몰아두었습니다.)
- video : 키워드를 이용해 유튜브 api로 가져오는 비디오의 영상 정보를 저장합니다.
  - videoTag와 videoDetail 테이블은 비디오의 구체적인 정보, 태그 등을 저장하는 역할을 합니다.
  - 태그가 겹치는 경우도 있을 수 있기에 videoTagVideo테이블을 작성하였습니다.

## 3. 인프라
![스크린샷 2023-07-11 오후 4 00 22](https://github.com/Ukeydock/NestJS/assets/71562311/453c3f34-ae41-471f-993e-8e76ce61b082)

백엔드는 AWS EC2(ec2-linux)에 인스턴스를 생성하고 내부에 도커를 설치하여 컨테이너를 관리합니다.

<img width="1090" alt="스크린샷 2023-07-11 오후 4 01 29" src="https://github.com/Ukeydock/NestJS/assets/71562311/0887a5e4-9b2b-41ff-b0c8-12b6428450b9">
포트번호를 다양하게 구성해 여러개의 컨테이너를 실행하는 방식으로 여러 서버를 실행할 수 있도록 구축하였습니다.


![스크린샷 2023-07-11 오후 4 10 11](https://github.com/Ukeydock/NestJS/assets/71562311/b3361c7a-7aff-4dfc-8ab6-c2bb6833ffb8)
도메인과 SSL인증서를 발급받아 https 통신이 가능하도록 구성하였고 

![스크린샷 2023-07-11 오후 4 12 41](https://github.com/Ukeydock/NestJS/assets/71562311/6e01a472-9a78-4f5b-9586-2c63fb94cace)
도메인은 ukeydock에 관련된 로드밸런서를 바라보게 만들어 포트포워딩을 시켜줄 수 있도록 구축하였습니다.



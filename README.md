# 이곳은 Ukeydock의 백엔드 소스코드 로직을 설명하는 문서입니다. 

순서는 다음과 같습니다.
- [폴더구조](#folder)
- [DB구조](#DB)
- [인프라](#infra)
- [작업 중 고민한 부분](#question)

## <a name="folder"> 1. 폴더구조</a> 
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

## <a name="DB"> 2. DB구조</a> 
![스크린샷 2023-07-11 오후 3 46 32](https://github.com/Ukeydock/NestJS/assets/71562311/c016bcbf-ab85-4498-8f78-678de157fc70)

주요 테이블의 역할은 다음과 같습니다.
- movie : 넷플릭스 영화의 키워드를 저장해두고 필요한 경우 사용
- keyword : 구글 트랜드, 넷플릭스의 영화 제목 등 유튜브에서 비디오를 생성하면 등록되는 테이블
  - 하나의 키워드는 여러개의 비디오를 가지게 됩니다.
- user : 유저의 기본 정보 테이블. (민감한 정보와 자주 사용하지 않는 데이터를 auth테이블에 몰아두었습니다.)
- video : 키워드를 이용해 유튜브 api로 가져오는 비디오의 영상 정보를 저장합니다.
  - videoTag와 videoDetail 테이블은 비디오의 구체적인 정보, 태그 등을 저장하는 역할을 합니다.
  - 태그가 겹치는 경우도 있을 수 있기에 videoTagVideo테이블을 작성하였습니다.

## <a name="infra"> 3. 인프라</a>
![스크린샷 2023-07-11 오후 4 00 22](https://github.com/Ukeydock/NestJS/assets/71562311/453c3f34-ae41-471f-993e-8e76ce61b082)

백엔드는 AWS EC2(ec2-linux)에 인스턴스를 생성하고 내부에 도커를 설치하여 컨테이너를 관리합니다.

<img width="1090" alt="스크린샷 2023-07-11 오후 4 01 29" src="https://github.com/Ukeydock/NestJS/assets/71562311/0887a5e4-9b2b-41ff-b0c8-12b6428450b9">
포트번호를 다양하게 구성해 여러개의 컨테이너를 실행하는 방식으로 여러 서버를 실행할 수 있도록 구축하였습니다.


![스크린샷 2023-07-11 오후 4 10 11](https://github.com/Ukeydock/NestJS/assets/71562311/b3361c7a-7aff-4dfc-8ab6-c2bb6833ffb8)
도메인과 SSL인증서를 발급받아 https 통신이 가능하도록 구성하였고 

![스크린샷 2023-07-11 오후 4 12 41](https://github.com/Ukeydock/NestJS/assets/71562311/6e01a472-9a78-4f5b-9586-2c63fb94cace)
도메인은 ukeydock에 관련된 로드밸런서를 바라보게 만들어 포트포워딩을 시켜줄 수 있도록 구축하였습니다.


![스크린샷 2023-07-11 오후 4 15 28](https://github.com/Ukeydock/NestJS/assets/71562311/b38a44ee-b6ac-402d-a7e2-cc6630c032e1)
- 프로필 이미지를 변경하면 사용자가 등록한 이미지 파일을 s3에 날짜와 랜덤 문자열을 이용해 저장하고

![스크린샷 2023-07-11 오후 4 16 48](https://github.com/Ukeydock/NestJS/assets/71562311/1cc65e42-0ec5-41d5-8285-90c119c131e5)
- 실질적인 출력은 CDN을 통해 안전하게 출력합니다.

## <a name="question"> 4. 고민한 부분</a>
유키독 프로젝트는 이전 직장에서 사용하였던 코드스타일과 로직을 일부 채용하였습니다. 

하나부터 열까지 백엔드 코드를 모두 직접 작성하였기에 기억에서 쉽게 지워지지 않아 가능하였습니다.

프로젝트를 진행하며 저는 항상 "더 좋은 방향이 있지 않을까?" 라는 고민을 하였습니다. 

때문에 docker의 컨테이너 구성을 어떻게 해야할지, CI/CD를 어떻게 구성하면 좋을지에 관한 , 또 다른 여러가지 주제로 효율적인 로직을 찾아 나섭니다.

mysql에서 순환 참조와 B-tree구조를 어떻게 활용해야 효율적일지, index는 어떤 상황에 사용하면 좋을지에 관한 제 생각을 정리해둔 블로그입니다.

[벨로그: SQL: 다대다 관계 데이터를 어떻게 찾으면 좋을까?](https://velog.io/@kwanyung/SQL-%EB%8B%A4%EB%8C%80%EB%8B%A4-%EA%B4%80%EA%B3%84-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%A5%BC-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%B0%BE%EC%9C%BC%EB%A9%B4-%EC%A2%8B%EC%9D%84%EA%B9%8C)

유키독 프로젝트는 main 브랜치에 push 이벤트가 발생하면 github actions를 이용해 typescript를 빌드하여 dist 폴더를 생성하고, 이 dist 폴더를 이용해 도커 이미지를 생성한 뒤 ec2인스턴스 도커에서 컨테이너로 실행하는 로직을 가집니다.

저는 항상 소스코드만 바뀌는데 굳이 이미지를 새로 생성하고, 컨테이너를 새로 바꿔줘야 할까? 라는 고민을 해왔습니다.(github actions의 로직 수행시간이 4~5분정도를 소요하는데 상당히 길다고 생각했기 때문입니다.)

[벨로그: github actions를 이용한 자동배포 구현이야기](https://velog.io/@kwanyung/github-actions%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EC%9E%90%EB%8F%99%EB%B0%B0%ED%8F%AC-%EA%B5%AC%ED%98%84%EC%9D%B4%EC%95%BC%EA%B8%B0)

결과적으로 제가 생각한 이론을 구현해내는 것은 실패했습니다만, 아직까지도 더 좋은, 더 효율적인 로직이 무엇일까 고민합니다.

이 밖에도 여러 폴더구조, 함수명, 변수명을 고민하고 래퍼런스를 찾아보며 3-레이어-아키텍처 구조를 기반으로 하는 저만의 폴더구조를 생각해내는 고민을 합니다.
- 이는 표준적인, 그리고 다른사람의 이론을 효과적으로 받아들이기 위해서라고 생각하고 있습니다.
[벨로그: Nest : 쿼리빌더 형식 정립?](https://velog.io/@kwanyung/Nest-%EC%BF%BC%EB%A6%AC%EB%B9%8C%EB%8D%94-%ED%98%95%EC%8B%9D-%EC%A0%95%EB%A6%BD)



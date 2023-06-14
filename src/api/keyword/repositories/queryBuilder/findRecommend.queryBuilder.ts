import { Injectable } from "@nestjs/common";

class RecommendAlgorithmBuilder {
    // 이 키워드의 아이디를 이용해 추천 키워드의 아이디 10개를 반환하기
    protected keywordIds: { [key: number]: { keywordId: number, point: number } };

    constructor() {
        this.keywordIds = {};
    }


    protected getKeywordIds() {
        // 객체의 값들을 배열로 변환
        const dataArray = Object.values(this.keywordIds);

        // 포인트를 기준으로 내림차순으로 정렬
        dataArray.sort((a, b) => b.point - a.point);

        // 상위 10개의 항목만 추출
        return dataArray.map((data) => { return data.keywordId }).slice(0, 10);
    }


}


export class GetRecommendKeywordIds extends RecommendAlgorithmBuilder {
    private keywordData: { keywordId: number }[]

    constructor(keywordData: { keywordId: number }[]) {
        super();
        this.keywordData = keywordData.map((data) => {
            if (!data.keywordId) {
                throw new Error("keywordId가 없습니다.");
            }
            return { keywordId: data.keywordId };
        })

    }



    public build() {
        for (const keyword of this.keywordData) {
            Object.assign(keyword, { point: 0 })

            // 중복된 키워드가 있으면 포인트를 올리고 없으면 새로 추가
            if (!this.keywordIds[keyword.keywordId]) {
                this.keywordIds[keyword.keywordId] = { keywordId: keyword.keywordId, point: 0 }
            }

            else {
                this.keywordIds[keyword.keywordId].point += 1;
            }
        }
        return this.getKeywordIds()
    }
}
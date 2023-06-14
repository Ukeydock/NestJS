import { ApiProperty } from "@nestjs/swagger";

export class CommonRequestDto {
    @ApiProperty()
    limit?: number = 20
}
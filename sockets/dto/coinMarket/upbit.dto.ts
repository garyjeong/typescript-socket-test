import { Type } from "class-transformer";
import { IsNumber, IsString, ValidateNested } from "class-validator";

export class UpbitData {
    @IsString()
    symbol: string;

    @IsNumber()
    price: number;
}

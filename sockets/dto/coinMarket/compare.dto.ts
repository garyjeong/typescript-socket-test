import { IsNumber, IsString } from "class-validator";

export class CompareData {
    @IsNumber()
    priceDiffKRW: number;
    
    @IsNumber()
    priceDiffRateKRW: number;
}

export class CompareList {
    @IsString()
    symbol: string;

    data: CompareData[];
}
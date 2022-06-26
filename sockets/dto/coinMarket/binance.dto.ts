import { IsNumber, IsString } from "class-validator";

export class BinanceData {
    @IsString()
    symbol: string;
    
    @IsString()
    exchange: string;

    @IsNumber()
    price: number;
}

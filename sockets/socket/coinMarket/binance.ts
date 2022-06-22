import config from "config";
import { SocketBase } from "../socketBase";

export class binanceSocket extends SocketBase {
    constructor() {
        super();
        this.url = config.get('BINANCE.SOCKET');
    }

    public getCoinPrice(tickers: string[]) {

    }
}
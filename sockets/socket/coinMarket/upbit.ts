import config from "config";
import { SocketBase } from "../socketBase";

export class upbitSocket extends SocketBase {
    constructor() {
        super();
        this.url = config.get('UPBIT.SOCKET');
    }

    public getCoinPrice(tickers: string[]) {

    }
}
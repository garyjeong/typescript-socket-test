import config from "../../../config/default.json";
import { SocketBase } from "../socketBase";
import { WebSocket } from 'ws';
export class binanceSocket extends SocketBase {
    public socket: any;

    constructor() {
        super();
        this.url = config.BINANCE.SOCKET;
    }

    public getCoinPrice(tickers: string[]) {
        const separtor = '@miniTicker';
        const coinTickerList =
            tickers
                .map((coin) => coin.toLowerCase() + 'btc')
                .join(separtor + '/') + separtor;

        const binanceSocket = new WebSocket(this.url + coinTickerList);

        binanceSocket.onopen = () => {
            console.log('[BINANCE] WS OPEN');
        }

        binanceSocket.onmessage = (message) => {
            const coinData = JSON.parse(message.data);
            const symbol = coinData.s.replace('btc', '');

            const data = {
                coinName: symbol,
                price: coinData.c
            };
            console.log('BINANCE', coinData);
        }
    }
}
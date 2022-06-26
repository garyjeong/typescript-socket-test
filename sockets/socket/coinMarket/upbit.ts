import { v4 as uuidv4 } from 'uuid';
import config from "../../../config/default.json";
import { SocketBase } from "../socketBase";
import { upbitData } from '../../dto/coinMarket';
import { WebSocket } from 'ws';

export class upbitSocket extends SocketBase {
    constructor() {
        super();
        this.url = config.UPBIT.SOCKET;
    }

    public async getCoinPrice(tickers: string[]) {
        const upbitSocket = new WebSocket(this.url);
        upbitSocket.binaryType = 'arraybuffer';

        const sendMessage = JSON.stringify([
            { ticket: uuidv4()},
            {
                type: 'ticker',
                codes: tickers,
                isOnlyRealtime: true
            },
            { format: 'SIMPLE' },
        ]);
    
        upbitSocket.onopen = () => {
            console.log('[UPBIT] WS OPEN');
            upbitSocket.send(sendMessage);
            console.log('[UPBIT] WS SEND_MESSAGE');
        }
    
        upbitSocket.onmessage = (message) => {
            var decoder = new TextDecoder('utf-8');
            var byteData = new Uint8Array(message.data);
    
            const coinData = JSON.parse(decoder.decode(byteData));
            if (coinData.error) return;
    
            const coinName = coinData.cd.replace('-','');
            
            // const data = {
            //     coinName: coinName,
            //     price: coinData.tp
            // };
            
            const data = new upbitData();
            data.symbol = coinName;
            data.price = coinData.tp;
            
            console.log('UPBIT', data);
        }
    }
}
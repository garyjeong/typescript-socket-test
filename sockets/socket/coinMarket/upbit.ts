import { v4 as uuidv4 } from 'uuid';
import config from "../../../config/default.json";
import { SocketBase } from "../socketBase";
import { UpbitData } from '../../dto/coinMarket';
import { WebSocket } from 'ws';

export class upbitSocket extends SocketBase {
    protected socket: WebSocket;
    protected data: UpbitData[];

    constructor() {
        super();

        this.url = config.UPBIT.SOCKET;
        this.socket = new WebSocket(this.url);
        this.socket.binaryType = 'arraybuffer';
    }

    public async sendMessage(tickers: string[]) {
        const sendMessage = JSON.stringify([
            { ticket: uuidv4()},
            {
                type: 'ticker',
                codes: tickers,
                isOnlyRealtime: true
            },
            { format: 'SIMPLE' },
        ]);

        this.socket.onopen = () => {
            console.log('[UPBIT] WS OPEN');
            this.socket.send(sendMessage);
            console.log('[UPBIT] WS SEND_MESSAGE');
        }
        this.execute();
    }

    public async execute() {
        console.log('fuck')
        this.socket.onmessage = (message: any) => {
            let decoder = new TextDecoder('utf-8');
            let byteData = new Uint8Array(message.data);
    
            const coinData = JSON.parse(decoder.decode(byteData));
            if (coinData.error) return;
    
            const coinName = coinData.cd.replace('-','');

            const data = new UpbitData();
            data.symbol = coinName;
            data.price = coinData.tp;

            this.data.push(data);
            
            console.log('UPBIT', data);
        };
    }


    public async getData(): Promise<UpbitData[]> {
        return this.data;
    }

    // public async getCoinPrice(tickers: string[]) {
    //     const upbitSocket = new WebSocket(this.url);
    //     upbitSocket.binaryType = 'arraybuffer';

    //     const sendMessage = JSON.stringify([
    //         { ticket: uuidv4()},
    //         {
    //             type: 'ticker',
    //             codes: tickers,
    //             isOnlyRealtime: true
    //         },
    //         { format: 'SIMPLE' },
    //     ]);
    
    //     upbitSocket.onopen = () => {
    //         console.log('[UPBIT] WS OPEN');
    //         upbitSocket.send(sendMessage);
    //         console.log('[UPBIT] WS SEND_MESSAGE');
    //     }
    
    //     upbitSocket.onmessage = (message) => {
    //         var decoder = new TextDecoder('utf-8');
    //         var byteData = new Uint8Array(message.data);
    
    //         const coinData = JSON.parse(decoder.decode(byteData));
    //         if (coinData.error) return;
    
    //         const coinName = coinData.cd.replace('-','');
            
    //         // const data = {
    //         //     coinName: coinName,
    //         //     price: coinData.tp
    //         // };
            
    //         const data = new UpbitData();
    //         data.symbol = coinName;
    //         data.price = coinData.tp;
            
    //         console.log('UPBIT', data);
    //     }
    // }
}
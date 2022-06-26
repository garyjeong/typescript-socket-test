import axios from 'axios';
import config from './config/default.json';
import { WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { CompareList, CompareData, UpbitData, BinanceData } from './sockets/dto/coinMarket/index';

(async () => {

    const tickerUrl = config.UPBIT.API;
    const res = await axios.get(tickerUrl);
    const tickers = res.data.filter((ticker) => ticker.market.includes('KRW-'));

    const upbit_ticker_list = tickers.map((ticker) => ticker.market);
    const binance_ticker_list = tickers.map((ticker) => ticker.market.replace('KRW-', ''));

    const upbitList: UpbitData[] = [];
    const binanceList: BinanceData[] = [];
    let freeList: any;
    // -------------------------------------------------------

    const upbitSocket = new WebSocket(config.UPBIT.SOCKET);

    upbitSocket.binaryType = 'arraybuffer';

    const sendMessage = JSON.stringify([
        { ticket: uuidv4()},
        {
            type: 'ticker',
            codes: upbit_ticker_list,
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

        const symbol = coinData.cd.replace('KRW-','');
        // console.log('UPBIT', symbol);
        
        // result[symbol] = {
        //     upbit: {
        //         price: coinData.tp
        //     }
        // }
        
        const data: UpbitData = {
            symbol: symbol,
            price: coinData.tp
        };

        upbitList.push(data);
        // upbitList[symbol] = { data };
        // upbitResult[symbol].push({
        //     upbit: {
        //         price: coinData.tp
        //     }
        // });
        freeList[symbol].push({
            price: coinData.tp
        });
        console.log('UPBIT', upbitList);
    }

    // -------------------------------------------------------
    
    // const binance_result = {};
    // const separtor = '@miniTicker';
    // const coinTickerList =
    //     binance_ticker_list
    //         .map((coin) => coin.toLowerCase() + 'btc')
    //         .join(separtor + '/') + separtor;
    // const binanceSocket = new WebSocket(config.BINANCE.SOCKET + coinTickerList);


    // binanceSocket.onopen = () => {
    //     console.log('[BINANCE] WS OPEN');
    // }

    // binanceSocket.onmessage = (message) => {
    //     const coinData = JSON.parse(message.data);
    //     const symbol = coinData.s.replace('BTC', '');

    //     // const data = {
    //     //     coinName: symbol,
    //     //     price: coinData.c
    //     // };

    //     // console.log('BINANCE', symbol);

    //     // binance_result[symbol] = {
    //     //     coinName: symbol,
    //     //     price: coinData.c
    //     // }
    //     // console.log('UPBIT', symbol);
    //     // result[symbol] = {
    //     //     binance: {
    //     //         price: coinData.c
    //     //     }
    //     // };
    //     const data: BinanceData = {
    //         symbol: symbol,
    //         exchange: '',
    //         price: coinData.c
    //     };
    //     // const data = new BinanceData();
    //     // data.symbol = symbol;
    //     // data.price = coinData.c;

    //     binanceList.data.push(data);
    //     // console.log(result);
    //     console.log('BINANCE', binanceList);
    // }

})();
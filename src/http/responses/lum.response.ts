import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LumResponse {
    @Expose()
    price: number;

    @Expose()
    denom: string;

    @Expose()
    symbol: string;

    @Expose()
    liquidity: number;

    @Expose()
    volume_24h: number;

    @Expose()
    name: number;

    @Expose({ name: 'previousDayPrice' })
    previous_day_price: number;

    constructor(data: Partial<LumResponse>) {
        Object.assign(this, data);
    }
}
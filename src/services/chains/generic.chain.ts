import { LoggerService } from '@nestjs/common';
import {HttpService} from "@nestjs/axios";

import { LumClient, LumUtils } from '@lum-network/sdk-javascript';
import { Stream } from 'xstream';
import { NewBlockEvent } from '@cosmjs/tendermint-rpc';

import { apy, AssetDenom, AssetMicroDenom, CLIENT_PRECISION, computeTotalApy, computeTotalTokenAmount, GenericAssetInfo, LUM_STAKING_ADDRESS, TEN_EXPONENT_SIX } from '@app/utils';
import { AssetService } from '@app/services';

export type Callback = (instance: any) => void;

interface GenericChainConfig {
    assetService: AssetService;
    httpService: HttpService;
    loggerService: LoggerService;
    prefix: string;
    symbol: string;
    endpoint: string;
    denom: AssetDenom;
    microDenom: AssetMicroDenom;
    subscribeToRPC?: boolean;
    postInitCallback?: Callback;
}

export class GenericChain {
    private readonly _config: GenericChainConfig;
    private _chainId: string;
    private _clientStream: Stream<NewBlockEvent> = null;
    private _client: LumClient;

    private readonly _postInitCallback: Callback;

    constructor(config: GenericChainConfig) {
        this._config = config;
    }

    get client(): LumClient {
        return this._client;
    }

    get endpoint(): string {
        return this._config.endpoint;
    }

    get prefix(): string {
        return this._config.prefix;
    }

    get symbol(): string {
        return this._config.symbol;
    }

    get denom(): string {
        return this._config.denom;
    }

    get microDenom(): string {
        return this._config.microDenom;
    }

    get clientStream(): any {
        return this._clientStream;
    }

    get chainId(): string {
        return this._chainId;
    }

    get assetService(): AssetService {
        return this._config.assetService;
    }

    get httpService(): HttpService {
        return this._config.httpService;
    }

    get loggerService(): LoggerService {
        return this._config.loggerService;
    }

    initialize = async (): Promise<LumClient> => {
        // If we want to connect to RPC WS, we have to patch the connection URI
        const useEndpoint = this._config.subscribeToRPC ? this._config.endpoint.replace('https://', 'wss://').replace('http://', 'ws://') : this._config.endpoint;

        // Bind and acquire the chain id
        this._client = await LumClient.connect(useEndpoint);
        const chainId = await this._client.getChainId();

        // If we want to subscribe to RPC, we have to create a stream
        if (this._config.subscribeToRPC) {
            this._clientStream = this._client.tmClient.subscribeNewBlock();
        }

        // If we have a post init callback, just mention it
        this.loggerService.debug(`Connected to ${this.symbol} chain = ${useEndpoint} (${chainId})`);
        if (this._postInitCallback) {
            this._postInitCallback(this);
        }
        return this._client;
    };

    isInitialized = (): boolean => {
        return this._client !== undefined;
    };

    getTokenInformationFromOsmosis = async (): Promise<any> => {
        try {
            const response = await fetch(`https://api-osmosis.imperator.co/tokens/v2/${this.symbol}`);
            return response.json();
        } catch (error) {
            return null;
        }
    };

    getPrice = async (): Promise<number> => {
        const infos = await this.getTokenInformationFromOsmosis();
        if (!infos) {
            return 0;
        }
        return infos.price;
    };

    getMarketCap = async (): Promise<number> => {
        try {
            const response = await fetch(`https://api-osmosis.imperator.co/tokens/v2/mcap`);
            const data = await response.json();
            const extractedData = data.find((d: any) => d.symbol === this.symbol);
            return extractedData ? extractedData.market_cap : 0;
        } catch (error) {
            return 0;
        }
    };

    getTokenSupply = async (): Promise<number> => {
        try {
            const supply = Number((await this.client.getSupply(this.microDenom)).amount) / TEN_EXPONENT_SIX;
            return supply;
        } catch (error) {
            return 0;
        }
    };

    getAPY = async (): Promise<number> => {
        const inflation = Number(await this.client.queryClient.mint.inflation()) / CLIENT_PRECISION;
        const metrics = await computeTotalApy(this.client, Number(await this.getTokenSupply()), inflation, CLIENT_PRECISION, TEN_EXPONENT_SIX);
        return apy(metrics.inflation, metrics.communityTaxRate, metrics.stakingRatio);
    };

    getTotalAllocatedToken = async (): Promise<number> => {
        const decode = LumUtils.Bech32.decode(LUM_STAKING_ADDRESS);
        const getDecodedAddress = LumUtils.Bech32.encode(this.prefix, decode.data);
        return Number(await computeTotalTokenAmount(getDecodedAddress, this.client, this.microDenom, CLIENT_PRECISION, TEN_EXPONENT_SIX));
    };

    getTVL = async (): Promise<number> => {
        const [getTotalPriceDb, getTotalTokenDb] = await Promise.all([this.assetService.getChainServicePrice(), this.assetService.getChainServiceTotalAllocatedToken()]);
        //TODO: implement
        return 0;
    };

    getAssetInfo = async (): Promise<GenericAssetInfo> => {
        try {
            const [supply, price, marketCap, apy, totalAllocatedToken] = await Promise.all([this.getTokenSupply(), this.getPrice(), this.getMarketCap(), this.getAPY(), this.getTotalAllocatedToken()]);
            return {
                supply,
                unit_price_usd: price,
                total_value_usd: marketCap,
                apy,
                total_allocated_token: totalAllocatedToken,
            };
        } catch (error) {
            return null;
        }
    };
}

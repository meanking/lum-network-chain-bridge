import { Injectable, Logger } from '@nestjs/common';

import { Cron, CronExpression } from '@nestjs/schedule';

import { AkashNetworkService, ComdexService, CosmosService, EvmosService, JunoService, KichainService, LumNetworkService, OsmosisService, SentinelService, StargazeService } from '@app/services';
import { AssetService } from '@app/services/asset.service';

import { DfractAssetName } from '@app/utils';

@Injectable()
export class AssetScheduler {
    private _logger: Logger = new Logger(AssetScheduler.name);

    constructor(
        private readonly _lumNetworkService: LumNetworkService,
        private readonly _osmosisService: OsmosisService,
        private readonly _cosmosService: CosmosService,
        private readonly _junoService: JunoService,
        private readonly _evmosService: EvmosService,
        private readonly _comdexService: ComdexService,
        private readonly _stargazeService: StargazeService,
        private readonly _akashNetworkService: AkashNetworkService,
        private readonly _sentinelService: SentinelService,
        private readonly _kiChainService: KichainService,
        private readonly _assetService: AssetService,
    ) {}

    @Cron(CronExpression.EVERY_10_SECONDS)
    async cosmosSync() {
        try {
            this._logger.log(`Syncing token assets info from Cosmos chain...`);

            const name = DfractAssetName.COSMOS;

            const getTokenInfo = await this._cosmosService.getTokenInfo();

            for (const key in getTokenInfo) {
                const compositeKey = `${name}_${key}`;

                const value = { [key]: getTokenInfo[key], last_updated_at: new Date() };

                await this._assetService.createOrUpdateAssetValue(compositeKey, value);

                const entity = await this._assetService.getByMetrics(`${name}_${key}`);

                if (entity) await this._assetService.createOrUpdateAssetExtra(`${name}_${key}`);
            }
        } catch (error) {
            this._logger.error(`Failed to sync token assets from Cosmsos chain...`, error);
        }
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async osmosisSync() {
        try {
            this._logger.log(`Syncing token assets info from Osmosis chain...`);

            const name = DfractAssetName.OSMOSIS;

            const getTokenInfo = await this._osmosisService.getTokenInfo();

            for (const key in getTokenInfo) {
                const compositeKey = `${name}_${key}`;

                const value = { [key]: getTokenInfo[key], last_updated_at: new Date() };

                await this._assetService.createOrUpdateAssetValue(compositeKey, value);

                const entity = await this._assetService.getByMetrics(`${name}_${key}`);

                if (entity) await this._assetService.createOrUpdateAssetExtra(`${name}_${key}`);
            }

            /* const getTokenInfo = await this._osmosisService.getTokenInfo(); */
        } catch (error) {
            this._logger.error(`Failed to sync token assets from Osmosis chain...`, error);
        }
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async junoSync() {
        try {
            this._logger.log(`Syncing token assets info from Osmosis chain...`);

            const name = DfractAssetName.JUNO;

            const getTokenInfo = await this._junoService.getTokenInfo();

            for (const key in getTokenInfo) {
                const compositeKey = `${name}_${key}`;

                const value = { [key]: getTokenInfo[key], last_updated_at: new Date() };

                await this._assetService.createOrUpdateAssetValue(compositeKey, value);

                const entity = await this._assetService.getByMetrics(`${name}_${key}`);

                if (entity) await this._assetService.createOrUpdateAssetExtra(`${name}_${key}`);
            }

            /* const getTokenInfo = await this._junoService.getTokenInfo(); */
        } catch (error) {
            this._logger.error(`Failed to sync token assets from Osmosis chain...`, error);
        }
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async evmosSync() {
        try {
            this._logger.log(`Syncing token assets info from Evmos chain...`);

            const name = DfractAssetName.EVMOS;

            const getTokenInfo = await this._evmosService.getTokenInfo();

            for (const key in getTokenInfo) {
                const compositeKey = `${name}_${key}`;

                const value = { [key]: getTokenInfo[key], last_updated_at: new Date() };

                await this._assetService.createOrUpdateAssetValue(compositeKey, value);

                const entity = await this._assetService.getByMetrics(`${name}_${key}`);

                if (entity) await this._assetService.createOrUpdateAssetExtra(`${name}_${key}`);
            }

            /* const getTokenInfo = await this._evmosService.getTokenInfo(); */
        } catch (error) {
            this._logger.error(`Failed to sync token assets from Evmos chain...`, error);
        }
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async lumNetworkSync() {
        try {
            this._logger.log(`Syncing token assets info from Lum Network chain...`);

            const name = DfractAssetName.LUM;

            const getTokenInfo = await this._lumNetworkService.getTokenInfo();

            for (const key in getTokenInfo) {
                const compositeKey = `${name}_${key}`;

                const value = { [key]: getTokenInfo[key], last_updated_at: new Date() };

                await this._assetService.createOrUpdateAssetValue(compositeKey, value);

                const entity = await this._assetService.getByMetrics(`${name}_${key}`);

                if (entity) await this._assetService.createOrUpdateAssetExtra(`${name}_${key}`);
            }

            /* const getTokenInfo = await this._lumNetworkService.getTokenInfo(); */
        } catch (error) {
            this._logger.error(`Failed to sync token assets from Lum Network chain...`, error);
        }
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async comdexSync() {
        try {
            this._logger.log(`Syncing token assets info from Comdex chain...`);

            const name = DfractAssetName.COMDEX;

            const getTokenInfo = await this._comdexService.getTokenInfo();

            for (const key in getTokenInfo) {
                const compositeKey = `${name}_${key}`;

                const value = { [key]: getTokenInfo[key], last_updated_at: new Date() };

                await this._assetService.createOrUpdateAssetValue(compositeKey, value);

                const entity = await this._assetService.getByMetrics(`${name}_${key}`);

                if (entity) await this._assetService.createOrUpdateAssetExtra(`${name}_${key}`);
            }

            /* const getTokenInfo = await this._comdexService.getTokenInfo(); */
        } catch (error) {
            this._logger.error(`Failed to sync token assets from Comdex chain...`, error);
        }
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async stargazeSync() {
        try {
            this._logger.log(`Syncing token assets info from Stargaze chain...`);

            const name = DfractAssetName.STARGAZE;

            const getTokenInfo = await this._stargazeService.getTokenInfo();

            for (const key in getTokenInfo) {
                const compositeKey = `${name}_${key}`;

                const value = { [key]: getTokenInfo[key], last_updated_at: new Date() };

                await this._assetService.createOrUpdateAssetValue(compositeKey, value);

                const entity = await this._assetService.getByMetrics(`${name}_${key}`);

                if (entity) await this._assetService.createOrUpdateAssetExtra(`${name}_${key}`);
            }

            /* const getTokenInfo = await this._stargazeService.getTokenInfo(); */
        } catch (error) {
            this._logger.error(`Failed to sync token assets from Stargaze chain...`, error);
        }
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async akashNetworkSync() {
        try {
            this._logger.log(`Syncing token assets info from Akash Network chain...`);

            const name = DfractAssetName.AKASH_NETWORK;

            const getTokenInfo = await this._akashNetworkService.getTokenInfo();

            for (const key in getTokenInfo) {
                const compositeKey = `${name}_${key}`;

                const value = { [key]: getTokenInfo[key], last_updated_at: new Date() };

                await this._assetService.createOrUpdateAssetValue(compositeKey, value);

                const entity = await this._assetService.getByMetrics(`${name}_${key}`);

                if (entity) await this._assetService.createOrUpdateAssetExtra(`${name}_${key}`);
            }

            /* const getTokenInfo = await this._akashNetworkService.getTokenInfo(); */
        } catch (error) {
            this._logger.error(`Failed to sync token assets from Akash Network chain...`, error);
        }
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async sentinelSync() {
        try {
            this._logger.log(`Syncing token assets info from Sentinel chain...`);

            const name = DfractAssetName.SENTINEL;

            const getTokenInfo = await this._sentinelService.getTokenInfo();

            for (const key in getTokenInfo) {
                const compositeKey = `${name}_${key}`;

                const value = { [key]: getTokenInfo[key], last_updated_at: new Date() };

                await this._assetService.createOrUpdateAssetValue(compositeKey, value);

                const entity = await this._assetService.getByMetrics(`${name}_${key}`);

                if (entity) await this._assetService.createOrUpdateAssetExtra(`${name}_${key}`);
            }

            /* const getTokenInfo = await this._sentinelService.getTokenInfo(); */
        } catch (error) {
            this._logger.error(`Failed to sync token assets from Sentinel chain...`, error);
        }
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async kiChainSync() {
        try {
            this._logger.log(`Syncing token assets info from Kichain chain...`);

            const name = DfractAssetName.KI;

            const getTokenInfo = await this._kiChainService.getTokenInfo();

            for (const key in getTokenInfo) {
                const compositeKey = `${name}_${key}`;

                const value = { [key]: getTokenInfo[key], last_updated_at: new Date() };

                await this._assetService.createOrUpdateAssetValue(compositeKey, value);

                const entity = await this._assetService.getByMetrics(`${name}_${key}`);

                if (entity) await this._assetService.createOrUpdateAssetExtra(`${name}_${key}`);
            }

            /* const getTokenInfo = await this._kiChainService.getTokenInfo(); */
        } catch (error) {
            this._logger.error(`Failed to sync token assets from Kichain chain...`, error);
        }
    }
}

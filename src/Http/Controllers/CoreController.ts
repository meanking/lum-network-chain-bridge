import { CacheInterceptor, Controller, Get, NotFoundException, Param, UseInterceptors } from '@nestjs/common';
import { ElasticService } from '@app/Services';
import { ElasticIndexes, QueueJobs, Queues } from '@app/Utils/Constants';
import { LumConstants } from '@lum-network/sdk-javascript';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Controller('')
export default class CoreController {
    constructor(private readonly _elasticService: ElasticService, @InjectQueue(Queues.QUEUE_DEFAULT) private readonly _queue: Queue) {}

    @Get('search/:data')
    @UseInterceptors(CacheInterceptor)
    async search(@Param('data') data: string) {
        // We check the different combinations
        if (/^\d+$/.test(data)) {
            return { type: 'block', data };
        } else if (String(data).startsWith(LumConstants.LumBech32PrefixValAddr)) {
            return { type: 'validator', data };
        } else if (String(data).startsWith(LumConstants.LumBech32PrefixAccAddr)) {
            return { type: 'account', data };
        } else {
            if (await this._elasticService.documentExists(ElasticIndexes.INDEX_BLOCKS, data)) {
                return { type: 'block', data };
            } else if (await this._elasticService.documentExists(ElasticIndexes.INDEX_TRANSACTIONS, data)) {
                return { type: 'transaction', data };
            } else {
                throw new NotFoundException('data_not_found');
            }
        }
    }

    @Get('faucet/:address')
    async faucet(@Param('address') address: string) {
        return this._queue.add(QueueJobs.MINT_FAUCET_REQUEST, { address });
    }
}

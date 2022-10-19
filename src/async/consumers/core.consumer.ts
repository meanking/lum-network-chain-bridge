import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Process, Processor } from '@nestjs/bull';

import { Job } from 'bull';

import { LumConstants, LumMessages, LumTypes, LumWalletFactory } from '@lum-network/sdk-javascript';

import { QueueJobs, Queues } from '@app/utils/constants';

import { LumNetworkService } from '@app/services';

@Processor(Queues.FAUCET)
export class CoreConsumer {
    private readonly _logger: Logger = new Logger(CoreConsumer.name);

    constructor(private readonly _configService: ConfigService, private readonly _lumNetworkService: LumNetworkService) {}

    @Process(QueueJobs.MINT_FAUCET_REQUEST)
    async mintFaucetRequest(job: Job<{ address: string }>) {
        const wallet = await LumWalletFactory.fromMnemonic(this._configService.get<string>('FAUCET_MNEMONIC'));
        if (!wallet) {
            this._logger.error(`Unable to generate wallet for address ${job.data.address}`);
            return;
        }
        const sendMsg = LumMessages.BuildMsgSend(wallet.getAddress(), job.data.address, [
            {
                denom: LumConstants.MicroLumDenom,
                amount: '100000000',
            },
        ]);
        const fee = {
            amount: [{ denom: LumConstants.MicroLumDenom, amount: '1000' }],
            gas: '100000',
        };
        const account = await this._lumNetworkService.client.getAccount(wallet.getAddress());
        if (!account) {
            this._logger.error('Cannot dispatch faucet request, failed to acquire account instance');
            return;
        }
        const doc: LumTypes.Doc = {
            fee,
            memo: 'Faucet',
            messages: [sendMsg],
            chainId: await this._lumNetworkService.client.getChainId(),
            signers: [
                {
                    accountNumber: account.accountNumber,
                    sequence: account.sequence,
                    publicKey: wallet.getPublicKey(),
                },
            ],
        };
        const result = await this._lumNetworkService.client.signAndBroadcastTx(wallet, doc);
        this._logger.debug(result);
    }
}

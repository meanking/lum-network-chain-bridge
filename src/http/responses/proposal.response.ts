import { Expose, Exclude, Type } from 'class-transformer';
import { ProposalStatus } from '@lum-network/sdk-javascript/build/codec/cosmos/gov/v1beta1/gov';
import { BalanceResponse } from '@app/http';
import Long from 'long';

@Exclude()
export class ResultResponse {
    @Expose()
    yes: number;

    @Expose()
    no: number;

    @Expose()
    abstain: number;

    @Expose({ name: 'noWithVeto' })
    no_with_veto: number;
}

@Exclude()
class ContentResponse {
    @Expose()
    title: string;

    @Expose()
    description: string;
}

@Exclude()
export class ProposalResponse {
    @Expose({ name: 'proposalId' })
    proposal_id: Long;

    @Expose({ name: 'submitTime' })
    submit_time: string;

    @Expose({ name: 'depositEndTime' })
    deposit_end_time: string;

    @Expose({ name: 'votingStartTime' })
    voting_start_time: string;

    @Expose({ name: 'votingEndTime' })
    voting_end_time: string;

    @Expose()
    status: ProposalStatus;

    @Expose()
    @Type(() => ContentResponse)
    content: ContentResponse;

    @Expose({ name: 'totalDeposit' })
    @Type(() => BalanceResponse)
    total_deposit: BalanceResponse[];

    @Expose({ name: 'finalTallyResult' })
    @Type(() => ResultResponse)
    final_result: ResultResponse;

    constructor(data: Partial<ProposalResponse>) {
        Object.assign(this, data);
    }
}
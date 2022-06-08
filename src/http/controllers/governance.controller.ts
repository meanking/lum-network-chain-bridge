import {CacheInterceptor, Controller, Get, NotFoundException, Param, UseInterceptors} from '@nestjs/common';
import {ApiOkResponse, ApiTags} from "@nestjs/swagger";

import {plainToClass} from 'class-transformer';

import {ProposalStatus} from '@lum-network/sdk-javascript/build/codec/cosmos/gov/v1beta1/gov';

import {LumNetworkService} from '@app/services';
import {ProposalResponse, ResultResponse} from '@app/http/responses/';
import {decodeContent} from '@app/utils';

@ApiTags('governance')
@Controller('governance')
@UseInterceptors(CacheInterceptor)
export class GovernanceController {
    constructor(private readonly _lumNetworkService: LumNetworkService) {
    }

    @Get('proposals')
    async fetch() {
        const results = await this._lumNetworkService.client.queryClient.gov.proposals(
            ProposalStatus.PROPOSAL_STATUS_UNSPECIFIED |
            ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD |
            ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD |
            ProposalStatus.PROPOSAL_STATUS_PASSED |
            ProposalStatus.PROPOSAL_STATUS_REJECTED |
            ProposalStatus.PROPOSAL_STATUS_FAILED |
            ProposalStatus.UNRECOGNIZED,
            '',
            '',
        );

        return results.proposals.map((proposal) => plainToClass(ProposalResponse, decodeContent(proposal)));
    }

    @ApiOkResponse({status: 200, type: ProposalResponse})
    @Get('proposals/:id')
    async get(@Param('id') id: string) {
        const result = await this._lumNetworkService.client.queryClient.gov.proposal(id);

        if (!result || !result.proposal) {
            throw new NotFoundException('proposal_not_found');
        }

        const proposal = decodeContent(result.proposal);

        return plainToClass(ProposalResponse, proposal);
    }

    @ApiOkResponse({status: 200, type: ResultResponse})
    @Get('proposals/:id/tally')
    async getTallyResults(@Param('id') id: string) {
        const result = await this._lumNetworkService.client.queryClient.gov.tally(id);

        if (!result || !result.tally) {
            throw new NotFoundException('tally_not_found');
        }

        return plainToClass(ResultResponse, result.tally);
    }
}

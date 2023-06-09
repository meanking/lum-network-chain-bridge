import { ApiProperty } from '@nestjs/swagger';

import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ChartGroupType, ChartTypes } from '@app/utils';

export class ChartRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    start_at: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsDateString()
    end_at: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    type: ChartTypes;

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @IsIn([ChartGroupType.GROUP_DAILY, ChartGroupType.GROUP_MONTHLY, ChartGroupType.GROUP_YEARLY])
    group_type?: ChartGroupType;
}

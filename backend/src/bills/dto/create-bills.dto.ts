import { IsDateString, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateBillDto {
    @IsString()
    @IsNotEmpty()
    householdId: string;

    @IsString()
    @IsNotEmpty()
    billType: string;

    @IsInt()
    @Min(0)
    totalCents: number;

    @IsDateString()
    periodStart: string;

    @IsDateString()
    periodEnd: string;
}

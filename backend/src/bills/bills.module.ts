import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';

import { Bill, BillSchema } from './schemas/bills.schema';
import { AllocationSchema } from '../allocations/allocation.schema';

import { PaymentSchema } from '../payments/payment.schema';
import { MemberSchema } from '../members/member.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Bill.name, schema: BillSchema },
            { name: 'Allocation', schema: AllocationSchema },
            { name: 'Payment', schema: PaymentSchema },
            { name: 'Member', schema: MemberSchema }
        ])
    ],
    controllers: [BillsController],
    providers: [BillsService],
})
export class BillsModule {}
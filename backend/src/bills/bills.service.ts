import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Bill, BillDocument } from './schemas/bills.schema';
import { CreateBillDto } from './dto/create-bills.dto';
import { Allocation } from '../allocations/allocation.interface';
import { BadRequestException } from '@nestjs/common';
import { AllocationDocument } from '../allocations/allocation.schema';



@Injectable()
export class BillsService {

    private getStatus(owed: number, paid: number): string {
        if (paid === 0) return 'unpaid';
        if (paid < owed) return 'part-paid';
        return 'paid';
    }

    constructor(
      @InjectModel(Bill.name) private billModel: Model<BillDocument>,
      @InjectModel('Allocation') private allocationModel: Model<any>,
      @InjectModel('Payment') private paymentModel: Model<any>,
      @InjectModel('Member') private memberModel: Model<any>
    ) {}

    async create(dto: CreateBillDto) {

        const members = await this.memberModel.find({
            householdId: dto.householdId
        }).exec();

        if (!members.length) {
            throw new NotFoundException('No members found for household');
        }

        //  Create bill
        const bill = await this.billModel.create({
            ...dto,
            periodStart: new Date(dto.periodStart),
            periodEnd: new Date(dto.periodEnd),
        });

        //  Split amount
        const total = bill.totalCents;
        const count = members.length;

        const baseAmount = Math.floor(total / count);
        let remainder = total % count;

        const allocations = members.map((member) => {
            let owed = baseAmount;

            if (remainder > 0) {
                owed += 1;
                remainder--;
            }

            return {
                billId: bill._id.toString(),
                memberId: member._id.toString(),
                owedCents: owed,
                paidCents: 0,
                status: this.getStatus(owed, 0)
            };
        });

        //  Save allocations
        await this.allocationModel.insertMany(allocations);

        return bill;
    }

    async findAllByHousehold(householdId: string) {
        return this.billModel
          .find({ householdId })
          .sort({ periodStart: -1 })
          .exec();
    }

    async findOne(id: string) {
        const bill = await this.billModel.findById(id).exec();
        if (!bill) throw new NotFoundException('Bill not found');
        return bill;
    }

    async addPayment(allocationId: string, amountCents: number) {

        const allocation = await this.allocationModel.findById(allocationId).exec();

        if (!allocation) {
            throw new NotFoundException('Allocation not found');
        }

        // Prevent overpayment
        if (allocation.paidCents + amountCents > allocation.owedCents) {
            throw new BadRequestException('Payment exceeds owed amount');
        }

        // Save payment
        await this.paymentModel.create({
            allocationId,
            memberId: allocation.memberId,
            amountCents
        });

        //  Update allocation
        allocation.paidCents += amountCents;

        //  Update status
        allocation.status = this.getStatus(
          allocation.owedCents,
          allocation.paidCents
        );

        await allocation.save();

        await this.updateBillStatus(allocation.billId);

        return allocation;
    }

    async markPaid(id: string) {
        const bill = await this.billModel.findByIdAndUpdate(
          id,
          { $set: { status: 'paid' } },
          { new: true },
        ).exec();

        if (!bill) throw new NotFoundException('Bill not found');
        return bill;
    }

    async getAllocations(billId: string) {
        return this.allocationModel.find({ billId });
    }

    async updateBillStatus(billId: string) {
        const allocations = await this.allocationModel.find({ billId }).exec();

        const allPaid = allocations.every(a => a.status === 'paid');

        await this.billModel.findByIdAndUpdate(
          billId,
          { status: allPaid ? 'closed' : 'open' }
        );
    }

    async getMembers() {
        return this.memberModel.find().exec();
    }

}
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bills.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('bills')
export class BillsController {
    constructor(
      private readonly billsService: BillsService) {}

    // POST /bills
    @Post()
    create(@Body() dto: CreateBillDto) {
        return this.billsService.create(dto);
    }

    // GET /bills?householdId=h1
    @Get()
    findAll(@Query('householdId') householdId: string) {
        return this.billsService.findAllByHousehold(householdId);
    }

    @Get('members')
    getMembers() {
        return this.billsService.getMembers();
    }

    // GET /bills/:id
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.billsService.findOne(id);
    }

    // PATCH /bills/:id/paid
    @Patch(':id/paid')
    markPaid(@Param('id') id: string) {
        return this.billsService.markPaid(id);
    }

    @Get(':id/allocations')
    getAllocations(@Param('id') id: string) {
        return this.billsService.getAllocations(id);
    }

    @Post('allocations/:id/pay')
    pay(
      @Param('id') id: string,
      @Body() body: { amountCents: number }
    ) {
        return this.billsService.addPayment(id, body.amountCents);
    }


}

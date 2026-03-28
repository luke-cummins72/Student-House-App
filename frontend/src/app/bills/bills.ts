import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillService } from '../services/bills.services';
import { Bill } from '../models/bills';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bills.html',
  styleUrls: ['./bills.css']
})
export class BillsComponent  implements OnInit {

  bills: Bill[] = [];
  allocations: any[] = [];

  selectedBillId: string | null = null;
  selectedBill: any = null;

  members: any[] = []

  newBill: Bill = {
    householdId: 'h1',
    billType: '',
    totalCents: 0,
    periodStart: '',
    periodEnd: ''
  };

  closeBreakdown() {
    this.allocations = [];
    this.selectedBill = null;
    this.selectedBillId = null;
  }

  constructor(private billService: BillService) {}

  loadMembers(): void {
    this.billService.getMembers().subscribe({
      next: (data) => this.members = data,
      error: (err) => console.error(err)
    });
  }
  ngOnInit(): void {
    this.loadBills();
    this.loadMembers();
  }

  loadBills(): void {
    this.billService.getBills().subscribe({
      next: (data) => this.bills = data,
      error: (err) => console.error(err)
    });
  }

  addBill(): void {
    this.billService.addBill(this.newBill).subscribe({
      next: (saved) => {
        this.bills.push(saved);
        this.resetForm();
      },
      error: (err) => console.error(err)
    });
  }

  resetForm(): void {
    this.newBill = {
      householdId: 'h1',
      billType: '',
      totalCents: 0,
      periodStart: '',
      periodEnd: ''
    };
  }

  loadAllocations(billId: string): void {
    this.selectedBillId = billId;

    // find the bill
    this.selectedBill = this.bills.find(b => b._id === billId);

    this.billService.getAllocations(billId).subscribe({
      next: (data) => this.allocations = data,
      error: (err) => console.error(err)
    });
  }

  getTotalOwed(): number {
    return this.allocations.reduce((sum, a) => sum + a.owedCents, 0) / 100;
  }

  getTotalPaid(): number {
    return this.allocations.reduce((sum, a) => sum + a.paidCents, 0) / 100;
  }

  getOutstanding(): number {
    return this.getTotalOwed() - this.getTotalPaid();
  }

  getMemberName(id: string): string {
    const member = this.members.find(m => m._id === id);
    return member ? member.name : id;
  }

  pay(allocation: any) {
    const amount = Math.round((allocation.paymentInput || 0) * 100);

    if (amount <= 0) {
      alert('Enter a valid amount');
      return;
    }

    this.billService.pay(allocation._id, amount).subscribe({
      next: () => {
        this.loadAllocations(this.selectedBillId!);
        this.loadBills();
      },
      error: (err) => alert(err.error?.message || 'Payment failed')
    });
  }

}

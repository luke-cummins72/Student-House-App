import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillService } from '../services/bills.services';
import { Bill } from '../models/bills';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bills.html'
})
export class Bills implements OnInit {

  bills: Bill[] = [];

  newBill: Bill = {
    householdId: 'h1',
    billType: '',
    totalCents: 0,
    periodStart: '',
    periodEnd: ''
  };

  constructor(private billService: BillService) {}

  ngOnInit(): void {
    this.loadBills();
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
}

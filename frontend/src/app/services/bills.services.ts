import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bill } from '../models/bills';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private apiUrl = 'http://localhost:3000/bills';
  private householdId = 'h1';

  constructor(private http: HttpClient) {}

  getBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(this.apiUrl, {
      params: { householdId: this.householdId }
    });
  }

  addBill(bill: Bill): Observable<Bill> {
    return this.http.post<Bill>(this.apiUrl, bill);
  }

  getAllocations(billId: string) {
    return this.http.get<any[]>(`http://localhost:3000/bills/${billId}/allocations`);
  }

  pay(allocationId: string, amount: number) {
    return this.http.post(
      `http://localhost:3000/bills/allocations/${allocationId}/pay`,
      { amountCents: amount }
    );
  }

  getMembers() {
    return this.http.get<any[]>('http://localhost:3000/bills/members');
  }

}

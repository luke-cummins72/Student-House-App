export interface Bill {
  _id?: string;
  householdId: string;
  billType: string;
  totalCents: number;
  periodStart: string;
  periodEnd: string;
  status?: string;
}

import { Schema, Document } from 'mongoose';

export interface AllocationDocument extends Document {
  billId: string;
  memberId: string;
  owedCents: number;
  paidCents: number;
  status: string;
}

export const AllocationSchema = new Schema({
  billId: String,
  memberId: String,
  owedCents: Number,
  paidCents: Number,
  status: String
});
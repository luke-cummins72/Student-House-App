import { Schema } from 'mongoose';

export const PaymentSchema = new Schema({
  allocationId: { type: String, required: true },
  memberId: { type: String, required: true },

  amountCents: { type: Number, required: true },

  date: { type: Date, default: Date.now }
});
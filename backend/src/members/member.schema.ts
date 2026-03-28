import { Schema } from 'mongoose';

export const MemberSchema = new Schema({
  name: { type: String, required: true },
  householdId: { type: String, required: true }
});
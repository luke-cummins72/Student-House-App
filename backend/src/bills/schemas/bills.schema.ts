import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BillDocument = Bill & Document;

@Schema({ timestamps: true })
export class Bill {
    @Prop({ required: true })
    householdId: string;

    @Prop({ required: true })
    billType: string; // e.g., 'Bins', 'Electricity'

    @Prop({ required: true, min: 0 })
    totalCents: number;

    @Prop({ required: true })
    periodStart: Date;

    @Prop({ required: true })
    periodEnd: Date;

    @Prop({ default: 'open' })
    status: 'open' | 'paid';
}

export const BillSchema = SchemaFactory.createForClass(Bill);

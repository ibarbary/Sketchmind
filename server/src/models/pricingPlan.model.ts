import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPricingPlan extends Document {
  name: string;
  price: number;
  credits: number;
  popular: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const pricingPlanSchema: Schema<IPricingPlan> = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    credits: { type: Number, default: 0 },
    popular: { type: Boolean, default: false },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const PricingPlan: Model<IPricingPlan> = mongoose.model<IPricingPlan>(
  "PricingPlan",
  pricingPlanSchema
);

export default PricingPlan;

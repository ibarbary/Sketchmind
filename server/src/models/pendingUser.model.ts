import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPendingUser extends Document {
  name: string;
  email: string;
  password: string;
  credits: number;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const pendingUserSchema: Schema<IPendingUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    credits: { type: Number, default: 0 },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

pendingUserSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PendingUser: Model<IPendingUser> = mongoose.model<IPendingUser>(
  "PendingUser",
  pendingUserSchema
);

export default PendingUser;

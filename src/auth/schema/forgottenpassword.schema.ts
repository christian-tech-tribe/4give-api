import { Schema } from 'mongoose';

export const ForgottenPasswordSchema = new Schema({

  email: String,

  newPasswordToken: String,

  timestamp: Date
  
});
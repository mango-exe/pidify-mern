import mongoose from 'mongoose'

interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  fullName: string;
  token: string;
  authorizationToken: string;
  socketId: string;
  permissions: mongoose.Types.ObjectId[];
  expiry: Date;
}

export {
  IUser
}

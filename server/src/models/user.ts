import mongoose , {  Schema } from 'mongoose'
import { IUser }  from '../types/models/user'

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  token: { type: String },
  socketId: { type: String },
  authorizationToken: { type: String },
  expiry: { type: Date },
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }]
})

const User = mongoose.model<IUser>('User', UserSchema)

export {
  User
}

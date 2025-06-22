import mongoose , {  Schema, Document } from 'mongoose'
import { IPermission }  from '../types/models/permission'

const PermissionSchema = new Schema<IPermission>({
  forResource: Schema.Types.ObjectId,
  rights: { type: String },
})

const Permission = mongoose.model<IPermission>('Permission', PermissionSchema)

export {
  Permission
}

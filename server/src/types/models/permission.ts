import mongoose from 'mongoose'

enum  Rights {
  READ_WRITE = 'read-write',
  READ = 'read',
  WRITE = 'write'
}

interface IPermission extends Document {
  _id: mongoose.Types.ObjectId;
  forResource: mongoose.Types.ObjectId;
  rights: Rights;
}

export {
  IPermission,
  Rights
}

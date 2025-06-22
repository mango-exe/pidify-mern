import mongoose, { Schema, Document } from 'mongoose'
import { IFileMeta, JobStatus  } from '../types/models/filemeta'

const FileMetaSchema = new Schema<IFileMeta>({
  path: { type: String, required: true },
  alias: { type: String, required: true, unique: true },
  timestamp: Date,
  size: Number,
  name: { type: String, required: true, unique: true },
  description: String,
  exports: { type: [Schema.Types.ObjectId], ref: 'Export' },
  jobStatus: { type: String, enum: Object.values(JobStatus), default: JobStatus.PENDING  }
})

const FileMeta = mongoose.model<IFileMeta>('FileMeta', FileMetaSchema)

export {
  FileMeta
}

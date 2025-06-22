import mongoose, { Schema, Document } from 'mongoose'
import { IExport } from '../types/models/export'

const  ExportSchema = new Schema<IExport>({
  path: { type: String , required: true },
  alias: { type: String , required: true },
  timestamp: { type: Date , required: true },
  size: { type: Number , required: true },
  name: { type: String , required: true },
  description: { type: String , required: true },
  type: { type: String , required: true }
})

const Export = mongoose.model<IExport>('Export', ExportSchema)

export {
  Export
}

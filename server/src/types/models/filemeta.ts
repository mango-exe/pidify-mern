import mongoose from 'mongoose'

enum JobStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  FULFILLED = 'FULFILLED',
  FAILED = 'FAILED'
}

interface IFileMeta {
  parentFile: mongoose.Types.ObjectId,
  path: string;
  alias: string;
  timestamp: Date;
  size: number;
  name: string;
  description: string;
  exports: [mongoose.Types.ObjectId];
  jobStatus: JobStatus
}

export  {
  IFileMeta,
  JobStatus
}

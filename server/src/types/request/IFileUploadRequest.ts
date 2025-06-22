// types/IFileUploadRequest.ts
import { Request } from 'express'
import { UploadedFile } from 'express-fileupload'

export type IFileUploadRequest = Request<
  any,
  any,
  {
    name: string;
    description: string;
    files?: {
      file: UploadedFile | UploadedFile[];
    };
    local?: {
      user?: any;
    };
  },
  any
> & {
  files?: {
    file: UploadedFile | UploadedFile[]
  }
  local?: {
    user?: any
  }
}

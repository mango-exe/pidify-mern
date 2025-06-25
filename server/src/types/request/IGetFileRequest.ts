import { Request } from 'express'
import { UploadedFile } from 'express-fileupload'
import { IUser } from '../models/user'

export type IGetFileRequest = Request<
  {
    alias: string;
  },
  any,
  {
    local?: {
      user?: IUser;
    };
  },
  any
> & {
  local?: {
    user?: IUser
  }
}

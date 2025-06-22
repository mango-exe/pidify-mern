import { Response } from "express";

interface IResponse {
  data: any;
  message: string;
  timestamp: Date;
}

export { IResponse }

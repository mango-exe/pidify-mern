enum ExportType {
  PDF='PDF',
  DOCX='DOCX'
}

interface IExport {
  path: string;
  alias: string;
  timestamp: Date;
  size: number;
  name: string;
  description: string;
  content: string;
  type: ExportType;
}

export  {
  IExport
}

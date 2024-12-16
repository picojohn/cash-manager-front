
export interface IInvoice{
    id: number;
    idCompanyClient: number;
    idBusinessUnit: number;
    idProyect: number;
    invoiceDate: Date;
    idCondition: number;
    expirationDate: Date;
    invoiceNumber: number;
    idClient: number;
    idCurrency: number;
    monthWorked: number;
    yearWorked: number;
    subTotalInvoice: number;
    taxesInvoice: number;
    totalInvoice: number;
    comments: string;

  }

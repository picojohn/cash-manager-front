export interface IQbBill {
  id: number;
  idCompany: number;
  qbId: string;
  syncToken: string;
  docNumber: string;
  txnDate: string;
  dueDate: string;
  vendorRef: string;
  vendorName: string;
  totalAmt: number;
  balance: number;
  currencyRef: string;
  exchangeRate: number;
  privateNote: string;
  apAccountRef: string;
  salesTermRef: string;
  linesCount: number;
  qbCreatedAt: string;
  qbUpdatedAt: string;
  syncedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IQbBillLine {
  id: number;
  idBill: number;
  idCompany: number;
  qbBillId: string;
  qbLineId: string;
  lineNum: number;
  detailType: string;
  description: string;
  amount: number;
  accountRef: string;
  accountName: string;
  itemRef: string;
  itemName: string;
  qty: number;
  unitPrice: number;
  billableStatus: string;
  customerRef: string;
  customerName: string;
  taxCodeRef: string;
}

export interface IQbBillsResponse {
  items: Array<IQbBill>;
  total: number;
}

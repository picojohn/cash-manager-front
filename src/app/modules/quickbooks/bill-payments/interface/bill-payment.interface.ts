export interface IQbBillPayment {
  id: number;
  idCompany: number;
  qbId: string;
  syncToken: string;
  docNumber: string;
  txnDate: string;
  totalAmt: number;
  payType: string;
  vendorRef: string;
  vendorName: string;
  apAccountRef: string;
  payAccountRef: string;
  payAccountName: string;
  checkNum: string;
  printStatus: string;
  currencyRef: string;
  exchangeRate: number;
  privateNote: string;
  qbCreatedAt: string;
  qbUpdatedAt: string;
  syncedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IQbBillPaymentLine {
  id: number;
  idBillPayment: number;
  idCompany: number;
  qbBillPaymentId: string;
  qbLineId: string;
  lineNum: number;
  amount: number;
  linkedTxnId: string;
  linkedTxnType: string;
}

export interface IQbBillPaymentsResponse {
  items: Array<IQbBillPayment>;
  total: number;
}

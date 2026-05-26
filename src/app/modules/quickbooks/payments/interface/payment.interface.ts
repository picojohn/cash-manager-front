export interface IQbPayment {
  id: number;
  idCompany: number;
  qbId: string;
  syncToken: string;
  txnDate: string;
  totalAmt: number;
  unappliedAmt: number;
  customerRef: string;
  customerName: string;
  paymentMethodRef: string;
  paymentMethodName: string;
  depositToAccountRef: string;
  depositToAccountName: string;
  currencyRef: string;
  exchangeRate: number;
  paymentRefNum: string;
  privateNote: string;
  qbCreatedAt: string;
  qbUpdatedAt: string;
  syncedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IQbPaymentLine {
  id: number;
  idPayment: number;
  idCompany: number;
  qbPaymentId: string;
  qbLineId: string;
  lineNum: number;
  amount: number;
  linkedTxnId: string;
  linkedTxnType: string;
}

export interface IQbPaymentsResponse {
  items: Array<IQbPayment>;
  total: number;
}

export interface IQbTransfer {
  id: number;
  idCompany: number;
  qbId: string;
  syncToken: string;
  txnDate: string;
  amount: number;
  fromAccountRef: string;
  fromAccountName: string;
  toAccountRef: string;
  toAccountName: string;
  privateNote: string;
  currencyRef: string;
  exchangeRate: number;
  qbCreatedAt: string;
  qbUpdatedAt: string;
  syncedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IQbTransfersResponse {
  items: Array<IQbTransfer>;
  total: number;
}

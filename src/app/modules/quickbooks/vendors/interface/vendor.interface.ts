export interface IQbVendor {
  id: number;
  idCompany: number;
  qbId: string;
  syncToken: string;
  displayName: string;
  companyName: string;
  givenName: string;
  familyName: string;
  primaryEmail: string;
  primaryPhone: string;
  webAddr: string;
  active: number;
  balance: number;
  vendor1099: number;
  taxIdentifier: string;
  accountNumber: string;
  currencyRef: string;
  paymentMethodRef: string;
  qbCreatedAt: string;
  qbUpdatedAt: string;
  syncedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IQbVendorsResponse {
  items: Array<IQbVendor>;
  total: number;
}

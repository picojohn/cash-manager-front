/** Interfaces del submodulo Customers. */

export interface IQbCustomer {
  id: number;
  idCompany: number;
  qbId: string;
  parentRef: string;
  job: number;
  syncToken: string;
  displayName: string;
  companyName: string;
  givenName: string;
  familyName: string;
  active: number;
  balance: number;
  primaryEmail: string;
  primaryPhone: string;
  qbCreatedAt: string;
  qbUpdatedAt: string;
  syncedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IQbCustomerInput {
  displayName: string;
  companyName?: string;
  givenName?: string;
  familyName?: string;
  email?: string;
  phone?: string;
  active?: boolean;
}

export interface IQbCustomersResponse {
  items: Array<IQbCustomer>;
  total: number;
}

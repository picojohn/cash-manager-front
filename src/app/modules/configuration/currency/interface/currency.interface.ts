export interface ICurrency {
  id: number;
  code: string;
  name: string;
}

export interface ICountry {
  id: number;
  name: string;
  language: string;
  countryCode: number;
  idCurrency: number;
  nameCurrency: string;
  code: string;
  state: number;
}

export interface ITax {
  id: number;
  name: string;
  description: string;
  defaultRate: number;
  idCountry: number;
  nameCountry?: string;
  state: number;
}


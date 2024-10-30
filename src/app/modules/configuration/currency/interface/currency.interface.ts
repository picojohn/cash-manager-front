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
  idCurrencies: [];
  nameCurrency: string;
  nameCurrencies: [];
  code: string;
  state: number;
}

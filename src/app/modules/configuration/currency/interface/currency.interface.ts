/* Interfaz pora un Currency */
export interface ICurrency {
  id: number;
  code: string;
  name: string;
}

/* Interfaz pora un Country */
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

/* Interfaz pora un Tax */
export interface ITax {
  id: number;
  name: string;
  description: string;
  defaultRate: number;
  idCountry: number;
  nameCountry?: string;
  state: number;
}

/* Interfaz pora una Groups */
export interface IGroup {
  id: number;
  name: string;
  idCompany: number;
}


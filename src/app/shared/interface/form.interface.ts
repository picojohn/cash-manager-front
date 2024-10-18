export interface IForm {
    name: string;
    prop: string;
    placeholder: string;
    labe: string;
    errorMessage: Array<IErrorMessage>;
    type: string;
    disabled: string;
    value: any;
}


interface IErrorMessage {
    typeError: string;
    message: string;
}
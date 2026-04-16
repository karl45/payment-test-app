export interface PaymentModel{
    id?:number;
    walletNumber:string;
    account:number;
    email:string;
    phone?:string;
    amount:number;
    currency:string;
    comment?:string;
    status?: Status;
    createdAt?:Date;
}

export enum Status{
    Created = "Created",
    Rejected = "Rejected"
}
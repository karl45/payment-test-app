export interface PaymentModel{
    id:number;
    walletNumber:string;
    account:number;
    email:string;
    phone:string | null;
    amount:number;
    currency:string;
    comment:string | null;
    status: Status;
    createdAt:Date;
}

export enum Status{
    Created = "Created",
    Rejected = "Rejected"
}
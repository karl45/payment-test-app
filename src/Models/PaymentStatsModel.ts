export interface PaymentCommonStatsModel{
    paymentCount:number;
    paymentTotal:number;
}

export interface PaymentGroupedByDayStatsModel extends PaymentCommonStatsModel{
    id:number;
    date:Date;
}


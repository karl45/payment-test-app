export interface PaymentCommonStatsModel{
    paymentCount:number;
    paymentTotal:number;
}

export interface PaymentGroupedByDayStatsModel extends PaymentCommonStatsModel{
    date:Date;
}


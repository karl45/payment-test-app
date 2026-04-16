import { useEffect, useState } from "react";
import type { PaymentGroupedByDayStatsModel } from "../../Models/PaymentStatsModel";
import { VITE_SERVER_URL } from "../../../api";
import loading from "../../assets/loading.gif";

interface PaymentStatsByDayParams {
  pageSize: number;
  lastDate?: Date | null;
  prevDate?: Date | null;
}

function PaymentGroupedByDayStats() {
  const [paymentGroupedByDayStats, setPaymentGroupedByDayStats] = useState<
    PaymentGroupedByDayStatsModel[]
  >([]);
  const [statsParams, setStatsParams] = useState<PaymentStatsByDayParams>({
    pageSize: 10,
  });

  const [isLoading, setIsLoading] = useState(true);

  const onNext = () => {

    if (!paymentGroupedByDayStats?.length) return;

    setStatsParams((prev) => ({
      ...prev,
      lastDate: new Date(paymentGroupedByDayStats.at(-1)!.date),
      prevDate: null,
    }));
  };

  const onPrev = () => {
    
    setStatsParams((prev) => ({
      ...prev,
      prevDate: new Date(paymentGroupedByDayStats.at(0)!.date),
      lastDate: null,
    }));
  };

  useEffect(() => {
    const fetchStatsByDay = async (paymentParams: PaymentStatsByDayParams) => {
      try {
        setIsLoading(true);

        const urlParams = new URLSearchParams();

        urlParams.append("pageSize", paymentParams.pageSize.toString());
        if (paymentParams.prevDate) urlParams.append("prevDate", new Date(paymentParams.prevDate).toISOString());
        if (paymentParams.lastDate) urlParams.append("lastDate", new Date(paymentParams.lastDate).toISOString());

        const paramString = new URLSearchParams(
          urlParams as Record<string, any>,
        ).toString();

        const response = await fetch(
          `${VITE_SERVER_URL}/payments/day-stats?${paramString}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (response.ok) {
          if (response.status === 204) return;

          const result = await response.json();
          setPaymentGroupedByDayStats(result);
        }
      } catch (error) {
        console.error("Ошибка при загрузке:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatsByDay(statsParams);
  }, [statsParams]);

  return (
    <>
      {isLoading ? (
        <div className="loading-state">
          <img src={loading} alt="Loading..." />
        </div>
      ) : (
        <div className="stats_by_day">
          <h3>Статистика платежей по дням:</h3>
          <table>
            <thead>
              <tr>
                <th>День</th>
                <th>PaymentCount</th>
                <th>PaymentTotal</th>
              </tr>
            </thead>
            <tbody>
              {paymentGroupedByDayStats.map((paymentGroupedByDayStats) => (
                <tr key={new Date(paymentGroupedByDayStats.date).toLocaleDateString()}>
                  <td>
                    {new Date(
                      paymentGroupedByDayStats.date,
                    ).toLocaleDateString()}
                  </td>
                  <td>{paymentGroupedByDayStats.paymentCount}</td>
                  <td>{paymentGroupedByDayStats.paymentTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button className="prev" onClick={onPrev}>
              Prev
            </button>
            <button className="next" onClick={onNext}>
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default PaymentGroupedByDayStats;

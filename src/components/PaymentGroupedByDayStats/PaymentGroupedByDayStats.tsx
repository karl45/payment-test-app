import { useEffect, useState } from "react";
import type { PaymentGroupedByDayStatsModel } from "../../Models/PaymentStatsModel";
import { VITE_SERVER_URL } from "../../../api";
import loading from "../../assets/loading.gif";

interface PaymentStatsByDayParams {
  pageSize: number;
  lastId: number;
  prevId: number;
}

function PaymentGroupedByDayStats() {
  const [paymentGroupedByDayStats, setPaymentGroupedByDayStats] = useState<
    PaymentGroupedByDayStatsModel[]
  >([]);
  const [statsParams, setStatsParams] = useState<PaymentStatsByDayParams>({
    pageSize: 10,
    lastId: 0,
    prevId: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  const onNext = () => {
    setStatsParams((prev) => ({
      ...prev,
      lastId: paymentGroupedByDayStats.at(-1).id,
      prevId: 0,
    }));
  };

  const onPrev = () => {
    setStatsParams((prev) => ({
      ...prev,
      prevId: paymentGroupedByDayStats.at(0).id,
      lastId: 0,
    }));
  };

  useEffect(() => {
    const fetchStatsByDay = async (paymentParams: PaymentStatsByDayParams) => {
      try {
        setIsLoading(true);

        const paramString = new URLSearchParams(
          paymentParams as Record<string, any>,
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
  }, []);

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
                <tr key={paymentGroupedByDayStats.id}>
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

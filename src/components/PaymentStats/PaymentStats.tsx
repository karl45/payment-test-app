import { useEffect, useState } from "react";
import type { PaymentCommonStatsModel } from "../../Models/PaymentStatsModel";
import { VITE_SERVER_URL } from "../../../api";
import PaymentGroupedByDayStats from "../PaymentGroupedByDayStats/PaymentGroupedByDayStats";
import "./PaymentStats.css";
import loading from "../../assets/loading.gif";

function PaymentStats() {
  const [paymentStats, setPaymentStats] = useState<PaymentCommonStatsModel>({
    paymentCount: 0,
    paymentTotal: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${VITE_SERVER_URL}/payments/stats`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          if (response.status === 204) return;

          const result = await response.json();
          setPaymentStats(result.paymentCommonStats);
        }
      } catch (error) {
        console.error("Ошибка при загрузке:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <div className="stats">
        {isLoading ? (
          <div className="loading-state">
            <img src={loading} alt="Loading..." />
          </div>
        ) : (
          <div className="common_stats">
            <h3>Статистика</h3>
            <span>
              Количество успешно созданных платежей:
              {paymentStats.paymentCount}
            </span>
            <span>
              Сумма всех успешных платежей: {paymentStats.paymentTotal}
            </span>
          </div>
        )}
        <PaymentGroupedByDayStats></PaymentGroupedByDayStats>
      </div>
    </>
  );
}

export default PaymentStats;

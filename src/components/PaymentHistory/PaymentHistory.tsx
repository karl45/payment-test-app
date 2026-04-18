import { useEffect, useState } from "react";
import { type PaymentModel } from "../../Models/PaymentModel";
import { VITE_SERVER_URL } from "../../../api";
import "./PaymentHistory.css";
import loading from "../../assets/loading.gif";
interface PaymentParams {
  pageSize: number;
  lastId: number | undefined;
  prevId: number | undefined;
}

function PaymentHistory() {
  const [payments, setPayments] = useState<PaymentModel[]>([]);
  const [params, setParams] = useState<PaymentParams>({
    pageSize: 10,
    lastId: 0,
    prevId: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async (paymentParams: PaymentParams) => {
      try {
        setIsLoading(true);
        const paramString = new URLSearchParams(
          paymentParams as Record<string, any>,
        ).toString();
        const response = await fetch(
          `${VITE_SERVER_URL}/payments?${paramString}`,
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
          setPayments(result.payments);
        }
      } catch (error) {
        console.error("Ошибка при загрузке:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments(params);
  }, [params]);

  const onNext = () => {
    setParams((prev) => ({
      ...prev,
      lastId: payments.at(-1)!.id,
      prevId: 0,
    }));
  };

  const onPrev = () => {
    setParams((prev) => ({
      ...prev,
      prevId: payments.at(0)!.id,
      lastId: 0,
    }));
  };

  return (
    <>
      {isLoading ? (
        <div className="loading-state">
          <img src={loading} alt="Loading..." />
        </div>
      ) : (
        <div className="payment_history">
          <div className="table_wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>WalletNumber</th>
                  <th>Account</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Status</th>
                  <th>Comments</th>
                  <th>CreatedAt</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <div>{payment.id}</div>
                    </td>
                    <td>
                      <div>{payment.walletNumber}</div>
                    </td>
                    <td>
                      <div>{payment.account}</div>
                    </td>
                    <td>
                      <div>{payment.phone || "—"}</div>
                    </td>
                    <td>
                      <div>{payment.email}</div>
                    </td>
                    <td>{payment.amount}</td>
                    <td>{payment.currency}</td>
                    <td>{payment.status}</td>
                    <td>{payment.comment}</td>
                    <td>{new Date(payment.createdAt!).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button className="nav_button" onClick={onPrev}>
              Prev
            </button>
            <button className="nav_button" onClick={onNext}>
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default PaymentHistory;

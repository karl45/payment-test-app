import "./PaymentCreate.css";
import { Status, type PaymentModel } from "../../Models/PaymentModel";
import { VITE_SERVER_URL, VITE_SECRET_KEY } from "../../../api";
import { useState } from "react";

interface Notification {
  type: NotificationType;
  message: string;
}

enum NotificationType {
  Error,
  Success,
}

function PaymentCreate() {
  const [serverNotification, setServerNotification] = useState<Notification>();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [disabled, setDisabled] = useState(true)
  const [formData, setFormData] = useState<PaymentModel>({
    walletNumber: "",
    account: 0,
    email: "",
    amount: 0,
    currency: "USD",
  });

  const currencies = [
    { code: "USD" },
    { code: "EUR" },
    { code: "RUB" },
    { code: "KZT" },
  ];

  type ValidationErrors = Partial<Record<keyof PaymentModel, string>>;

  const validatePayment = (
    data: PaymentModel,
  ): { isValid: boolean; errors: ValidationErrors } => {
    const errors: ValidationErrors = {};
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const phoneRegex = /^\+7\d{3}\d{3}\d{2}\d{2}$/;

    if (data.walletNumber.length < 8) {
      errors.walletNumber =
        "Номер кошелька должен содержать минимум 8 символов";
    }

    else if (data.account <= 0) {
      errors.account = "Номер счета должен быть положительным числом";
    }


    else if (!data.email) {
      errors.email = "Email обязателен";
    } else if (!emailRegex.test(data.email)) {
      errors.email = "Введите корректный email";
    }

    else if (data.amount <= 0) {
      errors.amount = "Сумма должна быть больше 0";
    }

    else if (data.currency.length !== 3) {
      errors.currency =
        "Валюта должна быть в формате ISO (3 символа, например: RUB, USD)";
    }

     if (data.phone) {
      if (!phoneRegex.test(data.phone)) {
        errors.phone = "Введите корректный номер телефона (+7XXXXXXXXXX)";
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    const nextFormData = {
      ...formData,
      [name]: type === 'number' ? (value === "" ? "" : Number(value)) : value,
    };

    setFormData(nextFormData);
    const validationResult = validatePayment(nextFormData);
        
    if(validationResult.isValid)
        setDisabled(false);
    else
       setDisabled(true);

    setErrors(validationResult.errors);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const onSubmit = async (payment: PaymentModel) => {
    payment.createdAt = new Date();

    try {
      const signature = await generateSignature(payment, VITE_SECRET_KEY);
      const response = await fetch(`${VITE_SERVER_URL}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Signature": signature,
        },
        body: JSON.stringify(payment),
      });

      if (response.ok) {
        setServerNotification({
          type: NotificationType.Success,
          message: "Платеж прошёл успешно!",
        });
      } else if (response.status == 401) {
        setServerNotification({
          type: NotificationType.Error,
          message: "Нелегитимный запрос. Сервер отклонил платеж",
        });
      } else {
        setServerNotification({
          type: NotificationType.Error,
          message: "Сервер отклонил платеж! Поля имеют неверный формат данных",
        });
      }
    } catch (error) {
      setServerNotification({
        type: NotificationType.Error,
        message: error.message || "Произошла ошибка",
      });
    }
  };

  async function generateSignature(body: PaymentModel, secret: string | undefined) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const bodyData = encoder.encode(JSON.stringify(body));

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, bodyData);

    return Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  return (
    <>
      <div className="create_payment_form">
        {serverNotification && (
          <div
            className={`${serverNotification?.type === NotificationType.Error ? "server_error" : "server_success"}`}
          >
            {serverNotification.message}
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="input_field">
            <span>Номер кошелька:</span>
            <input
              name="walletNumber"
              value={formData.walletNumber}
              onChange={handleChange}
              type="text"
            />
            {errors.walletNumber && (
              <span className="error_message">{errors.walletNumber}</span>
            )}
          </div>

          <div className="input_field">
            <span>Account:</span>
            <input
              name="account"
              value={formData.account}
              onChange={handleChange}
              type="number"
            />
            {errors.account && (
              <span className="error_message">{errors.account}</span>
            )}
          </div>

          <div className="input_field">
            <span>Email:</span>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
            />
            {errors.email && (
              <span className="error_message">{errors.email}</span>
            )}
          </div>

          <div className="input_field">
            <span>Phone:</span>
            <input
              name="phone"
              value={formData.phone ?? ''}
              onChange={handleChange}
              type="tel"
              placeholder="+7XXXXXXXXXX"
              required
            />
            {errors.phone && (
              <span className="error_message">{errors.phone}</span>
            )}
          </div>

          <div className="input_field">
            <span>Сумма платежа:</span>
            <input
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              type="number"
              required
            />
            {errors.amount && (
              <span className="error_message">{errors.amount}</span>
            )}
          </div>

          <div className="input_field">
            <span>Валюта:</span>
            <select
              name="currency"
              className="currency"
              value={formData.currency}
              onChange={handleChange}
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.code}
                </option>
              ))}
            </select>
            {errors.currency && (
              <span className="error_message">{errors.currency}</span>
            )}
          </div>

          <div className="input_field">
            <span>Комментарий:</span>

            <input
              name="comment"
              value={formData.comment ?? ''}
              onChange={handleChange}
              type="text"
            />
            {errors.comment && (
              <span className="error_message">{errors.comment}</span>
            )}
          </div>
          <button type="submit" disabled={disabled}>Создать платеж</button>
        </form>
      </div>
    </>
  );
}

export default PaymentCreate;

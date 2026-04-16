import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import PaymentCreate from "./components/PaymentCreate/PaymentCreate";
import Navbar from "./components/Navbar/Navbar";
import PaymentHistory from "./components/PaymentHistory/PaymentHistory";
import PaymentStats from "./components/PaymentStats/PaymentStats";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<PaymentHistory />}></Route>
          <Route path="/create-payment" element={<PaymentCreate />}></Route>
          <Route path="/payment-stats" element={<PaymentStats />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

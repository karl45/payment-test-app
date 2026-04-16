import { Link } from 'react-router';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <h3>TestPay</h3>
      <ul className="nav-links">
        <li><Link to="/">История</Link></li>
        <li><Link to="/create-payment">Создать платеж</Link></li>
        <li><Link to="/payment-stats">Статистка по платежам</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;

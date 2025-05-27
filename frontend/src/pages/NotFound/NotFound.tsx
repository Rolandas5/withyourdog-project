import { Link } from 'react-router-dom';
import './not-found.css';

export default function NotFound() {
  return (
    <div className="notfound-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="back-home-btn">
        Grįžti į pradžią
      </Link>
    </div>
  );
}

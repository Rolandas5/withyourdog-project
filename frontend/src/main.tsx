import ReactDOM from 'react-dom/client';
import App from './App';
import './components/NavBar/nav-bar.css';
import { StrictMode } from 'react';
import './css/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

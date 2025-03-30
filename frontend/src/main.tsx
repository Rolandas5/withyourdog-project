import ReactDOM from 'react-dom/client';
import App from './App';
import './css/NavBar.css';
import './css/LoginRegisterModal.css';
import { StrictMode } from 'react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

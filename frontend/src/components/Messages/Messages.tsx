import { useState, useRef } from 'react';
import { FiUser, FiMail } from 'react-icons/fi';
import axios from 'axios';
import './messages.css';

export const Messages = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);

  const isValidEmail = (email: string) => /.+@.+\..+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { name: '', email: '', message: '' };
    setSuccessMessage('');

    if (!name.trim()) newErrors.name = 'Įveskite savo vardą';
    if (!email.trim()) newErrors.email = 'Įveskite el. paštą';
    else if (!isValidEmail(email))
      newErrors.email = 'Neteisingas el. pašto formatas';
    if (!message.trim()) newErrors.message = 'Įveskite žinutę';

    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    try {
      setIsSending(true);
      await axios.post('/api/messages', {
        name,
        email,
        text: message,
      });
      setSuccessMessage('Ačiū! Jūsų žinutė buvo sėkmingai išsiųsta.');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setSuccessMessage('Įvyko klaida siunčiant žinutę. Bandykite dar kartą.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="contactSection">
      <div className="contactContainer">
        <h2 className="heading">Susisiekite su mumis</h2>
        <p className="subheading">
          Turite klausimų ar pasiūlymų? Parašykite mums žinutę!
        </p>

        <form onSubmit={handleSubmit} className="form" noValidate>
          <div className="contactInputGroup">
            <div className="contactInputWrapper">
              <input
                type="text"
                placeholder="Jūsų vardas"
                className="contactInput"
                value={name}
                onChange={(e) => setName(e.target.value)}
                ref={nameRef}
              />
              <FiUser className="contactIconRight" />
            </div>
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="contactInputGroup">
            <div className="contactInputWrapper">
              <input
                type="email"
                placeholder="El. paštas"
                className="contactInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ref={emailRef}
              />
              <FiMail className="contactIconRight" />
            </div>
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="contactInputGroup">
            <textarea
              placeholder="Jūsų žinutė"
              className="contactInput textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {errors.message && <p className="error">{errors.message}</p>}
          </div>

          <button className="contactButton" type="submit" disabled={isSending}>
            {isSending ? 'Siunčiama...' : 'Siųsti'}
          </button>

          {successMessage && <p className="success">{successMessage}</p>}
        </form>
      </div>
    </section>
  );
};

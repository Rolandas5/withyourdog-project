import { useState, useRef } from 'react';
import { FiUser, FiMail } from 'react-icons/fi';
import styles from './ContactSection.module.css';

export default function ContactSection() {
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
      await new Promise((res) => setTimeout(res, 1500));
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
    <section id="contact" className={styles.contactSection}>
      <div className={styles.contactContainer}>
        <h2 className={styles.heading}>Susisiekite su mumis</h2>
        <p className={styles.subheading}>
          Turite klausimų ar pasiūlymų? Parašykite mums žinutę!
        </p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.contactInputGroup}>
            <div className={styles.contactInputWrapper}>
              <input
                type="text"
                placeholder="Jūsų vardas"
                className={styles.contactInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
                ref={nameRef}
              />
              <FiUser className={styles.contactIconRight} />
            </div>
            {errors.name && <p className={styles.error}>{errors.name}</p>}
          </div>

          <div className={styles.contactInputGroup}>
            <div className={styles.contactInputWrapper}>
              <input
                type="email"
                placeholder="El. paštas"
                className={styles.contactInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ref={emailRef}
              />
              <FiMail className={styles.contactIconRight} />
            </div>
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>

          <div className={styles.contactInputGroup}>
            <textarea
              placeholder="Jūsų žinutė"
              className={`${styles.contactInput} ${styles.textarea}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {errors.message && <p className={styles.error}>{errors.message}</p>}
          </div>

          <button
            className={styles.contactButton}
            type="submit"
            disabled={isSending}
          >
            {isSending ? 'Siunčiama...' : 'Siųsti'}
          </button>

          {successMessage && <p className={styles.success}>{successMessage}</p>}
        </form>
      </div>
    </section>
  );
}

import { useState } from 'react';
import styles from './LoginPage.module.css';

interface LoginPageProps {
  onLogin: (token: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isSignup = mode === 'signup';

  const witty = isSignup
    ? { title: <>Let's get you <em>hired.</em></>, sub: 'Five fields now, fewer panic-applications later.' }
    : { title: <>Welcome <em>back.</em></>, sub: "Your applications didn't auto-send themselves. Well — some did." };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.includes('@')) { setError("That's not a real email and we both know it."); return; }
    if (!password || password.length < 4) { setError("Password: four characters minimum. We're not asking for much."); return; }
    if (isSignup && !name) { setError('A name would be polite.'); return; }
    setLoading(true);
    // Mock auth — no backend required
    setTimeout(() => {
      onLogin('mock-token-local');
      setLoading(false);
    }, 600);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoMark}>
            <div className={styles.logoMarkInner} />
          </div>
          <div className={styles.logoText}>
            career<em>mate</em>
          </div>
          <span className={styles.logoVersion}>v1.0</span>
        </div>

        {/* Mode toggle */}
        <div className={styles.modeSwitch}>
          {(['signin', 'signup'] as const).map((m) => (
            <button
              key={m}
              className={`${styles.modeBtn} ${mode === m ? styles.modeBtnActive : ''}`}
              onClick={() => { setMode(m); setError(''); }}
            >
              {m === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <h1 className={styles.heading}>{witty.title}</h1>
        <p className={styles.sub}>{witty.sub}</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {isSignup && (
            <>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="name">
                  Full Name <span className={styles.req}>*</span>
                </label>
                <input id="name" className={styles.input} placeholder="Aljowharah Aljubair"
                  value={name} onChange={(e) => { setName(e.target.value); setError(''); }} autoComplete="name" />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="university">University</label>
                <input id="university" className={styles.input} placeholder="Prince Sultan University"
                  value={university} onChange={(e) => setUniversity(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="major">Major</label>
                <input id="major" className={styles.input} placeholder="Computer Science"
                  value={major} onChange={(e) => setMajor(e.target.value)} />
              </div>
            </>
          )}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email <span className={styles.req}>*</span></label>
            <input id="email" type="email" className={styles.input} placeholder="you@uni.edu.sa"
              value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} autoComplete="email" />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password <span className={styles.req}>*</span></label>
            <input id="password" type="password" className={styles.input} placeholder="••••••••"
              value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }}
              autoComplete={isSignup ? 'new-password' : 'current-password'} />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading
              ? <><span className={styles.spinner} /> {isSignup ? 'CREATING' : 'SIGNING IN'}…</>
              : isSignup ? 'CREATE ACCOUNT →' : 'SIGN IN →'}
          </button>
        </form>

        <div className={styles.divider}>───── or ─────</div>
        <div className={styles.socialRow}>
          <button className={styles.socialBtn} type="button" disabled>G · Google</button>
          <button className={styles.socialBtn} type="button" disabled>in · LinkedIn</button>
        </div>
        <p className={styles.socialNote}>social login disabled in demo build</p>
        <p className={styles.footer}>Prince Sultan University · SE411 · Spring 2026</p>
      </div>
    </div>
  );
}

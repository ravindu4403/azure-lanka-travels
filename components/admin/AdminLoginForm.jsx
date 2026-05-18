'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react';

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/admin';
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitLogin(event) {
    event.preventDefault();
    setStatus({ type: 'loading', message: 'Checking secure access...' });

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Login failed.');
      setStatus({ type: 'success', message: 'Access approved. Opening admin dashboard...' });
      router.replace(next.startsWith('/admin') ? next : '/admin');
      router.refresh();
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  }

  return (
    <form className="admin-login-card admin-login-card-premium" onSubmit={submitLogin}>
      <div className="admin-login-card-head">
        <div className="admin-login-icon"><ShieldCheck size={32} /></div>
        <div className="admin-login-secure-pill"><Sparkles size={14} /> Secure Admin</div>
      </div>

      <span>Protected Control Center</span>
      <h1>Welcome Back</h1>
      <p>Sign in to manage bookings, safari packages, travel blogs, gallery approvals and customer reviews.</p>

      <label className="admin-field-card">
        <span><Mail size={16} /> Admin Email</span>
        <input name="email" type="email" value={form.email} onChange={updateField} required autoComplete="username" />
      </label>

      <label className="admin-field-card admin-password-field">
        <span><LockKeyhole size={16} /> Password</span>
        <div className="admin-password-input-wrap">
          <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={updateField} required autoComplete="current-password" />
          <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </label>

      <button className="admin-login-submit admin-login-submit-premium" type="submit" disabled={status.type === 'loading'}>
        {status.type === 'loading' ? 'Signing in...' : 'Open Admin Panel'}
      </button>

      {status.message && <p className={`form-status ${status.type}`}>{status.message}</p>}

      <small>For Vercel preview, add ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_TOKEN in Project Settings → Environment Variables.</small>
    </form>
  );
}

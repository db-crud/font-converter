import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const { requestPasswordReset } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await requestPasswordReset(email);
    showToast('🔐 Reset link sent (check console)', 'info');
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="admin@example.com"
          className="w-full p-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button className="w-full py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

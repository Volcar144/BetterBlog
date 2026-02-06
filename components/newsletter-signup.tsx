'use client';

import React, { useState } from 'react';

interface NewsletterSignupProps {
  placeholder?: string;
  buttonText?: string;
  title?: string;
  description?: string;
}

export function NewsletterSignupForm({
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  title = 'Subscribe to our newsletter',
  description = 'Get the latest posts delivered to your inbox every week.',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
        // Reset success message after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to subscribe. Please try again.');
    }
  };

  return (
    <div className='py-12 px-6 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-lg'>
      <div className='max-w-md mx-auto text-center'>
        <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>{title}</h3>
        <p className='text-gray-600 dark:text-gray-400 mb-6'>{description}</p>

        <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
          <div className='flex gap-2'>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              required
              disabled={status === 'loading' || status === 'success'}
              className='flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50'
            />
            <button
              type='submit'
              disabled={status === 'loading' || status === 'success'}
              className='px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors'
            >
              {status === 'loading' ? 'Subscribing...' : buttonText}
            </button>
          </div>

          {message && (
            <p className={`text-sm font-medium ${status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}

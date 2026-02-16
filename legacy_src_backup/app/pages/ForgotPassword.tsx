import { useState, FormEvent } from 'react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { BookHeart, CheckCircle2 } from 'lucide-react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return;
    }

    // Mock password reset
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 size-16 rounded-full flex items-center justify-center">
              <CheckCircle2 className="size-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-3">Check Your Email</h1>
          <p className="text-slate-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>.
            Please check your inbox and follow the instructions.
          </p>
          <Link to="/login">
            <Button className="w-full">Back to Login</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <BookHeart className="size-12 text-blue-600 mb-3" />
          <h1 className="text-2xl font-bold text-slate-800">Reset Password</h1>
          <p className="text-slate-500 mt-1 text-center">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          </div>

          <Button type="submit" className="w-full" size="lg">
            Send Reset Link
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-slate-500 hover:text-slate-700">
            ← Back to login
          </Link>
        </div>
      </Card>
    </div>
  );
}
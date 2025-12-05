import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

type AuthMode = 'login' | 'signup';

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const result = await login(email, password);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Welcome back!');
          navigate('/');
        }
      } else {
        if (username.length < 3) {
          toast.error('Username must be at least 3 characters');
          return;
        }
        if (password.length < 6) {
          toast.error('Password must be at least 6 characters');
          return;
        }
        const result = await signup(email, username, password);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Account created successfully!');
          navigate('/');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="border-4 border-border bg-card p-8 shadow-md">
        <h1 className="text-2xl font-mono font-bold text-center mb-6">
          {mode === 'login' ? 'LOGIN' : 'SIGN UP'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-mono">EMAIL</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="font-mono"
              placeholder="player@snake.com"
            />
          </div>

          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="username" className="font-mono">USERNAME</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="font-mono"
                placeholder="SnakeMaster"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="font-mono">PASSWORD</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="font-mono"
              placeholder="••••••"
            />
          </div>

          <Button
            type="submit"
            className="w-full font-mono"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === 'login' ? (
              'LOGIN'
            ) : (
              'CREATE ACCOUNT'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground font-mono">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <Button
            variant="ghost"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="font-mono mt-2"
          >
            {mode === 'login' ? 'SIGN UP' : 'LOGIN'}
          </Button>
        </div>

        {mode === 'login' && (
          <div className="mt-4 p-3 border-2 border-border bg-secondary">
            <p className="text-xs font-mono text-muted-foreground text-center">
              Demo: demo@snake.com / demo123
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

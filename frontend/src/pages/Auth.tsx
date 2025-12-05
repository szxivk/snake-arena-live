import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuthContext } from '@/contexts/AuthContext';
import { Helmet } from 'react-helmet-async';

const Auth = () => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="font-mono text-muted-foreground">LOADING...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Login - Snake Arena</title>
        <meta name="description" content="Login or create an account to save your scores and compete on the leaderboard." />
      </Helmet>

      <div className="py-8">
        <AuthForm />
      </div>
    </Layout>
  );
};

export default Auth;

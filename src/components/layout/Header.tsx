import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { User, Trophy, Eye, Gamepad2, LogOut } from 'lucide-react';

export function Header() {
  const { user, isAuthenticated, logout } = useAuthContext();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'PLAY', icon: Gamepad2 },
    { path: '/leaderboard', label: 'LEADERBOARD', icon: Trophy },
    { path: '/watch', label: 'WATCH', icon: Eye },
  ];

  return (
    <header className="border-b-4 border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-mono font-bold text-primary tracking-wider">
              SNAKE ARENA
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}>
                <Button
                  variant={location.pathname === path ? 'default' : 'ghost'}
                  className={cn(
                    "font-mono text-sm",
                    location.pathname === path && "shadow-xs"
                  )}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 border-2 border-border bg-secondary">
                  <User className="h-4 w-4" />
                  <span className="font-mono text-sm">{user?.username}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default" className="font-mono">
                  <User className="h-4 w-4 mr-2" />
                  LOGIN
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="flex md:hidden items-center justify-center gap-1 mt-4">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}>
              <Button
                variant={location.pathname === path ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  "font-mono text-xs",
                  location.pathname === path && "shadow-xs"
                )}
              >
                <Icon className="h-3 w-3 mr-1" />
                {label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

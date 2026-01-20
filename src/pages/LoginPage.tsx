/**
 * Login page component.
 */
import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/chat");
    } catch {
      // Error is handled in the store
    }
  };

  return (
    <div 
      className="bg-background p-4 overflow-hidden"
      style={{ 
        height: '100vh', 
        width: '100vw', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0
      }}
    >
      <Card className="w-full max-w-md border-border/50 shadow-lg relative z-10">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Sparkles size={32} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Chat Analytics</CardTitle>
          <CardDescription>
            Enter your credentials to sign in to your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError();
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                }}
                required
              />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary hover:text-primary/90 font-medium underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </div>
          <div className="text-center w-full">
            <div className="text-xs text-muted-foreground mb-2">
              Demo Credentials:
            </div>
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              analyst@example.com / analyst123
            </code>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

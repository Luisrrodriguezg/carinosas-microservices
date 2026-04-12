import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { login } from "@/lib/api";

const TEST_USERS = [
  { username: "admin", password: "admin123", role: "ADMIN", desc: "Full access: read, create, update, delete" },
  { username: "detective", password: "detective123", role: "DETECTIVE", desc: "Read, create, update (no delete)" },
  { username: "analyst", password: "analyst123", role: "ANALYST", desc: "Read only" },
];

interface Props {
  onLogin: (username: string, role: string) => void;
}

export function LoginPage({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (user?: string, pass?: string) => {
    const u = user || username;
    const p = pass || password;
    setError("");
    setLoading(true);
    try {
      await login(u, p);
      const role = TEST_USERS.find((t) => t.username === u)?.role || "UNKNOWN";
      onLogin(u, role);
    } catch {
      setError("Login failed. Make sure Keycloak is running on port 8090.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Carinosas Microservices</CardTitle>
            <CardDescription>
              Case management platform for investigative workflows. Login with Keycloak to test the API endpoints.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="admin123" />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button className="w-full" onClick={() => handleLogin()} disabled={loading || !username || !password}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Login (Test Users)</CardTitle>
            <CardDescription>Click to login instantly with a test account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {TEST_USERS.map((u) => (
              <Button key={u.username} variant="outline" className="w-full justify-between h-auto py-2" onClick={() => handleLogin(u.username, u.password)} disabled={loading}>
                <span className="font-mono">{u.username} / {u.password}</span>
                <span className="text-xs text-muted-foreground ml-2">{u.desc}</span>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

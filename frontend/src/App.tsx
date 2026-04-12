import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoginPage } from "@/pages/LoginPage";
import { CasesPage } from "@/pages/CasesPage";
import { PeoplePage } from "@/pages/PeoplePage";
import { EvidencePage } from "@/pages/EvidencePage";
import { TasksPage } from "@/pages/TasksPage";
import { setToken } from "@/lib/api";

export default function App() {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);

  if (!user) {
    return <LoginPage onLogin={(username, role) => setUser({ username, role })} />;
  }

  const handleLogout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Carinosas Microservices</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Logged in as <span className="font-mono font-medium text-foreground">{user.username}</span>
          </span>
          <Badge variant="secondary">{user.role}</Badge>
          <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <main className="p-6">
        <Tabs defaultValue="cases">
          <TabsList className="mb-6">
            <TabsTrigger value="cases">Cases</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="cases"><CasesPage role={user.role} /></TabsContent>
          <TabsContent value="people"><PeoplePage role={user.role} /></TabsContent>
          <TabsContent value="evidence"><EvidencePage role={user.role} /></TabsContent>
          <TabsContent value="tasks"><TasksPage role={user.role} /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

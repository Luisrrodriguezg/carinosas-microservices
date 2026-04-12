import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { TaskResponse, TaskRequest, TaskUpdateRequest } from "@/types";
import { TaskStatus, TaskPriority } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const canWrite = (role: string) => role === "ADMIN" || role === "DETECTIVE";
const canDelete = (role: string) => role === "ADMIN";

export function TasksPage({ role }: { role: string }) {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [error, setError] = useState("");
  const [caseFilter, setCaseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TaskResponse | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>(TaskPriority.MEDIUM);
  const [status, setStatus] = useState<string>(TaskStatus.PENDING);
  const [caseId, setCaseId] = useState("");
  const [assignedPersonId, setAssignedPersonId] = useState("");
  const [dueDate, setDueDate] = useState("");

  const load = async () => {
    try {
      const params = new URLSearchParams();
      if (caseFilter) params.set("caseId", caseFilter);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      const query = params.toString();
      const path = query ? `/api/tasks?${query}` : "/api/tasks";
      const data = await api.get<TaskResponse[]>(path);
      setTasks(data);
      setError("");
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  useEffect(() => { load(); }, [caseFilter, statusFilter]);

  const resetForm = () => {
    setTitle(""); setDescription(""); setPriority(TaskPriority.MEDIUM); setStatus(TaskStatus.PENDING);
    setCaseId(""); setAssignedPersonId(""); setDueDate(""); setEditing(null);
  };

  const openCreate = () => { resetForm(); setDialogOpen(true); };

  const openEdit = (t: TaskResponse) => {
    setEditing(t);
    setTitle(t.title);
    setDescription(t.description || "");
    setPriority(t.priority);
    setStatus(t.status);
    setCaseId(t.caseId);
    setAssignedPersonId(t.assignedPersonId || "");
    setDueDate(t.dueDate ? t.dueDate.slice(0, 16) : "");
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        const body: TaskUpdateRequest = {
          title, description, priority: priority as TaskPriority, status: status as TaskStatus,
          assignedPersonId: assignedPersonId || undefined,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        };
        await api.put(`/api/tasks/${editing.id}`, body);
      } else {
        const body: TaskRequest = {
          title, description, priority: priority as TaskPriority, caseId,
          assignedPersonId: assignedPersonId || undefined,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        };
        await api.post("/api/tasks", body);
      }
      setDialogOpen(false);
      resetForm();
      load();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      load();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Task Service (Port 8084)</CardTitle>
          <CardDescription>
            Manages assignments related to cases. Tasks can be assigned to people (via assignedPersonId UUID)
            and have due dates, priorities (LOW, MEDIUM, HIGH, CRITICAL), and statuses (PENDING, IN_PROGRESS, COMPLETED, OVERDUE, CANCELLED).
            Use this to assign investigation steps to team members and track their completion.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p><strong>Endpoints:</strong> GET /api/tasks, POST /api/tasks, PUT /api/tasks/:id, DELETE /api/tasks/:id</p>
          <p><strong>Filters:</strong> ?caseId=UUID and/or ?status=PENDING|IN_PROGRESS|COMPLETED|OVERDUE|CANCELLED</p>
          <p><strong>Your role ({role}):</strong> {canDelete(role) ? "Full access" : canWrite(role) ? "Read + Create + Update" : "Read only"}</p>
        </CardContent>
      </Card>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Label>Case ID:</Label>
          <Input className="w-72" value={caseFilter} onChange={(e) => setCaseFilter(e.target.value)} placeholder="Paste a case UUID" />
          <Label>Status:</Label>
          <Select value={statusFilter} onValueChange={(v) => { if (v) setStatusFilter(v); }}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              {Object.values(TaskStatus).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
        </div>

        {canWrite(role) && (
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger render={<Button />} onClick={openCreate}>Create Task</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Task" : "Create Task"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Interview witness John" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority *</Label>
                    <Select value={priority} onValueChange={(v) => { if (v) setPriority(v); }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.values(TaskPriority).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  {editing && (
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={status} onValueChange={(v) => { if (v) setStatus(v); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.values(TaskStatus).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                {!editing && (
                  <div className="space-y-2">
                    <Label>Case ID *</Label>
                    <Input value={caseId} onChange={(e) => setCaseId(e.target.value)} placeholder="UUID of the case" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Assigned Person ID (optional)</Label>
                  <Input value={assignedPersonId} onChange={(e) => setAssignedPersonId(e.target.value)} placeholder="UUID of a person" />
                </div>
                <div className="space-y-2">
                  <Label>Due Date (optional)</Label>
                  <Input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
                <Button onClick={handleSubmit} disabled={!title || (!editing && !caseId)}>
                  {editing ? "Update" : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Case ID</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No tasks found</TableCell></TableRow>
          ) : (
            tasks.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <div>
                    <span className="font-medium">{t.title}</span>
                    {t.description && <p className="text-xs text-muted-foreground truncate max-w-xs">{t.description}</p>}
                    <p className="text-xs text-muted-foreground font-mono">{t.id}</p>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{t.status}</Badge></TableCell>
                <TableCell><Badge variant="secondary">{t.priority}</Badge></TableCell>
                <TableCell className="text-xs font-mono max-w-32 truncate">{t.caseId}</TableCell>
                <TableCell className="text-xs font-mono max-w-32 truncate">{t.assignedPersonId || "—"}</TableCell>
                <TableCell className="text-xs">{t.dueDate ? new Date(t.dueDate).toLocaleString() : "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {canWrite(role) && <Button variant="outline" size="sm" onClick={() => openEdit(t)}>Edit</Button>}
                    {canDelete(role) && <Button variant="destructive" size="sm" onClick={() => handleDelete(t.id)}>Delete</Button>}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

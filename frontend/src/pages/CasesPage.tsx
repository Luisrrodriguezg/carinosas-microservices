import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { CaseResponse, CaseRequest, CaseUpdateRequest } from "@/types";
import { CaseStatus, CasePriority } from "@/types";
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

export function CasesPage({ role }: { role: string }) {
  const [cases, setCases] = useState<CaseResponse[]>([]);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CaseResponse | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>(CasePriority.MEDIUM);
  const [status, setStatus] = useState<string>(CaseStatus.OPEN);

  const load = async () => {
    try {
      const path = statusFilter !== "ALL" ? `/api/cases?status=${statusFilter}` : "/api/cases";
      const data = await api.get<CaseResponse[]>(path);
      setCases(data);
      setError("");
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  useEffect(() => { load(); }, [statusFilter]);

  const resetForm = () => {
    setTitle(""); setDescription(""); setPriority(CasePriority.MEDIUM); setStatus(CaseStatus.OPEN);
    setEditing(null);
  };

  const openCreate = () => { resetForm(); setDialogOpen(true); };

  const openEdit = (c: CaseResponse) => {
    setEditing(c);
    setTitle(c.title);
    setDescription(c.description || "");
    setPriority(c.priority);
    setStatus(c.status);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        const body: CaseUpdateRequest = { title, description, priority: priority as CasePriority, status: status as CaseStatus };
        await api.put(`/api/cases/${editing.id}`, body);
      } else {
        const body: CaseRequest = { title, description, priority: priority as CasePriority };
        await api.post("/api/cases", body);
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
      await api.delete(`/api/cases/${id}`);
      load();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Case Service (Port 8081)</CardTitle>
          <CardDescription>
            Manages investigation cases. Each case has a title, description, status (OPEN, IN_PROGRESS, CLOSED, ARCHIVED),
            and priority (LOW, MEDIUM, HIGH, CRITICAL). Cases are the core entity — people, evidence, and tasks all reference a case by its UUID.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p><strong>Endpoints:</strong> GET /api/cases, GET /api/cases/:id, POST /api/cases, PUT /api/cases/:id, DELETE /api/cases/:id</p>
          <p><strong>Filters:</strong> ?status=OPEN|IN_PROGRESS|CLOSED|ARCHIVED</p>
          <p><strong>Your role ({role}):</strong> {canDelete(role) ? "Full access" : canWrite(role) ? "Read + Create + Update" : "Read only"}</p>
        </CardContent>
      </Card>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label>Filter by status:</Label>
          <Select value={statusFilter} onValueChange={(v) => { if (v) setStatusFilter(v); }}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              {Object.values(CaseStatus).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
        </div>

        {canWrite(role) && (
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger render={<Button />} onClick={openCreate}>Create Case</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Case" : "Create Case"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Robbery on 5th Ave" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Priority *</Label>
                  <Select value={priority} onValueChange={(v) => { if (v) setPriority(v); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.values(CasePriority).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {editing && (
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={(v) => { if (v) setStatus(v); }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.values(CaseStatus).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button onClick={handleSubmit} disabled={!title}>{editing ? "Update" : "Create"}</Button>
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
            <TableHead>Created By</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.length === 0 ? (
            <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No cases found</TableCell></TableRow>
          ) : (
            cases.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div>
                    <span className="font-medium">{c.title}</span>
                    {c.description && <p className="text-xs text-muted-foreground truncate max-w-xs">{c.description}</p>}
                    <p className="text-xs text-muted-foreground font-mono">{c.id}</p>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{c.status}</Badge></TableCell>
                <TableCell><Badge variant="secondary">{c.priority}</Badge></TableCell>
                <TableCell>{c.createdBy}</TableCell>
                <TableCell className="text-xs">{new Date(c.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {canWrite(role) && <Button variant="outline" size="sm" onClick={() => openEdit(c)}>Edit</Button>}
                    {canDelete(role) && <Button variant="destructive" size="sm" onClick={() => handleDelete(c.id)}>Delete</Button>}
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

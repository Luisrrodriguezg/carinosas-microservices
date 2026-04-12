import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { PersonResponse, PersonRequest, PersonUpdateRequest } from "@/types";
import { PersonRole } from "@/types";
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

export function PeoplePage({ role }: { role: string }) {
  const [people, setPeople] = useState<PersonResponse[]>([]);
  const [error, setError] = useState("");
  const [caseFilter, setCaseFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PersonResponse | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [personRole, setPersonRole] = useState<string>(PersonRole.WITNESS);
  const [notes, setNotes] = useState("");
  const [caseId, setCaseId] = useState("");

  const load = async () => {
    try {
      const path = caseFilter ? `/api/people?caseId=${caseFilter}` : "/api/people";
      const data = await api.get<PersonResponse[]>(path);
      setPeople(data);
      setError("");
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  useEffect(() => { load(); }, [caseFilter]);

  const resetForm = () => {
    setFirstName(""); setLastName(""); setPersonRole(PersonRole.WITNESS); setNotes(""); setCaseId("");
    setEditing(null);
  };

  const openCreate = () => { resetForm(); setDialogOpen(true); };

  const openEdit = (p: PersonResponse) => {
    setEditing(p);
    setFirstName(p.firstName);
    setLastName(p.lastName);
    setPersonRole(p.role);
    setNotes(p.notes || "");
    setCaseId(p.caseId);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        const body: PersonUpdateRequest = { firstName, lastName, role: personRole as PersonRole, notes };
        await api.put(`/api/people/${editing.id}`, body);
      } else {
        const body: PersonRequest = { firstName, lastName, role: personRole as PersonRole, notes, caseId };
        await api.post("/api/people", body);
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
      await api.delete(`/api/people/${id}`);
      load();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>People Service (Port 8082)</CardTitle>
          <CardDescription>
            Manages individuals involved in cases: victims, suspects, witnesses, detectives, and analysts.
            Each person is linked to a case via a UUID reference (caseId). You must create a case first, then use its UUID here.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p><strong>Endpoints:</strong> GET /api/people, GET /api/people/:id, POST /api/people, PUT /api/people/:id, DELETE /api/people/:id</p>
          <p><strong>Filters:</strong> ?caseId=UUID (paste a case UUID to filter)</p>
          <p><strong>Roles:</strong> VICTIM, SUSPECT, WITNESS, DETECTIVE, ANALYST</p>
          <p><strong>Your role ({role}):</strong> {canDelete(role) ? "Full access" : canWrite(role) ? "Read + Create + Update" : "Read only"}</p>
        </CardContent>
      </Card>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label>Filter by caseId:</Label>
          <Input className="w-80" value={caseFilter} onChange={(e) => setCaseFilter(e.target.value)} placeholder="Paste a case UUID to filter" />
          <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
        </div>

        {canWrite(role) && (
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger render={<Button />} onClick={openCreate}>Add Person</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Person" : "Add Person"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name *</Label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name *</Label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Select value={personRole} onValueChange={(v) => { if (v) setPersonRole(v); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.values(PersonRole).map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {!editing && (
                  <div className="space-y-2">
                    <Label>Case ID *</Label>
                    <Input value={caseId} onChange={(e) => setCaseId(e.target.value)} placeholder="UUID of the case" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
                <Button onClick={handleSubmit} disabled={!firstName || !lastName || (!editing && !caseId)}>
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
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Case ID</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {people.length === 0 ? (
            <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No people found</TableCell></TableRow>
          ) : (
            people.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div>
                    <span className="font-medium">{p.firstName} {p.lastName}</span>
                    <p className="text-xs text-muted-foreground font-mono">{p.id}</p>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{p.role}</Badge></TableCell>
                <TableCell className="text-xs font-mono max-w-32 truncate">{p.caseId}</TableCell>
                <TableCell className="text-xs max-w-40 truncate">{p.notes}</TableCell>
                <TableCell className="text-xs">{new Date(p.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {canWrite(role) && <Button variant="outline" size="sm" onClick={() => openEdit(p)}>Edit</Button>}
                    {canDelete(role) && <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)}>Delete</Button>}
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

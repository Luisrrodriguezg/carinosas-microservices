import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { EvidenceResponse, EvidenceRequest, EvidenceUpdateRequest, CustodyRecordResponse, CustodyRecordRequest } from "@/types";
import { EvidenceType, EvidenceStatus } from "@/types";
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
import { Separator } from "@/components/ui/separator";

const canWrite = (role: string) => role === "ADMIN" || role === "DETECTIVE";
const canDelete = (role: string) => role === "ADMIN";

export function EvidencePage({ role }: { role: string }) {
  const [evidences, setEvidences] = useState<EvidenceResponse[]>([]);
  const [error, setError] = useState("");
  const [caseFilter, setCaseFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EvidenceResponse | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceType, setEvidenceType] = useState<string>(EvidenceType.PHYSICAL);
  const [evidenceStatus, setEvidenceStatus] = useState<string>(EvidenceStatus.COLLECTED);
  const [caseId, setCaseId] = useState("");

  const [custodyDialogOpen, setCustodyDialogOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceResponse | null>(null);
  const [custodyRecords, setCustodyRecords] = useState<CustodyRecordResponse[]>([]);
  const [custodyAction, setCustodyAction] = useState("");
  const [custodyPerformedBy, setCustodyPerformedBy] = useState("");
  const [custodyNotes, setCustodyNotes] = useState("");

  const load = async () => {
    try {
      const path = caseFilter ? `/api/evidences?caseId=${caseFilter}` : "/api/evidences";
      const data = await api.get<EvidenceResponse[]>(path);
      setEvidences(data);
      setError("");
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  useEffect(() => { load(); }, [caseFilter]);

  const resetForm = () => {
    setName(""); setDescription(""); setEvidenceType(EvidenceType.PHYSICAL);
    setEvidenceStatus(EvidenceStatus.COLLECTED); setCaseId(""); setEditing(null);
  };

  const openCreate = () => { resetForm(); setDialogOpen(true); };

  const openEdit = (ev: EvidenceResponse) => {
    setEditing(ev);
    setName(ev.name);
    setDescription(ev.description || "");
    setEvidenceType(ev.type);
    setEvidenceStatus(ev.status);
    setCaseId(ev.caseId);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        const body: EvidenceUpdateRequest = { name, description, type: evidenceType as EvidenceType, status: evidenceStatus as EvidenceStatus };
        await api.put(`/api/evidences/${editing.id}`, body);
      } else {
        const body: EvidenceRequest = { name, description, type: evidenceType as EvidenceType, caseId };
        await api.post("/api/evidences", body);
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
      await api.delete(`/api/evidences/${id}`);
      load();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  const openCustody = async (ev: EvidenceResponse) => {
    setSelectedEvidence(ev);
    setCustodyAction(""); setCustodyPerformedBy(""); setCustodyNotes("");
    try {
      const records = await api.get<CustodyRecordResponse[]>(`/api/evidences/${ev.id}/custody`);
      setCustodyRecords(records);
    } catch {
      setCustodyRecords([]);
    }
    setCustodyDialogOpen(true);
  };

  const addCustodyRecord = async () => {
    if (!selectedEvidence) return;
    try {
      const body: CustodyRecordRequest = { action: custodyAction, performedBy: custodyPerformedBy, notes: custodyNotes };
      await api.post(`/api/evidences/${selectedEvidence.id}/custody`, body);
      const records = await api.get<CustodyRecordResponse[]>(`/api/evidences/${selectedEvidence.id}/custody`);
      setCustodyRecords(records);
      setCustodyAction(""); setCustodyPerformedBy(""); setCustodyNotes("");
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Evidence Service (Port 8083)</CardTitle>
          <CardDescription>
            Manages evidence items and their chain of custody. Evidence types: PHYSICAL, DIGITAL, TESTIMONIAL, DOCUMENTARY, FORENSIC.
            When evidence is created, an initial COLLECTED custody record is auto-generated. You can add more custody events
            (e.g., TRANSFERRED, ANALYZED, STORED) to track the full chain of custody — a legal requirement in investigations.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p><strong>Endpoints:</strong> GET /api/evidences, POST /api/evidences, PUT /api/evidences/:id, DELETE /api/evidences/:id</p>
          <p><strong>Custody:</strong> GET /api/evidences/:id/custody, POST /api/evidences/:id/custody</p>
          <p><strong>Filters:</strong> ?caseId=UUID</p>
          <p><strong>Your role ({role}):</strong> {canDelete(role) ? "Full access" : canWrite(role) ? "Read + Create + Update" : "Read only"}</p>
        </CardContent>
      </Card>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label>Filter by caseId:</Label>
          <Input className="w-80" value={caseFilter} onChange={(e) => setCaseFilter(e.target.value)} placeholder="Paste a case UUID" />
          <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
        </div>

        {canWrite(role) && (
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger render={<Button />} onClick={openCreate}>Add Evidence</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Evidence" : "Add Evidence"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Fingerprint sample #1" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select value={evidenceType} onValueChange={(v) => { if (v) setEvidenceType(v); }}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.values(EvidenceType).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {editing && (
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={evidenceStatus} onValueChange={(v) => { if (v) setEvidenceStatus(v); }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.values(EvidenceStatus).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {!editing && (
                  <div className="space-y-2">
                    <Label>Case ID *</Label>
                    <Input value={caseId} onChange={(e) => setCaseId(e.target.value)} placeholder="UUID of the case" />
                  </div>
                )}
                <Button onClick={handleSubmit} disabled={!name || (!editing && !caseId)}>
                  {editing ? "Update" : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Dialog open={custodyDialogOpen} onOpenChange={setCustodyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chain of Custody — {selectedEvidence?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {custodyRecords.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No custody records</TableCell></TableRow>
                ) : (
                  custodyRecords.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell><Badge variant="outline">{r.action}</Badge></TableCell>
                      <TableCell>{r.performedBy}</TableCell>
                      <TableCell className="text-xs">{r.notes}</TableCell>
                      <TableCell className="text-xs">{new Date(r.performedAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {canWrite(role) && (
              <>
                <Separator />
                <p className="text-sm font-medium">Add Custody Record</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Action *</Label>
                    <Input value={custodyAction} onChange={(e) => setCustodyAction(e.target.value)} placeholder="e.g. TRANSFERRED, ANALYZED" />
                  </div>
                  <div className="space-y-2">
                    <Label>Performed By *</Label>
                    <Input value={custodyPerformedBy} onChange={(e) => setCustodyPerformedBy(e.target.value)} placeholder="e.g. Det. Smith" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea value={custodyNotes} onChange={(e) => setCustodyNotes(e.target.value)} />
                </div>
                <Button onClick={addCustodyRecord} disabled={!custodyAction || !custodyPerformedBy}>Add Record</Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Case ID</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evidences.length === 0 ? (
            <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No evidence found</TableCell></TableRow>
          ) : (
            evidences.map((ev) => (
              <TableRow key={ev.id}>
                <TableCell>
                  <div>
                    <span className="font-medium">{ev.name}</span>
                    {ev.description && <p className="text-xs text-muted-foreground truncate max-w-xs">{ev.description}</p>}
                    <p className="text-xs text-muted-foreground font-mono">{ev.id}</p>
                  </div>
                </TableCell>
                <TableCell><Badge variant="secondary">{ev.type}</Badge></TableCell>
                <TableCell><Badge variant="outline">{ev.status}</Badge></TableCell>
                <TableCell className="text-xs font-mono max-w-32 truncate">{ev.caseId}</TableCell>
                <TableCell className="text-xs">{new Date(ev.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => openCustody(ev)}>Custody</Button>
                    {canWrite(role) && <Button variant="outline" size="sm" onClick={() => openEdit(ev)}>Edit</Button>}
                    {canDelete(role) && <Button variant="destructive" size="sm" onClick={() => handleDelete(ev.id)}>Delete</Button>}
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

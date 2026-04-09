package com.carinosas.evidenceservice.controller;

import com.carinosas.evidenceservice.dto.*;
import com.carinosas.evidenceservice.service.EvidenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/evidences")
@RequiredArgsConstructor
public class EvidenceController {

    private final EvidenceService evidenceService;

    @GetMapping
    public List<EvidenceResponse> getAll(
            @RequestParam(required = false) UUID caseId) {
        if (caseId != null) return evidenceService.findByCaseId(caseId);
        return evidenceService.findAll();
    }

    @GetMapping("/{id}")
    public EvidenceResponse getById(@PathVariable UUID id) {
        return evidenceService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EvidenceResponse create(@Valid @RequestBody EvidenceRequest request) {
        return evidenceService.create(request);
    }

    @PutMapping("/{id}")
    public EvidenceResponse update(@PathVariable UUID id,
                                   @RequestBody EvidenceUpdateRequest request) {
        return evidenceService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        evidenceService.delete(id);
    }

    // ── Custody Chain ─────────────────────────────────────────
    @PostMapping("/{id}/custody")
    @ResponseStatus(HttpStatus.CREATED)
    public CustodyRecordResponse addCustody(
            @PathVariable UUID id,
            @Valid @RequestBody CustodyRecordRequest request) {
        return evidenceService.addCustodyRecord(id, request);
    }

    @GetMapping("/{id}/custody")
    public List<CustodyRecordResponse> getCustodyChain(@PathVariable UUID id) {
        return evidenceService.getCustodyChain(id);
    }
}

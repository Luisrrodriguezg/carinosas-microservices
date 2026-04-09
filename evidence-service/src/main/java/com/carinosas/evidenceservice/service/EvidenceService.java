package com.carinosas.evidenceservice.service;

import com.carinosas.evidenceservice.domain.CustodyRecord;
import com.carinosas.evidenceservice.domain.Evidence;
import com.carinosas.evidenceservice.dto.*;
import com.carinosas.evidenceservice.exceptions.EvidenceNotFoundException;
import com.carinosas.evidenceservice.repository.CustodyRecordRepository;
import com.carinosas.evidenceservice.repository.EvidenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class EvidenceService {

    private final EvidenceRepository evidenceRepository;
    private final CustodyRecordRepository custodyRecordRepository;

    public EvidenceResponse create(EvidenceRequest request) {
        var entity = Evidence.builder()
                .name(request.name())
                .description(request.description())
                .type(request.type())
                .caseId(request.caseId())
                .build();
        var saved = evidenceRepository.save(entity);
        // Auto create first custody record
        custodyRecordRepository.save(CustodyRecord.builder()
                .evidenceId(saved.getId())
                .action("COLLECTED")
                .performedBy("system")
                .notes("Evidence initially collected")
                .build());
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public EvidenceResponse findById(UUID id) {
        return evidenceRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new EvidenceNotFoundException(id));
    }

    @Transactional(readOnly = true)
    public List<EvidenceResponse> findAll() {
        return evidenceRepository.findAll().stream()
                .map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<EvidenceResponse> findByCaseId(UUID caseId) {
        return evidenceRepository.findByCaseId(caseId).stream()
                .map(this::toResponse).toList();
    }

    public EvidenceResponse update(UUID id, EvidenceUpdateRequest request) {
        var entity = evidenceRepository.findById(id)
                .orElseThrow(() -> new EvidenceNotFoundException(id));
        if (request.name() != null)        entity.setName(request.name());
        if (request.description() != null) entity.setDescription(request.description());
        if (request.type() != null)        entity.setType(request.type());
        if (request.status() != null)      entity.setStatus(request.status());
        return toResponse(evidenceRepository.save(entity));
    }

    public void delete(UUID id) {
        if (!evidenceRepository.existsById(id))
            throw new EvidenceNotFoundException(id);
        evidenceRepository.deleteById(id);
    }

    public CustodyRecordResponse addCustodyRecord(UUID evidenceId,
                                                  CustodyRecordRequest request) {
        if (!evidenceRepository.existsById(evidenceId))
            throw new EvidenceNotFoundException(evidenceId);
        var record = CustodyRecord.builder()
                .evidenceId(evidenceId)
                .action(request.action())
                .performedBy(request.performedBy())
                .notes(request.notes())
                .build();
        return toCustodyResponse(custodyRecordRepository.save(record));
    }

    @Transactional(readOnly = true)
    public List<CustodyRecordResponse> getCustodyChain(UUID evidenceId) {
        return custodyRecordRepository
                .findByEvidenceIdOrderByPerformedAtAsc(evidenceId)
                .stream().map(this::toCustodyResponse).toList();
    }

    private EvidenceResponse toResponse(Evidence e) {
        return new EvidenceResponse(e.getId(), e.getName(), e.getDescription(),
                e.getType(), e.getStatus(), e.getCaseId(),
                e.getCreatedAt(), e.getUpdatedAt());
    }

    private CustodyRecordResponse toCustodyResponse(CustodyRecord c) {
        return new CustodyRecordResponse(c.getId(), c.getEvidenceId(),
                c.getAction(), c.getPerformedBy(), c.getNotes(), c.getPerformedAt());
    }
}
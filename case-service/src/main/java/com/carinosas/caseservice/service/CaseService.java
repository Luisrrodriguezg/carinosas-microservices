package com.carinosas.caseservice.service;

import com.carinosas.caseservice.domain.CaseEntity;
import com.carinosas.caseservice.domain.CaseStatus;
import com.carinosas.caseservice.dto.CaseRequest;
import com.carinosas.caseservice.dto.CaseResponse;
import com.carinosas.caseservice.dto.CaseUpdateRequest;
import com.carinosas.caseservice.exceptions.CaseNotFoundException;
import com.carinosas.caseservice.repository.CaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CaseService {

    private final CaseRepository caseRepository;

    public CaseResponse create(CaseRequest request) {
        var entity = CaseEntity.builder()
                .title(request.title())
                .description(request.description())
                .priority(request.priority())
                .status(CaseStatus.OPEN)
                .createdBy("system")
                .build();
        return toResponse(caseRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public CaseResponse findById(UUID id) {
        return caseRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new CaseNotFoundException(id));
    }

    @Transactional(readOnly = true)
    public List<CaseResponse> findAll() {
        return caseRepository.findAll().stream()
                .map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<CaseResponse> findByStatus(CaseStatus status) {
        return caseRepository.findByStatus(status).stream()
                .map(this::toResponse).toList();
    }

    public CaseResponse update(UUID id, CaseUpdateRequest request) {
        var entity = caseRepository.findById(id)
                .orElseThrow(() -> new CaseNotFoundException(id));
        if (request.title() != null)       entity.setTitle(request.title());
        if (request.description() != null) entity.setDescription(request.description());
        if (request.priority() != null)    entity.setPriority(request.priority());
        if (request.status() != null)      entity.setStatus(request.status());
        return toResponse(caseRepository.save(entity));
    }

    public void delete(UUID id) {
        if (!caseRepository.existsById(id))
            throw new CaseNotFoundException(id);
        caseRepository.deleteById(id);
    }

    private CaseResponse toResponse(CaseEntity e) {
        return new CaseResponse(
                e.getId(), e.getTitle(), e.getDescription(),
                e.getStatus(), e.getPriority(),
                e.getCreatedBy(), e.getCreatedAt(), e.getUpdatedAt()
        );
    }
}
package com.carinosas.evidenceservice.dto;

import com.carinosas.evidenceservice.domain.EvidenceStatus;
import com.carinosas.evidenceservice.domain.EvidenceType;
import java.time.Instant;
import java.util.UUID;

public record EvidenceResponse(
        UUID id,
        String name,
        String description,
        EvidenceType type,
        EvidenceStatus status,
        UUID caseId,
        Instant createdAt,
        Instant updatedAt
) {}
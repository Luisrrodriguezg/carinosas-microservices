package com.carinosas.evidenceservice.dto;

import com.carinosas.evidenceservice.domain.EvidenceStatus;
import com.carinosas.evidenceservice.domain.EvidenceType;

public record EvidenceUpdateRequest(
        String name,
        String description,
        EvidenceType type,
        EvidenceStatus status
) {}

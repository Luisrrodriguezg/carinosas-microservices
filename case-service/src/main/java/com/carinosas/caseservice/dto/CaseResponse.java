package com.carinosas.caseservice.dto;

import com.carinosas.caseservice.domain.CasePriority;
import com.carinosas.caseservice.domain.CaseStatus;
import java.time.Instant;
import java.util.UUID;

public record CaseResponse(
        UUID id,
        String title,
        String description,
        CaseStatus status,
        CasePriority priority,
        String createdBy,
        Instant createdAt,
        Instant updatedAt
) {}
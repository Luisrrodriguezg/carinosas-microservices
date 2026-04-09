package com.carinosas.evidenceservice.dto;

import com.carinosas.evidenceservice.domain.EvidenceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record EvidenceRequest(
        @NotBlank(message = "Name is required")
        String name,

        String description,

        @NotNull(message = "Type is required")
        EvidenceType type,

        @NotNull(message = "Case ID is required")
        UUID caseId
) {}
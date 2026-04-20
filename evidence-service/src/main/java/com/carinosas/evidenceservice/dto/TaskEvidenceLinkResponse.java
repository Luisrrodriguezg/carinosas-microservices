package com.carinosas.evidenceservice.dto;

import java.time.Instant;
import java.util.UUID;

public record TaskEvidenceLinkResponse(
        UUID id,
        UUID taskId,
        UUID evidenceId,
        UUID caseId,
        String taskTitle,
        String taskStatus,
        Instant createdAt,
        Instant updatedAt
) {}

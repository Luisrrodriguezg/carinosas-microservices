package com.carinosas.peopleservice.dto;

import java.time.Instant;
import java.util.UUID;

public record TaskAssignmentResponse(
        UUID id,
        UUID taskId,
        UUID personId,
        UUID caseId,
        String taskTitle,
        String taskStatus,
        String taskPriority,
        Instant createdAt,
        Instant updatedAt
) {}

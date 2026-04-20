package com.carinosas.peopleservice.event;

import java.time.Instant;
import java.util.UUID;

public record TaskEvent(
        String eventType,
        UUID taskId,
        String title,
        String description,
        String status,
        String priority,
        UUID caseId,
        UUID assignedPersonId,
        UUID evidenceId,
        Instant dueDate,
        Instant occurredAt
) {}

package com.carinosas.taskservice.dto;

import com.carinosas.taskservice.domain.TaskPriority;
import com.carinosas.taskservice.domain.TaskStatus;
import java.time.Instant;
import java.util.UUID;

public record TaskUpdateRequest(
        String title,
        String description,
        TaskStatus status,
        TaskPriority priority,
        UUID assignedPersonId,
        UUID evidenceId,
        Instant dueDate
) {}
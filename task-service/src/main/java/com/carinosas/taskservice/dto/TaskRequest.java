package com.carinosas.taskservice.dto;

import com.carinosas.taskservice.domain.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

public record TaskRequest(
        @NotBlank(message = "Title is required")
        String title,

        String description,

        @NotNull(message = "Priority is required")
        TaskPriority priority,

        @NotNull(message = "Case ID is required")
        UUID caseId,

        UUID assignedPersonId,
        Instant dueDate
) {}
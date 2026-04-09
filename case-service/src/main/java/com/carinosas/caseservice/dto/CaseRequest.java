package com.carinosas.caseservice.dto;

import com.carinosas.caseservice.domain.CasePriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CaseRequest(
        @NotBlank(message = "Title is required")
        String title,

        String description,

        @NotNull(message = "Priority is required")
        CasePriority priority
) {}
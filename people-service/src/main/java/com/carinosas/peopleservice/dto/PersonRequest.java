package com.carinosas.peopleservice.dto;

import com.carinosas.peopleservice.domain.PersonRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record PersonRequest(
        @NotBlank(message = "First name is required")
        String firstName,

        @NotBlank(message = "Last name is required")
        String lastName,

        @NotNull(message = "Role is required")
        PersonRole role,

        String notes,

        @NotNull(message = "Case ID is required")
        UUID caseId
) {}
package com.carinosas.evidenceservice.dto;

import jakarta.validation.constraints.NotBlank;

public record CustodyRecordRequest(
        @NotBlank(message = "Action is required")
        String action,

        @NotBlank(message = "Performed by is required")
        String performedBy,

        String notes
) {}
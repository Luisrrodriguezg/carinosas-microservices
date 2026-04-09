package com.carinosas.peopleservice.dto;

import com.carinosas.peopleservice.domain.PersonRole;
import java.time.Instant;
import java.util.UUID;

public record PersonResponse(
        UUID id,
        String firstName,
        String lastName,
        PersonRole role,
        String notes,
        UUID caseId,
        Instant createdAt,
        Instant updatedAt
) {}
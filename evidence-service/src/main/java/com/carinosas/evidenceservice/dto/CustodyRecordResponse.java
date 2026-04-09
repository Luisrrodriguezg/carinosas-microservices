package com.carinosas.evidenceservice.dto;

import java.time.Instant;
import java.util.UUID;

public record CustodyRecordResponse(
        UUID id,
        UUID evidenceId,
        String action,
        String performedBy,
        String notes,
        Instant performedAt
) {}
package com.carinosas.caseservice.dto;

import com.carinosas.caseservice.domain.CasePriority;
import com.carinosas.caseservice.domain.CaseStatus;

public record CaseUpdateRequest(
        String title,
        String description,
        CaseStatus status,
        CasePriority priority
) {}
package com.carinosas.peopleservice.dto;

import com.carinosas.peopleservice.domain.PersonRole;

public record PersonUpdateRequest(
        String firstName,
        String lastName,
        PersonRole role,
        String notes
) {}
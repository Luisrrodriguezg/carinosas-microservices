package com.carinosas.caseservice.exceptions;

import java.util.UUID;

public class CaseNotFoundException extends CaseServiceException {
    public CaseNotFoundException(UUID id) {
        super("Case not found with id: " + id, 404);
    }
}
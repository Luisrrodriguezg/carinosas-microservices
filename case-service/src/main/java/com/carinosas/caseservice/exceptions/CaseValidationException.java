package com.carinosas.caseservice.exceptions;

public class CaseValidationException extends CaseServiceException {
    public CaseValidationException(String message) {
        super(message, 400);
    }
}
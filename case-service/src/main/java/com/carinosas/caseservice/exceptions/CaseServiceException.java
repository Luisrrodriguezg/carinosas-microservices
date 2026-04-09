package com.carinosas.caseservice.exceptions;

public class CaseServiceException extends RuntimeException {
    private final int statusCode;

    public CaseServiceException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public int getStatusCode() { return statusCode; }
}
package com.carinosas.evidenceservice.exceptions;

public class EvidenceServiceException extends RuntimeException {
    private final int statusCode;

    public EvidenceServiceException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public int getStatusCode() { return statusCode; }
}
package com.carinosas.peopleservice.exceptions;

public class PersonServiceException extends RuntimeException {
    private final int statusCode;

    public PersonServiceException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public int getStatusCode() { return statusCode; }
}
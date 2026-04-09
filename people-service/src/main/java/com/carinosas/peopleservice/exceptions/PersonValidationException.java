package com.carinosas.peopleservice.exceptions;

public class PersonValidationException extends PersonServiceException {
    public PersonValidationException(String message) {
        super(message, 400);
    }
}
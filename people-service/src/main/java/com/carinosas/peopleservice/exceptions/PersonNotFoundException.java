package com.carinosas.peopleservice.exceptions;

import java.util.UUID;

public class PersonNotFoundException extends PersonServiceException {
    public PersonNotFoundException(UUID id) {
        super("Person not found with id: " + id, 404);
    }
}
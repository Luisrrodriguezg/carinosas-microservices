package com.carinosas.evidenceservice.exceptions;

import java.util.UUID;

public class EvidenceNotFoundException extends EvidenceServiceException {
    public EvidenceNotFoundException(UUID id) {
        super("Evidence not found with id: " + id, 404);
    }
}
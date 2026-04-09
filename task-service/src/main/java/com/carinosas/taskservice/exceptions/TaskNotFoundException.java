package com.carinosas.taskservice.exceptions;

import java.util.UUID;

public class TaskNotFoundException extends TaskServiceException {
    public TaskNotFoundException(UUID id) {
        super("Task not found with id: " + id, 404);
    }
}
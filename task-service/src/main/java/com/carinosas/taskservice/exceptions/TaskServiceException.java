package com.carinosas.taskservice.exceptions;

public class TaskServiceException extends RuntimeException {
    private final int statusCode;

    public TaskServiceException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public int getStatusCode() { return statusCode; }
}
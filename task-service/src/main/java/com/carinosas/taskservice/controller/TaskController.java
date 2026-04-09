package com.carinosas.taskservice.controller;

import com.carinosas.taskservice.domain.TaskStatus;
import com.carinosas.taskservice.dto.TaskRequest;
import com.carinosas.taskservice.dto.TaskResponse;
import com.carinosas.taskservice.dto.TaskUpdateRequest;
import com.carinosas.taskservice.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public List<TaskResponse> getAll(
            @RequestParam(required = false) UUID caseId,
            @RequestParam(required = false) TaskStatus status) {
        if (caseId != null) return taskService.findByCaseId(caseId);
        if (status != null) return taskService.findByStatus(status);
        return taskService.findAll();
    }

    @GetMapping("/{id}")
    public TaskResponse getById(@PathVariable UUID id) {
        return taskService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse create(@Valid @RequestBody TaskRequest request) {
        return taskService.create(request);
    }

    @PutMapping("/{id}")
    public TaskResponse update(@PathVariable UUID id,
                               @RequestBody TaskUpdateRequest request) {
        return taskService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        taskService.delete(id);
    }
}
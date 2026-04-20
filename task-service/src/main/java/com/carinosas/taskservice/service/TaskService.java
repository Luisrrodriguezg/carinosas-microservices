package com.carinosas.taskservice.service;

import com.carinosas.taskservice.domain.Task;
import com.carinosas.taskservice.domain.TaskStatus;
import com.carinosas.taskservice.dto.TaskRequest;
import com.carinosas.taskservice.dto.TaskResponse;
import com.carinosas.taskservice.dto.TaskUpdateRequest;
import com.carinosas.taskservice.event.TaskEvent;
import com.carinosas.taskservice.event.TaskEventPublisher;
import com.carinosas.taskservice.exceptions.TaskNotFoundException;
import com.carinosas.taskservice.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskEventPublisher eventPublisher;

    public TaskResponse create(TaskRequest request) {
        var entity = Task.builder()
                .title(request.title())
                .description(request.description())
                .priority(request.priority())
                .caseId(request.caseId())
                .assignedPersonId(request.assignedPersonId())
                .evidenceId(request.evidenceId())
                .dueDate(request.dueDate())
                .status(TaskStatus.PENDING)
                .build();
        var saved = taskRepository.save(entity);
        eventPublisher.publish(toEvent("TASK_CREATED", saved));
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public TaskResponse findById(UUID id) {
        return taskRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new TaskNotFoundException(id));
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> findAll() {
        return taskRepository.findAll().stream()
                .map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> findByCaseId(UUID caseId) {
        return taskRepository.findByCaseId(caseId).stream()
                .map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> findByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status).stream()
                .map(this::toResponse).toList();
    }

    public TaskResponse update(UUID id, TaskUpdateRequest request) {
        var entity = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
        if (request.title() != null)            entity.setTitle(request.title());
        if (request.description() != null)      entity.setDescription(request.description());
        if (request.status() != null)           entity.setStatus(request.status());
        if (request.priority() != null)         entity.setPriority(request.priority());
        if (request.assignedPersonId() != null) entity.setAssignedPersonId(request.assignedPersonId());
        if (request.evidenceId() != null)       entity.setEvidenceId(request.evidenceId());
        if (request.dueDate() != null)          entity.setDueDate(request.dueDate());
        var saved = taskRepository.save(entity);
        eventPublisher.publish(toEvent("TASK_UPDATED", saved));
        return toResponse(saved);
    }

    public void delete(UUID id) {
        var entity = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
        taskRepository.deleteById(id);
        eventPublisher.publish(toEvent("TASK_DELETED", entity));
    }

    private TaskEvent toEvent(String eventType, Task t) {
        return new TaskEvent(
                eventType, t.getId(), t.getTitle(), t.getDescription(),
                t.getStatus() != null ? t.getStatus().name() : null,
                t.getPriority() != null ? t.getPriority().name() : null,
                t.getCaseId(), t.getAssignedPersonId(), t.getEvidenceId(),
                t.getDueDate(), Instant.now()
        );
    }

    private TaskResponse toResponse(Task t) {
        return new TaskResponse(
                t.getId(), t.getTitle(), t.getDescription(),
                t.getStatus(), t.getPriority(), t.getCaseId(),
                t.getAssignedPersonId(), t.getEvidenceId(), t.getDueDate(),
                t.getCreatedAt(), t.getUpdatedAt()
        );
    }
}
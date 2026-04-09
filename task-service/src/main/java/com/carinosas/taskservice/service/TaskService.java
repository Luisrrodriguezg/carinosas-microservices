package com.carinosas.taskservice.service;

import com.carinosas.taskservice.domain.Task;
import com.carinosas.taskservice.domain.TaskStatus;
import com.carinosas.taskservice.dto.TaskRequest;
import com.carinosas.taskservice.dto.TaskResponse;
import com.carinosas.taskservice.dto.TaskUpdateRequest;
import com.carinosas.taskservice.exceptions.TaskNotFoundException;
import com.carinosas.taskservice.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskResponse create(TaskRequest request) {
        var entity = Task.builder()
                .title(request.title())
                .description(request.description())
                .priority(request.priority())
                .caseId(request.caseId())
                .assignedPersonId(request.assignedPersonId())
                .dueDate(request.dueDate())
                .status(TaskStatus.PENDING)
                .build();
        return toResponse(taskRepository.save(entity));
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
        if (request.dueDate() != null)          entity.setDueDate(request.dueDate());
        return toResponse(taskRepository.save(entity));
    }

    public void delete(UUID id) {
        if (!taskRepository.existsById(id))
            throw new TaskNotFoundException(id);
        taskRepository.deleteById(id);
    }

    private TaskResponse toResponse(Task t) {
        return new TaskResponse(
                t.getId(), t.getTitle(), t.getDescription(),
                t.getStatus(), t.getPriority(), t.getCaseId(),
                t.getAssignedPersonId(), t.getDueDate(),
                t.getCreatedAt(), t.getUpdatedAt()
        );
    }
}
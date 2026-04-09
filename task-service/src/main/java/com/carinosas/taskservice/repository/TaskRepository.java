package com.carinosas.taskservice.repository;

import com.carinosas.taskservice.domain.Task;
import com.carinosas.taskservice.domain.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByCaseId(UUID caseId);
    List<Task> findByAssignedPersonId(UUID personId);
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByCaseIdAndStatus(UUID caseId, TaskStatus status);
}
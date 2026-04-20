package com.carinosas.peopleservice.event;

import com.carinosas.peopleservice.domain.TaskAssignment;
import com.carinosas.peopleservice.repository.TaskAssignmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskEventConsumer {

    private final TaskAssignmentRepository taskAssignmentRepository;

    @KafkaListener(topics = "task-events", groupId = "people-service")
    @Transactional
    public void consume(TaskEvent event) {
        log.debug("Received task event: {} for task {}", event.eventType(), event.taskId());

        switch (event.eventType()) {
            case "TASK_CREATED", "TASK_UPDATED" -> handleCreateOrUpdate(event);
            case "TASK_DELETED" -> handleDelete(event);
            default -> log.warn("Unknown event type: {}", event.eventType());
        }
    }

    private void handleCreateOrUpdate(TaskEvent event) {
        if (event.assignedPersonId() == null) {
            taskAssignmentRepository.deleteByTaskId(event.taskId());
            return;
        }

        var existing = taskAssignmentRepository.findByTaskId(event.taskId());
        if (existing.isPresent()) {
            var assignment = existing.get();
            assignment.setPersonId(event.assignedPersonId());
            assignment.setTaskTitle(event.title());
            assignment.setTaskStatus(event.status());
            assignment.setTaskPriority(event.priority());
            taskAssignmentRepository.save(assignment);
        } else {
            taskAssignmentRepository.save(TaskAssignment.builder()
                    .taskId(event.taskId())
                    .personId(event.assignedPersonId())
                    .caseId(event.caseId())
                    .taskTitle(event.title())
                    .taskStatus(event.status())
                    .taskPriority(event.priority())
                    .build());
        }
    }

    private void handleDelete(TaskEvent event) {
        taskAssignmentRepository.deleteByTaskId(event.taskId());
    }
}

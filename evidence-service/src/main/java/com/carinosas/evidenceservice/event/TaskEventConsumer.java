package com.carinosas.evidenceservice.event;

import com.carinosas.evidenceservice.domain.TaskEvidenceLink;
import com.carinosas.evidenceservice.repository.TaskEvidenceLinkRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskEventConsumer {

    private final TaskEvidenceLinkRepository taskEvidenceLinkRepository;

    @KafkaListener(topics = "task-events", groupId = "evidence-service")
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
        if (event.evidenceId() == null) {
            taskEvidenceLinkRepository.deleteByTaskId(event.taskId());
            return;
        }

        var existing = taskEvidenceLinkRepository.findByTaskId(event.taskId());
        if (existing.isPresent()) {
            var link = existing.get();
            link.setEvidenceId(event.evidenceId());
            link.setTaskTitle(event.title());
            link.setTaskStatus(event.status());
            taskEvidenceLinkRepository.save(link);
        } else {
            taskEvidenceLinkRepository.save(TaskEvidenceLink.builder()
                    .taskId(event.taskId())
                    .evidenceId(event.evidenceId())
                    .caseId(event.caseId())
                    .taskTitle(event.title())
                    .taskStatus(event.status())
                    .build());
        }
    }

    private void handleDelete(TaskEvent event) {
        taskEvidenceLinkRepository.deleteByTaskId(event.taskId());
    }
}

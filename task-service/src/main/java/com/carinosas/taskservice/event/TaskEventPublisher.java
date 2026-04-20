package com.carinosas.taskservice.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskEventPublisher {

    private static final String TOPIC = "task-events";
    private final KafkaTemplate<String, TaskEvent> kafkaTemplate;

    public void publish(TaskEvent event) {
        kafkaTemplate.send(TOPIC, event.taskId().toString(), event)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Failed to publish task event: {}", event.taskId(), ex);
                    } else {
                        log.debug("Published {} for task {}", event.eventType(), event.taskId());
                    }
                });
    }
}

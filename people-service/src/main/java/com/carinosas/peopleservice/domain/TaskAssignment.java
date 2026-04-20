package com.carinosas.peopleservice.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "task_assignments", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"taskId", "personId"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID taskId;

    @Column(nullable = false)
    private UUID personId;

    @Column(nullable = false)
    private UUID caseId;

    @Column(nullable = false)
    private String taskTitle;

    @Column
    private String taskStatus;

    @Column
    private String taskPriority;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column
    private Instant updatedAt;

    @PrePersist
    void onCreate() { this.createdAt = Instant.now(); }

    @PreUpdate
    void onUpdate() { this.updatedAt = Instant.now(); }
}

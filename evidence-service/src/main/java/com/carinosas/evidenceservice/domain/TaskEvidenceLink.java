package com.carinosas.evidenceservice.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "task_evidence_links", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"taskId", "evidenceId"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskEvidenceLink {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID taskId;

    @Column(nullable = false)
    private UUID evidenceId;

    @Column(nullable = false)
    private UUID caseId;

    @Column(nullable = false)
    private String taskTitle;

    @Column
    private String taskStatus;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column
    private Instant updatedAt;

    @PrePersist
    void onCreate() { this.createdAt = Instant.now(); }

    @PreUpdate
    void onUpdate() { this.updatedAt = Instant.now(); }
}

package com.carinosas.peopleservice.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "case_person_roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CasePersonRole {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID caseId;

    @Column(nullable = false)
    private UUID personId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PersonRole role;

    @Column
    private String notes;

    @Column(nullable = false, updatable = false)
    private Instant assignedAt;

    @Column
    private Instant removedAt;

    @PrePersist
    void onCreate() { this.assignedAt = Instant.now(); }
}

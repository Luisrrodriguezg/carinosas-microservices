package com.carinosas.evidenceservice.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "custody_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustodyRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID evidenceId;

    @Column(nullable = false)
    private String action;      // COLLECTED, TRANSFERRED, ANALYZED, STORED

    @Column(nullable = false)
    private String performedBy;

    @Column(length = 2000)
    private String notes;

    @Column(nullable = false, updatable = false)
    private Instant performedAt;

    @PrePersist
    void onCreate() { this.performedAt = Instant.now(); }
}
package com.carinosas.evidenceservice.repository;

import com.carinosas.evidenceservice.domain.Evidence;
import com.carinosas.evidenceservice.domain.EvidenceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface EvidenceRepository extends JpaRepository<Evidence, UUID> {
    List<Evidence> findByCaseId(UUID caseId);
    List<Evidence> findByStatus(EvidenceStatus status);
}
package com.carinosas.caseservice.repository;

import com.carinosas.caseservice.domain.CaseEntity;
import com.carinosas.caseservice.domain.CasePriority;
import com.carinosas.caseservice.domain.CaseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CaseRepository extends JpaRepository<CaseEntity, UUID> {
    List<CaseEntity> findByStatus(CaseStatus status);
    List<CaseEntity> findByPriority(CasePriority priority);
    List<CaseEntity> findByCreatedBy(String createdBy);
}
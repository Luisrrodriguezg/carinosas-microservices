package com.carinosas.evidenceservice.repository;

import com.carinosas.evidenceservice.domain.CustodyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CustodyRecordRepository extends JpaRepository<CustodyRecord, UUID> {
    List<CustodyRecord> findByEvidenceIdOrderByPerformedAtAsc(UUID evidenceId);
}
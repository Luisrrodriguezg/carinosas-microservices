package com.carinosas.evidenceservice.repository;

import com.carinosas.evidenceservice.domain.TaskEvidenceLink;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskEvidenceLinkRepository extends JpaRepository<TaskEvidenceLink, UUID> {
    List<TaskEvidenceLink> findByEvidenceId(UUID evidenceId);
    Optional<TaskEvidenceLink> findByTaskId(UUID taskId);
    void deleteByTaskId(UUID taskId);
}

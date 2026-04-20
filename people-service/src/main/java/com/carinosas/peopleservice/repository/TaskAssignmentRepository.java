package com.carinosas.peopleservice.repository;

import com.carinosas.peopleservice.domain.TaskAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment, UUID> {
    List<TaskAssignment> findByPersonId(UUID personId);
    Optional<TaskAssignment> findByTaskId(UUID taskId);
    void deleteByTaskId(UUID taskId);
}

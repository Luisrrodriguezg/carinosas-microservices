package com.carinosas.peopleservice.repository;

import com.carinosas.peopleservice.domain.Person;
import com.carinosas.peopleservice.domain.PersonRole;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface PersonRepository extends JpaRepository<Person, UUID> {
    List<Person> findByCaseId(UUID caseId);
    List<Person> findByRole(PersonRole role);
    List<Person> findByCaseIdAndRole(UUID caseId, PersonRole role);
}
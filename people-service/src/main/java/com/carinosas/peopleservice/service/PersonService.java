package com.carinosas.peopleservice.service;

import com.carinosas.peopleservice.domain.Person;
import com.carinosas.peopleservice.domain.TaskAssignment;
import com.carinosas.peopleservice.dto.PersonRequest;
import com.carinosas.peopleservice.dto.PersonResponse;
import com.carinosas.peopleservice.dto.PersonUpdateRequest;
import com.carinosas.peopleservice.dto.TaskAssignmentResponse;
import com.carinosas.peopleservice.exceptions.PersonNotFoundException;
import com.carinosas.peopleservice.repository.PersonRepository;
import com.carinosas.peopleservice.repository.TaskAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PersonService {

    private final PersonRepository personRepository;
    private final TaskAssignmentRepository taskAssignmentRepository;

    public PersonResponse create(PersonRequest request) {
        var entity = Person.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .role(request.role())
                .notes(request.notes())
                .caseId(request.caseId())
                .build();
        return toResponse(personRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public PersonResponse findById(UUID id) {
        return personRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new PersonNotFoundException(id));
    }

    @Transactional(readOnly = true)
    public List<PersonResponse> findAll() {
        return personRepository.findAll().stream()
                .map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<PersonResponse> findByCaseId(UUID caseId) {
        return personRepository.findByCaseId(caseId).stream()
                .map(this::toResponse).toList();
    }

    public PersonResponse update(UUID id, PersonUpdateRequest request) {
        var entity = personRepository.findById(id)
                .orElseThrow(() -> new PersonNotFoundException(id));
        if (request.firstName() != null) entity.setFirstName(request.firstName());
        if (request.lastName() != null)  entity.setLastName(request.lastName());
        if (request.role() != null)      entity.setRole(request.role());
        if (request.notes() != null)     entity.setNotes(request.notes());
        return toResponse(personRepository.save(entity));
    }

    public void delete(UUID id) {
        if (!personRepository.existsById(id))
            throw new PersonNotFoundException(id);
        personRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<TaskAssignmentResponse> findTasksByPersonId(UUID personId) {
        return taskAssignmentRepository.findByPersonId(personId).stream()
                .map(this::toTaskAssignmentResponse).toList();
    }

    private TaskAssignmentResponse toTaskAssignmentResponse(TaskAssignment ta) {
        return new TaskAssignmentResponse(
                ta.getId(), ta.getTaskId(), ta.getPersonId(),
                ta.getCaseId(), ta.getTaskTitle(), ta.getTaskStatus(),
                ta.getTaskPriority(), ta.getCreatedAt(), ta.getUpdatedAt()
        );
    }

    private PersonResponse toResponse(Person p) {
        return new PersonResponse(
                p.getId(), p.getFirstName(), p.getLastName(),
                p.getRole(), p.getNotes(), p.getCaseId(),
                p.getCreatedAt(), p.getUpdatedAt()
        );
    }
}
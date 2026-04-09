package com.carinosas.peopleservice.controller;

import com.carinosas.peopleservice.dto.PersonRequest;
import com.carinosas.peopleservice.dto.PersonResponse;
import com.carinosas.peopleservice.dto.PersonUpdateRequest;
import com.carinosas.peopleservice.service.PersonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/people")
@RequiredArgsConstructor
public class PersonController {

    private final PersonService personService;

    @GetMapping
    public List<PersonResponse> getAll(
            @RequestParam(required = false) UUID caseId) {
        if (caseId != null) return personService.findByCaseId(caseId);
        return personService.findAll();
    }

    @GetMapping("/{id}")
    public PersonResponse getById(@PathVariable UUID id) {
        return personService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PersonResponse create(@Valid @RequestBody PersonRequest request) {
        return personService.create(request);
    }

    @PutMapping("/{id}")
    public PersonResponse update(@PathVariable UUID id,
                                 @RequestBody PersonUpdateRequest request) {
        return personService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        personService.delete(id);
    }
}
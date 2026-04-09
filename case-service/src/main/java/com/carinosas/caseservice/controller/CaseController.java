package com.carinosas.caseservice.controller;

import com.carinosas.caseservice.domain.CaseStatus;
import com.carinosas.caseservice.dto.CaseRequest;
import com.carinosas.caseservice.dto.CaseResponse;
import com.carinosas.caseservice.dto.CaseUpdateRequest;
import com.carinosas.caseservice.service.CaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
public class CaseController {

    private final CaseService caseService;

    @GetMapping
    public List<CaseResponse> getAll(
            @RequestParam(required = false) CaseStatus status) {
        if (status != null) return caseService.findByStatus(status);
        return caseService.findAll();
    }

    @GetMapping("/{id}")
    public CaseResponse getById(@PathVariable UUID id) {
        return caseService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CaseResponse create(@Valid @RequestBody CaseRequest request) {
        return caseService.create(request);
    }

    @PutMapping("/{id}")
    public CaseResponse update(@PathVariable UUID id,
                               @RequestBody CaseUpdateRequest request) {
        return caseService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        caseService.delete(id);
    }
}
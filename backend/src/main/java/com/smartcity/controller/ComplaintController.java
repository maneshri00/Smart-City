package com.smartcity.controller;

import com.smartcity.model.Complaint;
import com.smartcity.model.ComplaintStatus;
import com.smartcity.service.ComplaintService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping("/complaints")
    public ResponseEntity<Complaint> submitComplaint(@RequestBody Complaint complaint) {
        return ResponseEntity.ok(complaintService.submitComplaint(complaint));
    }

    @GetMapping("/complaints")
    public List<Complaint> getAllComplaints() {
        return complaintService.getAllComplaints();
    }

    @GetMapping("/complaints/{id}")
    public Complaint getComplaint(@PathVariable UUID id) {
        return complaintService.getById(id);
    }

    @GetMapping("/complaint-status/{id}")
    public Object getComplaintStatus(@PathVariable UUID id) {
        return Map.of(
            "status", complaintService.getById(id).getStatus(),
            "timeline", complaintService.getTimeline(id),
            "estimated_resolution_hours", complaintService.getById(id).getEstimatedResolutionHours()
        );
    }

    public static class ResolutionRequest {
        private ComplaintStatus status;
        private String notes;
        private String updatedBy;
        
        public ComplaintStatus getStatus() { return status; }
        public void setStatus(ComplaintStatus status) { this.status = status; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
        public String getUpdatedBy() { return updatedBy; }
        public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
    }

    @PutMapping("/complaint-resolution/{id}")
    public Complaint updateResolution(@PathVariable UUID id, @RequestBody ResolutionRequest request) {
        return complaintService.updateResolution(id, request.getStatus(), request.getNotes(), request.getUpdatedBy());
    }
}

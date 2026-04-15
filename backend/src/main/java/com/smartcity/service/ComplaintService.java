package com.smartcity.service;

import com.smartcity.model.*;
import com.smartcity.repository.ComplaintRepository;
import com.smartcity.repository.ComplaintStatusHistoryRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintStatusHistoryRepository historyRepository;
    private final AIService aiService;
    private final SimpMessagingTemplate messagingTemplate;

    public ComplaintService(ComplaintRepository complaintRepository,
                            ComplaintStatusHistoryRepository historyRepository,
                            AIService aiService,
                            SimpMessagingTemplate messagingTemplate) {
        this.complaintRepository = complaintRepository;
        this.historyRepository = historyRepository;
        this.aiService = aiService;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public Complaint submitComplaint(Complaint request) {
        Map<String, Object> aiResult = aiService.classifyComplaint(request.getDescription(), request.getLocation());

        request.setCategory(ComplaintCategory.valueOf((String) aiResult.get("category")));
        request.setPriority(ComplaintPriority.valueOf((String) aiResult.get("priority")));
        request.setAiSuggestedSolution((String) aiResult.get("suggested_solution"));
        request.setDepartment((String) aiResult.get("department"));
        request.setEstimatedResolutionHours((Integer) aiResult.get("estimated_hours"));

        if (request.getPriority() == ComplaintPriority.EMERGENCY) {
            request.setStatus(ComplaintStatus.IN_PROGRESS);
            request.setEstimatedResolutionHours(4);
            messagingTemplate.convertAndSend("/topic/alerts", "EMERGENCY COMPLAINT SUBMITTED: " + request.getCategory());
        } else {
            request.setStatus(ComplaintStatus.SUBMITTED);
        }

        Complaint saved = complaintRepository.save(request);
        logStatusHistory(saved, saved.getStatus(), "Citizen", "Initial Submission via AI Agent");
        
        messagingTemplate.convertAndSend("/topic/complaints", saved);
        return saved;
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public Complaint getById(UUID id) {
        return complaintRepository.findById(id).orElseThrow();
    }
    
    public List<ComplaintStatusHistory> getTimeline(UUID id) {
        return historyRepository.findByComplaintIdOrderByTimestampDesc(id);
    }

    @Transactional
    public Complaint updateResolution(UUID id, ComplaintStatus status, String notes, String user) {
        Complaint complaint = getById(id);
        complaint.setStatus(status);
        Complaint saved = complaintRepository.save(complaint);

        logStatusHistory(saved, status, user, notes);
        messagingTemplate.convertAndSend("/topic/complaints", saved);
        return saved;
    }

    private void logStatusHistory(Complaint complaint, ComplaintStatus status, String updatedBy, String notes) {
        ComplaintStatusHistory history = new ComplaintStatusHistory();
        history.setComplaint(complaint);
        history.setStatus(status);
        history.setUpdatedBy(updatedBy);
        history.setNotes(notes);
        historyRepository.save(history);
    }
}

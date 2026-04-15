class PriorityAnalysisAgent:
    """
    Assigns rules based on category and keywords.
    Priorities: LOW, MEDIUM, HIGH, EMERGENCY
    """
    def analyze(self, category: str, text: str) -> str:
        text = text.lower()
        
        # Keyword based overrides
        if "fire" in text or "accident" in text or "dying" in text:
            return "EMERGENCY"
            
        if "leak" in text and category == "WATER_ISSUE":
            return "HIGH"
            
        if category in ["ELECTRICITY", "TRAFFIC_ISSUE"]:
            return "HIGH"
            
        if category in ["POLLUTION", "ROAD_DAMAGE"]:
            return "MEDIUM"
            
        return "LOW"

class ResolutionSupportAgent:
    """
    Generates suggested steps and estimated timelines.
    """
    def get_suggestions(self, category: str) -> dict:
        suggestions = {
            "WATER_ISSUE": {
                "steps": "1. Dispatch plumbing team. 2. Isolate valve. 3. Repair leak.",
                "estimated_hours": 12
            },
            "ROAD_DAMAGE": {
                "steps": "1. Barricade area. 2. Schedule asphalt fill. 3. Curing period.",
                "estimated_hours": 72
            },
            "TRAFFIC_ISSUE": {
                "steps": "1. Remote signal adjustment. 2. Dispatch traffic cop if needed.",
                "estimated_hours": 2
            },
            "POLLUTION": {
                "steps": "1. Inspect nearby industries. 2. Dispatch air purifier drone.",
                "estimated_hours": 48
            },
            "ELECTRICITY": {
                "steps": "1. Check grid load. 2. Send lineman team. 3. Restore transformer.",
                "estimated_hours": 4
            },
            "PUBLIC_SERVICE": {
                "steps": "1. Notify local contractor. 2. Schedule cleanup.",
                "estimated_hours": 24
            },
            "OTHER": {
                "steps": "1. Manual ticket review. 2. Assign to relevant desk.",
                "estimated_hours": 48
            }
        }
        
        return suggestions.get(category, suggestions["OTHER"])

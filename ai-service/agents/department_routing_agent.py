class DepartmentRoutingAgent:
    """
    Maps Categories to Departments.
    """
    def route(self, category: str) -> dict:
        mapping = {
            "WATER_ISSUE": {"department": "Water & Sanitation Department", "email": "water@smartcity.local"},
            "ROAD_DAMAGE": {"department": "Public Works Department", "email": "pwd@smartcity.local"},
            "TRAFFIC_ISSUE": {"department": "Traffic Management Cell", "email": "traffic@smartcity.local"},
            "POLLUTION": {"department": "Environment Control Board", "email": "environment@smartcity.local"},
            "ELECTRICITY": {"department": "Power Distribution Authority", "email": "power@smartcity.local"},
            "PUBLIC_SERVICE": {"department": "Municipal Corporation", "email": "municipal@smartcity.local"},
            "OTHER": {"department": "Citizen Services Helpdesk", "email": "helpdesk@smartcity.local"}
        }
        
        return mapping.get(category, mapping["OTHER"])

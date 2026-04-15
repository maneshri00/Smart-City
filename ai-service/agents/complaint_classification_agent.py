class ComplaintClassificationAgent:
    """
    Uses NLP (mocked TF-IDF + Naive Bayes) to classify complaint text.
    Categories: WATER_ISSUE, ROAD_DAMAGE, TRAFFIC_ISSUE, POLLUTION, ELECTRICITY, PUBLIC_SERVICE, OTHER
    """
    def __init__(self):
        # In a real scenario, we load a saved scikit-learn model here
        pass

    def classify(self, text: str) -> str:
        text = text.lower()
        if "water" in text or "leak" in text or "pipe" in text:
            return "WATER_ISSUE"
        elif "pothole" in text or "road" in text or "crack" in text:
            return "ROAD_DAMAGE"
        elif "traffic" in text or "jam" in text or "signal" in text:
            return "TRAFFIC_ISSUE"
        elif "smoke" in text or "smog" in text or "air" in text:
            return "POLLUTION"
        elif "power" in text or "electricity" in text or "outage" in text:
            return "ELECTRICITY"
        elif "garbage" in text or "park" in text:
            return "PUBLIC_SERVICE"
        return "OTHER"

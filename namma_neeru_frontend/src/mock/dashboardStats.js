export const MOCK_DASHBOARD_STATS = {
  totalTankers: 356,
  tankersTrend: "+12%",
  crisisZones: 12,
  crisisZonesTrend: "-3",
  avgDeliveryTime: "23 min",
  avgDeliveryTimeTrend: "-8%",
  totalDeliveries: 1248,
  totalDeliveriesTrend: "+18%"
};

export const MOCK_CRISIS_ALERTS = [
  {
    id: 1,
    area: "HSR Layout",
    risk: "High Risk",
    timeline: "in 4-6 days",
    confidence: "82%",
    reasons: ["low rainfall", "rising tanker demand", "declining reservoir levels"]
  },
  {
    id: 2,
    area: "Bommanahalli",
    risk: "Medium Risk",
    timeline: "in 6-10 days",
    confidence: "65%",
    reasons: ["consistent high demand", "pipeline maintenance"]
  },
  {
    id: 3,
    area: "Whitefield",
    risk: "Low Risk",
    timeline: "in 1-3 days",
    confidence: "90%",
    reasons: ["stable ground water", "new reservoir link"]
  }
];

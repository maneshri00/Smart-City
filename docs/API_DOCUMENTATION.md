# Smart City Digital Twin System - API Documentation

## Overview
This document outlines the REST API endpoints and WebSocket topics available in the Smart City Digital Twin System.

## Base URL
`http://localhost:8080/api`

## Authentication
All protected endpoints require a Bearer token.
Header Format: `Authorization: Bearer <token>`

---

## Auth Endpoints
### 1. Register User
`POST /auth/register`
- **Body**: `{ "username": "admin1", "email": "admin@b.com", "password": "pwd", "role": "ADMIN" }`
- **Response**: `200 OK` "User registered successfully"

### 2. Login
`POST /auth/login`
- **Body**: `{ "username": "admin1", "password": "pwd" }`
- **Response**: `{ "token": "jwt...", "username": "admin1", "role": "ADMIN" }`

---

## IoT Sensor Data Endpoints (Public)
### 1. Get Latest Readings
`GET /sensor-data`
- **Response**: 
```json
[
  { "id": "uuid", "timestamp": "2024-01-01T10:00:00Z", "zoneId": "Z1", "aqi": 45, "temperature": 22.5, "humidity": 65.0, "waterPh": 7.1, "source": "Sensor-1" }
]
```

### 2. Get 24h History
`GET /sensor-data/history`
- **Response**: Time-series array matching above format.

---

## Traffic Data Endpoints
### 1. Get Current Traffic
`GET /traffic`
- **Response**: 
```json
[
  { "id": "uuid", "zoneId": "Z1", "vehicleCount": 1200, "avgSpeedKmh": 24.5, "congestionLevel": "HIGH" }
]
```

### 2. Get Heatmap Data
`GET /traffic/heatmap`
- **Response**: Structured grid data of traffic densities.

---

## Environment & Sustainability Endpoints
### 1. Get Status
`GET /environment`
- **Response**: `{ "overall_aqi": 85, "pollution_level": "Moderate" }`

### 2. Get Alerts
`GET /environment/alerts`
- **Response**: `["High PM2.5 in Z1", "Water pH dropping in Z3"]`

---

## Complaint Management
### 1. Submit Complaint
`POST /complaints`
- **Body**: 
```json
{
  "citizenName": "John Doe",
  "email": "john@example.com",
  "location": "Sector 5",
  "description": "Water pipe burst on Main St."
}
```
- **Response**: Returns saved Complaint object with AI classifications and Ticket UUID.

### 2. Get All Complaints (Admin/Authority)
`GET /complaints`
- **Requires**: Bearer Token
- **Response**: Array of all complaints.

### 3. Track Complaint Status
`GET /complaint-status/{id}`
- **Response**: full timeline and estimated resolution hours.

### 4. Update Resolution Status (Admin/Authority)
`PUT /complaint-resolution/{id}`
- **Requires**: Bearer Token
- **Body**: `{ "status": "IN_PROGRESS", "notes": "Dispatched crew", "updatedBy": "Admin" }`
- **Response**: Updated complaint object.

---

## WebSockets
**Connection Endpoint**: `ws://localhost:8080/ws`
**Protocol**: STOMP over SockJS

### Topics
- `/topic/sensor-updates`: Broadcasts single `SensorData` object every 5 seconds.
- `/topic/alerts`: Broadcasts string messages on AI anomaly detection.
- `/topic/complaints`: Broadcasts the complaint object whenever status changes.

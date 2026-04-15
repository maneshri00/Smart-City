-- PostgreSQL Schema for Smart City Digital Twin System

-- Create Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Departments
INSERT INTO departments (name, email) VALUES
    ('Water & Sanitation Department', 'water@smartcity.local'),
    ('Public Works Department', 'pwd@smartcity.local'),
    ('Traffic Management Cell', 'traffic@smartcity.local'),
    ('Environment Control Board', 'environment@smartcity.local'),
    ('Power Distribution Authority', 'power@smartcity.local'),
    ('Municipal Corporation', 'municipal@smartcity.local'),
    ('Citizen Services Helpdesk', 'helpdesk@smartcity.local')
ON CONFLICT DO NOTHING;

-- Create Users Table (for Authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('CITIZEN', 'AUTHORITY', 'ADMIN')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy users for testing
INSERT INTO users (username, email, password_hash, role) VALUES
    ('admin', 'admin@smartcity.local', '$2a$10$xyz', 'ADMIN'),
    ('auth_water', 'water@smartcity.local', '$2a$10$xyz', 'AUTHORITY'),
    ('citizen_joe', 'joe@example.com', '$2a$10$xyz', 'CITIZEN')
ON CONFLICT DO NOTHING;

-- Create SensorData Table (Relational sync if not solely relying on DynamoDB)
CREATE TABLE IF NOT EXISTS sensor_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP NOT NULL,
    zone_id VARCHAR(50) NOT NULL,
    aqi INT NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    humidity DECIMAL(5,2) NOT NULL,
    water_ph DECIMAL(3,1) NOT NULL,
    source VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sensor_time ON sensor_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_sensor_zone ON sensor_data(zone_id);

-- Create TrafficData Table
CREATE TABLE IF NOT EXISTS traffic_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP NOT NULL,
    zone_id VARCHAR(50) NOT NULL,
    vehicle_count INT NOT NULL,
    avg_speed_kmh DECIMAL(5,2) NOT NULL,
    congestion_level VARCHAR(20) NOT NULL CHECK (congestion_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_traffic_time ON traffic_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_traffic_zone ON traffic_data(zone_id);

-- Create Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('WATER_ISSUE', 'ROAD_DAMAGE', 'TRAFFIC_ISSUE', 'POLLUTION', 'ELECTRICITY', 'PUBLIC_SERVICE', 'OTHER')),
    priority VARCHAR(50) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'EMERGENCY')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED')),
    department VARCHAR(255),
    ai_suggested_solution TEXT,
    estimated_resolution_hours INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_complaint_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaint_category ON complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaint_created_at ON complaints(created_at);

-- Create Complaint Status History Table
CREATE TABLE IF NOT EXISTS complaint_status_history (
    id SERIAL PRIMARY KEY,
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    updated_by VARCHAR(255),
    notes TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Sample Sensor Data
INSERT INTO sensor_data (timestamp, zone_id, aqi, temperature, humidity, water_ph, source)
SELECT 
    NOW() - (random() * interval '24 hours'),
    'Z' || floor(random() * 5 + 1)::text,
    floor(random() * 250 + 20),
    random() * 20 + 15,
    random() * 50 + 40,
    random() * 2 + 6.5,
    'Sensor-' || floor(random() * 100)
FROM generate_series(1, 100);

-- Insert Sample Traffic Data
INSERT INTO traffic_data (timestamp, zone_id, vehicle_count, avg_speed_kmh, congestion_level)
SELECT 
    NOW() - (random() * interval '12 hours'),
    'Z' || floor(random() * 5 + 1)::text,
    floor(random() * 1500 + 100),
    random() * 60 + 10,
    CASE 
        WHEN random() < 0.25 THEN 'LOW'
        WHEN random() < 0.5 THEN 'MEDIUM'
        WHEN random() < 0.8 THEN 'HIGH'
        ELSE 'CRITICAL'
    END
FROM generate_series(1, 100);

-- Insert Sample Complaints
INSERT INTO complaints (citizen_name, description, location, category, priority, status, department, estimated_resolution_hours)
SELECT 
    'Citizen ' || generate_series,
    'Sample Complaint Description ' || generate_series,
    'Sector ' || floor(random() * 10 + 1),
    CASE 
        WHEN random() < 0.2 THEN 'WATER_ISSUE'
        WHEN random() < 0.4 THEN 'ROAD_DAMAGE'
        WHEN random() < 0.6 THEN 'TRAFFIC_ISSUE'
        WHEN random() < 0.8 THEN 'POLLUTION'
        ELSE 'ELECTRICITY'
    END,
    CASE 
        WHEN random() < 0.3 THEN 'LOW'
        WHEN random() < 0.6 THEN 'MEDIUM'
        WHEN random() < 0.9 THEN 'HIGH'
        ELSE 'EMERGENCY'
    END,
    CASE 
        WHEN random() < 0.3 THEN 'SUBMITTED'
        WHEN random() < 0.6 THEN 'ASSIGNED'
        ELSE 'IN_PROGRESS'
    END,
    'Unassigned',
    floor(random() * 48 + 4)
FROM generate_series(1, 20);

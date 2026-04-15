# Smart City Digital Twin System

A production-grade, microservice-based platform for live city monitoring, using Spring Boot, React, FastAPI, PostgreSQL, and AWS DynamoDB.

## System Architecture Diagram

```
         [ Citizens / Admin - React Web UI ]
                    |
              (HTTP/REST + WebSocket)
                    |
      +-------------v-------------+
      |      Spring Boot App      |
      | - Security (JWT)          |
      | - REST Controllers        |
      | - WebSocket Broker        |
      | - Data Services           |
      +-------------+-------------+
             |               | (HTTP Client)
             |               v
             |     +-------------------+
             |     |    Python AI      |
             |     |   Microservice    |
             |     | - 5 AI Agents     |
             |     | - Scikit-Learn    |
             |     +-------------------+
             v
      +-------------------+
      |     Databases     |
      | - RDS PostgreSQL  | (Relational data)
      | - AWS DynamoDB    | (High-throughput IoT)
      +-------------------+
```

## Prerequisites
- Node.js 18+
- Java 17+ (Maven wrapper included)
- Python 3.10+
- AWS Account (for DynamoDB/RDS setup if deploying)

## Setup Steps
### 1. Database
- Apply `database/rds_schema.sql` to your local PostgreSQL instance for testing.
- Run `python database/dynamodb_setup.py` (assumes your AWS CLI is configured).

### 2. Environment Variables
No actual `.env` file is needed locally. The backend `application.properties` specifies default fallbacks to `localhost` and `postgres` default credentials. 

### 3. Running Services Locally

**A. Start Python AI Service**
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

**B. Start Spring Boot Backend**
```bash
cd backend
./mvnw spring-boot:run
```
*(Runs on port 8080. Swagger UI available at `http://localhost:8080/swagger-ui.html`)*

**C. Start React Frontend**
```bash
cd frontend
npm install
npm run dev
```
*(Runs on port 3000)*

## Deployment (AWS Free Tier)
1. Provision db.t3.micro RDS instance in us-east-1 and apply schema.
2. Ensure DynamoDB table `SmartCityIoTReadings` is created.
3. Build backend (`./mvnw package`) and deploy JAR via Elastic Beanstalk (Corretto 17).
4. Run AI Service on EC2 t2.micro via Docker.
5. Build Frontend (`npm run build`) and deploy `dist` folder to S3 static website hosting, fronted by CloudFront.

## Troubleshooting
- **WebSocket connection failed**: Ensure backend is running before loading the React app. Check if port 8080 is available.
- **AI Classification returning 'OTHER'**: Ensure Python microservice is running on port 8001; backend `AIService.java` falls back gracefully if unreachable.
- **Mapbox map not rendering**: Mapbox component uses a dummy token wrapper. Update `frontend/src/components/DigitalTwin/MapboxView.jsx` with a real token to view the actual map tile arrays.
"# Smart-City" 

# 📡 UAP Blockchain API Documentation

## Base URL

```
Development: http://localhost:5000/api
Production: https://api.uap-blockchain.edu.vn/api
```

## Authentication

All API requests require JWT authentication (except public verification endpoints).

```http
Authorization: Bearer <jwt_token>
```

---

## 📚 User Management

### Register User

```http
POST /users/register
```

**Request Body:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "userId": "SE170107",
  "fullName": "Nguyen Phi Hung",
  "email": "hung@fpt.edu.vn",
  "role": 4
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "userId": "SE170107",
    "role": 4,
    "transactionHash": "0x..."
  }
}
```

### Get User

```http
GET /users/{address}
```

**Response:**
```json
{
  "userAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "userId": "SE170107",
  "fullName": "Nguyen Phi Hung",
  "email": "hung@fpt.edu.vn",
  "role": 4,
  "isActive": true,
  "createdAt": 1698796800
}
```

---

## 🎓 Credential Management

### Issue Credential

```http
POST /credentials
```

**Request Body:**
```json
{
  "studentAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "credentialType": "DEGREE",
  "credentialData": "ipfs://QmHash...",
  "expiresAt": 1730419200
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "credentialId": 1,
    "transactionHash": "0x...",
    "status": "ACTIVE"
  }
}
```

### Verify Credential

```http
GET /credentials/{credentialId}/verify
```

**Response:**
```json
{
  "valid": true,
  "credential": {
    "credentialId": 1,
    "studentAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "credentialType": "DEGREE",
    "status": "ACTIVE",
    "issuedBy": "0x...",
    "issuedAt": 1698796800,
    "expiresAt": 1730419200
  }
}
```

### Revoke Credential

```http
POST /credentials/{credentialId}/revoke
```

**Response:**
```json
{
  "success": true,
  "data": {
    "credentialId": 1,
    "status": "REVOKED",
    "transactionHash": "0x..."
  }
}
```

### Get Student Credentials

```http
GET /credentials/student/{address}
```

**Response:**
```json
{
  "studentAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "credentials": [
    {
      "credentialId": 1,
      "credentialType": "DEGREE",
      "status": "ACTIVE",
      "issuedAt": 1698796800
    }
  ]
}
```

---

## 📅 Attendance Management

### Mark Attendance

```http
POST /attendance
```

**Request Body:**
```json
{
  "classId": 1,
  "studentAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "sessionDate": 1698796800,
  "status": 0,
  "notes": "On time"
}
```

**Attendance Status:**
- `0`: PRESENT
- `1`: ABSENT
- `2`: LATE
- `3`: EXCUSED

**Response:**
```json
{
  "success": true,
  "data": {
    "recordId": 1,
    "classId": 1,
    "studentAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "status": 0,
    "transactionHash": "0x..."
  }
}
```

### Update Attendance

```http
PUT /attendance/{recordId}
```

**Request Body:**
```json
{
  "status": 3,
  "notes": "Medical certificate provided"
}
```

### Get Student Attendance

```http
GET /attendance/class/{classId}/student/{address}
```

**Response:**
```json
{
  "classId": 1,
  "studentAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "records": [
    {
      "recordId": 1,
      "sessionDate": 1698796800,
      "status": 0,
      "notes": "On time",
      "markedBy": "0x...",
      "markedAt": 1698796810
    }
  ],
  "attendanceRate": 95.5
}
```

---

## 📊 Grade Management

### Record Grade

```http
POST /grades
```

**Request Body:**
```json
{
  "classId": 1,
  "studentAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "componentName": "Midterm",
  "score": 8550,
  "maxScore": 10000
}
```

**Note**: Scores are multiplied by 100 (85.50 = 8550)

**Response:**
```json
{
  "success": true,
  "data": {
    "gradeId": 1,
    "status": "DRAFT",
    "transactionHash": "0x..."
  }
}
```

### Update Grade

```http
PUT /grades/{gradeId}
```

**Request Body:**
```json
{
  "score": 9000
}
```

### Approve Grade

```http
POST /grades/{gradeId}/approve
```

**Response:**
```json
{
  "success": true,
  "data": {
    "gradeId": 1,
    "status": "APPROVED",
    "approvedBy": "0x...",
    "approvedAt": 1698796800,
    "transactionHash": "0x..."
  }
}
```

### Get Student Grades

```http
GET /grades/class/{classId}/student/{address}
```

**Response:**
```json
{
  "classId": 1,
  "studentAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "grades": [
    {
      "gradeId": 1,
      "componentName": "Midterm",
      "score": 8550,
      "maxScore": 10000,
      "percentage": 85.5,
      "status": "APPROVED"
    }
  ],
  "finalGrade": 87.25
}
```

---

## 🏫 Class Management

### Create Class

```http
POST /classes
```

**Request Body:**
```json
{
  "classCode": "SE170107",
  "className": "Software Engineering",
  "lecturerAddress": "0x...",
  "startDate": 1698796800,
  "endDate": 1706659200,
  "maxStudents": 50
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "classId": 1,
    "classCode": "SE170107",
    "transactionHash": "0x..."
  }
}
```

### Enroll Student

```http
POST /classes/{classId}/enroll
```

**Request Body:**
```json
{
  "studentAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

### Drop Student

```http
POST /classes/{classId}/drop
```

**Request Body:**
```json
{
  "studentAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

### Get Class Details

```http
GET /classes/{classId}
```

**Response:**
```json
{
  "classId": 1,
  "classCode": "SE170107",
  "className": "Software Engineering",
  "lecturerAddress": "0x...",
  "startDate": 1698796800,
  "endDate": 1706659200,
  "maxStudents": 50,
  "enrolledCount": 35,
  "isActive": true
}
```

### Get Class Enrollments

```http
GET /classes/{classId}/enrollments
```

**Response:**
```json
{
  "classId": 1,
  "enrollments": [
    {
      "enrollmentId": 1,
      "studentAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "enrolledAt": 1698796800,
      "isActive": true
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Student address is required"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Credential not found"
  }
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "Transaction failed",
    "details": "Revert reason..."
  }
}
```

---

## Rate Limiting

- **Standard Users**: 100 requests/minute
- **Authenticated Users**: 1000 requests/minute
- **Admin Users**: 5000 requests/minute

---

**API Version**: 1.0.0  
**Last Updated**: November 2025

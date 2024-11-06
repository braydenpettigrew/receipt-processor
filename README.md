# Receipt Processor

## Overview

This is a simple web service that processes receipts and awards points based on various rules. It exposes two main API endpoints:
1. `/receipts/process` - Accepts a receipt and returns an ID.
2. `/receipts/{id}/points` - Retrieves the points for a specific receipt based on its ID.

## Requirements

- Docker
- Node.js (for local development, if Docker is not used)

## Setup Instructions

### 1. Clone the Repository

First, clone the repository:
```bash
git clone <repository-url>
cd receipt-processor
```

### 2. Running with Docker

To build and run the application using Docker, follow these steps:

1. **Build the Docker image**:
   ```bash
   docker build -t receipt-processor .
   ```

2. **Run the Docker container**:
   ```bash
   docker run -p 3000:3000 receipt-processor
   ```
   
### 3. Running Locally (Without Docker)

If you'd prefer to run the application locally without Docker:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the application**:
   ```bash
   npm start
   ```

The service will be available at `http://localhost:3000`.

## API Endpoints

Once the service is running, you can interact with it via the API.

### 1. `/receipts/process` (POST)

**Request**:
```json
{
  "retailer": "Target",
  "purchaseDate": "2022-01-01",
  "purchaseTime": "13:01",
  "items": [
    {
      "shortDescription": "Mountain Dew 12PK",
      "price": "6.49"
    },
    {
      "shortDescription": "Emils Cheese Pizza",
      "price": "12.25"
    },
    {
      "shortDescription": "Knorr Creamy Chicken",
      "price": "1.26"
    },
    {
      "shortDescription": "Doritos Nacho Cheese",
      "price": "3.35"
    },
    {
      "shortDescription": "Klarbrunn 12-PK 12 FL OZ",
      "price": "12.00"
    }
  ],
  "total": "35.35"
}
```

**Response**:
```json
{
  "id": "7fb1377b-b223-49d9-a31a-5a02701dd310"
}
```

This endpoint processes the receipt and returns an id that can be used to fetch the points for the receipt.

### 2. `/receipts/{id}/points` (GET)

**Request**:
```bash
GET http://localhost:3000/receipts/{id}/points
```

**Response**:
```json
{
  "points": 28
}
```

This endpoint returns the number of points for the given receipt ID.

## Points Calculation Rules

The following rules determine how many points are awarded to a receipt:

1. One point for every alphanumeric character in the retailer name.
2. 50 points if the total is a round dollar amount (no cents).
3. 25 points if the total is a multiple of 0.25.
4. 5 points for every two items on the receipt.
5. If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer. The result is the number of points earned for that item.
6. 6 points if the day in the purchase date is odd.
7. 10 points if the time of purchase is after 2:00 pm and before 4:00 pm.

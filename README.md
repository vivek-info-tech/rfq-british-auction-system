# rfq-british-auction-system
 

A full-stack web application that implements a **British Auction-style bidding system** for Request for Quotation (RFQ) management. Built as part of the GoComet assignment.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6, Axios |
| Backend | Java 17, Spring Boot 3, Spring Data JPA, Lombok |
| Database | MySQL 8 |
| ORM | Hibernate |
| Build tool | Maven |

---

## Project Structure

```
rfq-british-auction/
├── backend/                  # Spring Boot project
│   ├── src/main/java/com/rfq/
│   │   ├── controller/       # REST controllers
│   │   ├── service/          # Business logic
│   │   ├── entity/           # JPA entities
│   │   ├── repository/       # Spring Data repositories
│   │   └── dto/              # Data transfer objects
│   └── pom.xml
│
└── frontend/                 # React + Vite project
    ├── src/
    │   ├── pages/            # AuctionList, AuctionDetails, CreateRFQ, SupplierBid,Hpme
    │   ├── components/       # BidForm, Navbar,AuctionCard
    │   └── utils/            # api.js, helpers.js
    └── package.json
```

---

## Prerequisites

Make sure you have the following installed before running the project:

- **Java 17+** — [Download](https://adoptium.net/)
- **Maven 3.8+** — [Download](https://maven.apache.org/download.cgi)
- **Node.js 18+** and **npm** — [Download](https://nodejs.org/)
- **MySQL 8+** — [Download](https://dev.mysql.com/downloads/)

---

## Getting Started

### Step 1 — Clone the repository

```bash
git clone https://github.com/vivek-info-tech/rfq-british-auction-system.git
cd rfq-british-auction-system
```

---

### Step 2 — Set up the MySQL database

Open your MySQL client (MySQL Workbench or terminal) and run:

```sql
CREATE DATABASE rfq_db;
```

Then create a user or use your existing root credentials — you will set them in Step 3.

---

### Step 3 — Configure the backend

Open the file:

```
backend/src/main/resources/application.properties
```

Update it with your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/rfq_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

 

### Step 4 — Run the backend

```bash
cd backend_rfq_system
mvn spring-boot:run
```

The API will start at **http://localhost:8080**

 

---

### Step 5 — Seed some suppliers (first time only)

The leaderboard and bid form require at least one supplier in the database. Run this SQL once after the backend starts:

```sql
USE rfq_db;

INSERT INTO suppliers (name, email) VALUES ('Vivek Logistics', 'vivek@logistics.com');
INSERT INTO suppliers (name, email) VALUES ('Vivek Yadav Co', 'yadav@co.com');
INSERT INTO suppliers (name, email) VALUES ('Vivek Kumar Freight', 'vkumar@freight.com');
```

---

### Step 6 — Run the frontend

Open a **new terminal window** and run:

```bash
cd frontend_rfq_system
npm install
npm run dev
```

The React app will start at **http://localhost:5173**

---

## Using the Application

Once both servers are running, open **http://localhost:5173** in your browser.

### Create an RFQ
1. Go to **Create RFQ** from the navbar
2. Fill in: RFQ name, reference ID, start time, close time, forced close time
3. Set the **British Auction configuration**:
   - Trigger window (X minutes)
   - Extension duration (Y minutes)
   - Trigger type: `BID_RECEIVED` / `ANY_RANK_CHANGE` / `L1_RANK_CHANGE`
4. Submit — the RFQ appears in the **Active Sourcing Events** list

### Submit a Bid
1. Click any active RFQ from the list
2. Select your supplier from the dropdown
3. Enter: freight charges, origin charges, destination charges, transit days, quote validity date
4. Click **Submit Binding Quote**
5. The leaderboard updates in real-time (every 2 seconds)

### British Auction Extension
- If a bid is placed inside the trigger window, the close time automatically extends by Y minutes
- The extension is capped at the **Forced Close Time** — it will never go beyond that
- Every extension is recorded in the **Event Stream** panel with its reason

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/rfq/create` | Create a new RFQ |
| `GET` | `/api/rfq/all` | List all RFQs |
| `GET` | `/api/rfq/{id}` | Get one RFQ by ID |
| `GET` | `/api/rfq/{id}/logs` | Get auction event log |
| `POST` | `/api/bid/{rfqId}` | Submit a bid |
| `GET` | `/api/bid/ranking/{rfqId}` | Get grouped leaderboard (L1, L2, L3...) |
| `GET` | `/api/supplier/all` | List all suppliers |

---

## Features Implemented

- [x] RFQ creation with full British Auction configuration
- [x] Bid submission with freight, origin, destination charges + quote validity
- [x] Live leaderboard — one row per supplier, sorted by lowest price
- [x] Tie-breaking by earliest submission time
- [x] Automatic auction extension (trigger window + Y minutes)
- [x] Three trigger types: BID_RECEIVED, ANY_RANK_CHANGE, L1_RANK_CHANGE
- [x] Hard stop enforcement — never extends beyond forced close time
- [x] Real-time event stream (BID_SUBMITTED, AUCTION_EXTENDED logs)
- [x] Auction status: UPCOMING / ACTIVE / CLOSED / FORCE CLOSED
- [x] Winner display after auction closes

---
 
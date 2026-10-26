# Rajvilas Heritage Palace & Resort — Architecture & UML Design Specification

This document presents the **Reverse-Engineered Software Design & Architecture** derived directly from the codebase of **Rajvilas Heritage Palace & Resort** (Udaipur, Rajasthan • GSTIN: `08AAACL7891F1Z2`).

---

## 🏛️ 1. System Context & Actor Hierarchy

The system enforces strict **Role-Based Access Control (RBAC)** across three staff roles, one guest actor, and two external gateways:

```mermaid
flowchart TD
    subgraph PrimaryActors["Primary System Actors"]
        GM["Vikram Rathore: General Manager / Admin"]
        FOM["Sneha Kulkarni: Front Office / Receptionist"]
        EHK["Ramesh Yadav: Executive Housekeeper"]
        Guest["Palace Guest: In-House Resident"]
    end

    subgraph CoreSystem["Rajvilas HMS Core Engine"]
        Engine["Full-Stack HMS Terminal (React 19 + Express + MongoDB)"]
    end

    subgraph ExternalServices["External Infrastructure"]
        NPCI["NPCI / BHIM UPI Gateway (VPA: rajvilas.palace@icici)"]
        WA["WhatsApp Web / Mobile API"]
        MDB["MongoDB In-Memory / Atlas Cluster"]
    end

    GM -->|"Full Administrative Access & Night Audit"| Engine
    FOM -->|"Check-in, Billing, CRM & Concierge"| Engine
    EHK -->|"4-Point Inspection & Stock"| Engine
    Guest -->|"Digital Keycard & NFC Unlock"| Engine

    Engine -->|"Instant UPI Intent & Settlement"| NPCI
    Engine -->|"Stay Passes & Butler Dispatch"| WA
    Engine -->|"Native Scrypt & HMAC Session Sync"| MDB
```

---

## 🎯 2. UML Use Case Diagrams

### A. Front Office, Reservations & VIP Concierge
The Front Office module handles the full guest lifecycle, from arrival to stay enhancement:

```mermaid
flowchart LR
    ActorFOM["Front Office / Receptionist"]
    
    subgraph UseCasesFO["Front Office & Concierge Use Cases"]
        UC1["Create Reservation (Collision Detection)"]
        UC2["Apply Royal Promo Code (ROYAL10, PALACE2026)"]
        UC3["Verify Government ID (Aadhaar Masking)"]
        UC4["Check-In Guest (Room Occupied)"]
        UC5["Express Check-Out (Folio Balance Check)"]
        UC6["Cancel Stay & Release Room (Reason Logging)"]
        UC7["Book Royal Experience (Auto Folio Charge)"]
        UC8["Dispatch WhatsApp Stay Pass (Namaste Greeting)"]
        UC9["Manage VIP Club Directory (Dietary & Spend)"]
    end

    ActorFOM --> UC1
    ActorFOM --> UC2
    ActorFOM --> UC3
    ActorFOM --> UC4
    ActorFOM --> UC5
    ActorFOM --> UC6
    ActorFOM --> UC7
    ActorFOM --> UC8
    ActorFOM --> UC9
```

### B. Billing, 12% GST Tax Invoicing & Instant UPI Settlement
Covers financial transactions, extra charges, and statutory tax compliance:

```mermaid
flowchart LR
    ActorBill["Front Office / General Manager"]
    ActorNPCI["NPCI UPI Network"]

    subgraph UseCasesBilling["Billing & Tax Folio Use Cases"]
        UB1["Generate 12% GST Folio (6% CGST + 6% SGST)"]
        UB2["Post Dining & Incidentals (Extra Charges)"]
        UB3["Generate Dynamic BHIM UPI QR (upi://pay URI)"]
        UB4["Simulate Real-time Settlement (12-Digit UTR)"]
        UB5["Export GSTR-1 Tax CSV (Accountant Ledger)"]
        UB6["Print Official Palace Invoice (Dual Stamp)"]
    end

    ActorBill --> UB1
    ActorBill --> UB2
    ActorBill --> UB3
    ActorBill --> UB5
    ActorBill --> UB6

    UB3 -.->|"Intent Dispatch"| ActorNPCI
    ActorNPCI -.->|"UTR Webhook Confirmation"| UB4
    UB4 -->|"Auto Settle"| UB1
```

### C. Housekeeping, Turnover & Inventory Stock
The sanitization and inventory replenishment pipeline:

```mermaid
flowchart LR
    ActorHK["Executive Housekeeper"]

    subgraph UseCasesHK["Housekeeping Operations"]
        UH1["View Room Turnover Matrix (Color-Coded Status)"]
        UH2["Perform 4-Point Inspection (Linen, Bath, AC, Sanitized)"]
        UH3["Mark Room Available (Turnover Complete)"]
        UH4["Track Amenity Inventory (Tea, Bath Kits, Duvets)"]
        UH5["Trigger Low Stock Alerts (Jaipur Artisan Reorder)"]
    end

    ActorHK --> UH1
    ActorHK --> UH2
    ActorHK --> UH3
    ActorHK --> UH4
    ActorHK --> UH5
```

### D. Executive Oversight, Night Audit & Guest Pass
Strategic controls reserved for General Manager Vikram Rathore:

```mermaid
flowchart LR
    ActorGM["General Manager"]
    ActorGuest["Palace Guest"]

    subgraph UseCasesGM["Executive Control & Audit"]
        UG1["Monitor RevPAR & ADR Analytics"]
        UG2["Execute Midnight Night Audit (4-Step Automated Run)"]
        UG3["Generate GM Daily Operating Report"]
        UG4["Audit Security Event Stream (Scrypt & Rate Limiting)"]
        UG5["Reset System to Factory State"]
    end

    subgraph UseCasesGuest["Guest Self-Service"]
        UG6["View Digital Room Pass"]
        UG7["Simulate NFC Smart Lock Tap"]
        UG8["Access Royal Wi-Fi Credentials"]
    end

    ActorGM --> UG1
    ActorGM --> UG2
    ActorGM --> UG3
    ActorGM --> UG4
    ActorGM --> UG5

    ActorGuest --> UG6
    ActorGuest --> UG7
    ActorGuest --> UG8
```

---

## 📐 3. UML Class Diagrams

### A. React Client Domain Model (`HotelContext`)

```mermaid
classDiagram
    class HotelContext {
        +User currentUser
        +String currentRole
        +Boolean isDbConnected
        +Array rooms
        +Array reservations
        +Array bills
        +Array inventory
        +Array experiences
        +Array experienceBookings
        +Array logs
        +KPIs kpis
        +login(username, password)
        +logout()
        +addReservation(newResData)
        +updateReservationStatus(resId, status)
        +cancelReservation(resId, reason)
        +addExtraChargeToFolio(billId, desc, amount)
        +toggleBillStatus(billId)
        +completeInspectionAndClean(roomNum, notes)
        +bookExperience(resId, expId, date, slot, count, notes)
        +runNightAudit(notes)
        +openGuestPass(booking)
    }

    class Room {
        +Number id
        +Number number
        +String type
        +String category
        +Number price
        +String status
        +Number floor
        +String beds
        +String size
        +Array amenities
        +String lastCleaned
        +String supervisorNote
    }

    class Reservation {
        +Number id
        +String guest
        +String email
        +String phone
        +Number room
        +String checkin
        +String checkout
        +String status
        +Number guestsCount
        +Number totalAmount
        +String promoCode
        +Number discount
        +String idType
        +String idNumber
        +Boolean idVerified
        +String notes
        +String cancellationReason
    }

    class Bill {
        +Number id
        +Number resId
        +String guest
        +Number room
        +Number roomCharges
        +Number extraCharges
        +Number taxes
        +Number total
        +String status
        +String paymentMethod
        +String date
        +Array items
    }

    class BillItem {
        +Number id
        +String description
        +Number amount
        +String date
    }

    class RoyalExperience {
        +String id
        +String title
        +String category
        +Number price
        +String priceUnit
        +String timing
        +String duration
        +String badge
        +String description
        +Array included
    }

    class ExperienceBooking {
        +String id
        +String experienceId
        +String title
        +String guest
        +Number room
        +Number resId
        +String date
        +String timeSlot
        +Number guestsCount
        +Number amount
        +String status
        +String notes
    }

    class NightAuditSummary {
        +String auditId
        +String timestamp
        +String date
        +String auditor
        +Number totalRooms
        +Number occupiedRoomsCount
        +Number occupancyRate
        +Number totalGrossRevenue
        +Number settledRevenue
        +Number pendingReceivables
        +Number gstCollected
        +Number postedTariffTotal
        +String notes
        +String status
    }

    HotelContext "1" *-- "many" Room : manages
    HotelContext "1" *-- "many" Reservation : tracks
    HotelContext "1" *-- "many" Bill : reconciles
    HotelContext "1" *-- "many" RoyalExperience : offers
    HotelContext "1" *-- "many" ExperienceBooking : schedules
    HotelContext "1" o-- "0..1" NightAuditSummary : records
    Bill "1" *-- "many" BillItem : contains
    Reservation "1" --> "1" Room : allocates
    Bill "1" --> "1" Reservation : settles
```

---

### B. Backend REST API & MongoDB Mongoose Models

```mermaid
classDiagram
    class UserSchema {
        +Number id
        +String name
        +String role
        +String designation
        +String username
        +String password
        +String avatar
    }

    class RoomSchema {
        +Number id
        +Number number
        +String type
        +String category
        +Number price
        +String status
        +Number floor
        +String beds
        +String size
        +Array amenities
        +String lastCleaned
        +String supervisorNote
    }

    class ReservationSchema {
        +Number id
        +String guest
        +String email
        +String phone
        +Number room
        +String checkin
        +String checkout
        +String status
        +Number guestsCount
        +Number totalAmount
        +String idType
        +String idNumber
        +Boolean idVerified
        +String notes
        +String cancellationReason
    }

    class BillSchema {
        +Number id
        +Number resId
        +String guest
        +Number room
        +Number roomCharges
        +Number extraCharges
        +Number taxes
        +Number total
        +String status
        +String paymentMethod
        +String date
        +Array items
    }

    class InventorySchema {
        +Number id
        +String name
        +String category
        +Number quantity
        +Number min
        +String unit
        +Number costPerUnit
        +String icon
    }

    class LogSchema {
        +Number id
        +String author
        +String time
        +String category
        +String message
    }

    BillSchema "1" *-- "many" BillItemSchema : embeds
```

---

## 🏗️ 4. Layered System Architecture

```mermaid
flowchart TD
    subgraph PresentationLayer["Layer 1: Presentation & UI (React 19 + Tailwind CSS)"]
        NavBar["Navbar & Global Triggers"]
        SideNav["Role-Filtered Sidebar"]
        DashView["Executive Dashboard & RevPAR"]
        TimeView["Timeline & Date Conflict Engine"]
        ResView["Reservations & Check-In Desk"]
        BillView["GST Folio & BHIM UPI QR Modal"]
        ExpView["Palace Royal Experiences Desk"]
        AuditView["Automated Night Audit Modal"]
        PassView["Guest Digital Keycard Portal"]
    end

    subgraph StateLayer["Layer 2: State & Context Management"]
        Context["HotelContext.jsx (Optimistic State + Polling Fallback)"]
        ApiClient["api.js (Axios Client with Bearer Token Injection)"]
    end

    subgraph SecurityLayer["Layer 3: Native Zero-Install Security Suite"]
        SecHeaders["Security Headers (X-Frame, CSP, HSTS)"]
        RateLimiter["Login Rate Limiter (5 attempts / 15 min)"]
        AuthGuard["HMAC-SHA256 Token Auth Guard"]
        RoleGuard["RBAC Guard (Admin, Reception, Housekeeping)"]
    end

    subgraph ControllerLayer["Layer 4: Express REST API Controllers"]
        AuthRoutes["/api/auth (Scrypt constant-time login)"]
        RoomRoutes["/api/rooms (Status & 4-Point Inspection)"]
        ResRoutes["/api/reservations (Collision Prevention)"]
        BillRoutes["/api/bills (12% GST & Incidentals)"]
        InvRoutes["/api/inventory (Housekeeping Stock)"]
        AuditRoutes["/api/logs (Audit Trail)"]
    end

    subgraph PersistenceLayer["Layer 5: Data Persistence"]
        MongoDB["MongoDB (Mongoose ODM / Auto-Local Memory Cluster)"]
        LocalStorage["Client-Side LocalStorage Fallback"]
    end

    PresentationLayer --> StateLayer
    StateLayer --> SecurityLayer
    SecurityLayer --> ControllerLayer
    ControllerLayer --> PersistenceLayer
```

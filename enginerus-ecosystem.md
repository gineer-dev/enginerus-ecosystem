# Functional Requirements Document (FRD)

# EngineRus OS

### Motorcycle Commerce & Service Operations Platform

Version: 1.0
Status: Draft
Product Owner: Dr. Engine R'us
System Name: EngineRus OS

---

# 1. Executive Summary

EngineRus OS is a centralized motorcycle operations platform designed to manage all business processes of Dr. Engine R'us and integrate with Visayas Moto Hub.

The platform serves as the operational backbone for:

* Service Operations
* Motorcycle Registry
* Inventory Management
* Customer Relationship Management
* Marketplace Synchronization
* Motorcycle Health Records

EngineRus OS is an internal business platform and is not intended to be publicly marketed as a SaaS product.

---

# 2. Business Background

Dr. Engine R'us is a motorcycle performance and service center specializing in:

* Dyno Tuning
* ECU Remapping
* Diagnostics
* PMS
* Repairs
* Performance Upgrades

Visayas Moto Hub serves as the marketplace platform for:

* Motorcycle Buy & Sell
* Parts Marketplace
* Accessories Marketplace
* Service Booking

The business requires a centralized ecosystem capable of managing customer motorcycles throughout their entire ownership lifecycle.

---

# 3. Vision

To become the first motorcycle service ecosystem in the Philippines that provides complete digital ownership and performance records for every motorcycle serviced by Dr. Engine R'us.

---

# 4. Objectives

## Operational Objectives

* Eliminate manual service records
* Centralize customer information
* Improve service workflow efficiency
* Track inventory usage accurately
* Synchronize inventory with marketplace

## Customer Objectives

* Provide complete motorcycle history
* Improve customer retention
* Deliver personalized maintenance recommendations
* Improve service transparency

---

# 5. User Roles

## Administrator

Permissions:

* Full system access
* Manage branches
* Manage users
* Access reports
* Configure system settings

---

## Service Advisor

Responsibilities:

* Customer registration
* Service booking
* Job order creation
* Service updates

---

## Mechanic

Responsibilities:

* View assigned jobs
* Update service progress
* Record diagnostics
* Upload service findings

---

## Dyno Technician

Responsibilities:

* Dyno session management
* Record dyno results
* Upload tuning data
* Save ECU maps

---

## Inventory Personnel

Responsibilities:

* Manage inventory
* Receive stock
* Transfer stock
* Adjust inventory

---

## Management

Responsibilities:

* Dashboard monitoring
* Performance tracking
* Business analytics

---

# 6. System Modules

# Module 1: Service Operations

## Service Booking

Features:

* Walk-in booking
* Scheduled booking
* Online booking integration
* Service categorization

Service Types:

* PMS
* Diagnostics
* Dyno Tuning
* ECU Remapping
* Engine Repair
* Tire Services
* Electrical Services

---

## Job Orders

Fields:

* Job Order Number
* Customer
* Motorcycle
* Service Type
* Assigned Mechanic
* Priority Level
* Estimated Completion
* Status

Statuses:

* Pending
* Queued
* In Progress
* Waiting Parts
* For Approval
* Completed
* Released
* Cancelled

---

## Service Queue Management

Features:

* Real-time queue
* Bay assignment
* Service priority
* Technician workload balancing

---

## Mechanic Assignment

Features:

* Assign mechanics
* Reassign jobs
* Track productivity
* Completion monitoring

---

# Module 2: Dyno Management

## Dyno Sessions

Fields:

* Session Number
* Motorcycle
* Customer
* Technician
* Date
* Dyno Type

---

## Dyno Results

Capture:

* Horsepower
* Torque
* RPM Range
* AFR Data
* Peak Torque
* Peak Power

Attachments:

* Dyno Graph Images
* PDF Reports
* Session Videos

---

## ECU Remapping

Capture:

* ECU Version
* Map Version
* Map Type
* Tuning Notes
* Backup Files

---

# Module 3: Motorcycle Registry

## Motorcycle Master Record

Fields:

* Motorcycle ID
* Plate Number
* Engine Number
* Chassis Number
* Brand
* Model
* Variant
* Year Model
* Color
* Mileage

---

## Ownership Records

Track:

* Current Owner
* Previous Owners
* Purchase Date
* Ownership History

---

## Warranty Records

Track:

* Warranty Provider
* Coverage
* Expiration Date
* Claims History

---

# Module 4: Motorcycle Health Record

## Purpose

The Motorcycle Health Record serves as the digital medical record of the motorcycle.

Every motorcycle will have a complete lifecycle history.

---

## Health Record Components

### Service History

Store:

* PMS
* Repairs
* Diagnostics
* Inspections

---

### Dyno History

Store:

* Dyno Sessions
* Power Results
* Torque Results

---

### ECU History

Store:

* ECU Maps
* Tuning Revisions
* Rollback History

---

### Maintenance Schedule

Track:

* Oil Change
* CVT Cleaning
* Valve Adjustment
* Brake Service
* Coolant Replacement

---

### Parts Replacement History

Track:

* Part Installed
* Date Installed
* Technician
* Mileage

Examples:

* Racing CVT
* Exhaust System
* Ignition Coil
* Tires
* Brake Pads

---

### Performance Upgrade History

Store:

* Modification Type
* Installation Date
* Dyno Result After Upgrade

---

# Module 5: Customer Relationship Management (CRM)

## Customer Profiles

Fields:

* Customer Number
* Full Name
* Mobile Number
* Email Address
* Address

---

## Customer Garage

A customer may own multiple motorcycles.

Features:

* View all motorcycles
* Service history
* Dyno records
* Warranty records

---

## Service Reminders

Automatic reminders:

* PMS Due
* Oil Change Due
* Tire Replacement Due
* Registration Renewal

---

## Loyalty Program

Track:

* Service Visits
* Total Spend
* Reward Points
* VIP Status

---

# Module 6: Inventory Management

## Product Categories

* Performance Parts
* Engine Components
* Tires
* Lubricants
* Accessories
* Safety Gear

---

## Inventory Features

* Stock Receiving
* Stock Transfer
* Stock Adjustment
* Stock Count
* Supplier Management

---

## Inventory Tracking

Track:

* Quantity
* Cost
* Serial Numbers
* Batch Numbers

---

## Low Stock Monitoring

Automatic alerts:

* Reorder Point
* Critical Stock
* Out of Stock

---

# Module 7: Marketplace Synchronization

## Integration Target

Visayas Moto Hub

---

## Inventory Publishing

Allow publishing:

* Motorcycles
* Parts
* Accessories

---

## Listing Management

Fields:

* Title
* Description
* Price
* Photos
* Availability

---

## Service Booking Integration

Bookings made from Visayas Moto Hub automatically create:

* Customer Record
* Service Booking
* Service Queue Entry

---

# Module 8: Dashboard & Analytics

## Service Dashboard

Metrics:

* Jobs Today
* Completed Services
* Active Jobs
* Average Completion Time

---

## Inventory Dashboard

Metrics:

* Inventory Value
* Fast Moving Parts
* Slow Moving Parts
* Low Stock Items

---

## Customer Dashboard

Metrics:

* New Customers
* Returning Customers
* Loyalty Members

---

## Dyno Dashboard

Metrics:

* Dyno Sessions
* Peak Power Records
* ECU Remaps Completed

---

# Module 9: Notifications

Channels:

* Email
* SMS
* Push Notifications
* In-App Notifications

Events:

* Booking Confirmation
* Service Completion
* PMS Reminder
* Warranty Expiration
* Low Stock Alerts

---

# Module 10: Audit Trail

Track:

* User
* Action
* Module
* Record
* Timestamp
* Previous Value
* New Value

---

# 7. Non-Functional Requirements

## Security

* Role-Based Access Control
* MFA Support
* Audit Logging
* Data Encryption

---

## Performance

* Page Load < 2 Seconds
* Search Response < 1 Second
* Concurrent Users > 500

---

## Availability

* 99.9% Uptime

---

## Scalability

Support:

* Multiple Branches
* Multiple Warehouses
* Multiple Service Centers

---

# 8. Future Enhancements

Phase 2

* Mobile App
* Mechanic Mobile Portal
* QR Service Cards
* Motorcycle Health Score
* AI Maintenance Recommendations
* AI Diagnostic Assistance

Phase 3

* Financing Integration
* Insurance Integration
* Trade-In Valuation Engine
* Predictive Maintenance Analytics

---

# 9. Success Criteria

* 100% digital service records
* Complete motorcycle ownership lifecycle tracking
* Inventory synchronized with marketplace
* Reduced service processing time
* Increased customer retention through Motorcycle Health Records

EngineRus OS shall serve as the centralized operational platform powering Dr. Engine R'us and Visayas Moto Hub while maintaining a complete digital history for every motorcycle within the ecosystem.

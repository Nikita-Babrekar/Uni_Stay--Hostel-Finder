# UniStay 🏠

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-rounded)](https://opensource.org/licenses/MIT)
[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-Full%20Stack-blue?style=flat-rounded)](#tech-stack)

> An intuitive, data-driven hostel and PG finder platform designed to simplify student housing hunting through advanced filtering and dynamic location matching.

---

## 📌 Project Overview

### The Problem Statement
Finding affordable, safe, and convenient student accommodation near college campuses is a chaotic, fragmented process. Students often have to rely on word-of-mouth, deal with unreliable local brokers, or physically wander around areas to check vacancy statuses.

### The Real Problem
While basic listing platforms exist, they suffer from critical gaps:
* **Lack of Niche Student Filters:** Most general real estate platforms do not filter properties based on student-specific necessities like food quality, bed-sharing configurations (Single/Double/Mixed), or specific gender restrictions (Boys/Girls/Co-ed).
* **Location Mismatch:** Properties are often advertised as "near the college" but are actually miles away, creating unnecessary commuting hurdles.
* **Unverified Information:** Lack of direct access to trusted property documents or verified owner communication channels creates trust issues for out-of-town students.

### Our Solution
**UniStay** bridges this gap by introducing a student-centric dashboard mapped directly alongside real-time location visualizations. The system partitions workflows into two clean portals:
1. **Students** can strictly filter living arrangements down to room specs, precise budget thresholds, and amenity checklists while pinpointing options immediately via an interactive map layout.
2. **Property Owners** get a dedicated portal to publish listings dynamically, attach necessary documents, manage verification flags, and instantly update property configurations in a persistent data layout.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | Clean, responsive modern CSS UI with smooth animations |
| **Mapping Engine** | Leaflet.js / OpenStreetMap | Interactive, dynamic map integration and coordinate pinning |
| **Backend** | Python Flask | Lightweight API architecture routing server workflows |
| **Database** | CSV | Structured, flat-file persistent storage configuration |
| **Design Language** | Inter Font, Glassmorphism elements | Premium, accessible aesthetic optimized for high scannability |

---

## ✨ Core Features

### 👨‍🎓 Student Dashboard Portal
* **Advanced Multi-Tier Filters:** Drill down listings seamlessly by Hostel Type (Boys, Girls, Co-ed), Monthly Budget Range slider, AC/Non-AC specs, and Sharing Layouts.
* **Granular Amenity Selection:** Checkboxes to quickly isolate listings that include WiFi, Laundry, Power Backup, Gym, or Library privileges.
* **Interactive Geo-Map Tracker:** Instantly view matching properties pinned to geographical coordinates. Features smooth map flying animations to instantly center on selected properties.
* **Dedicated Deep-Dive View:** A dedicated `hostel-detail.html` context page that dynamically captures URL parameter parameters to map galleries, owner contact pipelines, and verified standard amenities.

### 👨‍💼 Owner Dashboard Portal
* **Live Listing Publication Engine:** Structured forms allowing property owners to input detailed pricing metrics, full street addresses, and standard capacities.
* **Native File Attachment Uploads:** Integrated visual file counters that handle local document proofs and property images directly.
* **Instant Listing Synchronization:** Direct POST pipeline communication that seamlessly appends new rows into the backend database.

---

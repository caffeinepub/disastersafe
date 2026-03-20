# DisasterSafe – Disaster Management App

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- SOS emergency button with simulated location alert
- Disaster alerts feed (flood, earthquake, fire, storm, tsunami)
- Nearby emergency services finder (hospitals, police stations, safe shelters)
- Safety guidelines for different disaster types
- Emergency contacts list (add, call, delete contacts)
- Bottom navigation for mobile-style UX
- Backend storage for emergency contacts and alerts

### Modify
N/A (new project)

### Remove
N/A (new project)

## Implementation Plan
1. Backend: store emergency contacts (CRUD), store disaster alerts, store safety guidelines
2. Frontend: 5 screens via bottom nav — Home (SOS + alerts), Alerts, Nearby Services, Guidelines, Contacts
3. Home screen has large prominent SOS button, active alert banners
4. Alerts screen lists current disaster warnings with type/severity/location
5. Nearby screen shows categorized list of hospitals/police/shelters with mock data
6. Guidelines screen shows collapsible cards per disaster type
7. Contacts screen shows contact list with tap-to-call and add/delete

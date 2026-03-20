import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SafetyGuideline {
    tips: Array<string>;
    disasterType: AlertType;
}
export type Time = bigint;
export interface DisasterAlert {
    id: ID;
    alertType: AlertType;
    message: string;
    timestamp: Time;
    severity: Severity;
    location: string;
}
export interface EmergencyContact {
    id: ID;
    relationship: string;
    name: string;
    phoneNumber: string;
}
export interface SOSEvent {
    id: ID;
    timestamp: Time;
    location?: string;
}
export type ID = bigint;
export enum AlertType {
    flood = "flood",
    earthquake = "earthquake",
    fire = "fire",
    tsunami = "tsunami",
    storm = "storm"
}
export enum Severity {
    low = "low",
    high = "high",
    critical = "critical",
    medium = "medium"
}
export interface backendInterface {
    addDisasterAlert(alertType: AlertType, severity: Severity, location: string, message: string): Promise<ID>;
    addEmergencyContact(name: string, phoneNumber: string, relationship: string): Promise<ID>;
    deleteDisasterAlert(id: ID): Promise<void>;
    deleteEmergencyContact(id: ID): Promise<void>;
    getAllDisasterAlerts(): Promise<Array<DisasterAlert>>;
    getAllEmergencyContacts(): Promise<Array<EmergencyContact>>;
    getAllSafetyGuidelines(): Promise<Array<SafetyGuideline>>;
    getRecentSOSEvents(limit: bigint): Promise<Array<SOSEvent>>;
    getSafetyGuidelinesByType(disasterType: AlertType): Promise<SafetyGuideline>;
    logSOSEvent(location: string | null): Promise<ID>;
}

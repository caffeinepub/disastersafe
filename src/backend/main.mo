import Time "mo:core/Time";
import Array "mo:core/Array";
import List "mo:core/List";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

actor {
  type ID = Nat;
  var nextId = 0;

  func getNextId() : ID {
    let id = nextId;
    nextId += 1;
    id;
  };

  /// Emergency Contacts

  type EmergencyContact = {
    id : ID;
    name : Text;
    phoneNumber : Text;
    relationship : Text;
  };

  module EmergencyContact {
    public func compare(contact1 : EmergencyContact, contact2 : EmergencyContact) : Order.Order {
      Nat.compare(contact1.id, contact2.id);
    };
  };

  let emergencyContacts = Map.empty<ID, EmergencyContact>();

  public shared ({ caller }) func addEmergencyContact(name : Text, phoneNumber : Text, relationship : Text) : async ID {
    let contactId = getNextId();
    let contact : EmergencyContact = {
      id = contactId;
      name;
      phoneNumber;
      relationship;
    };
    emergencyContacts.add(contactId, contact);
    contactId;
  };

  public shared ({ caller }) func deleteEmergencyContact(id : ID) : async () {
    if (not emergencyContacts.containsKey(id)) { Runtime.trap("Contact does not exist") };
    emergencyContacts.remove(id);
  };

  public query ({ caller }) func getAllEmergencyContacts() : async [EmergencyContact] {
    emergencyContacts.values().toArray().sort();
  };

  /// Disaster Alerts

  type AlertType = {
    #flood;
    #earthquake;
    #fire;
    #storm;
    #tsunami;
  };

  type Severity = {
    #low;
    #medium;
    #high;
    #critical;
  };

  type DisasterAlert = {
    id : ID;
    alertType : AlertType;
    severity : Severity;
    location : Text;
    message : Text;
    timestamp : Time.Time;
  };

  module DisasterAlert {
    public func compare(alert1 : DisasterAlert, alert2 : DisasterAlert) : Order.Order {
      Nat.compare(alert1.id, alert2.id);
    };
  };

  let disasterAlerts = Map.empty<ID, DisasterAlert>();

  public shared ({ caller }) func addDisasterAlert(alertType : AlertType, severity : Severity, location : Text, message : Text) : async ID {
    let alertId = getNextId();
    let alert : DisasterAlert = {
      id = alertId;
      alertType;
      severity;
      location;
      message;
      timestamp = Time.now();
    };
    disasterAlerts.add(alertId, alert);
    alertId;
  };

  public shared ({ caller }) func deleteDisasterAlert(id : ID) : async () {
    if (not disasterAlerts.containsKey(id)) { Runtime.trap("Alert does not exist") };
    disasterAlerts.remove(id);
  };

  public query ({ caller }) func getAllDisasterAlerts() : async [DisasterAlert] {
    disasterAlerts.values().toArray().sort();
  };

  /// SOS Events

  type SOSEvent = {
    id : ID;
    timestamp : Time.Time;
    location : ?Text;
  };

  module SOSEvent {
    public func compare(event1 : SOSEvent, event2 : SOSEvent) : Order.Order {
      Nat.compare(event1.id, event2.id);
    };
  };

  let sosEvents = List.empty<SOSEvent>();

  public shared ({ caller }) func logSOSEvent(location : ?Text) : async ID {
    let eventId = getNextId();
    let event : SOSEvent = {
      id = eventId;
      timestamp = Time.now();
      location;
    };
    sosEvents.add(event);
    eventId;
  };

  public query ({ caller }) func getRecentSOSEvents(limit : Nat) : async [SOSEvent] {
    sosEvents.toArray().sliceToArray(0, limit).sort();
  };

  /// Safety Guidelines

  type SafetyGuideline = {
    disasterType : AlertType;
    tips : [Text];
  };

  let safetyGuidelines : [SafetyGuideline] = [
    {
      disasterType = #flood;
      tips = [
        "Move to higher ground immediately.",
        "Avoid walking or driving through floodwaters.",
        "Stay informed through weather alerts.",
        "Disconnect electrical appliances if safe to do so.",
      ];
    },
    {
      disasterType = #earthquake;
      tips = [
        "Drop, cover, and hold on during shaking.",
        "Stay away from windows and heavy furniture.",
        "Have an emergency kit ready.",
        "Secure heavy objects to prevent tipping.",
      ];
    },
    {
      disasterType = #fire;
      tips = [
        "Have a fire escape plan.",
        "Install smoke detectors.",
        "Keep fire extinguishers accessible.",
        "Never leave cooking unattended.",
      ];
    },
    {
      disasterType = #storm;
      tips = [
        "Secure outdoor objects.",
        "Stay away from windows during strong winds.",
        "Keep emergency supplies available.",
        "Avoid using electrical appliances during storms.",
      ];
    },
    {
      disasterType = #tsunami;
      tips = [
        "Move inland or to higher ground immediately.",
        "Follow official evacuation routes.",
        "Stay informed about tsunami warnings.",
        "Do not return until authorities declare it safe.",
      ];
    },
  ];

  public query ({ caller }) func getAllSafetyGuidelines() : async [SafetyGuideline] {
    safetyGuidelines;
  };

  public query ({ caller }) func getSafetyGuidelinesByType(disasterType : AlertType) : async SafetyGuideline {
    switch (safetyGuidelines.find<(SafetyGuideline)>(func(g) { g.disasterType == disasterType })) {
      case (null) { Runtime.trap("Guidelines not found") };
      case (?guideline) { guideline };
    };
  };
};

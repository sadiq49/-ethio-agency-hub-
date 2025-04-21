"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Search, 
  Filter, 
  Plane, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Send, 
  RefreshCw, 
  PlusCircle, 
  Luggage, 
  MapPin, 
  Timer, 
  Users, 
  Ticket, 
  CalendarClock, 
  Bell, 
  FileText, 
  Briefcase, 
  FileCheck, 
  FileX, 
  UserCheck, 
  Import as Passport, 
  FileSpreadsheet, 
  GraduationCap,
  Building,
  Phone,
  CheckSquare,
  CalendarDays,
  CheckCheck,
  ListTodo,
  ListFilter,
  ArrowRight,
  X,
  Info,
  Download,
  ExternalLink,
  Printer,
  ChevronRight,
  User,
  Clipboard,
  ClipboardCheck,
  AlarmClock,
  CircleAlert,
  Terminal,
  CheckCircle,
  XCircle,
  HelpCircle
} from "lucide-react";

// BadgeDiv component for status badges with icon and text
const BadgeDiv = ({ 
  className, 
  children 
}: { 
  className: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </div>
  );
};

interface Departure {
  id: string;
  workerName: string;
  workerID: string;
  destination: string;
  status: "Ready" | "Pending" | "Delayed" | "Departed";
  flightDetails: {
    airline: string;
    flightNumber: string;
    departureDate: string;
    departureTime: string;
    terminal: string;
    boardingTime?: string;
    gate?: string;
    estimatedArrival?: string;
  };
  checklist: {
    documents: {
      passport: boolean;
      visa: boolean;
      contract: boolean;
      insurance: boolean;
      medicalCertificate: boolean;
    };
    training: {
      orientation: boolean;
      languageBasics: boolean;
      safetyBriefing: boolean;
    };
    logistics: {
      ticketConfirmed: boolean;
      baggageChecked: boolean;
      airportTransport: boolean;
    };
    airportPreparation?: {
      taxiArranged: boolean;
      taxiConfirmed: boolean;
      pickupTime?: string;
      driverContact?: string;
      arrivalTime?: string;
      terminal?: string;
      checkInComplete?: boolean;
      securityScreening?: boolean;
      immigrationClearance?: boolean;
      boardingGateLocated?: boolean;
    };
  };
  receivingParty: {
    name: string;
    contact: string;
    notified: boolean;
    address?: string;
    confirmationDate?: string;
  };
  milestones?: {
    documentVerification: string;
    trainingCompletion: string;
    finalBriefing: string;
    airportArrival: string;
  };
  notifications?: {
    documentReminder: boolean;
    trainingReminder: boolean;
    departureReminder: boolean;
    receivingPartyNotified: boolean;
  };
  remarks?: string;
}

const departures: Departure[] = [
  {
    id: "DEP-2024-001",
    workerName: "Amina Hassan",
    workerID: "W1001",
    destination: "Riyadh",
    status: "Ready",
    flightDetails: {
      airline: "Ethiopian Airlines",
      flightNumber: "ET445",
      departureDate: "2024-03-20",
      departureTime: "23:45",
      terminal: "T2",
      boardingTime: "23:15",
      gate: "A12",
      estimatedArrival: "2024-03-21 03:30"
    },
    checklist: {
      documents: {
        passport: true,
        visa: true,
        contract: true,
        insurance: true,
        medicalCertificate: true
      },
      training: {
        orientation: true,
        languageBasics: true,
        safetyBriefing: true
      },
      logistics: {
        ticketConfirmed: true,
        baggageChecked: true,
        airportTransport: true
      },
      airportPreparation: {
        taxiArranged: true,
        taxiConfirmed: true,
        pickupTime: "20:45",
        driverContact: "+251 912 345 678",
        arrivalTime: "21:30",
        terminal: "T2",
        checkInComplete: true,
        securityScreening: true,
        immigrationClearance: true,
        boardingGateLocated: true
      }
    },
    receivingParty: {
      name: "Al Safwa Agency",
      contact: "+966-50-1234567",
      notified: true,
      address: "King Fahd Road, Riyadh, Saudi Arabia",
      confirmationDate: "2024-03-15"
    },
    milestones: {
      documentVerification: "2024-03-01",
      trainingCompletion: "2024-03-10",
      finalBriefing: "2024-03-18",
      airportArrival: "2024-03-20 20:45"
    },
    notifications: {
      documentReminder: true,
      trainingReminder: true,
      departureReminder: true,
      receivingPartyNotified: true
    }
  },
  {
    id: "DEP-2024-002",
    workerName: "Fatima Omar",
    workerID: "W1002",
    destination: "Dubai",
    status: "Pending",
    flightDetails: {
      airline: "Emirates",
      flightNumber: "EK722",
      departureDate: "2024-03-22",
      departureTime: "02:15",
      terminal: "T3",
      boardingTime: "01:45",
      gate: "B8",
      estimatedArrival: "2024-03-22 07:45"
    },
    checklist: {
      documents: {
        passport: true,
        visa: true,
        contract: false,
        insurance: true,
        medicalCertificate: true
      },
      training: {
        orientation: true,
        languageBasics: false,
        safetyBriefing: true
      },
      logistics: {
        ticketConfirmed: true,
        baggageChecked: false,
        airportTransport: false
      }
    },
    receivingParty: {
      name: "Dubai Employment Services",
      contact: "+971-50-9876543",
      notified: false,
      address: "Sheikh Zayed Road, Dubai, UAE"
    },
    milestones: {
      documentVerification: "2024-03-05",
      trainingCompletion: "Pending",
      finalBriefing: "Scheduled for 2024-03-21",
      airportArrival: "Scheduled for 2024-03-21 23:15"
    },
    notifications: {
      documentReminder: true,
      trainingReminder: true,
      departureReminder: false,
      receivingPartyNotified: false
    },
    remarks: "Pending contract signing and language training completion"
  },
  {
    id: "DEP-2024-003",
    workerName: "Sara Ahmed",
    workerID: "W1003",
    destination: "Kuwait",
    status: "Delayed",
    flightDetails: {
      airline: "Kuwait Airways",
      flightNumber: "KU514",
      departureDate: "2024-03-25",
      departureTime: "20:30",
      terminal: "T1",
      boardingTime: "20:00",
      gate: "C5",
      estimatedArrival: "2024-03-26 00:15"
    },
    checklist: {
      documents: {
        passport: true,
        visa: true,
        contract: true,
        insurance: false,
        medicalCertificate: true
      },
      training: {
        orientation: true,
        languageBasics: true,
        safetyBriefing: false
      },
      logistics: {
        ticketConfirmed: true,
        baggageChecked: false,
        airportTransport: true
      }
    },
    receivingParty: {
      name: "Kuwait Manpower Solutions",
      contact: "+965-555-7890",
      notified: true,
      address: "Salmiya District, Kuwait City, Kuwait",
      confirmationDate: "2024-03-18"
    },
    milestones: {
      documentVerification: "2024-03-08",
      trainingCompletion: "2024-03-15",
      finalBriefing: "Rescheduled to 2024-03-24",
      airportArrival: "Scheduled for 2024-03-25 17:30"
    },
    notifications: {
      documentReminder: true,
      trainingReminder: true,
      departureReminder: true,
      receivingPartyNotified: true
    },
    remarks: "Insurance renewal pending, safety briefing rescheduled"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Ready":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Delayed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "Departed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

function getStatusIcon(status: string) {
  switch (status) {
    case "Ready":
      return (
        <BadgeDiv className="bg-green-50 text-green-600">
          <CheckCircle className="h-4 w-4 mr-1" />
          Ready
        </BadgeDiv>
      );
    case "Pending":
      return (
        <BadgeDiv className="bg-yellow-50 text-yellow-600">
          <Clock className="h-4 w-4 mr-1" />
          Pending
        </BadgeDiv>
      );
    case "Delayed":
      return (
        <BadgeDiv className="bg-red-50 text-red-600">
          <XCircle className="h-4 w-4 mr-1" />
          Delayed
        </BadgeDiv>
      );
    case "Departed":
      return (
        <BadgeDiv className="bg-blue-50 text-blue-600">
          <Plane className="h-4 w-4 mr-1" />
          Departed
        </BadgeDiv>
      );
    default:
      return (
        <BadgeDiv className="bg-gray-50 text-gray-600">
          <HelpCircle className="h-4 w-4 mr-1" />
          Unknown
        </BadgeDiv>
      );
  }
}

function TodayFlying({ 
  departures, 
  onSelectDeparture,
  onOpenAirportPrep 
}: { 
  departures: Departure[],
  onSelectDeparture: (departure: Departure) => void,
  onOpenAirportPrep: (departure: Departure) => void
}) {
  // Filter for today's departures
  const today = new Date().toISOString().split('T')[0];
  const todayDepartures = departures.filter(
    (departure) => departure.flightDetails.departureDate === today
  );
  
  if (todayDepartures.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plane className="mr-2 h-5 w-5 text-blue-500" />
            Today Flying
          </CardTitle>
          <CardDescription>No scheduled departures for today</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plane className="mr-2 h-5 w-5 text-blue-500" />
          Today Flying
        </CardTitle>
        <CardDescription>{todayDepartures.length} workers scheduled to fly today</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {todayDepartures.map((departure) => (
          <div key={departure.id} className="border rounded-lg p-4 space-y-3 hover:border-blue-200 hover:bg-blue-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium">{departure.workerName}</h3>
                  <p className="text-xs text-muted-foreground">{departure.workerID}</p>
                </div>
              </div>
              <BadgeDiv className={getStatusColor(departure.status)}>
                {getStatusIcon(departure.status)}
                <BadgeDiv className={getStatusColor(departure.status)}>
                  {departure.status}
                </BadgeDiv>
              </BadgeDiv>
            </div>
            
            <div className="border-t pt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Flight</div>
                <div className="font-medium flex items-center">
                  <Plane className="mr-2 h-4 w-4 text-blue-500" />
                  {departure.flightDetails.airline} {departure.flightDetails.flightNumber}
                </div>
                <div className="text-xs">
                  <span className="font-medium">{departure.destination}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Departure</div>
                <div className="font-medium flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-blue-500" />
                  {departure.flightDetails.departureTime}
                </div>
                <div className="text-xs flex items-center">
                  <Terminal className="mr-1 h-3 w-3" />
                  Terminal {departure.flightDetails.terminal}, Gate {departure.flightDetails.gate || "TBA"}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Contact</div>
                <div className="font-medium flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-blue-500" />
                  {departure.receivingParty.contact}
                </div>
                <div className="text-xs">
                  {departure.receivingParty.name}
                </div>
              </div>
            </div>
            
            <div className="border-t pt-3">
              <h4 className="text-sm font-medium mb-2">Checklist Status</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-2 rounded-md">
                  <h5 className="text-xs flex items-center mb-1">
                    <FileCheck className="mr-1 h-3 w-3 text-blue-500" />
                    Documents
                  </h5>
                  <Progress 
                    value={Object.values(departure.checklist.documents).filter(Boolean).length * 20} 
                    className="h-1.5 mb-1" 
                  />
                </div>
                
                <div className="bg-gray-50 p-2 rounded-md">
                  <h5 className="text-xs flex items-center mb-1">
                    <ClipboardCheck className="mr-1 h-3 w-3 text-blue-500" />
                    Logistics
                  </h5>
                  <Progress 
                    value={Object.values(departure.checklist.logistics).filter(Boolean).length * (100/3)} 
                    className="h-1.5 mb-1" 
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center">
                <AlarmClock className="h-4 w-4 text-amber-500 mr-1" />
                <span className="text-xs">
                  Boarding at <span className="font-medium">{departure.flightDetails.boardingTime}</span>
                </span>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onOpenAirportPrep(departure)}
                >
                  <MapPin className="mr-1 h-4 w-4" />
                  Airport Prep
                </Button>
                <Button size="sm" onClick={() => onSelectDeparture(departure)}>
                  Manage
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <div className="w-full flex justify-between items-center">
          <Button variant="outline" size="sm" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Send Reminders
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Printer className="mr-2 h-4 w-4" />
            Print Manifests
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// Add new component for detailed checklist after the TodayFlying component
function AirportPreparationChecklist({
  departure,
  open,
  onOpenChange,
  onUpdate
}: {
  departure: Departure;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updated: Departure) => void;
}) {
  // Create a copy of the departure to work with
  const [updatedDeparture, setUpdatedDeparture] = useState<Departure>({
    ...departure,
    checklist: {
      ...departure.checklist,
      airportPreparation: departure.checklist.airportPreparation || {
        taxiArranged: false,
        taxiConfirmed: false,
        pickupTime: "",
        driverContact: "",
        arrivalTime: "",
        terminal: departure.flightDetails.terminal,
        checkInComplete: false,
        securityScreening: false,
        immigrationClearance: false,
        boardingGateLocated: false
      }
    }
  });

  const handleCheckboxChange = (category: string, item: string, value: boolean) => {
    setUpdatedDeparture(prev => {
      if (category === "airportPreparation") {
        return {
          ...prev,
          checklist: {
            ...prev.checklist,
            airportPreparation: {
              ...prev.checklist.airportPreparation!,
              [item]: value
            }
          }
        };
      }
      return prev;
    });
  };

  const handleInputChange = (category: string, item: string, value: string) => {
    setUpdatedDeparture(prev => {
      if (category === "airportPreparation") {
        return {
          ...prev,
          checklist: {
            ...prev.checklist,
            airportPreparation: {
              ...prev.checklist.airportPreparation!,
              [item]: value
            }
          }
        };
      }
      return prev;
    });
  };

  const handleSave = () => {
    onUpdate(updatedDeparture);
    onOpenChange(false);
  };

  const airportPrep = updatedDeparture.checklist.airportPreparation!;
  const departureTime = new Date(`2000-01-01T${departure.flightDetails.departureTime}`);
  // Calculate suggested pickup time (3 hours before departure)
  const suggestedPickupTime = new Date(departureTime);
  suggestedPickupTime.setHours(departureTime.getHours() - 3);
  const suggestedPickupTimeString = suggestedPickupTime.toTimeString().substring(0, 5);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plane className="mr-2 h-5 w-5 text-blue-500" />
            Airport Preparation Checklist
          </DialogTitle>
          <DialogDescription>
            Complete the checklist for {departure.workerName}'s journey to {departure.destination}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Worker info section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <User className="mr-2 h-4 w-4 text-blue-500" />
              Worker Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Name</Label>
                <div className="font-medium">{departure.workerName}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Worker ID</Label>
                <div className="font-medium">{departure.workerID}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Destination</Label>
                <div className="font-medium">{departure.destination}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <div>
                  <BadgeDiv className={getStatusColor(departure.status)}>
                    {departure.status}
                  </BadgeDiv>
                </div>
              </div>
            </div>
          </div>

          {/* Flight Details */}
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <Plane className="mr-2 h-4 w-4 text-blue-500" />
              Flight Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Airline</Label>
                <div className="font-medium">{departure.flightDetails.airline}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Flight Number</Label>
                <div className="font-medium">{departure.flightDetails.flightNumber}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Departure Date</Label>
                <div className="font-medium">{departure.flightDetails.departureDate}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Departure Time</Label>
                <div className="font-medium">{departure.flightDetails.departureTime}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Terminal</Label>
                <div className="font-medium">{departure.flightDetails.terminal}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Boarding Time</Label>
                <div className="font-medium">{departure.flightDetails.boardingTime || "Not specified"}</div>
              </div>
            </div>
          </div>

          {/* Taxi Arrangements */}
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-blue-500" />
              Taxi Arrangements to Bole International Airport
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="taxiArranged"
                  checked={airportPrep.taxiArranged}
                  onChange={e => handleCheckboxChange("airportPreparation", "taxiArranged", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="taxiArranged">Taxi arranged with trusted provider</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="taxiConfirmed"
                  checked={airportPrep.taxiConfirmed}
                  onChange={e => handleCheckboxChange("airportPreparation", "taxiConfirmed", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="taxiConfirmed">Driver confirmed pickup</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickupTime" className="text-sm">Pickup Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pickupTime"
                      type="time" 
                      placeholder={suggestedPickupTimeString}
                      value={airportPrep.pickupTime || ""}
                      onChange={e => handleInputChange("airportPreparation", "pickupTime", e.target.value)}
                      className="pl-8"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 3 hours before departure ({suggestedPickupTimeString})
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="driverContact" className="text-sm">Driver Contact</Label>
                  <div className="relative">
                    <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="driverContact"
                      placeholder="+251 9XX XXX XXX"
                      value={airportPrep.driverContact || ""}
                      onChange={e => handleInputChange("airportPreparation", "driverContact", e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Airport Checklist */}
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <Terminal className="mr-2 h-4 w-4 text-blue-500" />
              Bole International Airport Preparation
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="checkInComplete"
                  checked={airportPrep.checkInComplete}
                  onChange={e => handleCheckboxChange("airportPreparation", "checkInComplete", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="checkInComplete">Check-in completed</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="securityScreening"
                  checked={airportPrep.securityScreening}
                  onChange={e => handleCheckboxChange("airportPreparation", "securityScreening", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="securityScreening">Security screening passed</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="immigrationClearance"
                  checked={airportPrep.immigrationClearance}
                  onChange={e => handleCheckboxChange("airportPreparation", "immigrationClearance", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="immigrationClearance">Immigration clearance completed</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="boardingGateLocated"
                  checked={airportPrep.boardingGateLocated}
                  onChange={e => handleCheckboxChange("airportPreparation", "boardingGateLocated", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="boardingGateLocated">Boarding gate located</Label>
              </div>
              
              <div className="pt-2">
                <Label htmlFor="arrivalTime" className="text-sm">Airport Arrival Time</Label>
                <div className="relative">
                  <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="arrivalTime"
                    type="time"
                    value={airportPrep.arrivalTime || ""}
                    onChange={e => handleInputChange("airportPreparation", "arrivalTime", e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tips for Workers */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <Info className="mr-2 h-4 w-4 text-blue-500" />
              Tips for Workers at Bole International Airport
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <CheckSquare className="h-4 w-4 text-green-500 mt-0.5" />
                <p>Arrive at least 3 hours before international flights</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckSquare className="h-4 w-4 text-green-500 mt-0.5" />
                <p>Keep passport, visa, and ticket easily accessible</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckSquare className="h-4 w-4 text-green-500 mt-0.5" />
                <p>Ensure luggage complies with airline weight restrictions</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckSquare className="h-4 w-4 text-green-500 mt-0.5" />
                <p>Have employer contact details saved on phone and written down</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckSquare className="h-4 w-4 text-green-500 mt-0.5" />
                <p>Keep some cash in local currency for emergencies</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Checklist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function DeparturePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDeparture, setSelectedDeparture] = useState<Departure | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [showNewDepartureDialog, setShowNewDepartureDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [airportPrepOpen, setAirportPrepOpen] = useState(false);

  // Fake current date for demo purposes
  const currentDate = "2024-03-20";
  
  const filteredDepartures = departures.filter((departure) => {
    const matchesSearch =
      departure.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      departure.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      departure.workerID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      departure.flightDetails.flightNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || departure.status === statusFilter;
    
    const matchesTab = 
      (activeTab === "all") || 
      (activeTab === "today" && departure.flightDetails.departureDate === currentDate) ||
      (activeTab === "upcoming" && departure.flightDetails.departureDate > currentDate) ||
      (activeTab === "completed" && departure.status === "Departed");
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  // Calculate completion stats
  const todayDepartures = departures.filter(d => d.flightDetails.departureDate === currentDate);
  const upcomingDepartures = departures.filter(d => new Date(d.flightDetails.departureDate) > new Date(currentDate));
  const readyDepartures = todayDepartures.filter(d => d.status === "Ready");
  
  // Get total checklist completion percentage for a departure
  const getOverallCompletionPercentage = (departure: Departure) => {
    const totalItems = 
      Object.keys(departure.checklist.documents).length + 
      Object.keys(departure.checklist.training).length + 
      Object.keys(departure.checklist.logistics).length;
    
    const completedItems = 
      Object.values(departure.checklist.documents).filter(Boolean).length +
      Object.values(departure.checklist.training).filter(Boolean).length +
      Object.values(departure.checklist.logistics).filter(Boolean).length;
    
    return Math.round((completedItems / totalItems) * 100);
  };

  // Add a function to handle updating departures
  const handleUpdateDeparture = (updatedDeparture: Departure) => {
    // In a real app, this would call an API to update the departure
    console.log("Updating departure:", updatedDeparture);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Departure Preparation</h1>
            <p className="text-sm text-indigo-100 mt-1">Manage worker departures and pre-flight preparations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowScheduleDialog(true)}>
              <Calendar className="mr-2 h-4 w-4" />
              Deployment Schedule
            </Button>
            <Button variant="secondary" onClick={() => setShowNewDepartureDialog(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Departure
            </Button>
          </div>
        </div>
      </div>

      {/* Today's Departures Feature Banner */}
      {todayDepartures.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <Plane className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Today's Departures ({todayDepartures.length})</h3>
                  <p className="text-sm text-blue-700">
                    {readyDepartures.length} ready to depart • {todayDepartures.length - readyDepartures.length} require attention
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-blue-300 text-blue-800 hover:bg-blue-100">
                  <Bell className="mr-2 h-4 w-4" />
                  Send Reminders
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => setActiveTab("today")}>
                  <CheckSquare className="mr-2 h-4 w-4" />
                  View Checklist
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CalendarDays className="mr-2 h-4 w-4 text-slate-500" />
              Total Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departures.length}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <span className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 mr-1"></div>
                Today: {todayDepartures.length}
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-purple-400 mr-1"></div>
                Upcoming: {upcomingDepartures.length}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-green-800">
              <CheckCheck className="mr-2 h-4 w-4 text-green-600" />
              Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{readyDepartures.length}</div>
            <p className="text-xs text-muted-foreground pt-1">
              All checks completed
            </p>
            {todayDepartures.length > 0 && (
              <div className="mt-2 h-1.5 w-full bg-green-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${Math.round((readyDepartures.length / todayDepartures.length) * 100)}%` }}
                ></div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-yellow-800">
              <ListTodo className="mr-2 h-4 w-4 text-yellow-600" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {departures.filter(d => d.status === "Pending").length}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Checklist incomplete
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {departures
                .filter(d => d.status === "Pending")
                .slice(0, 2)
                .map(d => (
                  <Badge 
                    key={d.id} 
                    variant="outline" 
                    className="bg-white text-xs font-normal border-yellow-200"
                  >
                    {d.workerName.split(" ")[0]}
                  </Badge>
                ))}
              {departures.filter(d => d.status === "Pending").length > 2 && (
                <Badge 
                  variant="outline" 
                  className="bg-white text-xs font-normal border-yellow-200"
                >
                  +{departures.filter(d => d.status === "Pending").length - 2} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-red-800">
              <AlertCircle className="mr-2 h-4 w-4 text-red-600" />
              Delayed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {departures.filter(d => d.status === "Delayed").length}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Requires attention
            </p>
            {departures.filter(d => d.status === "Delayed").map(d => (
              <Button key={d.id} variant="link" size="sm" className="p-0 h-auto mt-2 text-red-700 text-xs">
                View issues
              </Button>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Terminal className="mr-2 h-4 w-4 text-blue-500" />
              Airport Preparation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(departures.reduce((acc, d) => {
                const prep = d.checklist.airportPreparation;
                if (!prep) return acc;
                const prepValues = Object.values(prep).filter(v => typeof v === 'boolean');
                return acc + (prepValues.filter(Boolean).length / prepValues.length);
              }, 0) / departures.filter(d => d.checklist.airportPreparation).length * 100 || 0)}%
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Average completion
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-3"
              onClick={() => {
                // Select the first departure of today if available
                const todayDep = departures.find(d => d.flightDetails.departureDate === currentDate);
                if (todayDep) {
                  setSelectedDeparture(todayDep);
                  setAirportPrepOpen(true);
                }
              }}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Manage Preparation
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="all" className="flex items-center">
              <ListFilter className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">All Departures</span>
              <span className="sm:hidden">All</span>
            </TabsTrigger>
            <TabsTrigger value="today" className="flex items-center">
              <Plane className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Today Flying</span>
              <span className="sm:hidden">Today</span>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Upcoming</span>
              <span className="sm:hidden">Soon</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Completed</span>
              <span className="sm:hidden">Done</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2 items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search worker or flight..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 sm:w-44">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Ready">Ready</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
                <SelectItem value="Departed">Departed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="m-0">
          <DepartureTable 
            departures={filteredDepartures} 
            onSelectDeparture={setSelectedDeparture} 
            getCompletionPercentage={getOverallCompletionPercentage}
          />
        </TabsContent>
        
        <TabsContent value="today" className="m-0">
          {filteredDepartures.length > 0 ? (
            <TodayFlying 
              departures={filteredDepartures} 
              onSelectDeparture={(departure) => {
                setSelectedDeparture(departure);
                setChecklistOpen(true);
              }}
              onOpenAirportPrep={(departure) => {
                setSelectedDeparture(departure);
                setAirportPrepOpen(true);
              }}
            />
          ) : (
            <EmptyState 
              icon={<Plane className="h-12 w-12 text-muted-foreground" />}
              title="No Departures Today"
              description="There are no workers scheduled to depart today."
            />
          )}
        </TabsContent>
        
        <TabsContent value="upcoming" className="m-0">
          {filteredDepartures.length > 0 ? (
            <DepartureTable 
              departures={filteredDepartures} 
              onSelectDeparture={setSelectedDeparture} 
              getCompletionPercentage={getOverallCompletionPercentage}
            />
          ) : (
            <EmptyState 
              icon={<Calendar className="h-12 w-12 text-muted-foreground" />}
              title="No Upcoming Departures"
              description="There are no workers scheduled for upcoming departures."
            />
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="m-0">
          {filteredDepartures.length > 0 ? (
            <DepartureTable 
              departures={filteredDepartures} 
              onSelectDeparture={setSelectedDeparture} 
              getCompletionPercentage={getOverallCompletionPercentage}
            />
          ) : (
            <EmptyState 
              icon={<CheckCircle2 className="h-12 w-12 text-muted-foreground" />}
              title="No Completed Departures"
              description="There are no workers with completed departures in the selected period."
            />
          )}
        </TabsContent>
      </Tabs>
      
      {/* Departure Details Dialog */}
      <Dialog open={!!selectedDeparture} onOpenChange={() => setSelectedDeparture(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <Plane className="mr-2 h-5 w-5 text-purple-600" />
              Departure Details
              {selectedDeparture?.status && (
                <BadgeDiv className={`ml-2 ${getStatusColor(selectedDeparture.status)}`}>
                  {selectedDeparture.status}
                </BadgeDiv>
              )}
            </DialogTitle>
            <DialogDescription className="flex items-center">
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              {selectedDeparture?.workerName} ({selectedDeparture?.workerID})
              <span className="mx-2">•</span>
              <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
              {selectedDeparture?.destination}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDeparture && (
            <div className="space-y-6">
              <Tabs defaultValue="checklist">
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="checklist" className="flex items-center">
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Pre-Departure Checklist
                  </TabsTrigger>
                  <TabsTrigger value="flight" className="flex items-center">
                    <Plane className="mr-2 h-4 w-4" />
                    Flight Details
                  </TabsTrigger>
                  <TabsTrigger value="receiving" className="flex items-center">
                    <UserCheck className="mr-2 h-4 w-4" />
                    Receiving Party
                  </TabsTrigger>
                  <TabsTrigger value="milestones" className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Milestones
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="checklist" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="overflow-hidden border-t-4 border-t-indigo-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <Passport className="mr-2 h-4 w-4 text-indigo-500" />
                          Documents
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y">
                          {Object.entries(selectedDeparture.checklist.documents).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between px-4 py-2">
                              <div className="flex items-center gap-2">
                                <span className="capitalize text-sm">{key}</span>
                              </div>
                              {value ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <CircleAlert className="h-4 w-4 text-amber-500" />
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="overflow-hidden border-t-4 border-t-violet-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <GraduationCap className="mr-2 h-4 w-4 text-violet-500" />
                          Training
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y">
                          {Object.entries(selectedDeparture.checklist.training).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between px-4 py-2">
                              <div className="flex items-center gap-2">
                                <span className="capitalize text-sm">{key}</span>
                              </div>
                              {value ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <CircleAlert className="h-4 w-4 text-amber-500" />
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="overflow-hidden border-t-4 border-t-blue-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <Luggage className="mr-2 h-4 w-4 text-blue-500" />
                          Logistics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y">
                          {Object.entries(selectedDeparture.checklist.logistics).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between px-4 py-2">
                              <div className="flex items-center gap-2">
                                <span className="capitalize text-sm">{key}</span>
                              </div>
                              {value ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <CircleAlert className="h-4 w-4 text-amber-500" />
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="flight" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Plane className="mr-2 h-5 w-5 text-blue-600" />
                        Flight Information
                      </CardTitle>
                      <CardDescription>
                        Flight {selectedDeparture.flightDetails.flightNumber} • {selectedDeparture.flightDetails.airline}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <div className="flex items-stretch mt-2">
                            <div className="flex-1">
                              <div className="text-sm text-muted-foreground">Departure</div>
                              <div className="font-semibold text-xl">{selectedDeparture.flightDetails.departureTime}</div>
                              <div className="text-sm mt-1">{selectedDeparture.flightDetails.departureDate}</div>
                            </div>
                            
                            <div className="flex flex-col items-center justify-center px-6">
                              <div className="w-24 h-px bg-gray-300 relative">
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                  <Plane className="h-4 w-4 text-blue-500" />
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex-1 text-right">
                              <div className="text-sm text-muted-foreground">Estimated Arrival</div>
                              <div className="font-medium">
                                {selectedDeparture.flightDetails.estimatedArrival?.split(' ')[1] || "N/A"}
                              </div>
                              <div className="text-sm mt-1">
                                {selectedDeparture.flightDetails.estimatedArrival?.split(' ')[0] || "N/A"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Deployment Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <Calendar className="mr-2 h-5 w-5 text-indigo-600" />
              Deployment Schedule
            </DialogTitle>
            <DialogDescription>
              View upcoming worker departures and schedule
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium mb-2">
              <div>Monday</div>
              <div>Tuesday</div>
              <div>Wednesday</div>
              <div>Thursday</div>
              <div>Friday</div>
              <div>Saturday</div>
              <div>Sunday</div>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 31 }).map((_, i) => {
                const date = new Date(2024, 2, i + 1); // March 2024
                const dayDepartures = departures.filter(d => d.flightDetails.departureDate === `2024-03-${String(i + 1).padStart(2, '0')}`);
                const isToday = `2024-03-${String(i + 1).padStart(2, '0')}` === currentDate;
                
                return (
                  <div 
                    key={i} 
                    className={`border rounded-md min-h-24 p-1 transition-colors ${
                      isToday 
                        ? 'bg-blue-50 border-blue-300' 
                        : dayDepartures.length > 0 
                          ? 'bg-gray-50 hover:bg-gray-100' 
                          : 'bg-white hover:bg-gray-50'
                    } ${date.getDay() === 0 || date.getDay() === 6 ? 'bg-gray-50' : ''}`}
                  >
                    <div className="text-right text-xs font-medium mb-1">
                      {i + 1}
                      {isToday && <span className="text-blue-600 ml-1">(Today)</span>}
                    </div>
                    
                    {dayDepartures.length > 0 && (
                      <div className="space-y-1">
                        {dayDepartures.map(d => (
                          <div 
                            key={d.id} 
                            className={`text-xs p-1 rounded ${
                              d.status === 'Ready' 
                                ? 'bg-green-100 text-green-800'
                                : d.status === 'Pending' 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : d.status === 'Delayed'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <div className="font-medium truncate">{d.workerName}</div>
                            <div className="flex items-center gap-1 text-[10px]">
                              <Plane className="h-2.5 w-2.5" />
                              {d.flightDetails.departureTime}
                            </div>
                          </div>
                        ))}
                        
                        {dayDepartures.length > 2 && (
                          <div className="text-[10px] text-center text-blue-600 font-medium">
                            +{dayDepartures.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1 text-xs">
                <div className="w-3 h-3 rounded-full bg-green-200"></div>
                <span>Ready</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <div className="w-3 h-3 rounded-full bg-yellow-200"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <div className="w-3 h-3 rounded-full bg-red-200"></div>
                <span>Delayed</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                Close
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export Schedule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Add the new dialog */}
      {selectedDeparture && (
        <AirportPreparationChecklist
          departure={selectedDeparture}
          open={airportPrepOpen}
          onOpenChange={setAirportPrepOpen}
          onUpdate={handleUpdateDeparture}
        />
      )}
    </div>
  );
}

// Empty state component
function EmptyState({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string 
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <div className="rounded-full bg-gray-100 p-3 mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

// DepartureTable component
function DepartureTable({ 
  departures, 
  onSelectDeparture,
  getCompletionPercentage,
  showTodayInfo = false
}: { 
  departures: Departure[], 
  onSelectDeparture: (departure: Departure) => void,
  getCompletionPercentage: (departure: Departure) => number,
  showTodayInfo?: boolean
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Worker</TableHead>
              <TableHead>Flight Details</TableHead>
              <TableHead>Preparation</TableHead>
              {showTodayInfo && <TableHead>Boarding</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showTodayInfo ? 7 : 6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Search className="h-8 w-8 mb-2" />
                    <p>No departures found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              departures.map((departure) => {
                const completionPercentage = getCompletionPercentage(departure);
                
                return (
                  <TableRow key={departure.id} className="group">
                    <TableCell className="font-medium">{departure.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{departure.workerName}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {departure.workerID}
                          <span className="mx-1">•</span>
                          <MapPin className="h-3 w-3" />
                          {departure.destination}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center">
                          <Plane className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                          {departure.flightDetails.airline} {departure.flightDetails.flightNumber}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {departure.flightDetails.departureDate}
                          <span className="mx-1">•</span>
                          <Clock className="h-3 w-3" />
                          {departure.flightDetails.departureTime}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Overall Completion</span>
                          <span>
                            {completionPercentage}%
                          </span>
                        </div>
                        <Progress 
                          value={completionPercentage} 
                          className={`h-2 ${
                            completionPercentage === 100 
                              ? 'bg-green-100' 
                              : completionPercentage >= 70 
                                ? 'bg-blue-100' 
                                : 'bg-yellow-100'
                          }`} 
                        />
                        <div className="flex gap-1 mt-1">
                          <div className="flex items-center text-xs gap-0.5 text-muted-foreground">
                            <Passport className="h-3 w-3" />
                            <span>
                              {Object.values(departure.checklist.documents).filter(Boolean).length}/
                              {Object.keys(departure.checklist.documents).length}
                            </span>
                          </div>
                          <div className="flex items-center text-xs gap-0.5 text-muted-foreground">
                            <GraduationCap className="h-3 w-3" />
                            <span>
                              {Object.values(departure.checklist.training).filter(Boolean).length}/
                              {Object.keys(departure.checklist.training).length}
                            </span>
                          </div>
                          <div className="flex items-center text-xs gap-0.5 text-muted-foreground">
                            <Luggage className="h-3 w-3" />
                            <span>
                              {Object.values(departure.checklist.logistics).filter(Boolean).length}/
                              {Object.keys(departure.checklist.logistics).length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    {showTodayInfo && (
                      <TableCell>
                        <div className="text-sm flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <AlarmClock className="h-3.5 w-3.5 text-blue-600" />
                            <span className="font-medium">
                              {departure.flightDetails.boardingTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            Gate {departure.flightDetails.gate}
                          </div>
                          {departure.receivingParty?.notified && (
                            <BadgeDiv variant="outline" className="mt-1 bg-green-50 text-green-700 text-xs border-green-200 gap-1 w-fit">
                              <CheckCircle2 className="h-3 w-3" />
                              Receiver Notified
                            </BadgeDiv>
                          )}
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(departure.status)}
                        <BadgeDiv className={getStatusColor(departure.status)}>
                          {departure.status}
                        </BadgeDiv>
                      </div>
                      {departure.remarks && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {departure.remarks.length > 30 ? departure.remarks.substring(0, 27) + '...' : departure.remarks}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="sm">
                          <ClipboardCheck className="mr-2 h-4 w-4" />
                          Checklist
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => onSelectDeparture(departure)}
                        >
                          <ChevronRight className="h-4 w-4" />
                          Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
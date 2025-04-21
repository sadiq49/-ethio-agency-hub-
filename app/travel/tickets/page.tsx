"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
  Building,
  Phone
} from "lucide-react";

interface FlightBooking {
  id: string;
  workerName: string;
  workerID: string;
  destination: string;
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed";
  airline: string;
  flightNumber: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  terminal: string;
  departureTerminal?: string;
  arrivalTerminal?: string;
  baggage: string;
  checklist: {
    visa: boolean;
    passport: boolean;
    medical: boolean;
    contract: boolean;
    insurance: boolean;
    orientation: boolean;
    vaccination?: boolean;
    accommodationConfirmed?: boolean;
    emergencyContact?: boolean;
    travelInsurance?: boolean;
  };
  ticketDetails?: {
    pnr: string;
    seatNumber: string;
    class: string;
    cost: number;
    bookingAgent?: string;
    fareType?: string;
    mealPreference?: string;
    specialAssistance?: string;
    eTicketNumber?: string;
    bookingDate?: string;
  };
  accommodationDetails?: {
    hotelName?: string;
    checkInDate?: string;
    checkOutDate?: string;
    address?: string;
    contactNumber?: string;
    confirmationNumber?: string;
  };
  notifications?: {
    checkInReminder?: boolean;
    departureAlert?: boolean;
    documentsReminder?: boolean;
    flightChanges?: boolean;
    boardingTime?: string;
  };
  airlinePreferences?: {
    preferredAirline?: string[];
    seatPreference?: "window" | "aisle" | "middle" | "no preference";
    mealPreference?: string;
    frequentFlyerNumber?: string;
  };
}

const bookings: FlightBooking[] = [
  {
    id: "TKT-2024-001",
    workerName: "Amina Hassan",
    workerID: "W1001",
    destination: "Riyadh",
    status: "Confirmed",
    airline: "Ethiopian Airlines",
    flightNumber: "ET445",
    departureDate: "2024-03-20",
    departureTime: "23:45",
    arrivalDate: "2024-03-21",
    arrivalTime: "03:30",
    terminal: "T2",
    departureTerminal: "International Terminal",
    arrivalTerminal: "Terminal 2",
    baggage: "30kg",
    checklist: {
      visa: true,
      passport: true,
      medical: true,
      contract: true,
      insurance: true,
      orientation: true,
      vaccination: true,
      accommodationConfirmed: true,
      emergencyContact: true,
      travelInsurance: true
    },
    ticketDetails: {
      pnr: "ABC123",
      seatNumber: "14A",
      class: "Economy",
      cost: 850,
      bookingAgent: "TravelMaster Agency",
      fareType: "Standard Economy",
      mealPreference: "Halal",
      eTicketNumber: "071-2234567890",
      bookingDate: "2024-02-15"
    },
    accommodationDetails: {
      hotelName: "Al Faisaliah Hotel",
      checkInDate: "2024-03-21",
      checkOutDate: "2024-03-22",
      address: "King Fahd Road, Riyadh, Saudi Arabia",
      contactNumber: "+966-11-273-2000",
      confirmationNumber: "BKG-789012"
    },
    notifications: {
      checkInReminder: true,
      departureAlert: true,
      documentsReminder: true,
      flightChanges: true,
      boardingTime: "23:00"
    },
    airlinePreferences: {
      preferredAirline: ["Ethiopian Airlines", "Emirates"],
      seatPreference: "window",
      mealPreference: "Halal",
      frequentFlyerNumber: "ET12345678"
    }
  },
  {
    id: "TKT-2024-002",
    workerName: "Fatima Omar",
    workerID: "W1002",
    destination: "Dubai",
    status: "Pending",
    airline: "Emirates",
    flightNumber: "EK722",
    departureDate: "2024-03-22",
    departureTime: "02:15",
    arrivalDate: "2024-03-22",
    arrivalTime: "07:45",
    terminal: "T3",
    departureTerminal: "Terminal 1",
    arrivalTerminal: "Terminal 3",
    baggage: "25kg",
    checklist: {
      visa: true,
      passport: true,
      medical: true,
      contract: false,
      insurance: true,
      orientation: false,
      vaccination: true,
      accommodationConfirmed: false,
      emergencyContact: true,
      travelInsurance: false
    },
    airlinePreferences: {
      preferredAirline: ["Emirates", "Etihad Airways"],
      seatPreference: "aisle",
      mealPreference: "Vegetarian",
      frequentFlyerNumber: "EK7654321"
    },
    notifications: {
      checkInReminder: true,
      departureAlert: true,
      documentsReminder: false,
      flightChanges: true
    }
  },
  {
    id: "TKT-2024-003",
    workerName: "Sara Ahmed",
    workerID: "W1003",
    destination: "Kuwait",
    status: "Confirmed",
    airline: "Kuwait Airways",
    flightNumber: "KU514",
    departureDate: "2024-03-25",
    departureTime: "20:30",
    arrivalDate: "2024-03-26",
    arrivalTime: "00:15",
    terminal: "T1",
    departureTerminal: "Main Terminal",
    arrivalTerminal: "Terminal 1",
    baggage: "30kg",
    checklist: {
      visa: true,
      passport: true,
      medical: true,
      contract: true,
      insurance: true,
      orientation: true,
      vaccination: true,
      accommodationConfirmed: true,
      emergencyContact: true,
      travelInsurance: true
    },
    ticketDetails: {
      pnr: "XYZ789",
      seatNumber: "22C",
      class: "Economy",
      cost: 920,
      bookingAgent: "Global Travel Solutions",
      fareType: "Flex Economy",
      mealPreference: "Standard",
      specialAssistance: "None",
      eTicketNumber: "229-7890123456",
      bookingDate: "2024-02-20"
    },
    accommodationDetails: {
      hotelName: "Radisson Blu Hotel Kuwait",
      checkInDate: "2024-03-26",
      checkOutDate: "2024-03-27",
      address: "Al Bida'a, Arabian Gulf Street, Kuwait",
      contactNumber: "+965-2567-3000",
      confirmationNumber: "RAD-2456789"
    },
    notifications: {
      checkInReminder: true,
      departureAlert: true,
      documentsReminder: true,
      flightChanges: true,
      boardingTime: "20:00"
    },
    airlinePreferences: {
      preferredAirline: ["Kuwait Airways", "Gulf Air"],
      seatPreference: "window",
      mealPreference: "Standard",
      frequentFlyerNumber: "KU8901234"
    }
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Confirmed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "Completed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Confirmed":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "Pending":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "Cancelled":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "Completed":
      return <Plane className="h-4 w-4 text-blue-500" />;
    default:
      return null;
  }
};

// Custom StatusBadge to replace Badge component
function StatusBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className || ''}`}>
      {children}
    </div>
  );
}

export default function TicketArrangementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<FlightBooking | null>(null);
  const [showNewBookingDialog, setShowNewBookingDialog] = useState(false);
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);
  const [showFlightSearchDialog, setShowFlightSearchDialog] = useState(false);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.workerID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.ticketDetails?.pnr && booking.ticketDetails.pnr.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ticket Arrangement</h1>
          <p className="text-sm text-muted-foreground">Manage flight bookings and pre-departure arrangements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFlightSearchDialog(true)}>
            <Plane className="mr-2 h-4 w-4" />
            Search Flights
          </Button>
          <Button onClick={() => setShowNewBookingDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Ticket className="mr-2 h-4 w-4 text-purple-500" />
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground pt-1">
              +23 this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Plane className="mr-2 h-4 w-4 text-blue-500" />
              Today's Departures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">12</div>
            <p className="text-xs text-muted-foreground pt-1">
              4 check-ins pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Timer className="mr-2 h-4 w-4 text-yellow-500" />
              Pending Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">28</div>
            <p className="text-xs text-muted-foreground pt-1">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Bell className="mr-2 h-4 w-4 text-red-500" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">8</div>
            <p className="text-xs text-muted-foreground pt-1">
              Require attention
            </p>
            <Button variant="link" className="text-xs p-0 h-auto mt-1" onClick={() => setShowNotificationsDialog(true)}>
              View all alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search bookings..."
            className="pl-8"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 sm:w-44">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Flight Details</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Pre-Departure</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => {
                const checklistItems = Object.entries(booking.checklist);
                const completedItems = checklistItems.filter(([_, value]) => value).length;
                const totalItems = checklistItems.length;
                const completionPercentage = (completedItems / totalItems) * 100;
                
                return (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>
                      <div>
                        <div>{booking.workerName}</div>
                        <div className="text-xs text-muted-foreground">
                          {booking.workerID}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.airline}</div>
                        <div className="text-xs text-muted-foreground">
                          Flight {booking.flightNumber}
                        </div>
                        {booking.ticketDetails?.pnr && (
                          <div className="text-xs text-muted-foreground">
                            PNR: {booking.ticketDetails.pnr}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {booking.departureDate}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {booking.departureTime} • {booking.departureTerminal || `Terminal ${booking.terminal}`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Checklist</span>
                          <span>
                            {completedItems}/{totalItems}
                          </span>
                        </div>
                        <Progress 
                          value={completionPercentage} 
                          className={`h-2 ${completionPercentage < 70 ? 'bg-yellow-100' : 'bg-green-100'}`} 
                        />
                        <div className="flex gap-1 mt-1">
                          {completionPercentage === 100 ? (
                            <StatusBadge className="text-xs bg-green-100 text-green-800 border-green-200">Complete</StatusBadge>
                          ) : completionPercentage >= 70 ? (
                            <StatusBadge className="text-xs bg-blue-100 text-blue-800 border-blue-200">In Progress</StatusBadge>
                          ) : (
                            <StatusBadge className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">Attention Needed</StatusBadge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(booking.status)}
                        <StatusBadge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </StatusBadge>
                      </div>
                      {booking.ticketDetails?.seatNumber && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Seat: {booking.ticketDetails.seatNumber}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          Ticket
                        </Button>
                        <Button size="sm" onClick={() => setSelectedBooking(booking)}>
                          <Briefcase className="mr-2 h-4 w-4" />
                          Manage
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No bookings found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Flight Booking Details</DialogTitle>
            <DialogDescription>
              View and manage flight booking information
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Flight Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Airline</span>
                      <span>{selectedBooking.airline}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Flight Number</span>
                      <span>{selectedBooking.flightNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Departure</span>
                      <span>{selectedBooking.departureDate} {selectedBooking.departureTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Arrival</span>
                      <span>{selectedBooking.arrivalDate} {selectedBooking.arrivalTime}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Pre-Departure Checklist</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedBooking.checklist).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="capitalize">{key}</span>
                        {value ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
import { Search, Filter, Book, Calendar, CheckCircle2, Clock, Building2, MapPin, Phone, Plane, Hotel, FileText, PlusCircle, UserPlus, CalendarRange, Fuel as Mosque, ScrollText, AlertCircle, MoreHorizontal, Eye, Trash2, Calendar as CalendarIcon, CheckSquare, X, RefreshCcw, FileCheck, XCircle, RotateCw, HelpCircle, ClipboardCheck, CheckCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type PilgrimStatus = "Active" | "Processing" | "Pending" | "Completed" | "Cancelled" | "Registered" | "Visa Pending" | "Visa Approved" | "Travel Ready" | "In Progress";
type DocumentStatus = "Complete" | "Verified" | "In Review" | "Submitted" | "Missing";
type PilgrimageType = "Hajj" | "Umrah";
type PaymentStatus = "Full" | "Partial" | "Pending" | "Refunded";

interface Pilgrim {
  id: string;
  name: string;
  nationality: string;
  photo?: string;
  passportNumber: string;
  pilgrimage: PilgrimageType;
  pilgrimageType?: PilgrimageType; // For backward compatibility
  status: PilgrimStatus;
  package: string;
  departureDate: string;
  returnDate: string;
  documentStatus?: DocumentStatus;
  travelGroup?: string;
  avatar?: string;

  // Document information
  documents: {
    passport: boolean;
    photo: boolean;
    vaccination: boolean;
    medicalReport: boolean;
    mahramDocuments: boolean;
    status?: DocumentStatus;
  };

  // Visa information
  visaDetails?: {
    number: string;
    issueDate: string;
    expiryDate: string;
    applicationDate: string;
    trackingNumber: string;
    status?: string;
    processingAgency?: string;
    lastUpdated?: string;
  };

  // Accommodation details
  accommodation: {
    makkah: string;
    madinah: string;
    location?: string;
    checkIn?: string;
    checkOut?: string;
  };

  // Travel details
  travel?: {
    departureDate: string;
    returnDate: string;
  };
  
  travelDetails?: {
    airline?: string;
    flightNumber?: string;
    departureTerminal?: string;
    returnFlightNumber?: string;
  };

  // Mahram details (for women and children)
  mahram?: {
    name: string;
    relation: string;
    passportNumber?: string;
    contactInfo?: string;
  };

  // Itinerary information
  itinerary?: {
    flightToSaudi: {
      airline: string;
      flightNumber: string;
      departureTime: string;
    };
    flightFromSaudi: {
      airline: string;
      flightNumber: string;
      departureTime: string;
    };
    groundTransportation: boolean;
    localGuide: string;
  };

  // Registration information
  registration?: {
    date: string;
    agencyOffice: string;
    registeredBy: string;
    physicalDocumentsSubmitted: boolean;
    paymentStatus: PaymentStatus;
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
  };

  // Contact information
  contactInfo?: {
    phone?: string;
    email?: string;
    emergency?: string;
    address?: string;
  };

  // Feedback after pilgrimage
  feedback?: {
    submitted: boolean;
    rating?: number;
    comments?: string;
    submissionDate?: string;
  };
}

const pilgrims: Pilgrim[] = [
  {
    id: "P-001",
    name: "Mohammed Salah",
    nationality: "Egyptian",
    passportNumber: "A123456",
    pilgrimage: "Hajj",
    status: "Visa Approved",
    package: "Premium",
    departureDate: "2023-06-15",
    returnDate: "2023-07-05",
    accommodation: {
      makkah: "Al Safwah Towers",
      madinah: "Millennium Madinah",
    },
    travelGroup: "Group A",
    visaDetails: {
      number: "KSA-123456",
      issueDate: "2024-03-15",
      expiryDate: "2024-08-15",
      applicationDate: "2024-02-20",
      trackingNumber: "VISA-ETH-23456"
    },
    documents: {
      passport: true,
      photo: true,
      vaccination: true,
      medicalReport: true,
      mahramDocuments: false
    },
    registration: {
      date: "2024-01-15",
      agencyOffice: "Addis Ababa Main Office",
      registeredBy: "Jamal Ibrahim",
      physicalDocumentsSubmitted: true,
      paymentStatus: "Full",
      emergencyContact: {
        name: "Aisha Mohammed",
        phone: "+251-911-234567",
        relationship: "Wife"
      }
    },
    itinerary: {
      flightToSaudi: {
        airline: "Ethiopian Airlines",
        flightNumber: "ET445",
        departureTime: "2024-06-15 23:30"
      },
      flightFromSaudi: {
        airline: "Ethiopian Airlines",
        flightNumber: "ET446",
        departureTime: "2024-07-10 03:15"
      },
      groundTransportation: true,
      localGuide: "Abdullah Saleh"
    }
  },
  {
    id: "P-002",
    name: "Fatima Ahmed",
    nationality: "Pakistani",
    passportNumber: "B789012",
    pilgrimage: "Umrah",
    status: "Registered",
    package: "Standard",
    departureDate: "2023-04-10",
    returnDate: "2023-04-20",
    accommodation: {
      makkah: "Makkah Hotel",
      madinah: "Madinah Hotel",
    },
    mahram: {
      name: "Omar Hassan",
      relation: "Father"
    },
    travelGroup: "Group B",
    documents: {
      passport: true,
      photo: true,
      vaccination: false,
      medicalReport: false,
      mahramDocuments: true
    },
    registration: {
      date: "2024-03-01",
      agencyOffice: "Dire Dawa Branch",
      registeredBy: "Amina Mohamed",
      physicalDocumentsSubmitted: true,
      paymentStatus: "Partial",
      emergencyContact: {
        name: "Omar Hassan",
        phone: "+251-911-765432",
        relationship: "Father"
      }
    }
  },
  {
    id: "P-003",
    name: "Ibrahim Khalil",
    nationality: "Indonesian",
    passportNumber: "C345678",
    pilgrimage: "Hajj",
    status: "Travel Ready",
    package: "Deluxe",
    departureDate: "2023-06-10",
    returnDate: "2023-07-01",
    accommodation: {
      makkah: "Jabal Omar Hyatt Regency",
      madinah: "Madinah Hilton",
    },
    travelGroup: "Group A",
    visaDetails: {
      number: "KSA-789012",
      issueDate: "2024-03-10",
      expiryDate: "2024-08-10",
      applicationDate: "2024-02-15",
      trackingNumber: "VISA-ETH-78901"
    },
    documents: {
      passport: true,
      photo: true,
      vaccination: true,
      medicalReport: true,
      mahramDocuments: false
    },
    registration: {
      date: "2024-01-10",
      agencyOffice: "Addis Ababa Main Office",
      registeredBy: "Yusuf Ahmed",
      physicalDocumentsSubmitted: true,
      paymentStatus: "Full",
      emergencyContact: {
        name: "Zainab Ali",
        phone: "+251-911-987654",
        relationship: "Sister"
      }
    },
    itinerary: {
      flightToSaudi: {
        airline: "Saudia",
        flightNumber: "SV432",
        departureTime: "2024-06-20 21:45"
      },
      flightFromSaudi: {
        airline: "Saudia",
        flightNumber: "SV433",
        departureTime: "2024-07-15 08:30"
      },
      groundTransportation: true,
      localGuide: "Mohammed Farooq"
    },
    feedback: {
      submitted: false
    }
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Registered":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "Visa Pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Visa Approved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Travel Ready":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "In Progress":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case "Completed":
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "Processing":
      return <RefreshCcw className="h-4 w-4 text-blue-500" />;
    case "Pending":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "Completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "Cancelled":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "Registered":
      return <ClipboardCheck className="h-4 w-4 text-blue-500" />;
    case "Visa Pending":
      return <FileText className="h-4 w-4 text-yellow-500" />;
    case "Visa Approved":
      return <FileCheck className="h-4 w-4 text-green-500" />;
    case "Travel Ready":
      return <Plane className="h-4 w-4 text-blue-500" />;
    case "In Progress":
      return <RotateCw className="h-4 w-4 text-purple-500" />;
    default:
      return <HelpCircle className="h-4 w-4 text-gray-500" />;
  }
};

function PhysicalRegistrationDialog({ 
  open, 
  onOpenChange, 
  onSave
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    passportNumber: "",
    pilgrimage: "Hajj",
    idCardNumber: "",
    phoneNumber: "",
    address: "",
    documents: {
      passport: false,
      photo: false,
      vaccination: false,
      medicalReport: false,
      mahramDocuments: false,
      idCard: false,
      birthCertificate: false,
      marriageCertificate: false
    },
    physicalVerification: {
      photoTaken: false,
      fingerprintsTaken: false,
      signatureCollected: false,
      originalDocumentsVerified: false
    },
    officerName: "",
    agencyOffice: "Addis Ababa Main Office",
    notes: ""
  });

  const handleCheckboxChange = (category: string, field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Physical Registration of Pilgrim</DialogTitle>
          <DialogDescription>
            Register pilgrims who visit the agency office in person. Verify and collect all physical documents.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 mt-4">
          <div className="border rounded-lg bg-slate-50 p-4">
            <h3 className="font-medium mb-3">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input 
                  value={formData.name} 
                  onChange={e => handleChange("name", e.target.value)}
                  placeholder="Pilgrim full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Passport Number</label>
                <Input 
                  value={formData.passportNumber} 
                  onChange={e => handleChange("passportNumber", e.target.value)}
                  placeholder="e.g. EP1234567"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pilgrimage Type</label>
                <Select 
                  value={formData.pilgrimage}
                  onValueChange={value => handleChange("pilgrimage", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pilgrimage type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hajj">Hajj</SelectItem>
                    <SelectItem value="Umrah">Umrah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ID Card Number</label>
                <Input 
                  value={formData.idCardNumber} 
                  onChange={e => handleChange("idCardNumber", e.target.value)}
                  placeholder="National ID number"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input 
                  value={formData.phoneNumber} 
                  onChange={e => handleChange("phoneNumber", e.target.value)}
                  placeholder="e.g. +251-911-234567"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Input 
                  value={formData.address} 
                  onChange={e => handleChange("address", e.target.value)}
                  placeholder="Home address"
                />
              </div>
            </div>
          </div>

          <div className="border rounded-lg bg-slate-50 p-4">
            <h3 className="font-medium mb-3">Document Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="passport"
                    checked={formData.documents.passport}
                    onChange={e => handleCheckboxChange("documents", "passport", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="passport">Passport (Original + Copy)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="photo"
                    checked={formData.documents.photo}
                    onChange={e => handleCheckboxChange("documents", "photo", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="photo">Passport-size Photos (4 copies)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="vaccination"
                    checked={formData.documents.vaccination}
                    onChange={e => handleCheckboxChange("documents", "vaccination", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="vaccination">Vaccination Certificate</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="medicalReport"
                    checked={formData.documents.medicalReport}
                    onChange={e => handleCheckboxChange("documents", "medicalReport", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="medicalReport">Medical Report</label>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="mahramDocuments"
                    checked={formData.documents.mahramDocuments}
                    onChange={e => handleCheckboxChange("documents", "mahramDocuments", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="mahramDocuments">Mahram Documents (if applicable)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="idCard"
                    checked={formData.documents.idCard}
                    onChange={e => handleCheckboxChange("documents", "idCard", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="idCard">National ID Card</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="birthCertificate"
                    checked={formData.documents.birthCertificate}
                    onChange={e => handleCheckboxChange("documents", "birthCertificate", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="birthCertificate">Birth Certificate</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="marriageCertificate"
                    checked={formData.documents.marriageCertificate}
                    onChange={e => handleCheckboxChange("documents", "marriageCertificate", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="marriageCertificate">Marriage Certificate (if applicable)</label>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg bg-slate-50 p-4">
            <h3 className="font-medium mb-3">Physical Verification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="photoTaken"
                    checked={formData.physicalVerification.photoTaken}
                    onChange={e => handleCheckboxChange("physicalVerification", "photoTaken", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="photoTaken">Photo Taken at Office</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="fingerprintsTaken"
                    checked={formData.physicalVerification.fingerprintsTaken}
                    onChange={e => handleCheckboxChange("physicalVerification", "fingerprintsTaken", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="fingerprintsTaken">Fingerprints Collected</label>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="signatureCollected"
                    checked={formData.physicalVerification.signatureCollected}
                    onChange={e => handleCheckboxChange("physicalVerification", "signatureCollected", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="signatureCollected">Signature Collected</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="originalDocumentsVerified"
                    checked={formData.physicalVerification.originalDocumentsVerified}
                    onChange={e => handleCheckboxChange("physicalVerification", "originalDocumentsVerified", e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="originalDocumentsVerified">Original Documents Physically Verified</label>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg bg-slate-50 p-4">
            <h3 className="font-medium mb-3">Registration Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Registration Officer</label>
                <Input 
                  value={formData.officerName} 
                  onChange={e => handleChange("officerName", e.target.value)}
                  placeholder="Officer's name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Agency Office</label>
                <Select 
                  value={formData.agencyOffice}
                  onValueChange={value => handleChange("agencyOffice", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select office location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Addis Ababa Main Office">Addis Ababa Main Office</SelectItem>
                    <SelectItem value="Dire Dawa Branch">Dire Dawa Branch</SelectItem>
                    <SelectItem value="Bahir Dar Office">Bahir Dar Office</SelectItem>
                    <SelectItem value="Hawassa Branch">Hawassa Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">Additional Notes</label>
                <textarea 
                  className="w-full border rounded-md p-2"
                  rows={3}
                  value={formData.notes} 
                  onChange={e => handleChange("notes", e.target.value)}
                  placeholder="Any additional information or observations"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Register Pilgrim
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function VisaTrackingSection({ pilgrims }: { pilgrims: Pilgrim[] }) {
  const [selectedVisaApplication, setSelectedVisaApplication] = useState<Pilgrim | null>(null);
  const [showStatusUpdateDialog, setShowStatusUpdateDialog] = useState(false);

  // Filter pilgrims with visa details
  const pilgrimsWithVisaDetails = pilgrims.filter(p => p.visaDetails);

  return (
    <div className="grid gap-6">
      <Card className="border-green-100">
        <CardHeader className="border-b pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 text-green-600 mr-2" />
              Visa Application Tracker
            </CardTitle>
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="mb-4 pb-4 border-b">
            <h3 className="text-sm font-medium mb-2">Application Status Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Card className="bg-blue-50 border-blue-100">
                <CardContent className="p-3">
                  <div className="text-xs text-blue-600 mb-1">Registered</div>
                  <div className="text-2xl font-bold">
                    {pilgrims.filter(p => p.status === "Registered").length}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-yellow-50 border-yellow-100">
                <CardContent className="p-3">
                  <div className="text-xs text-yellow-600 mb-1">Pending</div>
                  <div className="text-2xl font-bold">
                    {pilgrims.filter(p => p.status === "Visa Pending").length}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 border-purple-100">
                <CardContent className="p-3">
                  <div className="text-xs text-purple-600 mb-1">In Review</div>
                  <div className="text-2xl font-bold">
                    {pilgrimsWithVisaDetails.filter(p => p.visaDetails?.status === "Under Review").length}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-orange-50 border-orange-100">
                <CardContent className="p-3">
                  <div className="text-xs text-orange-600 mb-1">Additional Docs</div>
                  <div className="text-2xl font-bold">
                    {pilgrimsWithVisaDetails.filter(p => p.visaDetails?.status === "Additional Documents Required").length}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-100">
                <CardContent className="p-3">
                  <div className="text-xs text-green-600 mb-1">Approved</div>
                  <div className="text-2xl font-bold">
                    {pilgrims.filter(p => p.status === "Visa Approved").length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Recent Applications</h3>
              <Button variant="link" size="sm" className="text-primary h-auto p-0">
                View All Applications
              </Button>
            </div>
            
            <div className="space-y-4">
              {pilgrimsWithVisaDetails.map((pilgrim) => (
                <div key={pilgrim.id} className="border rounded-lg p-4 space-y-4 hover:border-blue-200 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          {pilgrim.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{pilgrim.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {pilgrim.passportNumber} • {pilgrim.pilgrimage}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(pilgrim.status)}>
                      {getStatusIcon(pilgrim.status)}
                      <span className="ml-1">{pilgrim.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Visa Application</div>
                      <div className="font-medium flex items-center">
                        <span className="mr-2">{pilgrim.visaDetails?.trackingNumber}</span>
                        {pilgrim.visaDetails?.status === "Under Review" && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">Processing</Badge>
                        )}
                        {pilgrim.visaDetails?.status === "Additional Documents Required" && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 text-xs">Action Needed</Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Application Date</div>
                      <div>{pilgrim.visaDetails?.applicationDate}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Last Updated</div>
                      <div>{pilgrim.visaDetails?.lastUpdated || "N/A"}</div>
                    </div>
                  </div>
                  
                  {/* Visual application progress bar */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Application Progress</span>
                      <span>
                        {pilgrim.status === "Registered" ? "25%" :
                         pilgrim.status === "Visa Pending" ? "50%" :
                         pilgrim.status === "Visa Approved" ? "100%" : "75%"}
                      </span>
                    </div>
                    <Progress 
                      value={
                        pilgrim.status === "Registered" ? 25 :
                        pilgrim.status === "Visa Pending" ? 50 :
                        pilgrim.status === "Visa Approved" ? 100 : 75
                      } 
                      className="h-2" 
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedVisaApplication(pilgrim);
                        setShowStatusUpdateDialog(true);
                      }}
                    >
                      Update Status
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => setSelectedVisaApplication(pilgrim)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visa Application Details Dialog */}
      <Dialog open={!!selectedVisaApplication} onOpenChange={() => setSelectedVisaApplication(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="h-5 w-5 text-green-600 mr-2" />
              Visa Application Details
            </DialogTitle>
            <DialogDescription>
              Tracking Number: {selectedVisaApplication?.visaDetails?.trackingNumber}
            </DialogDescription>
          </DialogHeader>
          
          {selectedVisaApplication && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Applicant Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Full Name</span>
                        <span className="font-medium">{selectedVisaApplication.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Passport Number</span>
                        <span>{selectedVisaApplication.passportNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pilgrimage Type</span>
                        <span>{selectedVisaApplication.pilgrimage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Package</span>
                        <span>{selectedVisaApplication.package}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Document Status</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Passport</span>
                        <span>{selectedVisaApplication.documents.passport ? "✅ Verified" : "❌ Missing"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Photos</span>
                        <span>{selectedVisaApplication.documents.photo ? "✅ Verified" : "❌ Missing"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vaccination</span>
                        <span>{selectedVisaApplication.documents.vaccination ? "✅ Verified" : "❌ Missing"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Medical Report</span>
                        <span>{selectedVisaApplication.documents.medicalReport ? "✅ Verified" : "❌ Missing"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mahram Documents</span>
                        <span>{selectedVisaApplication.documents.mahramDocuments ? "✅ Verified" : "❌ Missing"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Visa Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className={getStatusColor(selectedVisaApplication.status)}>
                          {getStatusIcon(selectedVisaApplication.status)}
                          <span className="ml-1">{selectedVisaApplication.status}</span>
                        </Badge>
                      </div>
                      {selectedVisaApplication.visaDetails?.number && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Visa Number</span>
                          <span className="font-medium">{selectedVisaApplication.visaDetails.number}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Application Date</span>
                        <span>{selectedVisaApplication.visaDetails?.applicationDate || "N/A"}</span>
                      </div>
                      {selectedVisaApplication.visaDetails?.issueDate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Issue Date</span>
                          <span>{selectedVisaApplication.visaDetails.issueDate}</span>
                        </div>
                      )}
                      {selectedVisaApplication.visaDetails?.expiryDate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Expiry Date</span>
                          <span>{selectedVisaApplication.visaDetails.expiryDate}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Processing Agency</span>
                        <span>{selectedVisaApplication.visaDetails?.processingAgency || "Saudi Embassy Addis Ababa"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Travel Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Departure Date</span>
                        <span>{selectedVisaApplication.departureDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Return Date</span>
                        <span>{selectedVisaApplication.returnDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Travel Group</span>
                        <span>{selectedVisaApplication.travelGroup}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4 flex justify-end gap-2">
                <Button variant="outline">
                  Download Documents
                </Button>
                <Button>
                  Update Application
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog - This would be used to send real-time updates */}
      <Dialog open={showStatusUpdateDialog} onOpenChange={setShowStatusUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Visa Application Status</DialogTitle>
            <DialogDescription>
              Update the status and send notifications to the pilgrim.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Application Status</label>
              <Select defaultValue={selectedVisaApplication?.visaDetails?.status || "Under Review"}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Additional Documents Required">Additional Documents Required</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <textarea 
                className="w-full border rounded-md p-2"
                rows={3}
                placeholder="Add notes about the status update"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sendNotification"
                className="rounded border-gray-300"
                defaultChecked
              />
              <label htmlFor="sendNotification">Send notification to pilgrim</label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowStatusUpdateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowStatusUpdateDialog(false)}>
              Update Status
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReligiousGuidanceSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("rituals");
  
  const categories = [
    { id: "rituals", name: "Hajj & Umrah Rituals", icon: <Mosque className="h-4 w-4" /> },
    { id: "prayers", name: "Prayers & Supplications", icon: <Book className="h-4 w-4" /> },
    { id: "locations", name: "Sacred Sites & Locations", icon: <MapPin className="h-4 w-4" /> },
    { id: "preparations", name: "Spiritual Preparations", icon: <CheckCircle2 className="h-4 w-4" /> },
    { id: "etiquette", name: "Behavior & Etiquette", icon: <UserPlus className="h-4 w-4" /> },
    { id: "faq", name: "Frequently Asked Questions", icon: <AlertCircle className="h-4 w-4" /> }
  ];
  
  const ritualGuides = [
    {
      title: "Umrah Step-by-Step Guide",
      description: "Detailed walkthrough of all Umrah rituals",
      type: "PDF",
      language: "Amharic, English, Arabic",
      lastUpdated: "2024-02-15"
    },
    {
      title: "Hajj Comprehensive Guide",
      description: "Complete guide to all Hajj rituals and activities",
      type: "PDF & Video",
      language: "Amharic, English, Arabic",
      lastUpdated: "2024-01-10"
    },
    {
      title: "Tawaf Instructions",
      description: "Proper procedure for performing Tawaf around the Kaaba",
      type: "PDF & Audio",
      language: "Amharic, English",
      lastUpdated: "2024-02-22"
    },
    {
      title: "Sa'i between Safa and Marwa",
      description: "Detailed instructions for completing Sa'i ritual",
      type: "PDF",
      language: "Amharic, English, Arabic",
      lastUpdated: "2024-02-20"
    },
    {
      title: "Proper Ihram Guidelines",
      description: "Instructions for entering the state of Ihram and related prohibitions",
      type: "PDF & Video",
      language: "Amharic, English",
      lastUpdated: "2024-01-25"
    }
  ];
  
  const onlineSessions = [
    {
      title: "Pre-Hajj Orientation",
      date: "2024-04-15",
      time: "18:00 - 20:00",
      instructor: "Sheikh Abdullah Omar",
      language: "Amharic",
      remainingSpots: 15
    },
    {
      title: "Understanding Hajj Rituals",
      date: "2024-04-22",
      time: "19:00 - 21:00",
      instructor: "Sheikh Mohammed Ibrahim",
      language: "Amharic & English",
      remainingSpots: 8
    },
    {
      title: "Q&A Session: Hajj Preparations",
      date: "2024-05-05",
      time: "18:30 - 20:00",
      instructor: "Sheikh Yusuf Ahmed",
      language: "Amharic",
      remainingSpots: 20
    }
  ];

  return (
    <div className="grid gap-6">
      <Card className="border-green-100">
        <CardHeader className="border-b pb-3">
          <CardTitle className="flex items-center">
            <Mosque className="h-5 w-5 text-green-600 mr-2" />
            Religious Guidance Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <div className="font-medium mb-1">Categories</div>
              <div className="space-y-1">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center p-2 rounded-md text-sm ${
                      selectedCategory === category.id
                        ? "bg-green-50 text-green-700 font-medium"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className={`mr-2 ${selectedCategory === category.id ? "text-green-600" : "text-slate-400"}`}>
                      {category.icon}
                    </div>
                    {category.name}
                  </button>
                ))}
              </div>
              
              <div className="border rounded-lg p-3 bg-blue-50 border-blue-100 space-y-2">
                <h3 className="font-medium text-blue-800 flex items-center">
                  <CalendarRange className="h-4 w-4 mr-2 text-blue-600" />
                  Upcoming Online Sessions
                </h3>
                <p className="text-xs text-blue-700">
                  Join our scheduled online sessions to learn more about Hajj and Umrah
                </p>
                <div className="space-y-2 mt-2">
                  {onlineSessions.map((session, index) => (
                    <div key={index} className="bg-white rounded-md p-2 text-sm border border-blue-100">
                      <div className="font-medium">{session.title}</div>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-muted-foreground">{session.date}</span>
                        <span>{session.time}</span>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-blue-600">{session.remainingSpots} spots left</span>
                        <Button size="sm" variant="outline" className="h-7 text-xs">Register</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2">
                  <Button variant="link" size="sm" className="h-auto p-0 text-blue-700">
                    View All Sessions
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="border-b pb-3 mb-4">
                <h2 className="font-medium text-lg">
                  {categories.find(c => c.id === selectedCategory)?.name || "Hajj & Umrah Rituals"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Access guides, videos, and resources for proper religious observance
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ritualGuides.map((guide, index) => (
                  <div key={index} className="border rounded-lg p-3 hover:border-green-200 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{guide.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {guide.description}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-2 whitespace-nowrap">
                        {guide.type}
                      </Badge>
                    </div>
                    <div className="mt-3 pt-3 border-t flex justify-between items-center text-xs text-muted-foreground">
                      <div>
                        <span>Available in: {guide.language}</span>
                      </div>
                      <div>
                        Updated: {guide.lastUpdated}
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button size="sm" variant="outline">
                        Preview
                      </Button>
                      <Button size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-center md:col-span-2 pt-4">
                  <Button variant="outline">
                    View All Resources
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ScrollText className="h-5 w-5 text-amber-600 mr-2" />
              Compliance Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-medium">Before Departure</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="prayer-training" className="rounded border-gray-300" />
                    <label htmlFor="prayer-training" className="text-sm">Complete prayer training</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="ritual-knowledge" className="rounded border-gray-300" />
                    <label htmlFor="ritual-knowledge" className="text-sm">Demonstrate knowledge of rituals</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="ihram-guidelines" className="rounded border-gray-300" />
                    <label htmlFor="ihram-guidelines" className="text-sm">Understand Ihram guidelines</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="orientation" className="rounded border-gray-300" />
                    <label htmlFor="orientation" className="text-sm">Attend pre-departure orientation</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="guide-materials" className="rounded border-gray-300" />
                    <label htmlFor="guide-materials" className="text-sm">Receive guide materials & resources</label>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-medium">During Pilgrimage</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="attend-briefings" className="rounded border-gray-300" />
                    <label htmlFor="attend-briefings" className="text-sm">Attend daily briefings</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="proper-dress" className="rounded border-gray-300" />
                    <label htmlFor="proper-dress" className="text-sm">Maintain proper dress code</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="group-activities" className="rounded border-gray-300" />
                    <label htmlFor="group-activities" className="text-sm">Participate in group activities</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="follow-schedule" className="rounded border-gray-300" />
                    <label htmlFor="follow-schedule" className="text-sm">Follow designated schedule</label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>
                  Save Checklist
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Book className="h-5 w-5 text-indigo-600 mr-2" />
              Mobile Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="h-16 w-16 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                  <Book className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-indigo-900">Hajj & Umrah Mobile App</h3>
                  <p className="text-sm text-indigo-700 mt-1">
                    Download our app for offline access to guides, maps, prayers, and more
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Download for Android
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Download for iOS
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Available Offline Resources</h3>
              
              <div className="border rounded-lg p-3 hover:border-indigo-200 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-indigo-500 mr-2" />
                    <span className="font-medium">Interactive Sacred Sites Map</span>
                  </div>
                  <Badge variant="outline">Map</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Offline map of all important locations in Makkah and Madinah
                </p>
              </div>
              
              <div className="border rounded-lg p-3 hover:border-indigo-200 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Book className="h-4 w-4 text-indigo-500 mr-2" />
                    <span className="font-medium">Dua & Prayer Compilation</span>
                  </div>
                  <Badge variant="outline">Audio & Text</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Essential prayers and supplications with audio pronunciations
                </p>
              </div>
              
              <div className="border rounded-lg p-3 hover:border-indigo-200 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-indigo-500 mr-2" />
                    <span className="font-medium">Step-by-Step Ritual Guides</span>
                  </div>
                  <Badge variant="outline">PDF & Video</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Visual guides for properly performing all rituals
                </p>
              </div>
              
              <div className="pt-2 flex justify-center">
                <Button variant="outline">
                  Browse All Mobile Resources
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function HajjUmrahPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pilgrimageFilter, setPilgrimageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPilgrim, setSelectedPilgrim] = useState<Pilgrim | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [showPhysicalRegistrationDialog, setShowPhysicalRegistrationDialog] = useState(false);

  const filteredPilgrims = pilgrims.filter((pilgrim) => {
    const matchesSearch =
      pilgrim.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pilgrim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pilgrim.passportNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPilgrimage = pilgrimageFilter === "all" || pilgrim.pilgrimage === pilgrimageFilter;
    const matchesStatus = statusFilter === "all" || pilgrim.status === statusFilter;
    
    return matchesSearch && matchesPilgrimage && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Hajj & Umrah Management</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => setShowPhysicalRegistrationDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            In-Person Registration
          </Button>
          <Button onClick={() => setShowRegistrationDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Register Pilgrim
          </Button>
        </div>
      </div>

      <div className="flex overflow-auto pb-2">
        <div className="flex border-b w-full">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "overview"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("visa")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center ${
              activeTab === "visa"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            <FileText className="mr-2 h-4 w-4" />
            Visa Application
          </button>
          <button
            onClick={() => setActiveTab("travel")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center ${
              activeTab === "travel"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Plane className="mr-2 h-4 w-4" />
            Travel Itinerary
          </button>
          <button
            onClick={() => setActiveTab("accommodation")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center ${
              activeTab === "accommodation"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Hotel className="mr-2 h-4 w-4" />
            Accommodation
          </button>
          <button
            onClick={() => setActiveTab("guidance")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center ${
              activeTab === "guidance"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Mosque className="mr-2 h-4 w-4" />
            Religious Guidance
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center ${
              activeTab === "feedback"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            <ScrollText className="mr-2 h-4 w-4" />
            Feedback & Reports
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Enhanced stat cards with gradients, icons and better visuals */}
        <Card className="overflow-hidden border-0 shadow-md">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-1" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Pilgrims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{pilgrims.length}</div>
                <p className="text-xs text-emerald-500 font-medium flex items-center pt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
                  </svg>
                  {pilgrims.filter(p => p.registration?.date.startsWith('2024')).length} this year
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-0 shadow-md">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-1" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Hajj Pilgrims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {pilgrims.filter(p => p.pilgrimage === "Hajj").length}
                </div>
                <p className="text-xs text-green-600 font-medium flex items-center pt-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  For 2024 season
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Mosque className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-0 shadow-md">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-1" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Umrah Pilgrims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {pilgrims.filter(p => p.pilgrimage === "Umrah").length}
                </div>
                <p className="text-xs text-blue-600 font-medium flex items-center pt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  Current season
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Book className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-0 shadow-md">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-1" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Visa Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">98%</div>
                <p className="text-xs text-orange-600 font-medium flex items-center pt-1">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Last 30 days
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {activeTab === "overview" && (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-1">
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search pilgrims by name or ID..."
                className="pl-10 bg-white border border-gray-200 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={pilgrimageFilter} onValueChange={setPilgrimageFilter}>
                <SelectTrigger className="w-36 sm:w-44 bg-white border border-gray-200 shadow-sm">
                  <div className="flex items-center">
                    <Book className="mr-2 h-4 w-4 text-indigo-500" />
                    <SelectValue placeholder="Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Hajj">Hajj</SelectItem>
                  <SelectItem value="Umrah">Umrah</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36 sm:w-44 bg-white border border-gray-200 shadow-sm">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4 text-indigo-500" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Registered">Registered</SelectItem>
                  <SelectItem value="Visa Pending">Visa Pending</SelectItem>
                  <SelectItem value="Visa Approved">Visa Approved</SelectItem>
                  <SelectItem value="Travel Ready">Travel Ready</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="border-0 shadow-md overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[100px] py-3">ID</TableHead>
                      <TableHead className="py-3">Pilgrim</TableHead>
                      <TableHead className="py-3">Type</TableHead>
                      <TableHead className="py-3">Travel Dates</TableHead>
                      <TableHead className="py-3">Documents</TableHead>
                      <TableHead className="py-3">Status</TableHead>
                      <TableHead className="text-right py-3">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPilgrims.map((pilgrim) => (
                      <TableRow key={pilgrim.id} className="hover:bg-gray-50 border-b border-gray-100">
                        <TableCell className="font-medium text-gray-600">
                          #{pilgrim.id.substring(0, 8)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-gray-200">
                              <AvatarImage src={pilgrim.avatar} alt={pilgrim.name} />
                              <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                {pilgrim.name.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="grid gap-0.5">
                              <div className="font-medium">{pilgrim.name}</div>
                              <div className="text-xs text-gray-500">
                                {pilgrim.nationality}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`
                            ${pilgrim.pilgrimage === "Hajj" 
                              ? "bg-green-50 text-green-700 border-green-200" 
                              : "bg-blue-50 text-blue-700 border-blue-200"}
                            px-2.5 py-0.5 rounded-full font-medium text-xs
                          `}>
                            {pilgrim.pilgrimage === "Hajj" ? 
                              <Mosque className="w-3 h-3 mr-1 inline" /> : 
                              <Book className="w-3 h-3 mr-1 inline" />
                            }
                            {pilgrim.pilgrimage}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-gray-500">Departure</span>
                            <span className="text-sm">{pilgrim.travel?.departureDate || "Not set"}</span>
                            <span className="text-xs font-medium text-gray-500 mt-1">Return</span>
                            <span className="text-sm">{pilgrim.travel?.returnDate || "Not set"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-10 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${getDocumentProgressColor(pilgrim.documents?.status)}`} 
                                style={{ width: `${getDocumentProgressPercentage(pilgrim.documents?.status)}%` }}
                              />
                            </div>
                            <span className="ml-2 text-xs text-gray-600">
                              {getDocumentProgressPercentage(pilgrim.documents?.status)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(pilgrim.status)}>
                            {getStatusIcon(pilgrim.status)}
                            <span className="ml-1">{pilgrim.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedPilgrim(pilgrim)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                Documents
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="mr-2 h-4 w-4" />
                                Travel Itinerary
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Departures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pilgrims
                    .filter(p => p.status === "Travel Ready")
                    .map((pilgrim) => (
                      <div key={pilgrim.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>
                              {pilgrim.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{pilgrim.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Group: {pilgrim.travelGroup}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{pilgrim.departureDate}</div>
                          <div className="text-sm text-muted-foreground">
                            {pilgrim.pilgrimage}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accommodation Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pilgrims
                    .filter(p => p.status === "Travel Ready" || p.status === "Visa Approved")
                    .map((pilgrim) => (
                      <div key={pilgrim.id} className="space-y-3 border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{pilgrim.name}</div>
                          <Badge variant="outline">{pilgrim.package}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Makkah</div>
                            <div>{pilgrim.accommodation.makkah}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Madinah</div>
                            <div>{pilgrim.accommodation.madinah}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
      
      {activeTab === "visa" && (
        <VisaTrackingSection pilgrims={pilgrims} />
      )}
      
      {activeTab === "travel" && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Travel Itinerary Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {pilgrims
                  .filter(p => p.itinerary)
                  .map((pilgrim) => (
                    <div key={pilgrim.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>
                              {pilgrim.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{pilgrim.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {pilgrim.passportNumber} • {pilgrim.pilgrimage}
                            </div>
                          </div>
                        </div>
                        <div>
                          <Badge variant="outline">{pilgrim.travelGroup}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border rounded p-3 bg-muted/20">
                          <h4 className="font-medium mb-2 flex items-center">
                            <Plane className="h-4 w-4 mr-2 rotate-45" />
                            Outbound Flight
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="text-muted-foreground">Airline</div>
                              <div>{pilgrim.itinerary?.flightToSaudi.airline}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Flight</div>
                              <div>{pilgrim.itinerary?.flightToSaudi.flightNumber}</div>
                            </div>
                            <div className="col-span-2">
                              <div className="text-muted-foreground">Departure Time</div>
                              <div>{pilgrim.itinerary?.flightToSaudi.departureTime}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded p-3 bg-muted/20">
                          <h4 className="font-medium mb-2 flex items-center">
                            <Plane className="h-4 w-4 mr-2 -rotate-45" />
                            Return Flight
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="text-muted-foreground">Airline</div>
                              <div>{pilgrim.itinerary?.flightFromSaudi.airline}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Flight</div>
                              <div>{pilgrim.itinerary?.flightFromSaudi.flightNumber}</div>
                            </div>
                            <div className="col-span-2">
                              <div className="text-muted-foreground">Departure Time</div>
                              <div>{pilgrim.itinerary?.flightFromSaudi.departureTime}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {activeTab === "accommodation" && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Accommodation Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pilgrims
                  .filter(p => p.status === "Travel Ready" || p.status === "Visa Approved")
                  .map((pilgrim) => (
                    <div key={pilgrim.id} className="space-y-3 border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{pilgrim.name}</div>
                        <Badge variant="outline">{pilgrim.package}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Makkah</div>
                          <div>{pilgrim.accommodation.makkah}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Madinah</div>
                          <div>{pilgrim.accommodation.madinah}</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {activeTab === "guidance" && (
        <ReligiousGuidanceSection />
      )}
      
      {activeTab === "feedback" && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Feedback & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Feedback content placeholder */}
            </CardContent>
          </Card>
        </div>
      )}
      
      <PhysicalRegistrationDialog
        open={showPhysicalRegistrationDialog}
        onOpenChange={setShowPhysicalRegistrationDialog}
        onSave={(data) => {
          console.log("Physical registration data:", data);
          // In a real app, this would call an API to save the data
          setShowPhysicalRegistrationDialog(false);
        }}
      />
    </div>
  );
}

function getStatusClass(status: PilgrimStatus) {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "Processing":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "Completed":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "Cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
}

function getDocumentProgressPercentage(status?: DocumentStatus) {
  switch (status) {
    case "Complete":
      return 100;
    case "Verified":
      return 80;
    case "In Review":
      return 60;
    case "Submitted":
      return 40;
    case "Missing":
      return 20;
    default:
      return 0;
  }
}

function getDocumentProgressColor(status?: DocumentStatus) {
  switch (status) {
    case "Complete":
      return "bg-green-500";
    case "Verified":
      return "bg-blue-500";
    case "In Review":
      return "bg-yellow-500";
    case "Submitted":
      return "bg-purple-500";
    case "Missing":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

function getPilgrimStatusIcon(status: PilgrimStatus) {
  switch (status) {
    case "Active":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "Processing":
      return <RefreshCcw className="h-4 w-4 text-blue-500" />;
    case "Pending":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "Completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "Cancelled":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "Registered":
      return <ClipboardCheck className="h-4 w-4 text-blue-500" />;
    case "Visa Pending":
      return <FileText className="h-4 w-4 text-yellow-500" />;
    case "Visa Approved":
      return <FileCheck className="h-4 w-4 text-green-500" />;
    case "Travel Ready":
      return <Plane className="h-4 w-4 text-blue-500" />;
    case "In Progress":
      return <RotateCw className="h-4 w-4 text-purple-500" />;
    default:
      return <HelpCircle className="h-4 w-4 text-gray-500" />;
  }
}
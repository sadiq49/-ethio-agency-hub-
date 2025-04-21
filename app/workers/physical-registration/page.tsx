"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Camera,
  Fingerprint,
  ScanLine,
  Upload,
  Save,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Globe,
  Building
} from "lucide-react";

// Ethiopian regions and their zones
const ethiopianRegions = {
  "Addis Ababa": [
    "Addis Ketema",
    "Akaky Kaliti",
    "Arada",
    "Bole",
    "Gullele",
    "Kirkos",
    "Kolfe Keranio",
    "Lideta",
    "Nifas Silk-Lafto",
    "Yeka"
  ],
  "Amhara": [
    "Agew Awi",
    "East Gojjam",
    "North Gondar",
    "North Shewa",
    "North Wollo",
    "Oromia",
    "South Gondar",
    "South Wollo",
    "Wag Hemra",
    "West Gojjam"
  ],
  "Oromia": [
    "Arsi",
    "Bale",
    "Borena",
    "East Hararge",
    "East Shewa",
    "East Wellega",
    "Guji",
    "Horo Guduru Wellega",
    "Illubabor",
    "Jimma",
    "North Shewa",
    "Southwest Shewa",
    "West Arsi",
    "West Guji",
    "West Hararge",
    "West Shewa",
    "West Wellega"
  ],
  "Tigray": [
    "Central",
    "Eastern",
    "North Western",
    "Southern",
    "Western",
    "Mekelle"
  ],
  "SNNPR": [
    "Bench Maji",
    "Dawro",
    "Gamo Gofa",
    "Gedeo",
    "Gurage",
    "Hadiya",
    "Kaffa",
    "Kembata Tembaro",
    "Sidama",
    "Silte",
    "South Omo",
    "Wolayita"
  ],
  "Afar": [
    "Zone 1 (Awsi Rasu)",
    "Zone 2 (Kilbet Rasu)",
    "Zone 3 (Gabi Rasu)",
    "Zone 4 (Fantena Rasu)",
    "Zone 5 (Hari Rasu)"
  ],
  "Benishangul-Gumuz": [
    "Assosa",
    "Kamashi",
    "Metekel"
  ],
  "Dire Dawa": ["Dire Dawa City"],
  "Gambela": [
    "Anywaa",
    "Majang",
    "Nuer"
  ],
  "Harari": ["Harari"],
  "Somali": [
    "Afder",
    "Degehabur",
    "Fafan",
    "Gode",
    "Jarar",
    "Korahe",
    "Liben",
    "Nogob",
    "Sitti"
  ]
};

// Sample woredas for demonstration (you would need a complete mapping)
const sampleWoredas = {
  "Addis Ketema": ["Woreda 1", "Woreda 2", "Woreda 3"],
  "Bole": ["Woreda 4", "Woreda 5", "Woreda 6"],
  "Kirkos": ["Woreda 7", "Woreda 8", "Woreda 9"],
  // Add more woredas as needed
};

export default function PhysicalRegistrationPage() {
  const [step, setStep] = useState(1);
  const [registrationMode, setRegistrationMode] = useState("new");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedWoreda, setSelectedWoreda] = useState("");
  const totalSteps = 6;

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    setSelectedZone("");
    setSelectedWoreda("");
  };

  const handleZoneChange = (value: string) => {
    setSelectedZone(value);
    setSelectedWoreda("");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Physical Registration</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Start New Registration
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground pt-1">
              +8 from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Biometrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">5</div>
            <p className="text-xs text-muted-foreground pt-1">
              Awaiting capture
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Document Scans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">156</div>
            <p className="text-xs text-muted-foreground pt-1">
              Documents processed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">19</div>
            <p className="text-xs text-muted-foreground pt-1">
              Fully registered
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registration Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-8">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && (
                  <div 
                    className={`h-1 w-24 ${
                      index < step ? "bg-primary" : "bg-border"
                    }`} 
                  />
                )}
                <div 
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    index + 1 === step
                      ? "border-primary bg-primary text-primary-foreground"
                      : index + 1 < step
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background"
                  }`}
                >
                  {index + 1 < step ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="flex justify-center gap-4">
                <Button
                  variant={registrationMode === "new" ? "default" : "outline"}
                  className="w-40"
                  onClick={() => setRegistrationMode("new")}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  New Worker
                </Button>
                <Button
                  variant={registrationMode === "existing" ? "default" : "outline"}
                  className="w-40"
                  onClick={() => setRegistrationMode("existing")}
                >
                  <ScanLine className="mr-2 h-4 w-4" />
                  Existing ID
                </Button>
              </div>

              {registrationMode === "new" ? (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName">First Name (English)</Label>
                      <Input id="firstName" placeholder="First Name" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="middleName">Middle Name (English)</Label>
                      <Input id="middleName" placeholder="Middle Name" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lastName">Last Name (English)</Label>
                      <Input id="lastName" placeholder="Last Name" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="amharicName">Full Name (Amharic)</Label>
                      <Input id="amharicName" placeholder="Full Name in Amharic" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="grid gap-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input id="dateOfBirth" type="date" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="maritalStatus">Marital Status</Label>
                      <Select>
                        <SelectTrigger id="maritalStatus">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="idNumber">National ID Number</Label>
                      <Input id="idNumber" placeholder="National ID Number" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="idIssueDate">ID Issue Date</Label>
                      <Input id="idIssueDate" type="date" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="scanId">Scan ID Card</Label>
                    <div className="flex gap-2">
                      <Input id="scanId" placeholder="Place ID card on scanner..." readOnly />
                      <Button variant="outline">
                        <ScanLine className="mr-2 h-4 w-4" />
                        Scan
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid gap-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex gap-2">
                      <Input id="phone" placeholder="+251" />
                      <Button variant="outline">
                        <Phone className="mr-2 h-4 w-4" />
                        Verify
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="altPhone">Alternative Phone</Label>
                    <Input id="altPhone" placeholder="+251" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="region">Region</Label>
                    <Select value={selectedRegion} onValueChange={handleRegionChange}>
                      <SelectTrigger id="region">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(ethiopianRegions).map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="zone">Zone/Sub-City</Label>
                    <Select 
                      value={selectedZone} 
                      onValueChange={handleZoneChange}
                      disabled={!selectedRegion}
                    >
                      <SelectTrigger id="zone">
                        <SelectValue placeholder="Select zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedRegion && ethiopianRegions[selectedRegion].map((zone) => (
                          <SelectItem key={zone} value={zone}>
                            {zone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="woreda">Woreda</Label>
                    <Select 
                      value={selectedWoreda} 
                      onValueChange={setSelectedWoreda}
                      disabled={!selectedZone}
                    >
                      <SelectTrigger id="woreda">
                        <SelectValue placeholder="Select woreda" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedZone && sampleWoredas[selectedZone]?.map((woreda) => (
                          <SelectItem key={woreda} value={woreda}>
                            {woreda}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="kebele">Kebele</Label>
                    <Input id="kebele" placeholder="Enter kebele" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="fullAddress">Full Address</Label>
                  <Textarea 
                    id="fullAddress" 
                    placeholder="Enter detailed address including house number if available"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-medium">Photo Capture</h3>
                  <div className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-8 w-8 mx-auto text-muted-foreground" />
                      <Button variant="outline" className="mt-4">
                        Capture Photo
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <ul className="list-disc list-inside space-y-1">
                      <li>White background</li>
                      <li>Neutral expression</li>
                      <li>No head covering</li>
                      <li>Recent photo (within 6 months)</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Fingerprint Capture</h3>
                  <div className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center">
                    <div className="text-center">
                      <Fingerprint className="h-8 w-8 mx-auto text-muted-foreground" />
                      <Button variant="outline" className="mt-4">
                        Capture Fingerprint
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Clean and dry fingers</li>
                      <li>All 10 fingerprints required</li>
                      <li>Clear impressions</li>
                      <li>No cuts or injuries</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Document Scanning & Attachments</h3>
              <div className="grid gap-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Birth Certificate</h4>
                      <p className="text-sm text-muted-foreground">
                        Original birth certificate or age documentation
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <ScanLine className="mr-2 h-4 w-4" />
                        Scan
                      </Button>
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Passport</h4>
                      <p className="text-sm text-muted-foreground">
                        Valid passport with at least 6 months validity
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <ScanLine className="mr-2 h-4 w-4" />
                        Scan
                      </Button>
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Educational Certificates</h4>
                      <p className="text-sm text-muted-foreground">
                        All academic certificates and transcripts
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <ScanLine className="mr-2 h-4 w-4" />
                        Scan
                      </Button>
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Multiple
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Medical Certificate</h4>
                      <p className="text-sm text-muted-foreground">
                        Recent medical examination report
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <ScanLine className="mr-2 h-4 w-4" />
                        Scan
                      </Button>
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Police Clearance</h4>
                      <p className="text-sm text-muted-foreground">
                        Criminal record verification
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <ScanLine className="mr-2 h-4 w-4" />
                        Scan
                      </Button>
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Training Certificates</h4>
                      <p className="text-sm text-muted-foreground">
                        Previous training or skill certificates
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <ScanLine className="mr-2 h-4 w-4" />
                        Scan
                      </Button>
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Multiple
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Interview Video</h4>
                      <p className="text-sm text-muted-foreground">
                        Record or upload worker interview
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button>
                        <Camera className="mr-2 h-4 w-4" />
                        Record Now
                      </Button>
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Video
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="rounded-lg border-2 border-dashed p-8">
                      <div className="text-center">
                        <Camera className="mx-auto h-8 w-8 text-muted-foreground" />
                        <h3 className="mt-2 text-sm font-medium">Interview Recording</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Record a brief interview covering work experience, skills, and expectations
                        </p>
                        <div className="mt-4 flex justify-center gap-2">
                          <Button>Start Recording</Button>
                          <Button variant="outline">Upload Existing</Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Maximum duration: 5 minutes</li>
                        <li>Cover work experience and skills</li>
                        <li>Discuss preferred job type and location</li>
                        <li>Mention language proficiency</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Skills & Preferences</h3>
              <div className="grid gap-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="education">Education Level</Label>
                    <Select>
                      <SelectTrigger id="education">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary School</SelectItem>
                        <SelectItem value="secondary">Secondary School</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="degree">Bachelor's Degree</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="experience">Work Experience</Label>
                    <Select>
                      <SelectTrigger id="experience">
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Experience</SelectItem>
                        <SelectItem value="1-2">1-2 Years</SelectItem>
                        <SelectItem value="2-5">2-5 Years</SelectItem>
                        <SelectItem value="5+">5+ Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="arabic">Arabic Language</Label>
                    <Select>
                      <SelectTrigger id="arabic">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="fluent">Fluent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="english">English Language</Label>
                    <Select>
                      <SelectTrigger id="english">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="fluent">Fluent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="destination">Preferred Destination</Label>
                    <Select>
                      <SelectTrigger id="destination">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saudi">Saudi Arabia</SelectItem>
                        <SelectItem value="uae">UAE</SelectItem>
                        <SelectItem value="kuwait">Kuwait</SelectItem>
                        <SelectItem value="qatar">Qatar</SelectItem>
                        <SelectItem value="bahrain">Bahrain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="jobType">Preferred Job Type</Label>
                    <Select>
                      <SelectTrigger id="jobType">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="housemaid">Housemaid</SelectItem>
                        <SelectItem value="caregiver">Caregiver</SelectItem>
                        <SelectItem value="cook">Cook</SelectItem>
                        <SelectItem value="driver">Driver</SelectItem>
                        <SelectItem value="gardener">Gardener</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  <div>
                    <h4 className="font-medium">Registration Complete</h4>
                    <p className="text-sm text-muted-foreground">
                      All required information and documents have been collected
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Next Steps</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Worker profile created in system
                    </li>
                    <li className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-blue-500" />
                      Schedule for mandatory training
                    </li>
                    <li className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-purple-500" />
                      Begin visa application process
                    </li>
                    <li className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-orange-500" />
                      Submit to MOLS for approval
                    </li>
                  </ul>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Button className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Complete & Print ID
                  </Button>
                  <Button variant="outline" className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register Another
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>
            <Button
              onClick={() => setStep(Math.min(totalSteps, step + 1))}
              disabled={step === totalSteps}
            >
              {step === totalSteps - 1 ? "Complete Registration" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              <div className="rounded-lg border">
                {/* Add pending registrations list */}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <div className="rounded-lg border">
                {/* Add completed registrations list */}
              </div>
            </TabsContent>

            <TabsContent value="issues" className="space-y-4">
              <div className="rounded-lg border">
                {/* Add registrations with issues */}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
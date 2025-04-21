"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem,
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  ArrowRight,
  Save,
  Check,
  Upload,
  MapPin,
  Edit,
  List,
  File,
  FileText,
  FileCheck,
  FileX,
  Video,
  FileMedical,
  Shield,
  Award,
  AlertCircle,
  Eye
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function WorkerRegistrationPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [availableZones, setAvailableZones] = useState<string[]>([]);
  const [availableWoredas, setAvailableWoredas] = useState<string[]>([]);
  const [manualEntry, setManualEntry] = useState(false);
  const [manualRegion, setManualRegion] = useState("");
  const [manualZone, setManualZone] = useState("");
  const [manualWoreda, setManualWoreda] = useState("");

  // Document upload status tracking
  const [uploadStatus, setUploadStatus] = useState({
    passport: { status: "pending", progress: 0 },
    id: { status: "pending", progress: 0 },
    medical: { status: "pending", progress: 0 },
    insurance: { status: "pending", progress: 0 },
    coc: { status: "pending", progress: 0 },
    videoInterview: { status: "pending", progress: 0 }
  });

  // Emergency contact ID document states
  const [emergencyIdUploaded, setEmergencyIdUploaded] = useState(false);
  const [emergencyIdUploading, setEmergencyIdUploading] = useState(false);
  const [emergencyIdProgress, setEmergencyIdProgress] = useState(0);
  const [emergencyIdPreviewOpen, setEmergencyIdPreviewOpen] = useState(false);

  const simulateUpload = (documentType: string) => {
    // Reset status first
    setUploadStatus(prev => ({
      ...prev,
      [documentType]: { status: "uploading", progress: 0 }
    }));

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadStatus(prev => ({
        ...prev,
        [documentType]: { 
          status: progress < 100 ? "uploading" : "complete", 
          progress: progress 
        }
      }));
      
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  };

  // Handle removing the emergency ID
  const handleRemoveEmergencyId = () => {
  // Ethiopian administrative divisions data
  const ethiopianRegions = [
    { value: "addis_ababa", label: "Addis Ababa" },
    { value: "oromia", label: "Oromia" },
    { value: "amhara", label: "Amhara" },
    { value: "tigray", label: "Tigray" },
    { value: "sidama", label: "Sidama" },
    { value: "snnpr", label: "SNNPR" },
    { value: "harari", label: "Harari" },
    { value: "dire_dawa", label: "Dire Dawa" },
    { value: "afar", label: "Afar" },
    { value: "somali", label: "Somali" },
    { value: "benishangul_gumuz", label: "Benishangul-Gumuz" },
    { value: "gambella", label: "Gambella" },
  ];
  
  // Zone data by region
  const zonesByRegion: Record<string, string[]> = {
    addis_ababa: ["Addis Ketema", "Akaky Kaliti", "Arada", "Bole", "Gulele", "Kirkos", "Kolfe Keranio", "Lideta", "Nifas Silk-Lafto", "Yeka"],
    oromia: ["East Hararghe", "West Hararghe", "Arsi", "East Shewa", "West Shewa", "North Shewa", "Southwest Shewa", "Jimma", "Illubabor", "Buno Bedele", "East Wellega", "Horo Guduru Wellega", "Kelem Wellega", "West Wellega", "Borena", "Guji", "West Guji", "North Shewa"],
    amhara: ["North Gondar", "Central Gondar", "South Gondar", "West Gondar", "Awi", "East Gojjam", "West Gojjam", "Wag Hemra", "North Wollo", "South Wollo", "North Shewa", "Oromia Special Zone"],
    tigray: ["Central", "East", "Northwest", "South", "Southeast", "West", "Mekelle"],
    sidama: ["Aleta Wondo", "Aroresa", "Bensa", "Bursa", "Dale", "Dara", "Shebedino", "Wondo Genet"],
    // Add data for other regions as needed
  };
  
  // Woreda data by region and zone
  const woredasByZone: Record<string, Record<string, string[]>> = {
    addis_ababa: {
      "Addis Ketema": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9", "Woreda 10"],
      "Akaky Kaliti": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9"],
      // Add woredas for other zones
    },
    oromia: {
      "East Hararghe": ["Babile", "Bedeno", "Chinaksen", "Deder", "Fadis", "Girawa", "Golo Oda", "Goro Gutu", "Gursum", "Haramaya", "Jarso", "Kersa", "Kombolcha", "Kurfa Chele", "Malka Balo", "Metta", "Midega Tola"],
      "West Hararghe": ["Anchar", "Boke", "Chiro Zuria", "Daro Lebu", "Doba", "Gemechis", "Guba Koricha", "Habro", "Mesela", "Mieso", "Tulo"],
      // Add woredas for other zones
    },
    // Add data for other regions and zones
  };
  
  useEffect(() => {
    if (selectedRegion) {
      setAvailableZones(zonesByRegion[selectedRegion] || []);
      setSelectedZone("");
      setAvailableWoredas([]);
    }
  }, [selectedRegion]);
  
  useEffect(() => {
    if (selectedRegion && selectedZone) {
      setAvailableWoredas(woredasByZone[selectedRegion]?.[selectedZone] || []);
    }
  }, [selectedRegion, selectedZone]);

  const goToNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle emergency ID upload
  const handleEmergencyIdUpload = () => {
    setEmergencyIdUploading(true);
    setEmergencyIdProgress(0);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setEmergencyIdProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setEmergencyIdUploading(false);
        setEmergencyIdUploaded(true);
      }
    }, 100);
  };
  
  // Handle removing the emergency ID
  const handleRemoveEmergencyId = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Worker Registration</h1>
      </div>

      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Register New Worker</CardTitle>
                <CardDescription>
                  Enter the worker's details to register them in the system
                </CardDescription>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <div key={index} className="flex items-center">
                      {index > 0 && (
                        <div className={`h-0.5 w-6 ${index < step ? "bg-primary" : "bg-border"}`} />
                      )}
                      <div 
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                          index + 1 === step
                            ? "bg-primary text-primary-foreground"
                            : index + 1 < step
                            ? "bg-primary text-primary-foreground"
                            : "bg-border text-muted-foreground"
                        }`}
                      >
                        {index + 1 < step ? <Check className="h-3 w-3" /> : index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Basic personal details of the worker
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="First Name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input id="middleName" placeholder="Middle Name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Last Name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Select>
                      <SelectTrigger id="maritalStatus">
                        <SelectValue placeholder="Select" />
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
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Contact details and residence information
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="laborId">Labor ID Number</Label>
                    <Input id="laborId" placeholder="Labor ID Number" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+251..." />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input id="email" type="email" placeholder="email@example.com" />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-base">Location Information</Label>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="manualSwitch" className="text-sm flex items-center">
                          <List className="mr-1 h-4 w-4 text-blue-600" />
                          Use Dropdown
                        </Label>
                        <Switch 
                          id="manualSwitch" 
                          checked={manualEntry}
                          onCheckedChange={setManualEntry}
                        />
                        <Label htmlFor="manualSwitch" className="text-sm flex items-center">
                          <Edit className="mr-1 h-4 w-4 text-green-600" />
                          Manual Entry
                        </Label>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 mb-4">
                      <div className="flex items-center text-sm text-blue-700 mb-2">
                        <MapPin className="mr-2 h-4 w-4" />
                        {manualEntry ? 
                          "Manually enter your region, zone, and woreda information" : 
                          "Select your region, zone, and woreda from the dropdown lists"}
                      </div>
                    </div>
                  </div>
                  
                  {manualEntry ? (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="manualRegion">Region</Label>
                        <Input 
                          id="manualRegion" 
                          placeholder="Enter your region" 
                          value={manualRegion}
                          onChange={(e) => setManualRegion(e.target.value)}
                          className="border-green-200 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="manualZone">Zone</Label>
                        <Input 
                          id="manualZone" 
                          placeholder="Enter your zone" 
                          value={manualZone}
                          onChange={(e) => setManualZone(e.target.value)}
                          className="border-green-200 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="manualWoreda">Woreda</Label>
                        <Input 
                          id="manualWoreda" 
                          placeholder="Enter your woreda" 
                          value={manualWoreda}
                          onChange={(e) => setManualWoreda(e.target.value)}
                          className="border-green-200 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="region">Region</Label>
                        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                          <SelectTrigger id="region" className="border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Regions of Ethiopia</SelectLabel>
                              {ethiopianRegions.map((region) => (
                                <SelectItem key={region.value} value={region.value}>{region.label}</SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="zone">Zone</Label>
                        <Select value={selectedZone} onValueChange={setSelectedZone} disabled={!selectedRegion}>
                          <SelectTrigger id="zone" className="border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder={selectedRegion ? "Select zone" : "Select region first"} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableZones.length > 0 ? (
                              <SelectGroup>
                                <SelectLabel>Zones in {ethiopianRegions.find(r => r.value === selectedRegion)?.label}</SelectLabel>
                                {availableZones.map((zone: string) => (
                                  <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                                ))}
                              </SelectGroup>
                            ) : (
                              <div className="p-2 text-sm text-center text-muted-foreground">
                                {selectedRegion ? "No zones found for this region" : "Select a region first"}
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="woreda">Woreda</Label>
                        <Select disabled={!selectedZone}>
                          <SelectTrigger id="woreda" className="border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder={selectedZone ? "Select woreda" : "Select zone first"} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableWoredas.length > 0 ? (
                              <SelectGroup>
                                <SelectLabel>Woredas in {selectedZone}</SelectLabel>
                                {availableWoredas.map((woreda: string) => (
                                  <SelectItem key={woreda} value={woreda}>{woreda}</SelectItem>
                                ))}
                              </SelectGroup>
                            ) : (
                              <div className="p-2 text-sm text-center text-muted-foreground">
                                {selectedZone ? "No woredas found for this zone" : "Select a zone first"}
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                  
                  <div className="grid gap-2">
                    <Label htmlFor="kebele">Kebele</Label>
                    <Input id="kebele" placeholder="Kebele" className="border-blue-200 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Passport Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Passport details for international travel
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="passportNumber">Passport Number</Label>
                    <Input id="passportNumber" placeholder="EP123456789" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="issueDate">Issue Date</Label>
                    <Input id="issueDate" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input id="expiryDate" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="issuingAuthority">Issuing Authority</Label>
                    <Input id="issuingAuthority" placeholder="e.g., Ethiopian Immigration" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="placeOfIssue">Place of Issue</Label>
                    <Input id="placeOfIssue" placeholder="e.g., Addis Ababa" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="passportCopy">Passport Copy</Label>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" className="w-full" type="button">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Passport
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Emergency Contact</h3>
                  <p className="text-sm text-muted-foreground">
                    Person to contact in case of emergency
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="emergencyName">Full Name</Label>
                    <Input id="emergencyName" placeholder="Emergency Contact Name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="emergencyRelationship">Relationship</Label>
                    <Select>
                      <SelectTrigger id="emergencyRelationship">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="relative">Other Relative</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="emergencyPhone">Phone Number</Label>
                    <Input id="emergencyPhone" placeholder="+251..." />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="emergencyAltPhone">Alternative Phone (Optional)</Label>
                    <Input id="emergencyAltPhone" placeholder="+251..." />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="emergencyEmail">Email (Optional)</Label>
                    <Input id="emergencyEmail" type="email" placeholder="email@example.com" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="emergencyAddress">Address</Label>
                    <Input id="emergencyAddress" placeholder="Full address" />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Emergency Contact ID</h4>
                    <div className="flex items-center space-x-2">
                      {emergencyIdUploaded ? (
                        <div className="flex items-center text-green-600 text-xs">
                          <Check className="h-3.5 w-3.5 mr-1" />
                          <span>Uploaded</span>
                        </div>
                      ) : (
                        <div className="text-amber-600 text-xs flex items-center">
                          <AlertCircle className="h-3.5 w-3.5 mr-1" />
                          <span>Required</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <File className="mt-0.5 h-5 w-5 text-blue-600 mr-3" />
                        <div>
                          <p className="text-sm font-medium">Valid ID Proof</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Upload a copy of your emergency contact's ID document (national ID, 
                            passport, or driver's license)
                          </p>
                        </div>
                      </div>
                      
                      {emergencyIdUploading ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Uploading...</span>
                            <span>{emergencyIdProgress}%</span>
                          </div>
                          <Progress value={emergencyIdProgress} className="h-2" />
                        </div>
                      ) : emergencyIdUploaded ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileCheck className="h-5 w-5 text-green-600 mr-2" />
                            <span className="text-sm">emergency-contact-id.jpg</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-blue-600"
                              onClick={() => setEmergencyIdPreviewOpen(true)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-500"
                              onClick={handleRemoveEmergencyId}
                            >
                              <FileX className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={handleEmergencyIdUpload}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload ID Document
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    The ID document is required to verify the identity of the emergency contact person.
                    This helps ensure proper communication in case of emergencies.
                  </p>
                </div>
              </div>
            )}
            
            {step === 5 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Skills & Preferences</h3>
                  <p className="text-sm text-muted-foreground">
                    Worker skills and job preferences
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Skill Level</Label>
                    <RadioGroup defaultValue="semi-skilled" className="grid grid-cols-3 gap-4">
                      <div>
                        <RadioGroupItem
                          value="skilled"
                          id="skilled"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="skilled"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span className="mb-1 font-medium">Skilled</span>
                          <span className="text-xs">Specialized training</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem
                          value="semi-skilled"
                          id="semi-skilled"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="semi-skilled"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span className="mb-1 font-medium">Semi-Skilled</span>
                          <span className="text-xs">Some training</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem
                          value="unskilled"
                          id="unskilled"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="unskilled"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span className="mb-1 font-medium">Unskilled</span>
                          <span className="text-xs">No formal training</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="preferredDestination">Preferred Destination</Label>
                    <Select>
                      <SelectTrigger id="preferredDestination">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saudi_arabia">Saudi Arabia</SelectItem>
                        <SelectItem value="dubai">Dubai (UAE)</SelectItem>
                        <SelectItem value="qatar">Qatar</SelectItem>
                        <SelectItem value="kuwait">Kuwait</SelectItem>
                        <SelectItem value="bahrain">Bahrain</SelectItem>
                        <SelectItem value="jordan">Jordan</SelectItem>
                        <SelectItem value="lebanon">Lebanon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="languageProficiency">Language Proficiency</Label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="arabic" className="text-sm">Arabic</Label>
                        <Select>
                          <SelectTrigger id="arabic">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="fluent">Fluent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="english" className="text-sm">English</Label>
                        <Select>
                          <SelectTrigger id="english">
                            <SelectValue placeholder="Select" />
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
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="previousExperience">Previous Related Experience</Label>
                    <Tabs defaultValue="none">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="none">No Experience</TabsTrigger>
                        <TabsTrigger value="yes">Has Experience</TabsTrigger>
                      </TabsList>
                      <TabsContent value="none">
                        <div className="py-4 text-center text-sm text-muted-foreground">
                          No previous experience will be recorded.
                        </div>
                      </TabsContent>
                      <TabsContent value="yes" className="space-y-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="employerName">Employer Name</Label>
                          <Input id="employerName" placeholder="Previous employer name" />
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <div className="grid gap-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input id="startDate" type="date" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input id="endDate" type="date" />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="country">Country</Label>
                          <Select>
                            <SelectTrigger id="country">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="saudi_arabia">Saudi Arabia</SelectItem>
                              <SelectItem value="uae">UAE</SelectItem>
                              <SelectItem value="qatar">Qatar</SelectItem>
                              <SelectItem value="kuwait">Kuwait</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={step === 1}
            >
              Previous
            </Button>
            <Button
              onClick={step === totalSteps ? undefined : goToNextStep}
              className={step === totalSteps ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {step === totalSteps ? (
                <>Submit Registration <Check className="ml-2 h-4 w-4" /></>
              ) : (
                <>Continue <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
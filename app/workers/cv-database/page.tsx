"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter, 
  Download, 
  Star, 
  StarOff, 
  Eye, 
  Lock,
  Share2,
  FileText,
  Languages,
  Briefcase,
  GraduationCap,
  Video,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Worker {
  id: string;
  name: string;
  age: number;
  gender: string;
  experience: string;
  destination: string;
  skillLevel: string;
  languages: string[];
  education: string;
  training: string;
  documents: {
    cv: boolean;
    passport: boolean;
    certificates: boolean;
  };
  hasVideo: boolean;
  videoUrl?: string; // URL to video interview
  photo?: string; // URL to profile photo
  reserved: boolean;
  reservedBy?: string;
  reservedUntil?: Date;
  rating?: number;
  attachments?: {
    name: string;
    type: string;
    url: string;
  }[];
  notes?: string;
  status?: string;
  availability?: string;
}

const sampleWorkers: Worker[] = [
  {
    id: "W1001",
    name: "Maria Garcia",
    age: 28,
    gender: "Female",
    experience: "5 years",
    destination: "UAE",
    skillLevel: "Experienced",
    languages: ["English", "Spanish", "Arabic"],
    education: "Nursing Degree",
    training: "Healthcare Assistant",
    documents: {
      cv: true,
      passport: true,
      certificates: true,
    },
    hasVideo: true,
    videoUrl: "/videos/maria_interview.mp4",
    photo: "/images/workers/maria.jpg",
    reserved: false,
    rating: 4.8,
    attachments: [
      { name: "Reference Letter", type: "PDF", url: "/docs/maria_reference.pdf" },
      { name: "Training Certificate", type: "PDF", url: "/docs/maria_cert.pdf" },
    ],
    notes: "Excellent communication skills. Available for immediate deployment.",
    status: "Available",
    availability: "Immediate"
  },
  {
    id: "W1002",
    name: "John Smith",
    age: 32,
    gender: "Male",
    experience: "7 years",
    destination: "Qatar",
    skillLevel: "Expert",
    languages: ["English", "Filipino"],
    education: "Vocational",
    training: "Elderly Care",
    documents: {
      cv: true,
      passport: true,
      certificates: true,
    },
    hasVideo: true,
    videoUrl: "/videos/john_interview.mp4",
    photo: "/images/workers/john.jpg",
    reserved: true,
    reservedBy: "Al Shifa Hospital",
    reservedUntil: new Date("2023-12-30"),
    rating: 4.5,
    status: "Reserved",
    availability: "January 2024"
  },
  {
    id: "W1003",
    name: "Aisha Ahmed",
    age: 26,
    gender: "Female",
    experience: "3 years",
    destination: "Saudi Arabia",
    skillLevel: "Intermediate",
    languages: ["English", "Arabic"],
    education: "High School",
    training: "Home Care",
    documents: {
      cv: true,
      passport: false,
      certificates: true,
    },
    hasVideo: false,
    photo: "/images/workers/aisha.jpg",
    reserved: false,
    rating: 4.2,
    notes: "Passport in process. Expected within 2 weeks.",
    status: "Pending Documentation",
    availability: "2 weeks"
  },
  {
    id: "W1004",
    name: "David Chen",
    age: 30,
    gender: "Male",
    experience: "4 years",
    destination: "Kuwait",
    skillLevel: "Experienced",
    languages: ["English", "Mandarin", "Cantonese"],
    education: "Bachelor's Degree",
    training: "Specialized Care",
    documents: {
      cv: true,
      passport: true,
      certificates: true,
    },
    hasVideo: true,
    videoUrl: "/videos/david_interview.mp4",
    photo: "/images/workers/david.jpg",
    reserved: false,
    rating: 4.9,
    attachments: [
      { name: "Previous Employment Records", type: "PDF", url: "/docs/david_employment.pdf" }
    ],
    status: "Available",
    availability: "Immediate"
  },
  {
    id: "W1005",
    name: "Fatima Khan",
    age: 29,
    gender: "Female",
    experience: "6 years",
    destination: "Bahrain",
    skillLevel: "Expert",
    languages: ["English", "Urdu", "Arabic"],
    education: "Nursing Diploma",
    training: "Geriatric Care",
    documents: {
      cv: true,
      passport: true,
      certificates: true,
    },
    hasVideo: true,
    videoUrl: "/videos/fatima_interview.mp4",
    photo: "/images/workers/fatima.jpg",
    reserved: true,
    reservedBy: "Royal Care Medical Center",
    reservedUntil: new Date("2023-11-15"),
    rating: 4.7,
    status: "Reserved",
    availability: "December 2023"
  }
];

const getSkillLevelColor = (skillLevel: string) => {
  switch (skillLevel) {
    case "Skilled":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Semi-Skilled":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Unskilled":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

export default function CVDatabasePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [showReserved, setShowReserved] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const filteredWorkers = sampleWorkers.filter((worker) => {
    const matchesSearch = 
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkill = skillFilter === "all" || worker.skillLevel === skillFilter;
    const matchesLanguage = languageFilter === "all" || 
      worker.languages.some(lang => lang.toLowerCase().includes(languageFilter.toLowerCase()));
    
    const matchesReservation = showReserved || !worker.reserved;
    
    return matchesSearch && matchesSkill && matchesLanguage && matchesReservation;
  });

  const generateShareableLink = (workerId: string) => {
    // In production, this would generate a secure, temporary link
    return `https://agency-hub.com/cv/${workerId}?token=temp`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">CV Database</h1>
            <p className="text-sm text-blue-100 mt-1">Browse, reserve and share worker profiles with clients</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">
              <Download className="mr-2 h-4 w-4" />
              Export List
            </Button>
            <Button variant="secondary">
              <Share2 className="mr-2 h-4 w-4" />
              Share Database
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Workers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground pt-1">
              +123 this month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">892</div>
            <p className="text-xs text-muted-foreground pt-1">
              Ready for deployment
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">
              Reserved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">342</div>
            <p className="text-xs text-muted-foreground pt-1">
              By various agents
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Deployment Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">78%</div>
            <p className="text-xs text-muted-foreground pt-1">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="w-full md:w-72 space-y-2">
              <Label htmlFor="search-workers">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-workers"
                  type="search"
                  placeholder="Search by name or ID..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
              <div className="space-y-2">
                <Label htmlFor="skill-filter">Skill Level</Label>
                <Select value={skillFilter} onValueChange={setSkillFilter}>
                  <SelectTrigger id="skill-filter">
                    <SelectValue placeholder="Skill Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Skills</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                    <SelectItem value="Experienced">Experienced</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Skilled">Skilled</SelectItem>
                    <SelectItem value="Semi-Skilled">Semi-Skilled</SelectItem>
                    <SelectItem value="Unskilled">Unskilled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language-filter">Language</Label>
                <Select value={languageFilter} onValueChange={setLanguageFilter}>
                  <SelectTrigger id="language-filter">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    <SelectItem value="Arabic">Arabic</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Filipino">Filipino</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                    <SelectItem value="Urdu">Urdu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="availability-filter">Availability</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="availability-filter">
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Availability</SelectItem>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="within-2-weeks">Within 2 Weeks</SelectItem>
                    <SelectItem value="within-month">Within a Month</SelectItem>
                    <SelectItem value="future">Future Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reservation-filter">Reservation</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="show-available" 
                      checked={true}
                      disabled
                    />
                    <label
                      htmlFor="show-available"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Available
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="show-reserved" 
                      checked={showReserved}
                      onCheckedChange={() => setShowReserved(!showReserved)}
                    />
                    <label
                      htmlFor="show-reserved"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Reserved
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredWorkers.map((worker) => (
              <Card key={worker.id} className={`h-full relative transition-all duration-150 ${
                worker.reserved ? "opacity-90 hover:opacity-100" : "hover:shadow-md"
              }`}>
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="relative">
                    {worker.reserved && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                        <div className="flex flex-col items-center p-4">
                          <Lock className="h-8 w-8 text-amber-500 mb-2" />
                          <div className="bg-white px-4 py-2 rounded-md shadow-sm text-center">
                            <p className="text-sm font-medium">
                              Reserved by {worker.reservedBy}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Until {worker.reservedUntil?.toLocaleDateString() || 'N/A'}
                            </p>
                            <Button 
                              variant="link" 
                              className="text-xs p-0 h-auto mt-1 text-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedWorker(worker);
                              }}
                            >
                              View Details →
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="relative h-48 overflow-hidden border-b">
                      {worker.photo ? (
                        <img 
                          src={worker.photo} 
                          alt={worker.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                          <Avatar className="h-24 w-24">
                            <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                              {worker.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                      
                      {worker.status && (
                        <div className="absolute top-2 left-2">
                          <Badge className={
                            worker.status === "Available" ? "bg-green-100 text-green-800" :
                            worker.status === "Reserved" ? "bg-amber-100 text-amber-800" :
                            "bg-blue-100 text-blue-800"
                          }>
                            {worker.status}
                          </Badge>
                        </div>
                      )}
                      
                      {worker.hasVideo && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="outline" className="bg-white/80">
                            <Video className="h-3 w-3 mr-1 text-blue-500" /> Video
                          </Badge>
                        </div>
                      )}
                      
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex justify-between items-end">
                        <div>
                          <h3 className="font-medium text-white">{worker.name}</h3>
                          <p className="text-xs text-white/80">{worker.id}</p>
                        </div>
                        <div className="flex">
                          {worker.rating !== undefined && (
                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/20">
                              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" /> 
                              <span className="text-xs text-white">{worker.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="space-y-4 flex-1">
                        <div className="flex flex-wrap gap-1">
                          <Badge className={getSkillLevelColor(worker.skillLevel)}>
                            {worker.skillLevel}
                          </Badge>
                          {worker.languages.slice(0, 2).map((language, index) => (
                            <Badge key={index} variant="outline">
                              {language}
                            </Badge>
                          ))}
                          {worker.languages.length > 2 && (
                            <Badge variant="outline">
                              +{worker.languages.length - 2}
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">{worker.experience === "None" ? "No experience" : worker.experience}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">{worker.education}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Documents</span>
                            <span>{Object.values(worker.documents).filter(Boolean).length}/3</span>
                          </div>
                          <Progress 
                            value={Object.values(worker.documents).filter(Boolean).length / 3 * 100} 
                            className="h-2"
                          />
                          <div className="flex justify-between">
                            <div className="flex gap-1">
                              <div className="flex items-center" title="CV">
                                {worker.documents.cv ? 
                                  <CheckCircle2 className="h-3 w-3 text-green-500" /> :
                                  <AlertCircle className="h-3 w-3 text-muted-foreground" />
                                }
                              </div>
                              <div className="flex items-center" title="Passport">
                                {worker.documents.passport ? 
                                  <CheckCircle2 className="h-3 w-3 text-green-500" /> :
                                  <AlertCircle className="h-3 w-3 text-muted-foreground" />
                                }
                              </div>
                              <div className="flex items-center" title="Certificates">
                                {worker.documents.certificates ? 
                                  <CheckCircle2 className="h-3 w-3 text-green-500" /> :
                                  <AlertCircle className="h-3 w-3 text-muted-foreground" />
                                }
                              </div>
                            </div>
                            {worker.availability && (
                              <Badge variant="outline" className="text-xs h-5">
                                {worker.availability}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button 
                          className="flex-1"
                          onClick={() => setSelectedWorker(worker)}
                        >
                          View Profile
                        </Button>
                        {!worker.reserved && (
                          <Button variant="outline" className="flex-1">
                            Reserve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="space-y-4">
          <div className="grid gap-2">
            {filteredWorkers.map((worker) => (
              <Card key={worker.id} className={worker.reserved ? "opacity-70" : ""}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={worker.photo} alt={worker.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {worker.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{worker.name}</h3>
                          <span className="text-xs text-muted-foreground">{worker.id}</span>
                          {worker.reserved && (
                            <Badge variant="outline" className="bg-muted">
                              <Lock className="mr-1 h-3 w-3" /> Reserved
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge className={getSkillLevelColor(worker.skillLevel)}>
                            {worker.skillLevel}
                          </Badge>
                          {worker.languages.map((language, index) => (
                            <Badge key={index} variant="outline">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex sm:ml-auto gap-2">
                      <Button 
                        size="sm"
                        onClick={() => setSelectedWorker(worker)}
                      >
                        View Profile
                      </Button>
                      {!worker.reserved && (
                        <Button variant="outline" size="sm">
                          Reserve
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedWorker} onOpenChange={() => setSelectedWorker(null)}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Worker Profile</DialogTitle>
            <DialogDescription>
              Review detailed information and documents
            </DialogDescription>
          </DialogHeader>
          {selectedWorker && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Photo and Basic Info */}
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden aspect-[3/4] bg-slate-100 shadow-sm border">
                    {selectedWorker.photo ? (
                      <img 
                        src={selectedWorker.photo} 
                        alt={selectedWorker.name} 
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Avatar className="h-32 w-32">
                          <AvatarFallback className="text-4xl">
                            {selectedWorker.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    {selectedWorker.reserved && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                          <Lock className="h-3 w-3" /> Reserved
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">ID:</span>
                        <span className="text-sm font-medium">{selectedWorker.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Age:</span>
                        <span className="text-sm font-medium">{selectedWorker.age} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Gender:</span>
                        <span className="text-sm font-medium">{selectedWorker.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Availability:</span>
                        <span className="text-sm font-medium">{selectedWorker.availability || "Immediate"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge className={selectedWorker.reserved ? 
                          "bg-yellow-100 text-yellow-800" : 
                          "bg-green-100 text-green-800"
                        }>
                          {selectedWorker.status || (selectedWorker.reserved ? "Reserved" : "Available")}
                        </Badge>
                      </div>
                      {selectedWorker.reserved && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Reserved By:</span>
                            <span className="text-sm font-medium">{selectedWorker.reservedBy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Until:</span>
                            <span className="text-sm font-medium">
                              {selectedWorker.reservedUntil?.toLocaleDateString() || 'N/A'}
                            </span>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Rating */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Rating & Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-5 w-5 ${i < (selectedWorker.rating || 0) 
                                ? "text-yellow-500 fill-yellow-500" 
                                : "text-gray-200"}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{selectedWorker.rating || 0}/5</span>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-sm text-muted-foreground">Skill Level:</span>
                        <Badge className={getSkillLevelColor(selectedWorker.skillLevel)}>
                          {selectedWorker.skillLevel}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-sm text-muted-foreground">Languages:</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedWorker.languages.map((language, index) => (
                            <Badge key={index} variant="outline">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Middle Column - Experience and Documents */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Experience & Qualifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-1">Experience</h3>
                        <p className="text-sm">{selectedWorker.experience}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1">Education</h3>
                        <p className="text-sm">{selectedWorker.education}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1">Training</h3>
                        <p className="text-sm">{selectedWorker.training}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-1">Destination</h3>
                        <p className="text-sm">{selectedWorker.destination}</p>
                      </div>
                      
                      {selectedWorker.notes && (
                        <div>
                          <h3 className="text-sm font-medium mb-1">Additional Notes</h3>
                          <p className="text-sm">{selectedWorker.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">CV</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedWorker.documents.cv ? (
                              <Badge className="bg-green-100 text-green-800">Available</Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">Missing</Badge>
                            )}
                            {selectedWorker.documents.cv && (
                              <Button size="sm" variant="outline">
                                <Eye className="h-3.5 w-3.5 mr-1" /> View
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Passport</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedWorker.documents.passport ? (
                              <Badge className="bg-green-100 text-green-800">Available</Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">Missing</Badge>
                            )}
                            {selectedWorker.documents.passport && (
                              <Button size="sm" variant="outline">
                                <Eye className="h-3.5 w-3.5 mr-1" /> View
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-purple-500" />
                            <span className="text-sm">Certificates</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedWorker.documents.certificates ? (
                              <Badge className="bg-green-100 text-green-800">Available</Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">Missing</Badge>
                            )}
                            {selectedWorker.documents.certificates && (
                              <Button size="sm" variant="outline">
                                <Eye className="h-3.5 w-3.5 mr-1" /> View
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {selectedWorker.attachments && selectedWorker.attachments.length > 0 && (
                          <div className="mt-4">
                            <h3 className="text-sm font-medium mb-2">Additional Attachments</h3>
                            <div className="space-y-2">
                              {selectedWorker.attachments.map((attachment, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-orange-500" />
                                    <span className="text-sm">{attachment.name}</span>
                                  </div>
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                                    </a>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Right Column - Video and Actions */}
                <div className="space-y-4">
                  {selectedWorker.hasVideo && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Video Interview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md overflow-hidden bg-slate-100 aspect-video relative">
                          {selectedWorker.videoUrl ? (
                            <video 
                              controls 
                              className="w-full h-full"
                              poster="/images/video-placeholder.jpg"
                            >
                              <source src={selectedWorker.videoUrl} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
                              <Video className="h-8 w-8 text-blue-500" />
                              <p className="text-sm text-muted-foreground">Video available upon request</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Agent Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full" onClick={() => setShareDialogOpen(true)}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Profile
                      </Button>
                      
                      <Button className="w-full" variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Download CV
                      </Button>
                      
                      {!selectedWorker.reserved ? (
                        <Button className="w-full" variant="secondary">
                          <UserCheck className="mr-2 h-4 w-4" />
                          Reserve Worker
                        </Button>
                      ) : (
                        <Button className="w-full" variant="destructive" disabled={selectedWorker.reservedBy !== "Your Agency"}>
                          <Lock className="mr-2 h-4 w-4" />
                          Release Reservation
                        </Button>
                      )}
                      
                      <div className="pt-4">
                        <h3 className="text-sm font-medium mb-2">Reservation Terms</h3>
                        <p className="text-xs text-muted-foreground">
                          Reserving a worker profile makes it exclusive to your agency for 7 days. 
                          Other agents will be unable to reserve this worker during this period.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Activity History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                        <div className="flex gap-2 items-start">
                          <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5"></div>
                          <div>
                            <p className="text-xs">Profile viewed by Al Safwa Agency</p>
                            <p className="text-xs text-muted-foreground">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex gap-2 items-start">
                          <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5"></div>
                          <div>
                            <p className="text-xs">CV downloaded by Dubai Employment</p>
                            <p className="text-xs text-muted-foreground">Yesterday</p>
                          </div>
                        </div>
                        <div className="flex gap-2 items-start">
                          <div className="h-2 w-2 rounded-full bg-yellow-500 mt-1.5"></div>
                          <div>
                            <p className="text-xs">Profile added to database</p>
                            <p className="text-xs text-muted-foreground">3 days ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedWorker(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Share Worker Profile</DialogTitle>
            <DialogDescription>
              Generate a secure link to share this profile with agents or clients
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Tabs defaultValue="link" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="link">Secure Link</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
              </TabsList>
              
              <TabsContent value="link" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="expiry">Link Expiry</Label>
                    <Select defaultValue="7days">
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select expiry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24hours">24 Hours</SelectItem>
                        <SelectItem value="3days">3 Days</SelectItem>
                        <SelectItem value="7days">7 Days</SelectItem>
                        <SelectItem value="30days">30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="password-protected" />
                    <Label htmlFor="password-protected">Password Protected</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="hide-contact" defaultChecked />
                    <Label htmlFor="hide-contact">Hide Contact Information</Label>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={selectedWorker ? generateShareableLink(selectedWorker.id) : ''}
                  />
                  <Button variant="outline" onClick={() => {
                    if (selectedWorker) {
                      navigator.clipboard.writeText(generateShareableLink(selectedWorker.id));
                      toast.success("Link copied to clipboard");
                    }
                  }}>
                    Copy
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Share2 className="mr-2 h-4 w-4" />
                    Generate & Copy
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="email" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Email</Label>
                  <Input id="recipient" placeholder="agent@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    defaultValue={selectedWorker ? `Worker Profile: ${selectedWorker.name} (${selectedWorker.id})` : 'Worker Profile'} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Input
                    id="message"
                    placeholder="Add a personal message"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="attach-cv" defaultChecked />
                    <Label htmlFor="attach-cv">Attach CV</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="include-link" defaultChecked />
                    <Label htmlFor="include-link">Include Profile Link</Label>
                  </div>
                </div>
                
                <Button className="w-full">
                  Send Email
                </Button>
              </TabsContent>
            </Tabs>
            
            <div className="space-y-2 bg-blue-50 p-3 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Secure Sharing</h4>
                  <p className="text-xs text-blue-800 mt-1">
                    When shared, the recipient can view basic information, but certain actions like reservation are disabled.
                    Each profile view is tracked for security purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
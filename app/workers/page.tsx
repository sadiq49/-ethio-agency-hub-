"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Filter, 
  ArrowUpDown, 
  Search, 
  User, 
  Users, 
  Globe, 
  Calendar, 
  MapPin,
  FileText,
  UserPlus,
  LayoutGrid,
  Eye,
  Pencil,
  Clock,
  CheckCircle,
  Stethoscope,
  Plane,
  UsersRound,
  FileCheck,
  Database,
  GraduationCap,
  BadgeCheck,
  ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Worker {
  id: string;
  name: string;
  passport: string;
  destination: string;
  status: string;
  gender: string;
  age: number;
  region: string;
  registeredDate: string;
}

const workers: Worker[] = [
  {
    id: "W1001",
    name: "Fatima Omar",
    passport: "EP1234567",
    destination: "Saudi Arabia",
    status: "Abroad",
    gender: "Female",
    age: 28,
    region: "Addis Ababa",
    registeredDate: "2023-01-15",
  },
  {
    id: "W1002",
    name: "Aisha Mohammed",
    passport: "EP7654321",
    destination: "Dubai",
    status: "In Process",
    gender: "Female",
    age: 25,
    region: "Amhara",
    registeredDate: "2023-02-22",
  },
  {
    id: "W1003",
    name: "Sara Ahmed",
    passport: "EP8765432",
    destination: "Qatar",
    status: "Waiting",
    gender: "Female",
    age: 30,
    region: "Oromia",
    registeredDate: "2023-03-05",
  },
  {
    id: "W1004",
    name: "Zainab Hassan",
    passport: "EP2345678",
    destination: "Kuwait",
    status: "Today Flying",
    gender: "Female",
    age: 27,
    region: "Harari",
    registeredDate: "2023-03-12",
  },
  {
    id: "W1005",
    name: "Mariam Ali",
    passport: "EP3456789",
    destination: "Jordan",
    status: "Visa Approved",
    gender: "Female",
    age: 24,
    region: "Dire Dawa",
    registeredDate: "2023-04-01",
  },
  {
    id: "W1006",
    name: "Amina Ibrahim",
    passport: "EP4567890",
    destination: "Saudi Arabia",
    status: "Medical Check",
    gender: "Female",
    age: 26,
    region: "SNNPR",
    registeredDate: "2023-04-15",
  },
  {
    id: "W1007",
    name: "Halima Yusuf",
    passport: "EP5678901",
    destination: "Bahrain",
    status: "MOLS Submitted",
    gender: "Female",
    age: 29,
    region: "Tigray",
    registeredDate: "2023-05-10",
  },
  {
    id: "W1008",
    name: "Khadija Abdullahi",
    passport: "EP6789012",
    destination: "Dubai",
    status: "Abroad",
    gender: "Female",
    age: 31,
    region: "Sidama",
    registeredDate: "2023-06-20",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Abroad":
      return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-300";
    case "In Process":
      return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-300";
    case "Waiting":
      return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300";
    case "Today Flying":
      return "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900 dark:text-indigo-300";
    case "Visa Approved":
      return "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-300";
    case "Medical Check":
      return "bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900 dark:text-cyan-300";
    case "MOLS Submitted":
      return "bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900 dark:text-teal-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Abroad":
      return <Globe className="mr-1 h-3 w-3" />;
    case "In Process":
      return <ArrowUpDown className="mr-1 h-3 w-3" />;
    case "Waiting":
      return <Clock className="mr-1 h-3 w-3" />;
    case "Today Flying":
      return <Plane className="mr-1 h-3 w-3" />;
    case "Visa Approved":
      return <CheckCircle className="mr-1 h-3 w-3" />;
    case "Medical Check":
      return <Stethoscope className="mr-1 h-3 w-3" />;
    case "MOLS Submitted":
      return <FileText className="mr-1 h-3 w-3" />;
    default:
      return null;
  }
};

export default function WorkersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [destinationFilter, setDestinationFilter] = useState("all");

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.passport.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || worker.status === statusFilter;
    const matchesDestination = destinationFilter === "all" || worker.destination === destinationFilter;
    
    return matchesSearch && matchesStatus && matchesDestination;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <Users className="h-8 w-8 mr-3" />
            <h1 className="text-2xl font-semibold tracking-tight">Worker Management</h1>
          </div>
          <Button className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Register New Worker
          </Button>
        </div>
      </div>

      {/* Worker Management Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-2">
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-blue-200 hover:border-blue-300">
          <CardHeader className="p-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center">
              <div className="p-2 bg-white/20 rounded-full mr-3">
                <UsersRound className="h-6 w-6" />
              </div>
              <CardTitle>Worker Registration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <p className="text-slate-600 mb-4">Complete worker registration with personal details, contact information, and document uploads.</p>
            <div className="flex items-center text-sm text-blue-600 mb-3">
              <User className="mr-1.5 h-4 w-4" />
              <span>Personal Information</span>
            </div>
            <div className="flex items-center text-sm text-blue-600 mb-3">
              <FileText className="mr-1.5 h-4 w-4" />
              <span>Document Collection</span>
            </div>
            <div className="flex items-center text-sm text-blue-600">
              <CheckCircle className="mr-1.5 h-4 w-4" />
              <span>Status Tracking</span>
            </div>
          </CardContent>
          <CardFooter className="p-4 bg-slate-50 border-t">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
              <a href="/workers/registration">
                Go to Registration <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-green-200 hover:border-green-300">
          <CardHeader className="p-5 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center">
              <div className="p-2 bg-white/20 rounded-full mr-3">
                <FileCheck className="h-6 w-6" />
              </div>
              <CardTitle>CV Generator</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <p className="text-slate-600 mb-4">Create professional CVs with multiple templates tailored for international employment.</p>
            <div className="flex items-center text-sm text-green-600 mb-3">
              <LayoutGrid className="mr-1.5 h-4 w-4" />
              <span>Multiple Templates</span>
            </div>
            <div className="flex items-center text-sm text-green-600 mb-3">
              <Eye className="mr-1.5 h-4 w-4" />
              <span>Preview & Export</span>
            </div>
            <div className="flex items-center text-sm text-green-600">
              <Globe className="mr-1.5 h-4 w-4" />
              <span>Country-Specific Formats</span>
            </div>
          </CardContent>
          <CardFooter className="p-4 bg-slate-50 border-t">
            <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
              <a href="/workers/cv-generator">
                Generate CV <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-indigo-200 hover:border-indigo-300">
          <CardHeader className="p-5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <div className="flex items-center">
              <div className="p-2 bg-white/20 rounded-full mr-3">
                <Database className="h-6 w-6" />
              </div>
              <CardTitle>CV Database</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <p className="text-slate-600 mb-4">Searchable database of worker profiles with skill matching and reservation capabilities.</p>
            <div className="flex items-center text-sm text-indigo-600 mb-3">
              <Search className="mr-1.5 h-4 w-4" />
              <span>Advanced Search</span>
            </div>
            <div className="flex items-center text-sm text-indigo-600 mb-3">
              <GraduationCap className="mr-1.5 h-4 w-4" />
              <span>Skill Matching</span>
            </div>
            <div className="flex items-center text-sm text-indigo-600">
              <BadgeCheck className="mr-1.5 h-4 w-4" />
              <span>Worker Reservations</span>
            </div>
          </CardContent>
          <CardFooter className="p-4 bg-slate-50 border-t">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" asChild>
              <a href="/workers/cv-database">
                Browse Database <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="h-8 w-1 bg-blue-600 rounded"></div>
        <h2 className="text-xl font-semibold">Worker Status Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{workers.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Abroad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {workers.filter(w => w.status === "Abroad").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-indigo-800">In Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-900">
              {workers.filter(w => w.status === "In Process").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-cyan-800">Today Flying</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-900">
              {workers.filter(w => w.status === "Today Flying").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2 mt-4 mb-2">
        <div className="h-8 w-1 bg-green-600 rounded"></div>
        <h2 className="text-xl font-semibold">Worker Directory</h2>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="bg-blue-50 p-1">
          <TabsTrigger value="list" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <FileText className="mr-2 h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="card" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <LayoutGrid className="mr-2 h-4 w-4" />
            Card View
          </TabsTrigger>
        </TabsList>
        
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search workers..."
              className="pl-8 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 sm:w-44 border-blue-200">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4 text-blue-500" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Abroad">Abroad</SelectItem>
                <SelectItem value="In Process">In Process</SelectItem>
                <SelectItem value="Waiting">Waiting</SelectItem>
                <SelectItem value="Today Flying">Today Flying</SelectItem>
                <SelectItem value="Visa Approved">Visa Approved</SelectItem>
                <SelectItem value="Medical Check">Medical Check</SelectItem>
                <SelectItem value="MOLS Submitted">MOLS Submitted</SelectItem>
              </SelectContent>
            </Select>

            <Select value={destinationFilter} onValueChange={setDestinationFilter}>
              <SelectTrigger className="w-36 sm:w-44 border-blue-200">
                <div className="flex items-center">
                  <Globe className="mr-2 h-4 w-4 text-green-500" />
                  <SelectValue placeholder="Destination" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Destinations</SelectItem>
                <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                <SelectItem value="Dubai">Dubai</SelectItem>
                <SelectItem value="Qatar">Qatar</SelectItem>
                <SelectItem value="Kuwait">Kuwait</SelectItem>
                <SelectItem value="Bahrain">Bahrain</SelectItem>
                <SelectItem value="Jordan">Jordan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="list" className="space-y-4">
          <Card className="border-blue-100 overflow-hidden">
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Passport</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No workers found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWorkers.map((worker) => (
                    <TableRow key={worker.id} className="hover:bg-blue-50">
                      <TableCell className="font-medium">{worker.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 bg-blue-100">
                            <AvatarFallback className="text-blue-700">
                              {worker.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {worker.name}
                        </div>
                      </TableCell>
                      <TableCell>{worker.passport}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Globe className="h-3.5 w-3.5 text-green-600" />
                          {worker.destination}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(worker.status)}`}>
                          {getStatusIcon(worker.status)}
                          {worker.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-500" />
                          {worker.region}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-600">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="card" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredWorkers.length === 0 ? (
              <div className="col-span-full text-center py-10 text-muted-foreground">
                No workers found matching your filters
              </div>
            ) : (
              filteredWorkers.map((worker) => (
                <Card key={worker.id} className="overflow-hidden hover:border-blue-300 transition-all duration-200">
                  <CardHeader className="p-4 pb-2 bg-gradient-to-r from-blue-50 to-green-50">
                    <div className="flex justify-between">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(worker.status)}`}>
                        {getStatusIcon(worker.status)}
                        {worker.status}
                      </div>
                      <span className="text-xs text-muted-foreground">{worker.id}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-3">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-12 w-12 bg-blue-100">
                        <AvatarFallback className="text-blue-700 font-medium">
                          {worker.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{worker.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <FileText className="h-3 w-3" /> {worker.passport}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5 text-green-600" />
                        <span className="text-muted-foreground">Destination:</span>
                      </div>
                      <div>{worker.destination}</div>
                      
                      <div className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-blue-600" />
                        <span className="text-muted-foreground">Age/Gender:</span>
                      </div>
                      <div>{worker.age} / {worker.gender}</div>
                      
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                        <span className="text-muted-foreground">Region:</span>
                      </div>
                      <div>{worker.region}</div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                        <span className="text-muted-foreground">Registered:</span>
                      </div>
                      <div>{new Date(worker.registeredDate).toLocaleDateString()}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-2 bg-slate-50 border-t flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-green-600">
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
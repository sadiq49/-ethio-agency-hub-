import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Search, Filter, Plus, MoreHorizontal, Star, StarHalf, Mail, Phone, MapPin, Globe, FileText, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// Mock data for agents
const mockAgents = [
  {
    id: "1",
    name: "Al Manar Manpower",
    country: "Saudi Arabia",
    city: "Riyadh",
    contactPerson: "Mohammed Al-Harbi",
    email: "contact@almanar.sa",
    phone: "+966 11 234 5678",
    rating: 5,
    status: "active",
    workersPlaced: 128,
    lastActivity: "2023-12-15"
  },
  {
    id: "2",
    name: "Dubai Star Recruitment",
    country: "UAE",
    city: "Dubai",
    contactPerson: "Ahmed Al-Mansour",
    email: "info@dubaistar.ae",
    phone: "+971 4 567 8901",
    rating: 4,
    status: "active",
    workersPlaced: 87,
    lastActivity: "2024-01-10"
  },
  {
    id: "3",
    name: "Kuwait Labor Solutions",
    country: "Kuwait",
    city: "Kuwait City",
    contactPerson: "Fatima Al-Sabah",
    email: "recruitment@kuwaitlabor.kw",
    phone: "+965 2345 6789",
    rating: 3,
    status: "inactive",
    workersPlaced: 42,
    lastActivity: "2023-10-05"
  },
  {
    id: "4",
    name: "Qatar Workforce Agency",
    country: "Qatar",
    city: "Doha",
    contactPerson: "Khalid Al-Thani",
    email: "hr@qatarworkforce.qa",
    phone: "+974 4456 7890",
    rating: 4,
    status: "active",
    workersPlaced: 65,
    lastActivity: "2024-01-25"
  },
  {
    id: "5",
    name: "Bahrain Employment Services",
    country: "Bahrain",
    city: "Manama",
    contactPerson: "Hasan Al-Khalifa",
    email: "contact@bahrainemployment.bh",
    phone: "+973 1700 1234",
    rating: 2,
    status: "probation",
    workersPlaced: 18,
    lastActivity: "2023-11-30"
  }
];

export function AgentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [agents, setAgents] = useState(mockAgents);
  const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);
  
  // Filter agents based on search query and filters
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
    const matchesCountry = countryFilter === "all" || agent.country === countryFilter;
    
    return matchesSearch && matchesStatus && matchesCountry;
  });
  
  // Get unique countries for filter
  const countries = [...new Set(agents.map(agent => agent.country))];
  
  // Render star rating
  const renderRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    return <div className="flex">{stars}</div>;
  };
  
  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Inactive</Badge>;
      case "probation":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Probation</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Agent Management</h1>
          <p className="text-gray-500">Manage your foreign employment agents and partnerships</p>
        </div>
        <Dialog open={isAddAgentOpen} onOpenChange={setIsAddAgentOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Agent</DialogTitle>
              <DialogDescription>
                Enter the details of the new foreign employment agent.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Agent Name</label>
                  <Input id="name" placeholder="Enter agent name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="country" className="text-sm font-medium">Country</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saudi-arabia">Saudi Arabia</SelectItem>
                      <SelectItem value="uae">UAE</SelectItem>
                      <SelectItem value="kuwait">Kuwait</SelectItem>
                      <SelectItem value="qatar">Qatar</SelectItem>
                      <SelectItem value="bahrain">Bahrain</SelectItem>
                      <SelectItem value="oman">Oman</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium">City</label>
                  <Input id="city" placeholder="Enter city" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contactPerson" className="text-sm font-medium">Contact Person</label>
                  <Input id="contactPerson" placeholder="Enter contact person name" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input id="email" type="email" placeholder="Enter email address" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="probation">Probation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddAgentOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsAddAgentOpen(false)}>Save Agent</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search agents..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="probation">Probation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="list" className="mb-6">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Workers Placed</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.map(agent => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>{agent.country}</TableCell>
                    <TableCell>{agent.contactPerson}</TableCell>
                    <TableCell>{renderRating(agent.rating)}</TableCell>
                    <TableCell>{getStatusBadge(agent.status)}</TableCell>
                    <TableCell>{agent.workersPlaced}</TableCell>
                    <TableCell>{new Date(agent.lastActivity).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer">
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Agent
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Agent
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map(agent => (
              <Card key={agent.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>{agent.name}</CardTitle>
                      <CardDescription>{agent.city}, {agent.country}</CardDescription>
                    </div>
                    {getStatusBadge(agent.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="font-medium mr-2">Rating:</div>
                      {renderRating(agent.rating)}
                    </div>
                    <div className="flex items-start">
                      <Mail className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                      <div>{agent.email}</div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                      <div>{agent.phone}</div>
                    </div>
                    <div className="flex items-start">
                      <Globe className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                      <div>Workers Placed: {agent.workersPlaced}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button size="sm">Contact</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export function TicketArrangement() {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ticket Arrangement</h1>
        <Button>New Booking</Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Search by worker name or passport number" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="issued">Issued</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Destinations</SelectItem>
                  <SelectItem value="dubai">Dubai</SelectItem>
                  <SelectItem value="riyadh">Riyadh</SelectItem>
                  <SelectItem value="jeddah">Jeddah</SelectItem>
                  <SelectItem value="kuwait">Kuwait</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker Name</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Flight</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Abebe Kebede</TableCell>
                    <TableCell>Dubai (DXB)</TableCell>
                    <TableCell>ET507</TableCell>
                    <TableCell>May 15, 2024</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Details</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Ticket Details</DialogTitle>
                              <DialogDescription>
                                Flight information for Abebe Kebede
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="font-medium">Passenger:</div>
                                <div>Abebe Kebede</div>
                                <div className="font-medium">Passport:</div>
                                <div>EP0123456</div>
                                <div className="font-medium">Flight:</div>
                                <div>ET507</div>
                                <div className="font-medium">Date:</div>
                                <div>May 15, 2024</div>
                                <div className="font-medium">Departure:</div>
                                <div>Addis Ababa (ADD) - 08:30 AM</div>
                                <div className="font-medium">Arrival:</div>
                                <div>Dubai (DXB) - 13:45 PM</div>
                                <div className="font-medium">Booking Reference:</div>
                                <div>ETHABC123</div>
                                <div className="font-medium">Status:</div>
                                <div>Confirmed</div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline">Download E-Ticket</Button>
                              <Button>Send to Worker</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tigist Haile</TableCell>
                    <TableCell>Dubai (DXB)</TableCell>
                    <TableCell>ET507</TableCell>
                    <TableCell>May 15, 2024</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Details</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Hanna Girma</TableCell>
                    <TableCell>Riyadh (RUH)</TableCell>
                    <TableCell>EK722</TableCell>
                    <TableCell>May 20, 2024</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Issued</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Details</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="past">
          <Card>
            <CardContent className="p-6 text-center">
              <p>Past bookings will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cancelled">
          <Card>
            <CardContent className="p-6 text-center">
              <p>Cancelled bookings will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
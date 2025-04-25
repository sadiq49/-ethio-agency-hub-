import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
// Missing ScrollView import
import { ScrollView } from "react-native";

export function PilgrimageManagement() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Hajj & Umrah Management</h1>
          <p className="text-gray-500 mt-1">Manage pilgrimage services and pilgrim groups</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Import Pilgrims</Button>
          <Button>New Registration</Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input placeholder="Search by pilgrim name or passport number" />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilgrimage Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="hajj">Hajj</SelectItem>
                  <SelectItem value="umrah">Umrah</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="registered">Registered</SelectItem>
                  <SelectItem value="visa-processing">Visa Processing</SelectItem>
                  <SelectItem value="visa-approved">Visa Approved</SelectItem>
                  <SelectItem value="departed">Departed</SelectItem>
                  <SelectItem value="in-mecca">In Mecca</SelectItem>
                  <SelectItem value="in-medina">In Medina</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Pilgrimages</CardTitle>
              <CardDescription>Pilgrimages scheduled in the next 30 days</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pilgrim Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Departure Date</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Mohammed Ahmed</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Hajj</Badge>
                    </TableCell>
                    <TableCell>June 5, 2024</TableCell>
                    <TableCell>June 25, 2024</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800">Visa Approved</Badge>
                    </TableCell>
                    <TableCell>Group A</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Fatima Ibrahim</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Hajj</Badge>
                    </TableCell>
                    <TableCell>June 5, 2024</TableCell>
                    <TableCell>June 25, 2024</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-800">Visa Processing</Badge>
                    </TableCell>
                    <TableCell>Group A</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ahmed Mahmoud</TableCell>
                    <TableCell>
                      <Badge className="bg-purple-100 text-purple-800">Umrah</Badge>
                    </TableCell>
                    <TableCell>May 20, 2024</TableCell>
                    <TableCell>May 30, 2024</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800">Visa Approved</Badge>
                    </TableCell>
                    <TableCell>Group C</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Pilgrimages</CardTitle>
              <CardDescription>Pilgrims currently in Saudi Arabia</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pilgrim Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Current Location</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Guide</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Aisha Yusuf</TableCell>
                    <TableCell>
                      <Badge className="bg-purple-100 text-purple-800">Umrah</Badge>
                    </TableCell>
                    <TableCell>Mecca</TableCell>
                    <TableCell>May 15, 2024</TableCell>
                    <TableCell>Group B</TableCell>
                    <TableCell>Sheikh Abdullah</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Track</Button>
                        <Button variant="outline" size="sm">Contact</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed">
          <Card>
            <CardContent className="p-6 text-center">
              <p>Completed pilgrimages will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="groups">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Group A - Hajj 2024</CardTitle>
                    <CardDescription>Departing June 5, 2024</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800">15 Pilgrims</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Guide:</span>
                    <span className="font-medium">Sheikh Mohammed Ali</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Accommodation:</span>
                    <span className="font-medium">Al Noor Hotel, Mecca</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Transportation:</span>
                    <span className="font-medium">Private Bus</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <Badge className="bg-blue-100 text-blue-800">Preparation</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 flex justify-between">
                <Button variant="outline">View Members</Button>
                <Button>Manage Group</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b">
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Group B - Umrah</CardTitle>
                    <CardDescription>Departing May 10, 2024</CardDescription>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">8 Pilgrims</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Guide:</span>
                    <span className="font-medium">Sheikh Abdullah Omar</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Accommodation:</span>
                    <span className="font-medium">Dar Al Taqwa, Medina</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Transportation:</span>
                    <span className="font-medium">Shared Transport</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50 flex justify-between">
                <Button variant="outline">View Members</Button>
                <Button>Manage Group</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// In the component where ScrollView is used (around line 200-250)
<ScrollView horizontal showsHorizontalScrollIndicator={false}>
  <Chip
    selected={statusFilter === 'all'}
    onPress={() => setStatusFilter('all')}
    style={styles.filterChip}
  >
    All Status
  </Chip>
  // ... more chips ...
</ScrollView>
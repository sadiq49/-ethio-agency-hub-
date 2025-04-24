import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export function DeparturePreparation() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Departure Preparation</h1>
        <Button>Add Worker</Button>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming (7 Days)</TabsTrigger>
          <TabsTrigger value="thisMonth">This Month</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <DepartureCard 
              workerName="Abebe Kebede"
              destination="Dubai, UAE"
              departureDate="May 15, 2024"
              flight="ET507"
              progress={75}
              checklistItems={[
                { id: "passport", label: "Passport & Visa", checked: true },
                { id: "contract", label: "Employment Contract", checked: true },
                { id: "medical", label: "Medical Certificate", checked: true },
                { id: "training", label: "Pre-departure Training", checked: false },
                { id: "ticket", label: "Flight Ticket", checked: true },
                { id: "insurance", label: "Travel Insurance", checked: false },
                { id: "orientation", label: "Orientation Session", checked: true },
                { id: "emergency", label: "Emergency Contact", checked: true }
              ]}
            />
            
            <DepartureCard 
              workerName="Tigist Haile"
              destination="Dubai, UAE"
              departureDate="May 15, 2024"
              flight="ET507"
              progress={50}
              checklistItems={[
                { id: "passport", label: "Passport & Visa", checked: true },
                { id: "contract", label: "Employment Contract", checked: true },
                { id: "medical", label: "Medical Certificate", checked: false },
                { id: "training", label: "Pre-departure Training", checked: false },
                { id: "ticket", label: "Flight Ticket", checked: true },
                { id: "insurance", label: "Travel Insurance", checked: false },
                { id: "orientation", label: "Orientation Session", checked: true },
                { id: "emergency", label: "Emergency Contact", checked: false }
              ]}
            />
            
            <DepartureCard 
              workerName="Hanna Girma"
              destination="Riyadh, Saudi Arabia"
              departureDate="May 20, 2024"
              flight="EK722"
              progress={90}
              checklistItems={[
                { id: "passport", label: "Passport & Visa", checked: true },
                { id: "contract", label: "Employment Contract", checked: true },
                { id: "medical", label: "Medical Certificate", checked: true },
                { id: "training", label: "Pre-departure Training", checked: true },
                { id: "ticket", label: "Flight Ticket", checked: true },
                { id: "insurance", label: "Travel Insurance", checked: true },
                { id: "orientation", label: "Orientation Session", checked: true },
                { id: "emergency", label: "Emergency Contact", checked: false }
              ]}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="thisMonth">
          <Card className="mt-6">
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker Name</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Departure Date</TableHead>
                    <TableHead>Flight</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Abebe Kebede</TableCell>
                    <TableCell>Dubai, UAE</TableCell>
                    <TableCell>May 15, 2024</TableCell>
                    <TableCell>ET507</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={75} className="h-2 w-24" />
                        <span className="text-sm">75%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                  {/* Additional rows would go here */}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed">
          <Card className="mt-6">
            <CardContent className="p-6 text-center">
              <p>Completed departure preparations will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

interface DepartureCardProps {
  workerName: string;
  destination: string;
  departureDate: string;
  flight: string;
  progress: number;
  checklistItems: ChecklistItem[];
}

function DepartureCard({ workerName, destination, departureDate, flight, progress, checklistItems }: DepartureCardProps) {
  const [items, setItems] = useState(checklistItems);
  
  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };
  
  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{workerName}</CardTitle>
            <CardDescription>{destination}</CardDescription>
          </div>
          <Badge className="bg-blue-100 text-blue-800">
            {departureDate}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">Preparation Progress</div>
          <div className="text-sm font-medium">{progress}%</div>
        </div>
        <Progress value={progress} className="h-2 mb-6" />
        
        <div className="space-y-3">
          <div className="text-sm font-medium">Flight: {flight}</div>
          <div className="border-t pt-3">
            <h3 className="font-medium mb-2">Pre-departure Checklist</h3>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={item.id} 
                    checked={item.checked} 
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <label
                    htmlFor={item.id}
                    className={`text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${item.checked ? 'line-through text-gray-500' : ''}`}
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 flex justify-between">
        <Button variant="outline">Send Reminder</Button>
        <Button>Update Status</Button>
      </CardFooter>
    </Card>
  );
}
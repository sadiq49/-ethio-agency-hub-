import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function TodayFlying() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Today Flying</h1>
        <div className="text-lg font-medium">{today}</div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Flights</TabsTrigger>
          <TabsTrigger value="morning">Morning</TabsTrigger>
          <TabsTrigger value="afternoon">Afternoon</TabsTrigger>
          <TabsTrigger value="evening">Evening</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="bg-blue-50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>ET507</CardTitle>
                    <CardDescription>Ethiopian Airlines</CardDescription>
                  </div>
                  <Badge>08:30 AM</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-500">From</div>
                    <div className="font-medium">Addis Ababa (ADD)</div>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">To</div>
                    <div className="font-medium">Dubai (DXB)</div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Workers (3)</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center">
                      <div>Abebe Kebede</div>
                      <Badge variant="outline" className="bg-green-50">Check-in Complete</Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <div>Tigist Haile</div>
                      <Badge variant="outline" className="bg-yellow-50">Pending Check-in</Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <div>Dawit Tadesse</div>
                      <Badge variant="outline" className="bg-green-50">Check-in Complete</Badge>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" className="mr-2">Send Reminder</Button>
                  <Button>Update Status</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="bg-blue-50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>EK722</CardTitle>
                    <CardDescription>Emirates</CardDescription>
                  </div>
                  <Badge>14:45 PM</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-500">From</div>
                    <div className="font-medium">Addis Ababa (ADD)</div>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">To</div>
                    <div className="font-medium">Riyadh (RUH)</div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Workers (2)</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center">
                      <div>Hanna Girma</div>
                      <Badge variant="outline" className="bg-green-50">Check-in Complete</Badge>
                    </li>
                    <li className="flex justify-between items-center">
                      <div>Solomon Tesfaye</div>
                      <Badge variant="outline" className="bg-green-50">Check-in Complete</Badge>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" className="mr-2">Send Reminder</Button>
                  <Button>Update Status</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="morning">
          <Card>
            <CardHeader className="bg-blue-50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>ET507</CardTitle>
                  <CardDescription>Ethiopian Airlines</CardDescription>
                </div>
                <Badge>08:30 AM</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-500">From</div>
                  <div className="font-medium">Addis Ababa (ADD)</div>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">To</div>
                  <div className="font-medium">Dubai (DXB)</div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Workers (3)</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <div>Abebe Kebede</div>
                    <Badge variant="outline" className="bg-green-50">Check-in Complete</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <div>Tigist Haile</div>
                    <Badge variant="outline" className="bg-yellow-50">Pending Check-in</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <div>Dawit Tadesse</div>
                    <Badge variant="outline" className="bg-green-50">Check-in Complete</Badge>
                  </li>
                </ul>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" className="mr-2">Send Reminder</Button>
                <Button>Update Status</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="afternoon">
          <Card>
            <CardHeader className="bg-blue-50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>EK722</CardTitle>
                  <CardDescription>Emirates</CardDescription>
                </div>
                <Badge>14:45 PM</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-500">From</div>
                  <div className="font-medium">Addis Ababa (ADD)</div>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">To</div>
                  <div className="font-medium">Riyadh (RUH)</div>
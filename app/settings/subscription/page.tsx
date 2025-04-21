"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building2,
  Receipt,
  FileText,
  Download
} from "lucide-react";

interface SubscriptionPlan {
  name: string;
  price: number;
  features: string[];
  workerLimit: number;
  recommended?: boolean;
}

const plans: SubscriptionPlan[] = [
  {
    name: "Basic",
    price: 5000,
    workerLimit: 100,
    features: [
      "Basic worker management",
      "Document storage",
      "Standard reports",
      "Email support",
    ],
  },
  {
    name: "Professional",
    price: 8000,
    workerLimit: 250,
    recommended: true,
    features: [
      "Advanced worker management",
      "Document processing",
      "CV generation",
      "Training management",
      "Priority support",
      "API access",
    ],
  },
  {
    name: "Enterprise",
    price: 15000,
    workerLimit: 500,
    features: [
      "Unlimited worker management",
      "Advanced analytics",
      "Custom reporting",
      "Dedicated support",
      "Multi-branch support",
      "White-label options",
    ],
  },
];

export default function SubscriptionPage() {
  const [currentPlan] = useState("Professional");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Subscription Management</h1>
        <Button>
          <Receipt className="mr-2 h-4 w-4" />
          View Invoices
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Professional</div>
            <p className="text-xs text-muted-foreground pt-1">
              Next billing: Jan 15, 2024
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Workers Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156/250</div>
            <p className="text-xs text-muted-foreground pt-1">
              62% of limit used
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Storage Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.8 GB</div>
            <p className="text-xs text-muted-foreground pt-1">
              75% of 100 GB limit
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Billing Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-xl font-bold">Active</span>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Auto-renewal enabled
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.recommended ? 'border-primary' : ''}`}>
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Recommended</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  <span>{plan.name}</span>
                  <span className="text-2xl">
                    {plan.price.toLocaleString()} ETB
                    <span className="text-sm text-muted-foreground">/month</span>
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Up to {plan.workerLimit.toLocaleString()} workers</span>
                </div>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={currentPlan === plan.name ? "outline" : "default"}
                >
                  {currentPlan === plan.name ? "Current Plan" : "Upgrade"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Receipt className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">December 2023</p>
                    <p className="text-sm text-muted-foreground">Professional Plan</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">8,000 ETB</span>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Receipt className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">November 2023</p>
                    <p className="text-sm text-muted-foreground">Professional Plan</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">8,000 ETB</span>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">Commercial Bank of Ethiopia</p>
                  <p className="text-sm text-muted-foreground">Account ending in 4589</p>
                </div>
                <Badge>Primary</Badge>
              </div>
              <Button className="w-full" variant="outline">
                <Building2 className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">API Calls</span>
                <span>75,432 / 100,000</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-full w-[75%] rounded-full bg-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Document Processing</span>
                <span>1,234 / 2,000</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-full w-[62%] rounded-full bg-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">CV Generation</span>
                <span>456 / 1,000</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className="h-full w-[45%] rounded-full bg-primary" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
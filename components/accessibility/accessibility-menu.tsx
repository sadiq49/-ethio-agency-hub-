"use client";

import React from "react";
import { useAccessibility } from "./accessibility-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Accessibility } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function AccessibilityMenu() {
  const { options, updateOptions } = useAccessibility();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Accessibility options">
          <Accessibility className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Accessibility Options</DialogTitle>
          <DialogDescription>
            Customize your experience to make the application more accessible.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="font-size" className="col-span-2">
              Font Size
            </Label>
            <Select
              value={options.fontSize}
              onValueChange={(value) =>
                updateOptions({ fontSize: value as "normal" | "large" | "x-large" })
              }
              className="col-span-2"
            >
              <SelectTrigger id="font-size">
                <SelectValue placeholder="Font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="x-large">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast" className="flex-1">
              High Contrast
            </Label>
            <Switch
              id="high-contrast"
              checked={options.highContrast}
              onCheckedChange={(checked) =>
                updateOptions({ highContrast: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="reduced-motion" className="flex-1">
              Reduced Motion
            </Label>
            <Switch
              id="reduced-motion"
              checked={options.reducedMotion}
              onCheckedChange={(checked) =>
                updateOptions({ reducedMotion: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="screen-reader" className="flex-1">
              Screen Reader Optimizations
            </Label>
            <Switch
              id="screen-reader"
              checked={options.screenReader}
              onCheckedChange={(checked) =>
                updateOptions({ screenReader: checked })
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
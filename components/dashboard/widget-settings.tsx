"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';

interface WidgetSettingsProps {
  widgetId: string;
  widgetType: string;
  title: string;
  settings: Record<string, any>;
  onSave: (widgetId: string, title: string, settings: Record<string, any>) => void;
}

/**
 * Widget Settings Component
 * 
 * Provides a configuration dialog for customizing dashboard widgets.
 * Settings are specific to each widget type.
 * 
 * @param widgetId - Unique identifier for the widget
 * @param widgetType - Type of widget (determines available settings)
 * @param title - Current widget title
 * @param settings - Current widget settings
 * @param onSave - Callback function when settings are saved
 * @returns React component with widget settings UI
 */
export function WidgetSettings({ 
  widgetId, 
  widgetType, 
  title, 
  settings, 
  onSave 
}: WidgetSettingsProps) {
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newSettings, setNewSettings] = useState(settings);
  
  // Reset form when dialog opens
  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setNewTitle(title);
      setNewSettings({...settings});
    }
    setOpen(isOpen);
  };
  
  // Update a specific setting
  const updateSetting = (key: string, value: any) => {
    setNewSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Save settings
  const handleSave = () => {
    onSave(widgetId, newTitle, newSettings);
    setOpen(false);
  };
  
  // Render settings based on widget type
  const renderSettings = () => {
    switch (widgetType) {
      case 'status-cards':
        return (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-percentage">Show Percentages</Label>
                <Switch 
                  id="show-percentage" 
                  checked={newSettings.showPercentage || false}
                  onCheckedChange={(checked) => updateSetting('showPercentage', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-change">Show Change Indicators</Label>
                <Switch 
                  id="show-change" 
                  checked={newSettings.showChange || false}
                  onCheckedChange={(checked) => updateSetting('showChange', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-cards">Maximum Cards</Label>
                <Select 
                  value={String(newSettings.maxCards || 5)}
                  onValueChange={(value) => updateSetting('maxCards', parseInt(value))}
                >
                  <SelectTrigger id="max-cards">
                    <SelectValue placeholder="Select maximum cards" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
        
      case 'worker-statistics':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chart-type">Chart Type</Label>
                <Select 
                  value={newSettings.chartType || 'bar'}
                  onValueChange={(value) => updateSetting('chartType', value)}
                >
                  <SelectTrigger id="chart-type">
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time-period">Time Period</Label>
                <Select 
                  value={newSettings.timePeriod || 'month'}
                  onValueChange={(value) => updateSetting('timePeriod', value)}
                >
                  <SelectTrigger id="time-period">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Weekly</SelectItem>
                    <SelectItem value="month">Monthly</SelectItem>
                    <SelectItem value="quarter">Quarterly</SelectItem>
                    <SelectItem value="year">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-legend">Show Legend</Label>
                <Switch 
                  id="show-legend" 
                  checked={newSettings.showLegend || true}
                  onCheckedChange={(checked) => updateSetting('showLegend', checked)}
                />
              </div>
            </div>
          </>
        );
        
      case 'todays-tasks':
      case 'recent-activities':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="max-items">Maximum Items</Label>
                <Input 
                  id="max-items" 
                  type="number" 
                  min="1" 
                  max="20" 
                  value={newSettings.maxItems || 5}
                  onChange={(e) => updateSetting('maxItems', parseInt(e.target.value))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-time">Show Time</Label>
                <Switch 
                  id="show-time" 
                  checked={newSettings.showTime || true}
                  onCheckedChange={(checked) => updateSetting('showTime', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-refresh">Auto Refresh</Label>
                <Switch 
                  id="auto-refresh" 
                  checked={newSettings.autoRefresh || false}
                  onCheckedChange={(checked) => updateSetting('autoRefresh', checked)}
                />
              </div>
              
              {newSettings.autoRefresh && (
                <div className="space-y-2">
                  <Label htmlFor="refresh-interval">Refresh Interval (seconds)</Label>
                  <Input 
                    id="refresh-interval" 
                    type="number" 
                    min="30" 
                    max="3600" 
                    value={newSettings.refreshInterval || 300}
                    onChange={(e) => updateSetting('refreshInterval', parseInt(e.target.value))}
                  />
                </div>
              )}
            </div>
          </>
        );
        
      default:
        return (
          <p className="text-sm text-muted-foreground">
            No custom settings available for this widget type.
          </p>
        );
    }
  };

  return (
    <>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpen(true)}>
        <Settings className="h-4 w-4" />
      </Button>
      
      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Widget Settings</DialogTitle>
            <DialogDescription>
              Customize how this widget appears and behaves on your dashboard.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="widget-title">Widget Title</Label>
              <Input 
                id="widget-title" 
                value={newTitle} 
                onChange={(e) => setNewTitle(e.target.value)} 
              />
            </div>
            
            <div className="pt-4">
              <h4 className="text-sm font-medium mb-3">Widget Options</h4>
              {renderSettings()}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
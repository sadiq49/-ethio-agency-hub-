"use client";

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  X, 
  Maximize2, 
  Minimize2, 
  Settings, 
  Save,
  LayoutGrid
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import StatusCards from '@/components/dashboard/status-cards';
import WorkerStatistics from '@/components/dashboard/worker-statistics';
import TodaysTasks from '@/components/dashboard/todays-tasks';
import RecentActivities from '@/components/dashboard/recent-activities';

// Widget registry - maps widget IDs to their components
const widgetRegistry = {
  'status-cards': {
    id: 'status-cards',
    title: 'Status Overview',
    description: 'Key metrics and status indicators',
    component: StatusCards,
    defaultSize: 'full',
  },
  'worker-statistics': {
    id: 'worker-statistics',
    title: 'Worker Statistics',
    description: 'Monthly worker status and deployment trends',
    component: WorkerStatistics,
    defaultSize: 'large',
  },
  'todays-tasks': {
    id: 'todays-tasks',
    title: "Today's Tasks",
    description: 'Tasks scheduled for today',
    component: TodaysTasks,
    defaultSize: 'medium',
  },
  'recent-activities': {
    id: 'recent-activities',
    title: 'Recent Activities',
    description: 'Latest system activities and updates',
    component: RecentActivities,
    defaultSize: 'medium',
  },
  // Add more widgets here
};

type WidgetSize = 'small' | 'medium' | 'large' | 'full';

interface DashboardWidget {
  id: string;
  widgetId: string;
  title: string;
  size: WidgetSize;
  position: number;
  settings?: Record<string, any>;
}

interface DashboardLayout {
  id: string;
  name: string;
  widgets: DashboardWidget[];
}

/**
 * Customizable Dashboard Component
 * 
 * Allows users to create personalized dashboards by adding, removing,
 * resizing, and rearranging widgets. Layouts are saved to user preferences.
 * 
 * Features:
 * - Drag and drop widget arrangement
 * - Multiple saved dashboard layouts
 * - Widget size customization
 * - Widget-specific settings
 * 
 * @returns React component with customizable dashboard UI
 */
export default function CustomizableDashboard() {
  const [layouts, setLayouts] = useState<DashboardLayout[]>([]);
  const [currentLayout, setCurrentLayout] = useState<DashboardLayout | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newLayoutName, setNewLayoutName] = useState('');
  
  // Load saved layouts on component mount
  useEffect(() => {
    const savedLayouts = localStorage.getItem('dashboard-layouts');
    
    if (savedLayouts) {
      try {
        const parsedLayouts = JSON.parse(savedLayouts) as DashboardLayout[];
        setLayouts(parsedLayouts);
        
        // Set current layout to the last used one or the first available
        const lastUsedId = localStorage.getItem('last-used-layout');
        const lastUsedLayout = lastUsedId 
          ? parsedLayouts.find(l => l.id === lastUsedId) 
          : null;
          
        setCurrentLayout(lastUsedLayout || parsedLayouts[0] || createDefaultLayout());
      } catch (error) {
        console.error('Error loading saved layouts:', error);
        setCurrentLayout(createDefaultLayout());
      }
    } else {
      // Create default layout if none exists
      const defaultLayout = createDefaultLayout();
      setLayouts([defaultLayout]);
      setCurrentLayout(defaultLayout);
    }
  }, []);
  
  // Save layouts when they change
  useEffect(() => {
    if (layouts.length > 0) {
      localStorage.setItem('dashboard-layouts', JSON.stringify(layouts));
    }
    
    if (currentLayout) {
      localStorage.setItem('last-used-layout', currentLayout.id);
    }
  }, [layouts, currentLayout]);
  
  // Create a default layout
  const createDefaultLayout = (): DashboardLayout => {
    return {
      id: `layout-${Date.now()}`,
      name: 'Default Layout',
      widgets: [
        {
          id: `widget-${Date.now()}-1`,
          widgetId: 'status-cards',
          title: 'Status Overview',
          size: 'full',
          position: 0,
        },
        {
          id: `widget-${Date.now()}-2`,
          widgetId: 'worker-statistics',
          title: 'Worker Statistics',
          size: 'large',
          position: 1,
        },
        {
          id: `widget-${Date.now()}-3`,
          widgetId: 'todays-tasks',
          title: "Today's Tasks",
          size: 'medium',
          position: 2,
        },
      ],
    };
  };
  
  // Create a new layout
  const createNewLayout = () => {
    if (!newLayoutName.trim()) return;
    
    const newLayout: DashboardLayout = {
      id: `layout-${Date.now()}`,
      name: newLayoutName,
      widgets: [],
    };
    
    setLayouts([...layouts, newLayout]);
    setCurrentLayout(newLayout);
    setNewLayoutName('');
    setIsEditMode(true);
  };
  
  // Switch to a different layout
  const switchLayout = (layoutId: string) => {
    const layout = layouts.find(l => l.id === layoutId);
    if (layout) {
      setCurrentLayout(layout);
      setIsEditMode(false);
    }
  };
  
  // Delete a layout
  const deleteLayout = (layoutId: string) => {
    if (layouts.length <= 1) return; // Don't delete the last layout
    
    const updatedLayouts = layouts.filter(l => l.id !== layoutId);
    setLayouts(updatedLayouts);
    
    if (currentLayout?.id === layoutId) {
      setCurrentLayout(updatedLayouts[0]);
    }
  };
  
  // Add a widget to the current layout
  const addWidget = (widgetId: string) => {
    if (!currentLayout) return;
    
    const widgetInfo = widgetRegistry[widgetId as keyof typeof widgetRegistry];
    
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      widgetId,
      title: widgetInfo.title,
      size: widgetInfo.defaultSize as WidgetSize,
      position: currentLayout.widgets.length,
    };
    
    const updatedWidgets = [...currentLayout.widgets, newWidget];
    
    const updatedLayout = {
      ...currentLayout,
      widgets: updatedWidgets,
    };
    
    setCurrentLayout(updatedLayout);
    updateLayoutInList(updatedLayout);
  };
  
  // Remove a widget from the current layout
  const removeWidget = (widgetId: string) => {
    if (!currentLayout) return;
    
    const updatedWidgets = currentLayout.widgets
      .filter(w => w.id !== widgetId)
      .map((w, index) => ({ ...w, position: index }));
    
    const updatedLayout = {
      ...currentLayout,
      widgets: updatedWidgets,
    };
    
    setCurrentLayout(updatedLayout);
    updateLayoutInList(updatedLayout);
  };
  
  // Update widget size
  const updateWidgetSize = (widgetId: string, newSize: WidgetSize) => {
    if (!currentLayout) return;
    
    const updatedWidgets = currentLayout.widgets.map(w => 
      w.id === widgetId ? { ...w, size: newSize } : w
    );
    
    const updatedLayout = {
      ...currentLayout,
      widgets: updatedWidgets,
    };
    
    setCurrentLayout(updatedLayout);
    updateLayoutInList(updatedLayout);
  };
  
  // Update the current layout in the layouts list
  const updateLayoutInList = (updatedLayout: DashboardLayout) => {
    const updatedLayouts = layouts.map(l => 
      l.id === updatedLayout.id ? updatedLayout : l
    );
    
    setLayouts(updatedLayouts);
  };
  
  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination || !currentLayout) return;
    
    const items = Array.from(currentLayout.widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update positions
    const updatedWidgets = items.map((item, index) => ({
      ...item,
      position: index,
    }));
    
    const updatedLayout = {
      ...currentLayout,
      widgets: updatedWidgets,
    };
    
    setCurrentLayout(updatedLayout);
    updateLayoutInList(updatedLayout);
  };
  
  // Get widget component by ID
  const getWidgetComponent = (widgetId: string) => {
    const widget = widgetRegistry[widgetId as keyof typeof widgetRegistry];
    if (!widget) return null;
    
    const Component = widget.component;
    return <Component />;
  };
  
  // Get CSS class for widget size
  const getWidgetSizeClass = (size: WidgetSize) => {
    switch (size) {
      case 'small':
        return 'col-span-1';
      case 'medium':
        return 'col-span-1 md:col-span-2';
      case 'large':
        return 'col-span-1 md:col-span-2 lg:col-span-3';
      case 'full':
        return 'col-span-1 md:col-span-4';
      default:
        return 'col-span-1';
    }
  };

  if (!currentLayout) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <LayoutGrid className="mr-2 h-4 w-4" />
                {currentLayout.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Dashboard Layouts</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {layouts.map(layout => (
                <DropdownMenuItem 
                  key={layout.id}
                  onClick={() => switchLayout(layout.id)}
                  className={layout.id === currentLayout.id ? 'bg-accent' : ''}
                >
                  {layout.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Layout
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Dashboard Layout</DialogTitle>
                    <DialogDescription>
                      Enter a name for your new dashboard layout.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="layout-name">Layout Name</Label>
                    <Input 
                      id="layout-name" 
                      value={newLayoutName} 
                      onChange={(e) => setNewLayoutName(e.target.value)} 
                      placeholder="My Custom Dashboard"
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={createNewLayout}>Create Layout</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant={isEditMode ? "default" : "outline"} 
            onClick={() => setIsEditMode(!isEditMode)}
          >
            <Settings className="mr-2 h-4 w-4" />
            {isEditMode ? "Save Layout" : "Edit Layout"}
          </Button>
        </div>
      </div>
      
      {isEditMode && (
        <Card>
          <CardHeader>
            <CardTitle>Available Widgets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.values(widgetRegistry).map(widget => (
                <Button 
                  key={widget.id} 
                  variant="outline" 
                  onClick={() => addWidget(widget.id)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {widget.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="widgets" direction="vertical">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              {currentLayout.widgets
                .sort((a, b) => a.position - b.position)
                .map((widget, index) => (
                  <Draggable
                    key={widget.id}
                    draggableId={widget.id}
                    index={index}
                    isDragDisabled={!isEditMode}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={getWidgetSizeClass(widget.size)}
                      >
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div 
                              {...(isEditMode ? provided.dragHandleProps : {})}
                              className="space-y-1"
                            >
                              <CardTitle>{widget.title}</CardTitle>
                            </div>
                            {isEditMode && (
                              <div className="flex items-center gap-1">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Maximize2 className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Widget Size</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => updateWidgetSize(widget.id, 'small')}>
                                      Small
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => updateWidgetSize(widget.id, 'medium')}>
                                      Medium
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => updateWidgetSize(widget.id, 'large')}>
                                      Large
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => updateWidgetSize(widget.id, 'full')}>
                                      Full Width
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => removeWidget(widget.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </CardHeader>
                          <CardContent>
                            {getWidgetComponent(widget.widgetId)}
                          </CardContent>
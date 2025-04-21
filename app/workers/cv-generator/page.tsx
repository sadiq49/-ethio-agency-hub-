"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Search, 
  Filter, 
  Download, 
  FileText,
  Printer,
  Share2,
  Eye,
  CheckCircle,
  X,
  Layout,
  Settings,
  Globe,
  Languages,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  User,
  Calendar,
  PenTool,
  Image,
  ArrowRight,
  AlertCircle,
  Check
} from "lucide-react";

interface Worker {
  id: string;
  name: string;
  age: number;
  gender: string;
  experience: string;
  destination: string;
  skillLevel: string;
  languages: string[];
  education: string;
  training: string[];
  photo?: string;
  status: "draft" | "generated" | "shared";
  generatedDate?: string;
}

const workers: Worker[] = [
  {
    id: "W1001",
    name: "Amina Hassan",
    age: 28,
    gender: "Female",
    experience: "2 years housekeeping in Dubai",
    destination: "Saudi Arabia",
    skillLevel: "Semi-Skilled",
    languages: ["Arabic (Basic)", "English (Basic)"],
    education: "High School",
    training: ["Housekeeping", "Basic Arabic Language"],
    status: "generated",
    generatedDate: "2023-12-15",
  },
  {
    id: "W1002",
    name: "Fatima Omar",
    age: 25,
    gender: "Female",
    experience: "None",
    destination: "Dubai",
    skillLevel: "Unskilled",
    languages: ["Arabic (None)", "English (Basic)"],
    education: "Primary School",
    training: ["Basic Housekeeping"],
    status: "draft",
  },
  {
    id: "W1003",
    name: "Zainab Ali",
    age: 32,
    gender: "Female",
    experience: "3 years caregiving in Kuwait",
    destination: "Qatar",
    skillLevel: "Skilled",
    languages: ["Arabic (Intermediate)", "English (Intermediate)"],
    education: "Diploma in Healthcare",
    training: ["Elderly Care", "First Aid", "Arabic Language"],
    status: "shared",
    generatedDate: "2023-12-10",
  },
];

const cvTemplates = [
  {
    id: "modern",
    name: "Modern Template",
    description: "Clean and contemporary design with a focus on visual hierarchy",
    preview: "https://images.pexels.com/photos/8867434/pexels-photo-8867434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "classic",
    name: "Classic Template",
    description: "Traditional format preferred by conservative employers",
    preview: "https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "professional",
    name: "Professional Template",
    description: "Balanced design suitable for all industries",
    preview: "https://images.pexels.com/photos/8867538/pexels-photo-8867538.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "generated":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "draft":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "shared":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

export default function CVGeneratorPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [showTemplates, setShowTemplates] = useState(false);
  const [previewWorker, setPreviewWorker] = useState<Worker | null>(null);
  const [colorScheme, setColorScheme] = useState("blue");
  const [fontStyle, setFontStyle] = useState("modern");
  const [includePhoto, setIncludePhoto] = useState(true);
  const [exportFormat, setExportFormat] = useState("pdf");
  const [exportOpen, setExportOpen] = useState(false);
  const [customizationOpen, setCustomizationOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || worker.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const CVPreview = ({ worker }: { worker: Worker }) => {
    return (
      <div className="bg-white p-8 max-w-4xl mx-auto">
        <div className="flex items-start gap-6 border-b pb-6">
          <Avatar className="h-32 w-32">
            <AvatarFallback className="text-4xl">
              {worker.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-3xl font-bold">{worker.name}</h2>
            <p className="text-lg text-muted-foreground mt-1">{worker.skillLevel} Worker</p>
            <div className="flex gap-4 mt-4">
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{worker.age} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{worker.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Preferred Destination</p>
                <p className="font-medium">{worker.destination}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Experience</h3>
            <p>{worker.experience === "None" ? "No prior experience" : worker.experience}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Education</h3>
            <p>{worker.education}</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Languages</h3>
          <div className="flex gap-2">
            {worker.languages.map((language, index) => (
              <Badge key={index} variant="secondary">
                {language}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Training & Certifications</h3>
          <ul className="list-disc list-inside space-y-2">
            {worker.training.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <FileText className="h-8 w-8 mr-3" />
            <h1 className="text-2xl font-semibold tracking-tight">CV Generator</h1>
          </div>
          <Button 
            className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            onClick={() => setCustomizationOpen(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Customize Templates
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total CVs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{workers.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {workers.filter(w => w.status === "generated").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {workers.filter(w => w.status === "draft").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-indigo-800">Shared</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-900">
              {workers.filter(w => w.status === "shared").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Template Selection Dialog */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select CV Template</DialogTitle>
            <DialogDescription>
              Choose the best template for your worker's profile
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {cvTemplates.map((template) => (
              <div 
                key={template.id} 
                className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  selectedTemplate === template.id ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="aspect-[3/4] relative">
                  <img 
                    src={template.preview} 
                    alt={template.name}
                    className="object-cover w-full h-full"
                  />
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="p-3 bg-white">
                  <h3 className="font-medium text-sm">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mt-6 border border-blue-100">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Template Customization</h4>
                <p className="text-xs text-blue-700 mt-1">
                  You can further customize colors, fonts, and layout after selecting a template.
                  Click the "Customize Templates" button at the top of the page.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowTemplates(false)}>Cancel</Button>
            <Button onClick={() => setShowTemplates(false)}>Apply Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Color & Font Customization Dialog */}
      <Dialog open={customizationOpen} onOpenChange={setCustomizationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>CV Customization Options</DialogTitle>
            <DialogDescription>
              Personalize the look and feel of your generated CVs
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Color Scheme</h4>
              <RadioGroup 
                value={colorScheme} 
                onValueChange={setColorScheme} 
                className="grid grid-cols-4 gap-2"
              >
                <div>
                  <RadioGroupItem value="blue" id="blue" className="sr-only" />
                  <Label
                    htmlFor="blue"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-blue-50 p-2 hover:bg-blue-100 has-[:checked]:border-blue-500"
                  >
                    <div className="h-4 w-10 rounded-full bg-blue-600"></div>
                    <span className="text-xs mt-1">Blue</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="green" id="green" className="sr-only" />
                  <Label
                    htmlFor="green"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-green-50 p-2 hover:bg-green-100 has-[:checked]:border-green-500"
                  >
                    <div className="h-4 w-10 rounded-full bg-green-600"></div>
                    <span className="text-xs mt-1">Green</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="purple" id="purple" className="sr-only" />
                  <Label
                    htmlFor="purple"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-purple-50 p-2 hover:bg-purple-100 has-[:checked]:border-purple-500"
                  >
                    <div className="h-4 w-10 rounded-full bg-purple-600"></div>
                    <span className="text-xs mt-1">Purple</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="gray" id="gray" className="sr-only" />
                  <Label
                    htmlFor="gray"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-gray-50 p-2 hover:bg-gray-100 has-[:checked]:border-gray-500"
                  >
                    <div className="h-4 w-10 rounded-full bg-gray-600"></div>
                    <span className="text-xs mt-1">Gray</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Font Style</h4>
              <RadioGroup value={fontStyle} onValueChange={setFontStyle}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="modern" id="modern" />
                  <Label htmlFor="modern">Modern Sans-Serif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="classic" id="classic" />
                  <Label htmlFor="classic">Classic Serif</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="minimal" id="minimal" />
                  <Label htmlFor="minimal">Minimal</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="photo-toggle">Include Photo</Label>
                <div className="text-xs text-muted-foreground">
                  Display worker's photo in the CV
                </div>
              </div>
              <Switch
                id="photo-toggle"
                checked={includePhoto}
                onCheckedChange={setIncludePhoto}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomizationOpen(false)}>Cancel</Button>
            <Button onClick={() => setCustomizationOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CV Preview Dialog */}
      <Dialog open={!!previewWorker && !exportOpen} onOpenChange={(open) => !open && setPreviewWorker(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>CV Preview</DialogTitle>
            <DialogDescription>
              Preview how the CV will look with the {cvTemplates.find(t => t.id === selectedTemplate)?.name} template
            </DialogDescription>
          </DialogHeader>
          
          {previewWorker && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50">
                    <Layout className="mr-1 h-3 w-3" /> {cvTemplates.find(t => t.id === selectedTemplate)?.name}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50">
                    <PenTool className="mr-1 h-3 w-3" /> {fontStyle} fonts
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50">
                    <div className={`mr-1 h-3 w-3 rounded-full bg-${colorScheme}-500`}></div> {colorScheme} theme
                  </Badge>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowTemplates(true)}>
                  Change Template
                </Button>
              </div>
              
              <div className={`border rounded-lg overflow-hidden shadow-sm p-8 bg-white`}>
                <div className={`${selectedTemplate === "modern" ? "flex flex-col" : "flex items-start gap-6"} ${
                  selectedTemplate === "modern" ? "border-t-4" : "border-l-4"
                } ${
                  colorScheme === "blue" ? "border-blue-500" :
                  colorScheme === "green" ? "border-green-500" :
                  colorScheme === "purple" ? "border-purple-500" : "border-gray-500"
                } pb-6`}>
                  {includePhoto && (
                    <Avatar className={`${
                      selectedTemplate === "modern" ? "h-28 w-28 mx-auto mb-4" : "h-32 w-32"
                    }`}>
                      <AvatarFallback className={`text-2xl bg-${colorScheme}-100 text-${colorScheme}-700`}>
                        {previewWorker.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`${selectedTemplate === "modern" ? "text-center" : "flex-1"}`}>
                    <h2 className={`text-3xl font-bold ${fontStyle === "classic" ? "font-serif" : ""}`}>
                      {previewWorker.name}
                    </h2>
                    <p className={`text-lg ${
                      colorScheme === "blue" ? "text-blue-600" :
                      colorScheme === "green" ? "text-green-600" :
                      colorScheme === "purple" ? "text-purple-600" : "text-gray-600"
                    } mt-1`}>
                      {previewWorker.skillLevel} Worker
                    </p>
                    
                    {selectedTemplate === "modern" && (
                      <div className="flex justify-center gap-4 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Age</p>
                          <p className="font-medium">{previewWorker.age} years</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Gender</p>
                          <p className="font-medium">{previewWorker.gender}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Destination</p>
                          <p className="font-medium">{previewWorker.destination}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {selectedTemplate !== "modern" && (
                  <div className="grid grid-cols-3 gap-6 mt-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="font-medium">{previewWorker.age} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium">{previewWorker.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Destination</p>
                      <p className="font-medium">{previewWorker.destination}</p>
                    </div>
                  </div>
                )}

                <div className={`grid ${selectedTemplate === "modern" ? "grid-cols-1 gap-6" : "grid-cols-2 gap-8"} mt-8`}>
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 pb-2 border-b ${
                      colorScheme === "blue" ? "border-blue-200" :
                      colorScheme === "green" ? "border-green-200" :
                      colorScheme === "purple" ? "border-purple-200" : "border-gray-200"
                    } ${fontStyle === "classic" ? "font-serif" : ""}`}>
                      Experience
                    </h3>
                    <p>{previewWorker.experience === "None" ? "No prior experience" : previewWorker.experience}</p>
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 pb-2 border-b ${
                      colorScheme === "blue" ? "border-blue-200" :
                      colorScheme === "green" ? "border-green-200" :
                      colorScheme === "purple" ? "border-purple-200" : "border-gray-200"
                    } ${fontStyle === "classic" ? "font-serif" : ""}`}>
                      Education
                    </h3>
                    <p>{previewWorker.education}</p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className={`text-lg font-semibold mb-3 pb-2 border-b ${
                    colorScheme === "blue" ? "border-blue-200" :
                    colorScheme === "green" ? "border-green-200" :
                    colorScheme === "purple" ? "border-purple-200" : "border-gray-200"
                  } ${fontStyle === "classic" ? "font-serif" : ""}`}>
                    Languages
                  </h3>
                  <div className="flex gap-2">
                    {previewWorker.languages.map((language, index) => (
                      <span key={index} className={`px-2 py-0.5 rounded-full text-sm ${
                        colorScheme === "blue" ? "bg-blue-100 text-blue-800" :
                        colorScheme === "green" ? "bg-green-100 text-green-800" :
                        colorScheme === "purple" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {language}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className={`text-lg font-semibold mb-3 pb-2 border-b ${
                    colorScheme === "blue" ? "border-blue-200" :
                    colorScheme === "green" ? "border-green-200" :
                    colorScheme === "purple" ? "border-purple-200" : "border-gray-200"
                  } ${fontStyle === "classic" ? "font-serif" : ""}`}>
                    Training & Certifications
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {previewWorker.training.map((item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {selectedTemplate === "classic" && (
                  <div className="mt-8 pt-8 border-t text-center">
                    <div className="flex justify-center gap-6">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>+251 XXX XXX XXX</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>agency@example.com</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>Addis Ababa, Ethiopia</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setPreviewWorker(null)}>
                  Close
                </Button>
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Preview
                </Button>
                <Button onClick={() => setExportOpen(true)}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CV
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Options Dialog */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export CV</DialogTitle>
            <DialogDescription>
              Choose your export options
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Export Format</h4>
              <RadioGroup 
                value={exportFormat} 
                onValueChange={setExportFormat}
                className="grid grid-cols-3 gap-2"
              >
                <div>
                  <RadioGroupItem value="pdf" id="pdf" className="sr-only" />
                  <Label
                    htmlFor="pdf"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent has-[:checked]:border-primary"
                  >
                    <FileText className="h-6 w-6 mb-1 text-red-600" />
                    <span className="text-xs">PDF</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="docx" id="docx" className="sr-only" />
                  <Label
                    htmlFor="docx"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent has-[:checked]:border-primary"
                  >
                    <FileText className="h-6 w-6 mb-1 text-blue-600" />
                    <span className="text-xs">DOCX</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="jpg" id="jpg" className="sr-only" />
                  <Label
                    htmlFor="jpg"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent has-[:checked]:border-primary"
                  >
                    <Image className="h-6 w-6 mb-1 text-green-600" />
                    <span className="text-xs">JPG</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recipient-email">Email To (Optional)</Label>
              <Input
                id="recipient-email"
                placeholder="recipient@example.com"
              />
              <p className="text-xs text-muted-foreground">
                Send a copy of the CV directly to an email address
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special requirements or notes for this CV"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => {
                setExportOpen(false);
                setGenerating(true);
                // Simulate generation
                setTimeout(() => {
                  setGenerating(false);
                  setGenerationComplete(true);
                  setTimeout(() => setGenerationComplete(false), 3000);
                }, 2000);
              }}
            >
              Generate & Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search, Filter and Worker List */}
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] border-blue-200">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4 text-blue-500" />
              <SelectValue placeholder="Filter by status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All CVs</SelectItem>
            <SelectItem value="generated">Generated</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="shared">Shared</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="ml-auto border-green-200 text-green-700"
          onClick={() => setShowTemplates(true)}
        >
          <Layout className="mr-2 h-4 w-4" />
          Choose Template
        </Button>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList className="bg-blue-50 p-1">
          <TabsTrigger value="grid" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Layout className="mr-2 h-4 w-4" />
            Grid View
          </TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <FileText className="mr-2 h-4 w-4" />
            List View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredWorkers.map((worker) => (
              <Card 
                key={worker.id} 
                className="overflow-hidden hover:shadow-md transition-all duration-200 hover:border-blue-300"
              >
                <CardHeader className={`p-4 ${
                  worker.status === "generated" 
                    ? "bg-gradient-to-r from-green-50 to-green-100" 
                    : worker.status === "shared"
                    ? "bg-gradient-to-r from-blue-50 to-blue-100"
                    : "bg-gradient-to-r from-yellow-50 to-yellow-100"
                }`}>
                  <div className="flex justify-between">
                    <Badge className={getStatusColor(worker.status)}>
                      {worker.status === "generated" && <CheckCircle className="mr-1 h-3 w-3" />}
                      {worker.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{worker.id}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-12 w-12 bg-blue-100">
                      <AvatarFallback className="text-blue-700 font-medium">
                        {worker.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{worker.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> {worker.skillLevel}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-slate-500" />
                      <span className="text-muted-foreground">Age/Gender:</span>
                    </div>
                    <div>{worker.age} / {worker.gender}</div>
                    
                    <div className="flex items-center gap-1">
                      <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
                      <span className="text-muted-foreground">Education:</span>
                    </div>
                    <div>{worker.education}</div>
                    
                    <div className="flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5 text-green-600" />
                      <span className="text-muted-foreground">Destination:</span>
                    </div>
                    <div>{worker.destination}</div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1">Languages</p>
                    <div className="flex flex-wrap gap-1">
                      {worker.languages.map((language, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-2 bg-slate-50 border-t">
                  <div className="flex w-full gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 text-blue-600"
                      onClick={() => setPreviewWorker(worker)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Preview
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 text-green-600"
                      onClick={() => {
                        setPreviewWorker(worker);
                        setExportOpen(true);
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" /> Export
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="space-y-2">
          {filteredWorkers.map((worker) => (
            <Card key={worker.id} className="hover:border-blue-200 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-blue-100">
                      <AvatarFallback className="text-blue-700">
                        {worker.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{worker.name}</h3>
                        <Badge className={getStatusColor(worker.status)}>
                          {worker.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" /> {worker.skillLevel}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" /> {worker.destination}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setPreviewWorker(worker)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Preview
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => {
                        setPreviewWorker(worker);
                        setExportOpen(true);
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" /> Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Success Notification */}
      {generationComplete && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-200 text-green-800 p-4 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-green-200 rounded-full p-1">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium">CV Generated Successfully!</h4>
            <p className="text-sm">Your file has been created and is ready for download.</p>
          </div>
          <Button variant="ghost" size="sm" className="ml-4" onClick={() => setGenerationComplete(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Loading Overlay */}
      {generating && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex flex-col items-center text-center">
              <div className="relative h-12 w-12 mb-4">
                <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
                <div className="absolute inset-3 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-700" />
                </div>
              </div>
              <h3 className="text-lg font-medium mb-1">Generating CV</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Please wait while we create your professional CV document
              </p>
              <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2">
                <div className="bg-blue-600 h-2.5 rounded-full animate-[progress_2s_ease-in-out_forwards]"></div>
              </div>
              <style jsx>{`
                @keyframes progress {
                  0% { width: 5%; }
                  50% { width: 70%; }
                  100% { width: 100%; }
                }
              `}</style>
              <p className="text-xs text-muted-foreground">This may take a few moments...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
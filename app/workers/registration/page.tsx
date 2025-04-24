"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem,
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  ArrowRight,
  Save,
  Check,
  Upload,
  MapPin,
  Edit,
  List,
  File,
  FileText,
  FileCheck,
  FileX,
  Video,
  FileMedical,
  Shield,
  Award,
  AlertCircle,
  Eye
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function WorkerRegistrationPage() {
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [availableZones, setAvailableZones] = useState<string[]>([]);
  const [availableWoredas, setAvailableWoredas] = useState<string[]>([]);
  const [manualEntry, setManualEntry] = useState(false);
  const [manualRegion, setManualRegion] = useState("");
  const [manualZone, setManualZone] = useState("");
  const [manualWoreda, setManualWoreda] = useState("");

  // Document upload status tracking
  const [uploadStatus, setUploadStatus] = useState({
    passport: { status: "pending", progress: 0 },
    id: { status: "pending", progress: 0 },
    medical: { status: "pending", progress: 0 },
    insurance: { status: "pending", progress: 0 },
    coc: { status: "pending", progress: 0 },
    videoInterview: { status: "pending", progress: 0 }
  });

  // Emergency contact ID document states
  const [emergencyIdUploaded, setEmergencyIdUploaded] = useState(false);
  const [emergencyIdUploading, setEmergencyIdUploading] = useState(false);
  const [emergencyIdProgress, setEmergencyIdProgress] = useState(0);
  const [emergencyIdPreviewOpen, setEmergencyIdPreviewOpen] = useState(false);

  const simulateUpload = (documentType: string) => {
    // Reset status first
    setUploadStatus(prev => ({
      ...prev,
      [documentType]: { status: "uploading", progress: 0 }
    }));

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadStatus(prev => ({
        ...prev,
        [documentType]: { 
          status: progress < 100 ? "uploading" : "complete", 
          progress: progress 
        }
      }));
      
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  };

  // Handle removing the emergency ID
  const handleRemoveEmergencyId = () => {
    setEmergencyIdUploaded(false);
    setEmergencyIdProgress(0);
  };

  // Ethiopian administrative divisions data
  const ethiopianRegions = [
    { value: "addis_ababa", label: "Addis Ababa" },
    { value: "oromia", label: "Oromia" },
    { value: "amhara", label: "Amhara" },
    { value: "tigray", label: "Tigray" },
    { value: "sidama", label: "Sidama" },
    { value: "snnpr", label: "SNNPR" },
    { value: "harari", label: "Harari" },
    { value: "dire_dawa", label: "Dire Dawa" },
    { value: "afar", label: "Afar" },
    { value: "somali", label: "Somali" },
    { value: "benishangul_gumuz", label: "Benishangul-Gumuz" },
    { value: "gambella", label: "Gambella" },
  ];
  
  // Zone data by region
  const zonesByRegion: Record<string, string[]> = {
    addis_ababa: ["Addis Ketema", "Akaky Kaliti", "Arada", "Bole", "Gulele", "Kirkos", "Kolfe Keranio", "Lideta", "Nifas Silk-Lafto", "Yeka"],
    oromia: ["East Hararghe", "West Hararghe", "Arsi", "East Shewa", "West Shewa", "North Shewa", "Southwest Shewa", "Jimma", "Illubabor", "Buno Bedele", "East Wellega", "Horo Guduru Wellega", "Kelem Wellega", "West Wellega", "Borena", "Guji", "West Guji", "North Shewa"],
    amhara: ["North Gondar", "Central Gondar", "South Gondar", "West Gondar", "Awi", "East Gojjam", "West Gojjam", "Wag Hemra", "North Wollo", "South Wollo", "North Shewa", "Oromia Special Zone"],
    tigray: ["Central", "East", "Northwest", "South", "Southeast", "West", "Mekelle"],
    sidama: ["Aleta Wondo", "Aroresa", "Bensa", "Bursa", "Dale", "Dara", "Shebedino", "Wondo Genet"],
    // Add data for other regions as needed
  };
  
  // Woreda data by region and zone
  const woredasByZone: Record<string, Record<string, string[]>> = {
    addis_ababa: {
      "Addis Ketema": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9", "Woreda 10"],
      "Akaky Kaliti": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9"],
      // Add woredas for other zones
    },
    oromia: {
      "East Hararghe": ["Babile", "Bedeno", "Chinaksen", "Deder", "Fadis", "Girawa", "Golo Oda", "Goro Gutu", "Gursum", "Haramaya", "Jarso", "Kersa", "Kombolcha", "Kurfa Chele", "Malka Balo", "Metta", "Midega Tola"],
      "West Hararghe": ["Anchar", "Boke", "Chiro Zuria", "Daro Lebu", "Doba", "Gemechis", "Guba Koricha", "Habro", "Mesela", "Mieso", "Tulo"],
      // Add woredas for other zones
    },
    // Add data for other regions and zones
  };
  
  useEffect(() => {
    if (selectedRegion) {
      setAvailableZones(zonesByRegion[selectedRegion] || []);
      setSelectedZone("");
      setAvailableWoredas([]);
    }
  }, [selectedRegion]);
  
  useEffect(() => {
    if (selectedRegion && selectedZone) {
      setAvailableWoredas(woredasByZone[selectedRegion]?.[selectedZone] || []);
    }
  }, [selectedRegion, selectedZone]);

  const goToNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle emergency ID upload
  const handleEmergencyIdUpload = () => {
    setEmergencyIdUploading(true);
    setEmergencyIdProgress(0);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setEmergencyIdProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setEmergencyIdUploading(false);
        setEmergencyIdUploaded(true);
      }
    }, 100);
  };
  
  // Handle removing the emergency ID
  const handleRemoveEmergencyId = () => {
    setEmergencyIdUploaded(false);
    setEmergencyIdProgress(0);
  };

  // Ethiopian administrative divisions data
  const ethiopianRegions = [
    { value: "addis_ababa", label: "Addis Ababa" },
    { value: "oromia", label: "Oromia" },
    { value: "amhara", label: "Amhara" },
    { value: "tigray", label: "Tigray" },
    { value: "sidama", label: "Sidama" },
    { value: "snnpr", label: "SNNPR" },
    { value: "harari", label: "Harari" },
    { value: "dire_dawa", label: "Dire Dawa" },
    { value: "afar", label: "Afar" },
    { value: "somali", label: "Somali" },
    { value: "benishangul_gumuz", label: "Benishangul-Gumuz" },
    { value: "gambella", label: "Gambella" },
  ];
  
  // Zone data by region
  const zonesByRegion: Record<string, string[]> = {
    addis_ababa: ["Addis Ketema", "Akaky Kaliti", "Arada", "Bole", "Gulele", "Kirkos", "Kolfe Keranio", "Lideta", "Nifas Silk-Lafto", "Yeka"],
    oromia: ["East Hararghe", "West Hararghe", "Arsi", "East Shewa", "West Shewa", "North Shewa", "Southwest Shewa", "Jimma", "Illubabor", "Buno Bedele", "East Wellega", "Horo Guduru Wellega", "Kelem Wellega", "West Wellega", "Borena", "Guji", "West Guji", "North Shewa"],
    amhara: ["North Gondar", "Central Gondar", "South Gondar", "West Gondar", "Awi", "East Gojjam", "West Gojjam", "Wag Hemra", "North Wollo", "South Wollo", "North Shewa", "Oromia Special Zone"],
    tigray: ["Central", "East", "Northwest", "South", "Southeast", "West", "Mekelle"],
    sidama: ["Aleta Wondo", "Aroresa", "Bensa", "Bursa", "Dale", "Dara", "Shebedino", "Wondo Genet"],
    // Add data for other regions as needed
  };
  
  // Woreda data by region and zone
  const woredasByZone: Record<string, Record<string, string[]>> = {
    addis_ababa: {
      "Addis Ketema": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9", "Woreda 10"],
      "Akaky Kaliti": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9"],
      // Add woredas for other zones
    },
    oromia: {
      "East Hararghe": ["Babile", "Bedeno", "Chinaksen", "Deder", "Fadis", "Girawa", "Golo Oda", "Goro Gutu", "Gursum", "Haramaya", "Jarso", "Kersa", "Kombolcha", "Kurfa Chele", "Malka Balo", "Metta", "Midega Tola"],
      "West Hararghe": ["Anchar", "Boke", "Chiro Zuria", "Daro Lebu", "Doba", "Gemechis", "Guba Koricha", "Habro", "Mesela", "Mieso", "Tulo"],
      // Add woredas for other zones
    },
    // Add data for other regions and zones
  };
  
  useEffect(() => {
    if (selectedRegion) {
      setAvailableZones(zonesByRegion[selectedRegion] || []);
      setSelectedZone("");
      setAvailableWoredas([]);
    }
  }, [selectedRegion]);
  
  useEffect(() => {
    if (selectedRegion && selectedZone) {
      setAvailableWoredas(woredasByZone[selectedRegion]?.[selectedZone] || []);
    }
  }, [selectedRegion, selectedZone]);

  const goToNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle emergency ID upload
  const handleEmergencyIdUpload = () => {
    setEmergencyIdUploading(true);
    setEmergencyIdProgress(0);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setEmergencyIdProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setEmergencyIdUploading(false);
        setEmergencyIdUploaded(true);
      }
    }, 100);
  };
  
  // Handle removing the emergency ID
  const handleRemoveEmergencyId = () => {
    setEmergencyIdUploaded(false);
    setEmergencyIdProgress(0);
  };

  // Ethiopian administrative divisions data
  const ethiopianRegions = [
    { value: "addis_ababa", label: "Addis Ababa" },
    { value: "oromia", label: "Oromia" },
    { value: "amhara", label: "Amhara" },
    { value: "tigray", label: "Tigray" },
    { value: "sidama", label: "Sidama" },
    { value: "snnpr", label: "SNNPR" },
    { value: "harari", label: "Harari" },
    { value: "dire_dawa", label: "Dire Dawa" },
    { value: "afar", label: "Afar" },
    { value: "somali", label: "Somali" },
    { value: "benishangul_gumuz", label: "Benishangul-Gumuz" },
    { value: "gambella", label: "Gambella" },
  ];
  
  // Zone data by region
  const zonesByRegion: Record<string, string[]> = {
    addis_ababa: ["Addis Ketema", "Akaky Kaliti", "Arada", "Bole", "Gulele", "Kirkos", "Kolfe Keranio", "Lideta", "Nifas Silk-Lafto", "Yeka"],
    oromia: ["East Hararghe", "West Hararghe", "Arsi", "East Shewa", "West Shewa", "North Shewa", "Southwest Shewa", "Jimma", "Illubabor", "Buno Bedele", "East Wellega", "Horo Guduru Wellega", "Kelem Wellega", "West Wellega", "Borena", "Guji", "West Guji", "North Shewa"],
    amhara: ["North Gondar", "Central Gondar", "South Gondar", "West Gondar", "Awi", "East Gojjam", "West Gojjam", "Wag Hemra", "North Wollo", "South Wollo", "North Shewa", "Oromia Special Zone"],
    tigray: ["Central", "East", "Northwest", "South", "Southeast", "West", "Mekelle"],
    sidama: ["Aleta Wondo", "Aroresa", "Bensa", "Bursa", "Dale", "Dara", "Shebedino", "Wondo Genet"],
    // Add data for other regions as needed
  };
  
  // Woreda data by region and zone
  const woredasByZone: Record<string, Record<string, string[]>> = {
    addis_ababa: {
      "Addis Ketema": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9", "Woreda 10"],
      "Akaky Kaliti": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9"],
      // Add woredas for other zones
    },
    oromia: {
      "East Hararghe": ["Babile", "Bedeno", "Chinaksen", "Deder", "Fadis", "Girawa", "Golo Oda", "Goro Gutu", "Gursum", "Haramaya", "Jarso", "Kersa", "Kombolcha", "Kurfa Chele", "Malka Balo", "Metta", "Midega Tola"],
      "West Hararghe": ["Anchar", "Boke", "Chiro Zuria", "Daro Lebu", "Doba", "Gemechis", "Guba Koricha", "Habro", "Mesela", "Mieso", "Tulo"],
      // Add woredas for other zones
    },
    // Add data for other regions and zones
  };
  
  useEffect(() => {
    if (selectedRegion) {
      setAvailableZones(zonesByRegion[selectedRegion] || []);
      setSelectedZone("");
      setAvailableWoredas([]);
    }
  }, [selectedRegion]);
  
  useEffect(() => {
    if (selectedRegion && selectedZone) {
      setAvailableWoredas(woredasByZone[selectedRegion]?.[selectedZone] || []);
    }
  }, [selectedRegion, selectedZone]);

  const goToNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle emergency ID upload
  const handleEmergencyIdUpload = () => {
    setEmergencyIdUploading(true);
    setEmergencyIdProgress(0);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setEmergencyIdProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setEmergencyIdUploading(false);
        setEmergencyIdUploaded(true);
      }
    }, 100);
  };
  
  // Handle removing the emergency ID
  const handleRemoveEmergencyId = () => {
    setEmergencyIdUploaded(false);
    setEmergencyIdProgress(0);
  };

  // Ethiopian administrative divisions data
  const ethiopianRegions = [
    { value: "addis_ababa", label: "Addis Ababa" },
    { value: "oromia", label: "Oromia" },
    { value: "amhara", label: "Amhara" },
    { value: "tigray", label: "Tigray" },
    { value: "sidama", label: "Sidama" },
    { value: "snnpr", label: "SNNPR" },
    { value: "harari", label: "Harari" },
    { value: "dire_dawa", label: "Dire Dawa" },
    { value: "afar", label: "Afar" },
    { value: "somali", label: "Somali" },
    { value: "benishangul_gumuz", label: "Benishangul-Gumuz" },
    { value: "gambella", label: "Gambella" },
  ];
  
  // Zone data by region
  const zonesByRegion: Record<string, string[]> = {
    addis_ababa: ["Addis Ketema", "Akaky Kaliti", "Arada", "Bole", "Gulele", "Kirkos", "Kolfe Keranio", "Lideta", "Nifas Silk-Lafto", "Yeka"],
    oromia: ["East Hararghe", "West Hararghe", "Arsi", "East Shewa", "West Shewa", "North Shewa", "Southwest Shewa", "Jimma", "Illubabor", "Buno Bedele", "East Wellega", "Horo Guduru Wellega", "Kelem Wellega", "West Wellega", "Borena", "Guji", "West Guji", "North Shewa"],
    amhara: ["North Gondar", "Central Gondar", "South Gondar", "West Gondar", "Awi", "East Gojjam", "West Gojjam", "Wag Hemra", "North Wollo", "South Wollo", "North Shewa", "Oromia Special Zone"],
    tigray: ["Central", "East", "Northwest", "South", "Southeast", "West", "Mekelle"],
    sidama: ["Aleta Wondo", "Aroresa", "Bensa", "Bursa", "Dale", "Dara", "Shebedino", "Wondo Genet"],
    // Add data for other regions as needed
  };
  
  // Woreda data by region and zone
  const woredasByZone: Record<string, Record<string, string[]>> = {
    addis_ababa: {
      "Addis Ketema": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9", "Woreda 10"],
      "Akaky Kaliti": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9"],
      // Add woredas for other zones
    },
    oromia: {
      "East Hararghe": ["Babile", "Bedeno", "Chinaksen", "Deder", "Fadis", "Girawa", "Golo Oda", "Goro Gutu", "Gursum", "Haramaya", "Jarso", "Kersa", "Kombolcha", "Kurfa Chele", "Malka Balo", "Metta", "Midega Tola"],
      "West Hararghe": ["Anchar", "Boke", "Chiro Zuria", "Daro Lebu", "Doba", "Gemechis", "Guba Koricha", "Habro", "Mesela", "Mieso", "Tulo"],
      // Add woredas for other zones
    },
    // Add data for other regions and zones
  };
  
  useEffect(() => {
    if (selectedRegion) {
      setAvailableZones(zonesByRegion[selectedRegion] || []);
      setSelectedZone("");
      setAvailableWoredas([]);
    }
  }, [selectedRegion]);
  
  useEffect(() => {
    if (selectedRegion && selectedZone) {
      setAvailableWoredas(woredasByZone[selectedRegion]?.[selectedZone] || []);
    }
  }, [selectedRegion, selectedZone]);

  const goToNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle emergency ID upload
  const handleEmergencyIdUpload = () => {
    setEmergencyIdUploading(true);
    setEmergencyIdProgress(0);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setEmergencyIdProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setEmergencyIdUploading(false);
        setEmergencyIdUploaded(true);
      }
    }, 100);
  };
  
  // Handle removing the emergency ID
  const handleRemoveEmergencyId = () => {
    setEmergencyIdUploaded(false);
    setEmergencyIdProgress(0);
  };

  // Ethiopian administrative divisions data
  const ethiopianRegions = [
    { value: "addis_ababa", label: "Addis Ababa" },
    { value: "oromia", label: "Oromia" },
    { value: "amhara", label: "Amhara" },
    { value: "tigray", label: "Tigray" },
    { value: "sidama", label: "Sidama" },
    { value: "snnpr", label: "SNNPR" },
    { value: "harari", label: "Harari" },
    { value: "dire_dawa", label: "Dire Dawa" },
    { value: "afar", label: "Afar" },
    { value: "somali", label: "Somali" },
    { value: "benishangul_gumuz", label: "Benishangul-Gumuz" },
    { value: "gambella", label: "Gambella" },
  ];
  
  // Zone data by region
  const zonesByRegion: Record<string, string[]> = {
    addis_ababa: ["Addis Ketema", "Akaky Kaliti", "Arada", "Bole", "Gulele", "Kirkos", "Kolfe Keranio", "Lideta", "Nifas Silk-Lafto", "Yeka"],
    oromia: ["East Hararghe", "West Hararghe", "Arsi", "East Shewa", "West Shewa", "North Shewa", "Southwest Shewa", "Jimma", "Illubabor", "Buno Bedele", "East Wellega", "Horo Guduru Wellega", "Kelem Wellega", "West Wellega", "Borena", "Guji", "West Guji", "North Shewa"],
    amhara: ["North Gondar", "Central Gondar", "South Gondar", "West Gondar", "Awi", "East Gojjam", "West Gojjam", "Wag Hemra", "North Wollo", "South Wollo", "North Shewa", "Oromia Special Zone"],
    tigray: ["Central", "East", "Northwest", "South", "Southeast", "West", "Mekelle"],
    sidama: ["Aleta Wondo", "Aroresa", "Bensa", "Bursa", "Dale", "Dara", "Shebedino", "Wondo Genet"],
    // Add data for other regions as needed
  };
  
  // Woreda data by region and zone
  const woredasByZone: Record<string, Record<string, string[]>> = {
    addis_ababa: {
      "Addis Ketema": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9", "Woreda 10"],
      "Akaky Kaliti": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9"],
      // Add woredas for other zones
    },
    oromia: {
      "East Hararghe": ["Babile", "Bedeno", "Chinaksen", "Deder", "Fadis", "Girawa", "Golo Oda", "Goro Gutu", "Gursum", "Haramaya", "Jarso", "Kersa", "Kombolcha", "Kurfa Chele", "Malka Balo", "Metta", "Midega Tola"],
      "West Hararghe": ["Anchar", "Boke", "Chiro Zuria", "Daro Lebu", "Doba", "Gemechis", "Guba Koricha", "Habro", "Mesela", "Mieso", "Tulo"],
      // Add woredas for other zones
    },
    // Add data for other regions and zones
  };
  
  useEffect(() => {
    if (selectedRegion) {
      setAvailableZones(zonesByRegion[selectedRegion] || []);
      setSelectedZone("");
      setAvailableWoredas([]);
    }
  }, [selectedRegion]);
  
  useEffect(() => {
    if (selectedRegion && selectedZone) {
      setAvailableWoredas(woredasByZone[selectedRegion]?.[selectedZone] || []);
    }
  }, [selectedRegion, selectedZone]);

  const goToNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle emergency ID upload
  const handleEmergencyIdUpload = () => {
    setEmergencyIdUploading(true);
    setEmergencyIdProgress(0);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setEmergencyIdProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setEmergencyIdUploading(false);
        setEmergencyIdUploaded(true);
      }
    }, 100);
  };
  
  // Handle removing the emergency ID
  const handleRemoveEmergencyId = () => {
    setEmergencyIdUploaded(false);
    setEmergencyIdProgress(0);
  };

  // Ethiopian administrative divisions data
  const ethiopianRegions = [
    { value: "addis_ababa", label: "Addis Ababa" },
    { value: "oromia", label: "Oromia" },
    { value: "amhara", label: "Amhara" },
    { value: "tigray", label: "Tigray" },
    { value: "sidama", label: "Sidama" },
    { value: "snnpr", label: "SNNPR" },
    { value: "harari", label: "Harari" },
    { value: "dire_dawa", label: "Dire Dawa" },
    { value: "afar", label: "Afar" },
    { value: "somali", label: "Somali" },
    { value: "benishangul_gumuz", label: "Benishangul-Gumuz" },
    { value: "gambella", label: "Gambella" },
  ];
  
  // Zone data by region
  const zonesByRegion: Record<string, string[]> = {
    addis_ababa: ["Addis Ketema", "Akaky Kaliti", "Arada", "Bole", "Gulele", "Kirkos", "Kolfe Keranio", "Lideta", "Nifas Silk-Lafto", "Yeka"],
    oromia: ["East Hararghe", "West Hararghe", "Arsi", "East Shewa", "West Shewa", "North Shewa", "Southwest Shewa", "Jimma", "Illubabor", "Buno Bedele", "East Wellega", "Horo Guduru Wellega", "Kelem Wellega", "West Wellega", "Borena", "Guji", "West Guji", "North Shewa"],
    amhara: ["North Gondar", "Central Gondar", "South Gondar", "West Gondar", "Awi", "East Gojjam", "West Gojjam", "Wag Hemra", "North Wollo", "South Wollo", "North Shewa", "Oromia Special Zone"],
    tigray: ["Central", "East", "Northwest", "South", "Southeast", "West", "Mekelle"],
    sidama: ["Aleta Wondo", "Aroresa", "Bensa", "Bursa", "Dale", "Dara", "Shebedino", "Wondo Genet"],
    // Add data for other regions as needed
  };
  
  // Woreda data by region and zone
  const woredasByZone: Record<string, Record<string, string[]>> = {
    addis_ababa: {
      "Addis Ketema": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9", "Woreda 10"],
      "Akaky Kaliti": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9"],
      // Add woredas for other zones
    },
    oromia: {
      "East Hararghe": ["Babile", "Bedeno", "Chinaksen", "Deder", "Fadis", "Girawa", "Golo Oda", "Goro Gutu", "Gursum", "Haramaya", "Jarso", "Kersa", "Kombolcha", "Kurfa Chele", "Malka Balo", "Metta", "Midega Tola"],
      "West Hararghe": ["Anchar", "Boke", "Chiro Zuria", "Daro Lebu", "Doba", "Gemechis", "Guba Koricha", "Habro", "Mesela", "Mieso", "Tulo"],
      // Add woredas for other zones
    },
    // Add data for other regions and zones
  };
  
  useEffect(() => {
    if (selectedRegion) {
      setAvailableZones(zonesByRegion[selectedRegion] || []);
      setSelectedZone("");
      setAvailableWoredas([]);
    }
  }, [selectedRegion]);
  
  useEffect(() => {
    if (selectedRegion && selectedZone) {
      setAvailableWoredas(woredasByZone[selectedRegion]?.[selectedZone] || []);
    }
  }, [selectedRegion, selectedZone]);

  const goToNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle emergency ID upload
  const handleEmergencyIdUpload = () => {
    setEmergencyIdUploading(true);
    setEmergencyIdProgress(0);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setEmergencyIdProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setEmergencyIdUploading(false);
        setEmergencyIdUploaded(true);
      }
    }, 100);
  };
  
  // Handle removing the emergency ID
  const handleRemoveEmergencyId = () => {
    setEmergencyIdUploaded(false);
    setEmergencyIdProgress(0);
  };

  // Ethiopian administrative divisions data
  const ethiopianRegions = [
    { value: "addis_ababa", label: "Addis Ababa" },
    { value: "oromia", label: "Oromia" },
    { value: "amhara", label: "Amhara" },
    { value: "tigray", label: "Tigray" },
    { value: "sidama", label: "Sidama" },
    { value: "snnpr", label: "SNNPR" },
    { value: "harari", label: "Harari" },
    { value: "dire_dawa", label: "Dire Dawa" },
    { value: "afar", label: "Afar" },
    { value: "somali", label: "Somali" },
    { value: "benishangul_gumuz", label: "Benishangul-Gumuz" },
    { value: "gambella", label: "Gambella" },
  ];
  
  // Zone data by region
  const zonesByRegion: Record<string, string[]> = {
    addis_ababa: ["Addis Ketema", "Akaky Kaliti", "Arada", "Bole", "Gulele", "Kirkos", "Kolfe Keranio", "Lideta", "Nifas Silk-Lafto", "Yeka"],
    oromia: ["East Hararghe", "West Hararghe", "Arsi", "East Shewa", "West Shewa", "North Shewa", "Southwest Shewa", "Jimma", "Illubabor", "Buno Bedele", "East Wellega", "Horo Guduru Wellega", "Kelem Wellega", "West Wellega", "Borena", "Guji", "West Guji", "North Shewa"],
    amhara: ["North Gondar", "Central Gondar", "South Gondar", "West Gondar", "Awi", "East Gojjam", "West Gojjam", "Wag Hemra", "North Wollo", "South Wollo", "North Shewa", "Oromia Special Zone"],
    tigray: ["Central", "East", "Northwest", "South", "Southeast", "West", "Mekelle"],
    sidama: ["Aleta Wondo", "Aroresa", "Bensa", "Bursa", "Dale", "Dara", "Shebedino", "Wondo Genet"],
    // Add data for other regions as needed
  };
  
  // Woreda data by region and zone
  const woredasByZone: Record<string, Record<string, string[]>> = {
    addis_ababa: {
      "Addis Ketema": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9", "Woreda 10"],
      "Akaky Kaliti": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9"],
      // Add woredas for other zones
    },
    oromia: {
      "East Hararghe": ["Babile", "Bedeno", "Chinaksen", "Deder", "Fadis", "Girawa", "Golo Oda", "Goro Gutu", "Gursum", "Haramaya", "Jarso", "Kersa", "Kombolcha", "Kurfa Chele", "Malka Balo", "Metta", "Midega Tola"],
      "West Hararghe": ["Anchar", "Boke", "Chiro Zuria", "Daro Lebu", "Doba", "Gemechis", "Guba Koricha", "Habro", "Mesela", "Mieso", "Tulo"],
      // Add woredas for other zones
    },
    // Add data for other regions and zones
  };
  
  useEffect(() => {
    if (selectedRegion) {
      setAvailableZones(zonesByRegion[selectedRegion] || []);
      setSelectedZone("");
      setAvailableWoredas([]);
    }
  }, [selectedRegion]);
  
  useEffect(() => {
    if (selectedRegion && selectedZone) {
      setAvailableWoredas(woredasByZone[selectedRegion]?.[selectedZone] || []);
    }
  }, [selectedRegion, selectedZone]);

  const goToNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle emergency ID upload
  const handleEmergencyIdUpload = () => {
    setEmergencyIdUploading(true);
    setEmergencyIdProgress(0);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setEmergencyIdProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setEmergencyIdUploading(false);
        setEmergencyIdUploaded(true);
      }
    }, 100);
  };
  
  // Handle removing the emergency ID
  const handleRemoveEmergencyId = () => {
    setEmergencyIdUploaded(false);
    setEmergencyIdProgress(0);
  };

  // Ethiopian administrative divisions data
  const ethiopianRegions = [
    { value: "addis_ababa", label: "Addis Ababa" },
    { value: "oromia", label: "Oromia" },
    { value: "amhara", label: "Amhara" },
    { value: "tigray", label: "Tigray" },
    { value: "sidama", label: "Sidama" },
    { value: "snnpr", label: "SNNPR" },
    { value: "harari", label: "Harari" },
    { value: "dire_dawa", label: "Dire Dawa" },
    { value: "afar", label: "Afar" },
    { value: "somali", label: "Somali" },
    { value: "benishangul_gumuz", label: "Benishangul-Gumuz" },
    { value: "gambella", label: "Gambella" },
  ];
  
  // Zone data by region
  const zonesByRegion: Record<string, string[]> = {
    addis_ababa: ["Addis Ketema", "Akaky Kaliti", "Arada", "Bole", "Gulele", "Kirkos", "Kolfe Keranio", "Lideta", "Nifas Silk-Lafto", "Yeka"],
    oromia: ["East Hararghe", "West Hararghe", "Arsi", "East Shewa", "West Shewa", "North Shewa", "Southwest Shewa", "Jimma", "Illubabor", "Buno Bedele", "East Wellega", "Horo Guduru Wellega", "Kelem Wellega", "West Wellega", "Borena", "Guji", "West Guji", "North Shewa"],
    amhara: ["North Gondar", "Central Gondar", "South Gondar", "West Gondar", "Awi", "East Gojjam", "West Gojjam", "Wag Hemra", "North Wollo", "South Wollo", "North Shewa", "Oromia Special Zone"],
    tigray: ["Central", "East", "Northwest", "South", "Southeast", "West", "Mekelle"],
    sidama: ["Aleta Wondo", "Aroresa", "Bensa", "Bursa", "Dale", "Dara", "Shebedino", "Wondo Genet"],
    // Add data for other regions as needed
  };
  
  // Woreda data by region and zone
  const woredasByZone: Record<string, Record<string, string[]>> = {
    addis_ababa: {
      "Addis Ketema": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9", "Woreda 10"],
      "Akaky Kaliti": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9"],
      // Add woredas for other zones
    },
    oromia: {
      "East Hararghe": ["Babile", "Bedeno", "Chinaksen", "Deder", "Fadis", "Girawa", "Golo Oda", "Goro Gutu", "Gursum", "Haramaya", "Jarso", "Kersa", "Kombolcha", "Kurfa Chele", "Malka Balo", "Metta", "Midega Tola"],
      "West Hararghe": ["Anchar", "Boke", "Chiro Zuria", "Daro Lebu", "Doba", "Gemechis", "Guba Koricha", "Habro", "Mesela", "Mieso", "Tulo"],
      // Add woredas for other zones
    },
    // Add data for other regions and zones
  };
  
  useEffect(() => {
    if (selectedRegion) {
      setAvailableZones(zonesByRegion[selectedRegion] || []);
      setSelectedZone("");
      setAvailableWoredas([]);
    }
  }, [selectedRegion]);
  
  useEffect(() => {
    if (selectedRegion && selectedZone) {
      setAvailableWoredas(woredasByZone[selectedRegion]?.[selectedZone] || []);
    }
  }, [selectedRegion, selectedZone]);

  const goToNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle emergency ID upload
  const handleEmergencyIdUpload = () => {
    setEmergencyIdUploading(true);
    setEmergencyIdProgress(0);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setEmergencyIdProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setEmergencyIdUploading(false);
        setEmergencyIdUploaded(true);
      }
    }, 100);
  };
  
  // Handle removing the emergency ID
  const handleRemoveEmergencyId = () => {
    setEmergencyIdUploaded(false);
    setEmergencyIdProgress(0);
  };

  // Ethiopian administrative divisions data
  const ethiopianRegions = [
    { value: "addis_ababa", label: "Addis Ababa" },
    { value: "oromia", label: "Oromia" },
    { value: "amhara", label: "Amhara" },
    { value: "tigray", label: "Tigray" },
    { value: "sidama", label: "Sidama" },
    { value: "snnpr", label: "SNNPR" },
    { value: "harari", label: "Harari" },
    { value: "dire_dawa", label: "Dire Dawa" },
    { value: "afar", label: "Afar" },
    { value: "somali", label: "Somali" },
    { value: "benishangul_gumuz", label: "Benishangul-Gumuz" },
    { value: "gambella", label: "Gambella" },
  ];
  
  // Zone data by region
  const zonesByRegion: Record<string, string[]> = {
    addis_ababa: ["Addis Ketema", "Akaky Kaliti", "Arada", "Bole", "Gulele", "Kirkos", "Kolfe Keranio", "Lideta", "Nifas Silk-Lafto", "Yeka"],
    oromia: ["East Hararghe", "West Hararghe", "Arsi", "East Shewa", "West Shewa", "North Shewa", "Southwest Shewa", "Jimma", "Illubabor", "Buno Bedele", "East Wellega", "Horo Guduru Wellega", "Kelem Wellega", "West Wellega", "Borena", "Guji", "West Guji", "North Shewa"],
    amhara: ["North Gondar", "Central Gondar", "South Gondar", "West Gondar", "Awi", "East Gojjam", "West Gojjam", "Wag Hemra", "North Wollo", "South Wollo", "North Shewa", "Oromia Special Zone"],
    tigray: ["Central", "East", "Northwest", "South", "Southeast", "West", "Mekelle"],
    sidama: ["Aleta Wondo", "Aroresa", "Bensa", "Bursa", "Dale", "Dara", "Shebedino", "Wondo Genet"],
    // Add data for other regions as needed
  };
  
  // Woreda data by region and zone
  const woredasByZone: Record<string, Record<string, string[]>> = {
    addis_ababa: {
      "Addis Ketema": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9", "Woreda 10"],
      "Akaky Kaliti": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9"],
      // Add woredas for other zones
    },
    oromia: {
      "East Hararghe": ["Babile", "Bedeno", "Chinaksen", "Deder", "Fadis", "Girawa", "Golo Oda", "Goro Gutu", "Gursum", "Haramaya", "Jarso", "Kersa", "Kombolcha", "Kurfa Chele", "Malka Balo", "Metta", "Midega Tola"],
      "West Hararghe": ["Anchar", "Boke", "Chiro Zuria", "Daro Lebu", "Doba", "Gemechis", "Guba Koricha", "Habro", "Mesela", "Mieso", "Tulo"],
      // Add woredas for other zones
    },
    // Add data for other regions and zones
  };
  
  useEffect(() => {
    if (selectedRegion) {
      setAvailableZones(zonesByRegion[selectedRegion] || []);
      setSelectedZone("");
      setAvailableWoredas([]);
    }
  }, [selectedRegion]);
  
  useEffect(() => {
    if (selectedRegion && selectedZone) {
      setAvailableWoredas(woredasByZone[selectedRegion]?.[selectedZone] || []);
    }
  }, [selectedRegion, selectedZone]);

  const goToNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle emergency ID upload
  const handleEmergencyIdUpload = () => {
    setEmergencyIdUploading(true);
    setEmergencyIdProgress(0);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setEmergencyIdProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setEmergencyIdUploading(false);
        setEmergencyIdUploaded(true);
      }
    }, 100);
  };
  
  // Handle removing the emergency ID
  const handleRemoveEmergencyId = () => {
    setEmergencyIdUploaded(false);
    setEmergencyIdProgress(0);
  };

  // Ethiopian administrative divisions data
  const ethiopianRegions = [
    { value: "addis_ababa", label: "Addis Ababa" },
    { value: "oromia", label: "Oromia" },
    { value: "amhara", label: "Amhara" },
    { value: "tigray", label: "Tigray" },
    { value: "sidama", label: "Sidama" },
    { value: "snnpr", label: "SNNPR" },
    { value: "harari", label: "Harari" },
    { value: "dire_dawa", label: "Dire Dawa" },
    { value: "afar", label: "Afar" },
    { value: "somali", label: "Somali" },
    { value: "benishangul_gumuz", label: "Benishangul-Gumuz" },
    { value: "gambella", label: "Gambella" },
  ];
  
  // Zone data by region
  const zonesByRegion: Record<string, string[]> = {
    addis_ababa: ["Addis Ketema", "Akaky Kaliti", "Arada", "Bole", "Gulele", "Kirkos", "Kolfe Keranio", "Lideta", "Nifas Silk-Lafto", "Yeka"],
    oromia: ["East Hararghe", "West Hararghe", "Arsi", "East Shewa", "West Shewa", "North Shewa", "Southwest Shewa", "Jimma", "Illubabor", "Buno Bedele", "East Wellega", "Horo Guduru Wellega", "Kelem Wellega", "West Wellega", "Borena", "Guji", "West Guji", "North Shewa"],
    amhara: ["North Gondar", "Central Gondar", "South Gondar", "West Gondar", "Awi", "East Gojjam", "West Gojjam", "Wag Hemra", "North Wollo", "South Wollo", "North Shewa", "Oromia Special Zone"],
    tigray: ["Central", "East", "Northwest", "South", "Southeast", "West", "Mekelle"],
    sidama: ["Aleta Wondo", "Aroresa", "Bensa", "Bursa", "Dale", "Dara", "Shebedino", "Wondo Genet"],
    // Add data for other regions as needed
  };
  
  // Woreda data by region and zone
  const woredasByZone: Record<string, Record<string, string[]>> = {
    addis_ababa: {
      "Addis Ketema": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9", "Woreda 10"],
      "Akaky Kaliti": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9"],
      // Add woredas for other zones
    },
    oromia: {
      "East Hararghe": ["Babile", "Bedeno", "Chinaksen", "Deder", "Fadis", "Girawa", "Golo Oda", "Goro Gutu", "Gursum", "Haramaya", "Jarso", "Kersa", "Kombolcha", "Kurfa Chele", "Malka Balo", "Metta", "Midega Tola"],
      "West Hararghe": ["Anchar", "Boke", "Chiro Zuria", "Daro Lebu", "Doba", "Gemechis", "Guba Koricha", "Habro", "Mesela", "Mieso", "Tulo"],
      // Add woredas for other zones
    },
    // Add data for other regions and zones
  };
  
  useEffect(() => {
    if (selectedRegion) {
      setAvailableZones(zonesByRegion[selectedRegion] || []);
      setSelectedZone("");
      setAvailableWoredas([]);
    }
  }, [selectedRegion]);
  
  useEffect(() => {
    if (selectedRegion && selectedZone) {
      setAvailableWoredas(woredasByZone[selectedRegion]?.[selectedZone] || []);
    }
  }, [selectedRegion, selectedZone]);

  const goToNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle emergency ID upload
  const handleEmergencyIdUpload = () => {
    setEmergencyIdUploading(true);
    setEmergencyIdProgress(0);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setEmergencyIdProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setEmergencyIdUploading(false);
        setEmergencyIdUploaded(true);
      }
    }, 100);
  };
  
  // Handle removing the emergency ID
  const handleRemoveEmergencyId = () => {
    setEmergencyIdUploaded(false);
    setEmergencyIdProgress(0);
  };

  // Ethiopian administrative divisions data
  const ethiopianRegions = [
    { value: "addis_ababa", label: "Addis Ababa" },
    { value: "oromia", label: "Oromia" },
    { value: "amhara", label: "Amhara" },
    { value: "tigray", label: "Tigray" },
    { value: "sidama", label: "Sidama" },
    { value: "snnpr", label: "SNNPR" },
    { value: "harari", label: "Harari" },
    { value: "dire_dawa", label: "Dire Dawa" },
    { value: "afar", label: "Afar" },
    { value: "somali", label: "Somali" },
    { value: "benishangul_gumuz", label: "Benishangul-Gumuz" },
    { value: "gambella", label: "Gambella" },
  ];
  
  // Zone data by region
  const zonesByRegion: Record<string, string[]> = {
    addis_ababa: ["Addis Ketema", "Akaky Kaliti", "Arada", "Bole", "Gulele", "Kirkos", "Kolfe Keranio", "Lideta", "Nifas Silk-Lafto", "Yeka"],
    oromia: ["East Hararghe", "West Hararghe", "Arsi", "East Shewa", "West Shewa", "North Shewa", "Southwest Shewa", "Jimma", "Illubabor", "Buno Bedele", "East Wellega", "Horo Guduru Wellega", "Kelem Wellega", "West Wellega", "Borena", "Guji", "West Guji", "North Shewa"],
    amhara: ["North Gondar", "Central Gondar", "South Gondar", "West Gondar", "Awi", "East Gojjam", "West Gojjam", "Wag Hemra", "North Wollo", "South Wollo", "North Shewa", "Oromia Special Zone"],
    tigray: ["Central", "East", "Northwest", "South", "Southeast", "West", "Mekelle"],
    sidama: ["Aleta Wondo", "Aroresa", "Bensa", "Bursa", "Dale", "Dara", "Shebedino", "Wondo Genet"],
    // Add data for other regions as needed
  };
  
  // Woreda data by region and zone
  const woredasByZone: Record<string, Record<string, string[]>> = {
    addis_ababa: {
      "Addis Ketema": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9", "Woreda 10"],
      "Akaky Kaliti": ["Woreda 1", "Woreda 2", "Woreda 3", "Woreda 4", "Woreda 5", "Woreda 6", "Woreda 7", "Woreda 8", "Woreda 9"],
      // Add woredas for other zones
    },
    oromia: {
      "East Hararghe": ["Babile", "Bedeno", "Chinaksen", "Deder", "Fadis", "Girawa", "Golo Oda", "Goro Gutu", "Gursum", "Haramaya", "Jarso", "Kersa", "Kombolcha", "Kurfa Chele", "Malka Balo", "Metta", "Midega Tola"],
      "West Hararghe": ["Anchar", "Boke", "Chiro Zuria", "Daro Lebu", "Doba", "Gemechis", "Guba Koricha", "Habro", "Mesela", "Mieso", "Tulo"],
      // Add woredas for other zones
    },
    // Add data for other regions and zones
  };
  
  useEffect(() => {
    if (selectedRegion) {
      setAvailableZones(zonesByRegion[selectedRegion] || []);
      setSelectedZone("");
      setAvailableWoredas([]);
    }
  }, [selectedRegion]);
  
  useEffect(() => {
    if (selectedRegion && selectedZone) {
      setAvailableWoredas(woredasByZone[selectedRegion]?.[selectedZone] || []);
    }
  }, [selectedRegion, selectedZone]);

  const goToNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const goToPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle emergency ID upload
  const handleEmergencyIdUpload = () => {
    setEmergencyIdUploading(true);
    setEmergencyIdProgress(0);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setEmergencyIdProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setEmergencyIdUploading(false);
        setEmergencyIdUploaded(true);
      }
    }, 100);
  };
  
  // Handle removing the emergency ID
  const handleRemoveEmergencyId = () => {
    setEmergencyIdUploaded(false);
    setEmergencyIdProgress(0);
  };

  // Ethiopian administrative divisions data
  const ethiopianRegions = [
    { value: "addis_ababa", label: "Addis Ababa" },
    { value: "oromia", label: "Oromia" },
    { value: "amhara", label: "Amhara" },
    { value: "tigray", label: "Tigray" },
    { value: "sidama", label: "Sidama" },
    { value: "snnpr", label: "SNNPR" },
    { value: "harari", label: "Harari" },
    { value: "dire_dawa", label: "Dire Dawa" },
    { value: "afar", label: "Afar" },
    { value: "somali", label: "Somali" },
    { value: "benishangul_gumuz", label: "Benishangul-Gumuz" },
    { value: "gambella", label: "Gambella" },
  ];
  
  // Zone data by region
  const zonesByRegion: Record<string, string[]> = {
    addis_ababa: ["Addis Ketema", "Akaky Kaliti", "Arada", "Bole", "Gulele", "Kirkos", "Kolfe Keranio", "Lideta", "Nifas Silk-Lafto", "Yeka"],
    oromia: ["East Hararghe", "West Hararghe", "Arsi", "East Shewa", "West Shewa", "North Shewa", "Southwest Shewa", "Jimma", "Illubabor", "Buno Bedele", "East Wellega", "Horo Guduru Wellega", "Kelem Wellega", "West Wellega", "Borena", "Guji", "West Guji", "North Shewa"],
    amhara: ["North Gondar", "Central Gondar", "South Gondar", "West Gondar", "Awi", "East Gojjam", "West Gojjam", "Wag Hemra", "North Wollo", "South Wollo", "North Shewa"
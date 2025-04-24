// DocumentStatusBadge component
export function DocumentStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pending_review":
      return <Badge variant="outline">Pending Review</Badge>;
    case "approved":
      return <Badge className="bg-green-500">Approved</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    case "needs_correction":
      return <Badge variant="warning">Needs Correction</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}// DocumentStatusBadge component
export function DocumentStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pending_review":
      return <Badge variant="outline">Pending Review</Badge>;
    case "approved":
      return <Badge className="bg-green-500">Approved</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    case "needs_correction":
      return <Badge variant="warning">Needs Correction</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}// FilterSelect component
interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function FilterSelect({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = "Select option" 
}: FilterSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}// theme.ts
export const theme = {
  colors: {
    primary: {
      main: '#3b82f6',
      light: '#93c5fd',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#8b5cf6',
      light: '#c4b5fd',
      dark: '#6d28d9',
    },
    // Add more color definitions
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    // Add more spacing values
  },
  // Add typography, breakpoints, etc.
}// theme.ts
export const theme = {
  colors: {
    primary: {
      main: '#3b82f6',
      light: '#93c5fd',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#8b5cf6',
      light: '#c4b5fd',
      dark: '#6d28d9',
    },
    // Add more color definitions
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    // Add more spacing values
  },
  // Add typography, breakpoints, etc.
}// styles.ts
import { theme } from './theme';

export const styles = {
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  card: {
    borderRadius: 8,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  // Add more reusable styles
}// useFilters.ts
import { useState } from 'react';

export function useFilters<T extends Record<string, any>>(initialFilters: T) {
  const [filters, setFilters] = useState<T>(initialFilters);
  
  const updateFilter = (key: keyof T, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  
  const resetFilters = () => {
    setFilters(initialFilters);
  };
  
  return {
    filters,
    updateFilter,
    resetFilters,
    setFilters,
  };
}// useFilters.ts
import { useState } from 'react';

export function useFilters<T extends Record<string, any>>(initialFilters: T) {
  const [filters, setFilters] = useState<T>(initialFilters);
  
  const updateFilter = (key: keyof T, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  
  const resetFilters = () => {
    setFilters(initialFilters);
  };
  
  return {
    filters,
    updateFilter,
    resetFilters,
    setFilters,
  };
}// documentContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface DocumentContextType {
  documents: Document[];
  loading: boolean;
  error: Error | null;
  refreshDocuments: () => Promise<void>;
  uploadDocument: (file: any, type: string) => Promise<any>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Implement the same logic as in your useDocuments hook
  
  return (
    <DocumentContext.Provider value={{
      documents,
      loading,
      error,
      refreshDocuments,
      uploadDocument,
    }}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocumentContext() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
}// Example with react-hook-form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  passportNumber: z.string().min(5, 'Invalid passport number'),
  destination: z.string().min(2, 'Destination is required'),
});

export function WorkerRegistrationForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      passportNumber: '',
      destination: '',
    },
  });
  
  const onSubmit = (data) => {
    // Handle form submission
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { Card, Title, Paragraph, Badge, Divider, Button, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { theme } from '../theme';

type DocumentDetail = {
  id: string;
  worker_name: string;
  document_type: string;
  description: string | null;
  status: string;
  submitted_at: string | null;
  processed_at: string | null;
  processing_time: number | null;
  processor_name: string | null;
  file_url: string | null;
  comments: string | null;
};

export default function DocumentDetailScreen({ route, navigation }) {
  const { documentId } = route.params;
  const [document, setDocument] = useState<DocumentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDocumentDetail();
  }, [documentId]);

  const fetchDocumentDetail = async () => {
    try {
      setIsLoading(true);
      
      // Replace with your actual Supabase query
      const { data, error } = await supabase
        .from('documents')
        .select('*, workers(name)')
        .eq('id', documentId)
        .single();
      
      if (error) throw error;
      
      // Format the data
      const formattedData = {
        ...data,
        worker_name: data.workers?.name || 'Unknown Worker',
      };
      
      setDocument(formattedData);
    } catch (error) {
      console.error('Error fetching document details:', error);
      Alert.alert('Error', 'Failed to load document details');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <Badge style={styles.pendingBadge}>Pending Review</Badge>;
      case 'approved':
        return <Badge style={styles.approvedBadge}>Approved</Badge>;
      case 'rejected':
        return <Badge style={styles.rejectedBadge}>Rejected</Badge>;
      case 'expired':
        return <Badge style={styles.expiredBadge}>Expired</Badge>;
      case 'needs_correction':
        return <Badge style={styles.correctionBadge}>Needs Correction</Badge>;
      default:
        return <Badge style={styles.defaultBadge}>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPP');
  };

  const formatDocumentType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const openDocument = async () => {
    if (!document?.file_url) {
      Alert.alert('Error', 'Document URL not available');
      return;
    }

    try {
      const supported = await Linking.canOpenURL(document.file_url);
      
      if (supported) {
        await Linking.openURL(document.file_url);
      } else {
        Alert.alert('Error', 'Cannot open this document URL');
      }
    } catch (error) {
      console.error('Error opening document:', error);
      Alert.alert('Error', 'Failed to open document');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading document details...</Text>
      </View>
    );
  }

  if (!document) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#F44336" />
        <Text style={styles.errorText}>Document not found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title>{formatDocumentType(document.document_type)}</Title>
            {getStatusBadge(document.status)}
          </View>
          
          <Paragraph style={styles.workerName}>
            Worker: {document.worker_name}
          </Paragraph>
          
          {document.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{document.description}</Text>
            </View>
          )}
          
          <Divider style={styles.divider} />
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Document Timeline</Text>
            
            <View style={styles.timelineItem}>
              <MaterialCommunityIcons name="upload" size={24} color={theme.colors.primary} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Submitted</Text>
                <Text style={styles.timelineDate}>{formatDate(document.submitted_at)}</Text>
              </View>
            </View>
            
            {document.processed_at && (
              <View style={styles.timelineItem}>
                <MaterialCommunityIcons 
                  name={document.status === 'approved' ? 'check-circle' : 'alert-circle'} 
                  size={24} 
                  color={document.status === 'approved' ? '#4CAF50' : '#F44336'} 
                />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>
                    {document.status === 'approved' ? 'Approved' : 
                     document.status === 'rejected' ? 'Rejected' : 'Processed'}
                  </Text>
                  <Text style={styles.timelineDate}>{formatDate(document.processed_at)}</Text>
                  {document.processor_name && (
                    <Text style={styles.processorName}>By: {document.processor_name}</Text>
                  )}
                </View>
              </View>
            )}
            
            {document.processing_time && (
              <View style={styles.processingTimeContainer}>
                <Text style={styles.processingTimeLabel}>Processing Time:</Text>
                <Text style={styles.processingTimeValue}>
                  {document.processing_time.toFixed(1)} hours
                </Text>
              </View>
            )}
          </View>
          
          {document.comments && (
            <>
              <Divider style={styles.divider} />
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Comments</Text>
                <Text style={styles.comments}>{document.comments}</Text>
              </View>
            </>
          )}
        </Card.Content>
      </Card>
      
      {document.file_url && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Document Preview</Text>
            
            {document.file_url.toLowerCase().endsWith('.pdf') ? (
              <View style={styles.pdfPreview}>
                <MaterialCommunityIcons name="file-pdf-box" size={64} color={theme.colors.primary} />
                <Text style={styles.pdfText}>PDF Document</Text>
              </View>
            ) : (
              <Image 
                source={{ uri: document.file_url }} 
                style={styles.imagePreview}
                resizeMode="contain"
              />
            )}
          </Card.Content>
          
          <Card.Actions>
            <Button mode="contained" onPress={openDocument}>
              Open Document
            </Button>
          </Card.Actions>
        </Card>
      )}
      
      <View style={styles.actionButtons}>
        <Button 
          mode="outlined" 
          icon="arrow-left" 
          onPress={() => navigation.goBack()}
          style={styles.actionButton}
        >
          Back
        </Button>
        
        {document.status === 'needs_correction' && (
          <Button 
            mode="contained" 
            icon="upload" 
            onPress={() => navigation.navigate('UploadDocument', { 
              documentType: document.document_type,
              isResubmission: true,
              originalDocumentId: document.id
            })}
            style={styles.actionButton}
          >
            Resubmit
          </Button>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginVertical: 16,
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workerName: {
    fontSize: 16,
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineContent: {
    marginLeft: 16,
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  timelineDate: {
    fontSize: 14,
    color: '#666',
  },
  processorName: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  processingTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  processingTimeLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  processingTimeValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  comments: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  pdfPreview: {
    height: 200,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 16,
  },
  pdfText: {
    marginTop: 8,
    fontSize: 16,
  },
  imagePreview:
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, FAB, ActivityIndicator, Chip } from 'react-native-paper';
import { Calendar as RNCalendar, Agenda } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { theme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';

export default function CalendarScreen({ navigation }) {
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'agenda'
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  // Add this function to fetch document-related events
  const fetchDocumentEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['pending', 'approved'])
        .gte('deadline', new Date(new Date().setDate(new Date().getDate() - 30)).toISOString())
        .lte('deadline', new Date(new Date().setDate(new Date().getDate() + 90)).toISOString());
      
      if (error) throw error;
      
      // Convert document deadlines to calendar events
      const documentEvents = {};
      (data || []).forEach(doc => {
        if (!doc.deadline) return;
        
        const dateStr = doc.deadline.split('T')[0];
        const eventColor = doc.status === 'pending' ? theme.colors.warning : theme.colors.success;
        
        if (!documentEvents[dateStr]) {
          documentEvents[dateStr] = {
            marked: true,
            dotColor: eventColor,
            events: []
          };
        }
        
        documentEvents[dateStr].events.push({
          id: `doc-${doc.id}`,
          title: `Document: ${doc.title || 'Untitled'}`,
          start_date: doc.deadline,
          color: eventColor,
          type: 'document',
          document_id: doc.id
        });
      });
      
      return documentEvents;
    } catch (error) {
      console.error('Error fetching document events:', error);
      return {};
    }
  };
  
  // Modify your fetchEvents function to include document events
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      // Fetch regular events (existing code)
      // ... existing code ...
      // Fetch document events
      const documentEvents = await fetchDocumentEvents();
      
      // Combine all events
      const allFormattedEvents = { ...formattedEvents };
      
      // Merge document events with regular events
      Object.keys(documentEvents).forEach(date => {
        if (!allFormattedEvents[date]) {
          allFormattedEvents[date] = documentEvents[date];
        } else {
          allFormattedEvents[date].events = [
            ...allFormattedEvents[date].events,
            ...documentEvents[date].events
          ];
        }
      });
      
      setEvents(allFormattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleAddEvent = () => {
    navigation.navigate('AddEvent', {
      date: selectedDate,
      onEventAdded: fetchEvents
    });
  };

  const handleEventPress = (event) => {
    navigation.navigate('EventDetails', {
      eventId: event.id,
      onEventUpdated: fetchEvents
    });
  };

  const getMarkedDates = () => {
    const markedDates = {};
    
    Object.keys(events).forEach(date => {
      markedDates[date] = {
        marked: true,
        dotColor: events[date].dotColor
      };
    });
    
    // Add selected date
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: theme.colors.primary
    };
    
    return markedDates;
  };

  const renderEventItem = (event) => {
    return (
      <TouchableOpacity
        onPress={() => handleEventPress(event)}
        style={styles.eventItem}
      >
        <View style={[styles.eventColor, { backgroundColor: event.color || theme.colors.primary }]} />
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventTime}>
            {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {event.end_date && ` - ${new Date(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
          </Text>
          {event.location && (
            <Text style={styles.eventLocation}>
              <MaterialCommunityIcons name="map-marker" size={14} />
              {' '}{event.location}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderAgendaItem = (item) => {
    return (
      <Card style={styles.agendaItem} onPress={() => handleEventPress(item)}>
        <Card.Content>
          <View style={styles.agendaItemHeader}>
            <View style={[styles.eventColor, { backgroundColor: item.color || theme.colors.primary }]} />
            <Title style={styles.agendaItemTitle}>{item.title}</Title>
          </View>
          <Paragraph style={styles.agendaItemTime}>
            {new Date(item.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {item.end_date && ` - ${new Date(item.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
          </Paragraph>
          {item.location && (
            <Paragraph style={styles.agendaItemLocation}>
              <MaterialCommunityIcons name="map-marker" size={14} />
              {' '}{item.location}
            </Paragraph>
          )}
          {item.team_id && (
            <Chip style={styles.teamChip} icon="account-group">Team Event</Chip>
          )}
        </Card.Content>
      </Card>
    );
  };

  const formatAgendaData = () => {
    const agendaData = {};
    
    Object.keys(events).forEach(date => {
      agendaData[date] = events[date].events;
    });
    
    return agendaData;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'calendar' && styles.activeToggle]}
          onPress={() => setViewMode('calendar')}
        >
          <MaterialCommunityIcons 
            name="calendar-month" 
            size={24} 
            color={viewMode === 'calendar' ? theme.colors.primary : '#999'} 
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'agenda' && styles.activeToggle]}
          onPress={() => setViewMode('agenda')}
        >
          <MaterialCommunityIcons 
            name="view-agenda" 
            size={24} 
            color={viewMode === 'agenda' ? theme.colors.primary : '#999'} 
          />
        </TouchableOpacity>
      </View>
      
      {viewMode === 'calendar' ? (
        <>
          <RNCalendar
            current={selectedDate}
            onDayPress={handleDateSelect}
            markedDates={getMarkedDates()}
            theme={{
              todayTextColor: theme.colors.primary,
              arrowColor: theme.colors.primary,
            }}
            style={styles.calendar}
          />
          
          <View style={styles.eventsContainer}>
            <Title style={styles.eventsTitle}>
              Events for {new Date(selectedDate).toLocaleDateString()}
            </Title>
            
            <ScrollView style={styles.eventsList}>
              {events[selectedDate] && events[selectedDate].events.length > 0 ? (
                events[selectedDate].events.map(event => renderEventItem(event))
              ) : (
                <Text style={styles.noEventsText}>No events for this day</Text>
              )}
            </ScrollView>
          </View>
        </>
      ) : (
        <Agenda
          items={formatAgendaData()}
          renderItem={renderAgendaItem}
          renderEmptyDate={() => (
            <View style={styles.emptyDate}>
              <Text style={styles.emptyDateText}>No events</Text>
            </View>
          )}
          rowHasChanged={(r1, r2) => r1.id !== r2.id}
          theme={{
            selectedDayBackgroundColor: theme.colors.primary,
            todayTextColor: theme.colors.primary,
            dotColor: theme.colors.primary,
            agendaDayTextColor: theme.colors.primary,
            agendaDayNumColor: theme.colors.primary,
            agendaTodayColor: theme.colors.primary,
          }}
        />
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddEvent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#f5f5f5',
  },
  toggleButton: {
    padding: 8,
    marginHorizontal: 16,
  },
  activeToggle: {
    borderBottomWidth:
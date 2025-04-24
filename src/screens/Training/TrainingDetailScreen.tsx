import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { Text, Card, Title, Paragraph, Button, ActivityIndicator, ProgressBar, Divider, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { supabase } from '../../lib/supabase';
import { theme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';

export default function TrainingDetailScreen({ route, navigation }) {
  const { trainingId, title, currentProgress = 0 } = route.params;
  const [training, setTraining] = useState(null);
  const [sections, setSections] = useState([]);
  const [progress, setProgress] = useState(currentProgress);
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const { user } = useAuth();
  const webViewRef = useRef(null);

  useEffect(() => {
    fetchTrainingDetails();
  }, [trainingId]);

  const fetchTrainingDetails = async () => {
    setIsLoading(true);
    try {
      // Fetch training module details
      const { data: trainingData, error: trainingError } = await supabase
        .from('training_modules')
        .select('*')
        .eq('id', trainingId)
        .single();
      
      if (trainingError) throw trainingError;
      
      // Fetch training sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('training_sections')
        .select('*')
        .eq('training_id', trainingId)
        .order('order_index');
      
      if (sectionsError) throw sectionsError;
      
      // Fetch user progress
      const { data: progressData, error: progressError } = await supabase
        .from('training_progress')
        .select('*')
        .eq('training_id', trainingId)
        .eq('worker_id', user.id)
        .single();
      
      if (!progressError && progressData) {
        setProgress(progressData.progress_percentage);
        
        // If there's a last_section_viewed, set it as current
        if (progressData.last_section_viewed !== null) {
          setCurrentSection(progressData.last_section_viewed);
        }
      }
      
      setTraining(trainingData);
      setSections(sectionsData);
    } catch (error) {
      console.error('Error fetching training details:', error);
      Alert.alert('Error', 'Failed to load training details');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async (newProgress, sectionIndex) => {
    try {
      const status = newProgress >= 100 ? 'completed' : 'in_progress';
      
      // Check if progress record exists
      const { data: existingProgress, error: checkError } = await supabase
        .from('training_progress')
        .select('id')
        .eq('training_id', trainingId)
        .eq('worker_id', user.id)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingProgress) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('training_progress')
          .update({
            progress_percentage: newProgress,
            status,
            last_section_viewed: sectionIndex,
            completed_at: newProgress >= 100 ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingProgress.id);
        
        if (updateError) throw updateError;
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('training_progress')
          .insert({
            training_id: trainingId,
            worker_id: user.id,
            progress_percentage: newProgress,
            status,
            last_section_viewed: sectionIndex,
            completed_at: newProgress >= 100 ? new Date().toISOString() : null,
          });
        
        if (insertError) throw insertError;
      }
      
      setProgress(newProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleSectionComplete = (sectionIndex) => {
    if (sectionIndex >= sections.length - 1) {
      // Last section completed
      updateProgress(100, sectionIndex);
      Alert.alert(
        'Training Completed',
        'Congratulations! You have completed this training module.',
        [{ text: 'OK' }]
      );
    } else {
      // Calculate new progress percentage
      const newProgress = Math.round(((sectionIndex + 1) / sections.length) * 100);
      updateProgress(newProgress, sectionIndex);
      
      // Move to next section
      setCurrentSection(sectionIndex + 1);
    }
  };

  const handleQuizSubmit = async (answers) => {
    setIsSubmitting(true);
    try {
      // Get correct answers from the quiz section
      const quizSection = sections.find(section => section.type === 'quiz');
      const quizData = JSON.parse(quizSection.content);
      
      // Calculate score
      let correctCount = 0;
      const results = {};
      
      Object.keys(answers).forEach(questionId => {
        const question = quizData.questions.find(q => q.id.toString() === questionId);
        const isCorrect = question.correct_answer === answers[questionId];
        
        if (isCorrect) correctCount++;
        
        results[questionId] = {
          selected: answers[questionId],
          correct: question.correct_answer,
          isCorrect
        };
      });
      
      const score = Math.round((correctCount / quizData.questions.length) * 100);
      const passed = score >= quizData.passing_score;
      
      setQuizResults({
        score,
        passed,
        results
      });
      
      if (passed) {
        // Mark training as completed if quiz is passed
        updateProgress(100, sections.length - 1);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      Alert.alert('Error', 'Failed to submit quiz answers');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSectionContent = (section) => {
    switch (section.type) {
      case 'video':
        return (
          <View style={styles.videoContainer}>
            <WebView
              ref={webViewRef}
              source={{ uri: section.content }}
              style={styles.video}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsFullscreenVideo={true}
            />
            <Button 
              mode="contained" 
              onPress={() => handleSectionComplete(currentSection)}
              style={styles.nextButton}
            >
              Mark as Completed
            </Button>
          </View>
        );
        
      case 'text':
        return (
          <View style={styles.textContainer}>
            <ScrollView style={styles.textScroll}>
              <Text style={styles.textContent}>{section.content}</Text>
            </ScrollView>
            <Button 
              mode="contained" 
              onPress={() => handleSectionComplete(currentSection)}
              style={styles.nextButton}
            >
              Next Section
            </Button>
          </View>
        );
        
      case 'quiz':
        const quizData = JSON.parse(section.content);
        return (
          <View style={styles.quizContainer}>
            {quizResults ? (
              <View style={styles.quizResults}>
                <Title style={styles.quizResultTitle}>
                  Quiz Results: {quizResults.score}%
                </Title>
                
                <View style={[
                  styles.quizScoreContainer,
                  { backgroundColor: quizResults.passed ? theme.colors.success + '20' : theme.colors.error + '20' }
                ]}>
                  <MaterialCommunityIcons 
                    name={quizResults.passed ? 'check-circle' : 'close-circle'} 
                    size={48} 
                    color={quizResults.passed ? theme.colors.success : theme.colors.error} 
                  />
                  <Text style={[
                    styles.quizScoreText,
                    { color: quizResults.passed ? theme.colors.success : theme.colors.error }
                  ]}>
                    {quizResults.passed ? 'Passed' : 'Failed'}
                  </Text>
                </View>
                
                <Divider style={styles.divider} />
                
                <ScrollView style={styles.quizReviewScroll}>
                  {quizData.questions.map((question, index) => (
                    <View key={question.id} style={styles.quizReviewItem}>
                      <Text style={styles.quizReviewQuestion}>
                        {index + 1}. {question.text}
                      </Text>
                      
                      <View style={styles.quizReviewAnswers}>
                        {question.options.map(option => (
                          <View 
                            key={option.id} 
                            style={[
                              styles.quizReviewOption,
                              quizResults.results[question.id].selected === option.id && 
                                (quizResults.results[question.id].isCorrect 
                                  ? styles.quizReviewOptionCorrect 
                                  : styles.quizReviewOptionIncorrect),
                              quizResults.results[question.id].correct === option.id && 
                                styles.quizReviewOptionCorrect
                            ]}
                          >
                            <Text style={styles.quizReviewOptionText}>
                              {option.text}
                            </Text>
                            
                            {quizResults.results[question.id].selected === option.id && (
                              <MaterialCommunityIcons 
                                name={quizResults.results[question.id].isCorrect ? 'check' : 'close'} 
                                size={18} 
                                color={quizResults.results[question.id].isCorrect 
                                  ? theme.colors.success 
                                  : theme.colors.error} 
                              />
                            )}
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </ScrollView>
                
                {!quizResults.passed && (
                  <Button 
                    mode="contained" 
                    onPress={() => {
                      setQuizResults(null);
                      setQuizAnswers({});
                    }}
                    style={styles.retryButton}
                  >
                    Retry Quiz
                  </Button>
                )}
                
                {quizResults.passed && (
                  <Button 
                    mode="contained" 
                    onPress={() => navigation.navigate('TrainingList')}
                    style={styles.finishButton}
                  >
                    Finish Training
                  </Button>
                )}
              </View>
            ) : (
              <View style={styles.quizForm}>
                <Title style={styles.quizTitle}>{quizData.title}</Title>
                <Paragraph style={styles.quizDescription}>
                  {quizData.description}
                </Paragraph>
                <Text style={styles.quizPassingScore}>
                  Passing Score: {quizData.passing_score}%
                </Text>
                
                <Divider style={styles.divider} />
                
                <ScrollView style={styles.quizScroll}>
                  {quizData.questions.map((question, index) => (
                    <View key={question.id} style={styles.quizQuestion}>
                      <Text style={styles.questionText}>
                        {index + 1}. {question.text}
                      </Text>
                      
                      <View style={styles.optionsContainer}>
                        {question.options.map(option => (
                          <List.Item
                            key={option.id}
                            title={option.text}
                            left={props => (
                              <List.Icon 
                                {...props} 
                                icon={quizAnswers[question.id] === option.id 
                                  ? 'radiobox-marked' 
                                  : 'radiobox-blank'} 
                              />
                            )}
                            onPress={() => {
                              setQuizAnswers(prev => ({
                                ...prev,
                                [question.id]: option.id
                              }));
                            }}
                            style={[
                              styles.optionItem,
                              quizAnswers[question.id] === option.id && styles.selectedOption
                            ]}
                          />
                        ))}
                      </View>
                    </View>
                  ))}
                </ScrollView>
                
                <Button 
                  mode="contained" 
                  onPress={() => handleQuizSubmit(quizAnswers)}
                  disabled={Object.keys(quizAnswers).length < quizData.questions.length || isSubmitting}
                  loading={isSubmitting}
                  style={styles.submitButton}
                >
                  Submit Quiz
                </Button>
              </View>
            )}
          </View>
        );
        
      default:
        return (
          <View style={styles.fallbackContainer}>
            <Text>Content not available</Text>
          </View>
        );
    }
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
      <View style={styles.header}>
        <Title style={styles.title}>{training?.title}</Title>
        <View style={styles.progressContainer}>
          <ProgressBar 
            progress={progress / 100} 
            color={theme.colors.primary}
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>{progress}% Complete</Text>
        </View>
      </View>
      
      <View style={styles.sectionsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.sectionsScroll}
          contentContainerStyle={styles.sectionsContent}
        >
          {sections.map((section, index) => (
            <Button
              key={section.id}
              mode={currentSection === index ? 'contained' : 'outlined'}
              onPress={() => {
                // Only allow navigation to completed sections or the next available one
                if (index <= Math.ceil(progress / (100 / sections.length))) {
                  setCurrentSection(index);
                  updateProgress(progress, index);
                }
              }}
              disabled={index
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, RadioButton, Button, ProgressBar, Title } from 'react-native-paper';
import { theme } from '../theme';

export const TrainingQuiz = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  
  const handleAnswer = (questionId, answerId) => {
    setAnswers({
      ...answers,
      [questionId]: answerId
    });
  };
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      
      // Calculate score
      const score = questions.reduce((total, question) => {
        const correctAnswer = question.options.find(option => option.isCorrect);
        return answers[question.id] === correctAnswer.id ? total + 1 : total;
      }, 0);
      
      onComplete({
        totalQuestions: questions.length,
        correctAnswers: score,
        score: Math.round((score / questions.length) * 100)
      });
    }
  };
  
  const isAnswered = (questionId) => {
    return answers[questionId] !== undefined;
  };
  
  if (showResults) {
    const score = questions.reduce((total, question) => {
      const correctAnswer = question.options.find(option => option.isCorrect);
      return answers[question.id] === correctAnswer.id ? total + 1 : total;
    }, 0);
    
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <Card style={styles.resultsCard}>
        <Card.Content>
          <Title style={styles.resultsTitle}>Quiz Results</Title>
          <Text style={styles.scoreText}>
            You scored {score} out of {questions.length} ({percentage}%)
          </Text>
          <ProgressBar 
            progress={score / questions.length} 
            color={percentage >= 70 ? theme.colors.success : theme.colors.error}
            style={styles.progressBar}
          />
          
          <View style={styles.resultsSummary}>
            {questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const correctAnswer = question.options.find(option => option.isCorrect);
              const isCorrect = userAnswer === correctAnswer.id;
              
              return (
                <View key={question.id} style={styles.resultItem}>
                  <Text style={styles.questionNumber}>Question {index + 1}:</Text>
                  <Text style={[
                    styles.resultStatus, 
                    { color: isCorrect ? theme.colors.success : theme.colors.error }
                  ]}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card.Content>
      </Card>
    );
  }
  
  const question = questions[currentQuestion];
  
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.progress}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
        <ProgressBar 
          progress={(currentQuestion + 1) / questions.length} 
          color={theme.colors.primary}
          style={styles.progressBar}
        />
        
        <Text style={styles.question}>{question.text}</Text>
        
        <RadioButton.Group
          onValueChange={value => handleAnswer(question.id, value)}
          value={answers[question.id] || ''}
        >
          {question.options.map(option => (
            <RadioButton.Item
              key={option.id}
              label={option.text}
              value={option.id}
              style={styles.option}
            />
          ))}
        </RadioButton.Group>
        
        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.nextButton}
          disabled={!isAnswered(question.id)}
        >
          {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  progress: {
    textAlign: 'center',
    marginBottom: 8,
    color: theme.colors.backdrop,
  },
  progressBar: {
    marginBottom: 16,
    height: 8,
    borderRadius: 4,
  },
  question: {
    fontSize: 18,
    marginBottom: 16,
  },
  option: {
    marginBottom: 8,
  },
  nextButton: {
    marginTop: 16,
  },
  resultsCard: {
    marginBottom: 16,
  },
  resultsTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  scoreText: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 8,
  },
  resultsSummary: {
    marginTop: 16,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  questionNumber: {
    fontWeight: 'bold',
  },
  resultStatus: {
    fontWeight: 'bold',
  },
});
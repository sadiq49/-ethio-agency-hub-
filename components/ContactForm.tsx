import React from 'react';
import { useFormValidation } from '../hooks/use-form-validation';
import { useLoadingState } from '../hooks/use-loading-state';

interface ContactFormProps {
  onSubmitSuccess?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmitSuccess }) => {
  const { fields, handleChange, handleBlur, handleSubmit, setFieldRules, isSubmitting } = 
    useFormValidation({
      name: '',
      email: '',
      message: ''
    });
  
  const { execute } = useLoadingState({
    onError: (error) => {
      console.error('Form submission error:', error);
    }
  });
  
  // Set validation rules
  React.useEffect(() => {
    setFieldRules('name', [
      {
        validate: (value) => value.trim().length > 0,
        errorMessage: 'Name is required'
      }
    ]);
    
    setFieldRules('email', [
      {
        validate: (value) => value.trim().length > 0,
        errorMessage: 'Email is required'
      },
      {
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        errorMessage: 'Please enter a valid email address'
      }
    ]);
    
    setFieldRules('message', [
      {
        validate: (value) => value.trim().length > 0,
        errorMessage: 'Message is required'
      },
      {
        validate: (value) => value.trim().length >= 10,
        errorMessage: 'Message must be at least 10 characters'
      }
    ]);
  }, [setFieldRules]);
  
  const submitForm = async (values: typeof fields) => {
    await execute(async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form submitted:', values);
      onSubmitSuccess?.();
    });
  };
  
  return (
    <form 
      className="contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(submitForm);
      }}
    >
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={fields.name.value}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          className={fields.name.error && fields.name.touched ? 'error' : ''}
        />
        {fields.name.error && fields.name.touched && (
          <div className="error-message">{fields.name.error}</div>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={fields.email.value}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          className={fields.email.error && fields.email.touched ? 'error' : ''}
        />
        {fields.email.error && fields.email.touched && (
          <div className="error-message">{fields.email.error}</div>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          value={fields.message.value}
          onChange={(e) => handleChange('message', e.target.value)}
          onBlur={() => handleBlur('message')}
          className={fields.message.error && fields.message.touched ? 'error' : ''}
          rows={5}
        />
        {fields.message.error && fields.message.touched && (
          <div className="error-message">{fields.message.error}</div>
        )}
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className={`submit-button ${isSubmitting ? 'loading' : ''}`}
      >
        {isSubmitting ? (
          <>
            <span className="loading-spinner"></span>
            Sending...
          </>
        ) : 'Send Message'}
      </button>
    </form>
  );
};
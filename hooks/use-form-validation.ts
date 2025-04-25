import { useState, useCallback } from 'react';

type ValidationRule<T> = {
  validate: (value: T) => boolean;
  errorMessage: string;
};

type FieldValidation<T> = {
  value: T;
  rules: ValidationRule<T>[];
  touched: boolean;
  error: string | null;
};

export function useFormValidation<T extends Record<string, any>>(initialValues: T) {
  const [fields, setFields] = useState<Record<keyof T, FieldValidation<any>>>(() => {
    const initialFields: Record<string, FieldValidation<any>> = {};
    
    Object.keys(initialValues).forEach(key => {
      initialFields[key] = {
        value: initialValues[key],
        rules: [],
        touched: false,
        error: null
      };
    });
    
    return initialFields as Record<keyof T, FieldValidation<any>>;
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  
  const setFieldRules = useCallback(<K extends keyof T>(
    fieldName: K,
    rules: ValidationRule<T[K]>[]
  ) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        rules
      }
    }));
  }, []);
  
  const validateField = useCallback(<K extends keyof T>(fieldName: K): boolean => {
    const field = fields[fieldName];
    
    for (const rule of field.rules) {
      if (!rule.validate(field.value)) {
        setFields(prev => ({
          ...prev,
          [fieldName]: {
            ...prev[fieldName],
            error: rule.errorMessage
          }
        }));
        return false;
      }
    }
    
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        error: null
      }
    }));
    
    return true;
  }, [fields]);
  
  const validateAllFields = useCallback((): boolean => {
    let isValid = true;
    
    Object.keys(fields).forEach(key => {
      const fieldIsValid = validateField(key as keyof T);
      isValid = isValid && fieldIsValid;
    });
    
    setIsValid(isValid);
    return isValid;
  }, [fields, validateField]);
  
  const handleChange = useCallback(<K extends keyof T>(
    fieldName: K,
    value: T[K]
  ) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
        touched: true
      }
    }));
    
    // Validate on change if the field has been touched
    if (fields[fieldName].touched) {
      validateField(fieldName);
    }
  }, [fields, validateField]);
  
  const handleBlur = useCallback(<K extends keyof T>(fieldName: K) => {
    setFields(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        touched: true
      }
    }));
    
    validateField(fieldName);
  }, [validateField]);
  
  const handleSubmit = useCallback(async (
    onSubmit: (values: T) => Promise<void> | void
  ) => {
    setIsSubmitting(true);
    
    const isValid = validateAllFields();
    
    if (isValid) {
      const values = Object.keys(fields).reduce((acc, key) => {
        acc[key as keyof T] = fields[key as keyof T].value;
        return acc;
      }, {} as T);
      
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
    
    setIsSubmitting(false);
  }, [fields, validateAllFields]);
  
  const resetForm = useCallback(() => {
    setFields(() => {
      const resetFields: Record<string, FieldValidation<any>> = {};
      
      Object.keys(initialValues).forEach(key => {
        resetFields[key] = {
          value: initialValues[key],
          rules: fields[key].rules,
          touched: false,
          error: null
        };
      });
      
      return resetFields as Record<keyof T, FieldValidation<any>>;
    });
    
    setIsValid(false);
    setIsSubmitting(false);
  }, [initialValues, fields]);
  
  return {
    fields,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldRules,
    resetForm,
    isSubmitting,
    isValid
  };
}
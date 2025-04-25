import React, { useEffect, useState } from 'react';

interface SuccessAnimationProps {
  onComplete?: () => void;
  delay?: number;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  onComplete,
  delay = 2000
}) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay, onComplete]);
  
  if (!visible) return null;
  
  return (
    <div className="success-animation">
      <div className="success-checkmark">
        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
          <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
      </div>
    </div>
  );
};
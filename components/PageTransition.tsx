import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface PageTransitionProps {
  children: React.ReactNode;
  location: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  location 
}) => {
  return (
    <TransitionGroup>
      <CSSTransition
        key={location}
        timeout={300}
        classNames="page"
        unmountOnExit
      >
        {children}
      </CSSTransition>
    </TransitionGroup>
  );
};
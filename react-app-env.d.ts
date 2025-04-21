// This file contains type declarations for React and related libraries

interface ReactNode {}

declare namespace React {
  type ReactNode = ReactNode;
  interface HTMLProps<T> {}
  interface SVGProps<T> {}
  interface ChangeEvent<T> {
    target: T;
  }
  interface ComponentType<P> {}
  interface FC<P> {
    (props: P): any;
  }
}

declare module 'react' {
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export const FC: any;
  export type ReactNode = ReactNode;
  export type ChangeEvent<T> = React.ChangeEvent<T>;
  export const useEffect: any;
  export const useRef: any;
  export const useCallback: any;
  export const useMemo: any;
}

declare module 'lucide-react' {
  // Generic component type for all SVG icons
  const IconComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  
  // Export all icons
  export const Search: typeof IconComponent;
  export const Filter: typeof IconComponent;
  export const Clock: typeof IconComponent;
  export const CheckCircle2: typeof IconComponent;
  export const AlertCircle: typeof IconComponent;
  export const FileText: typeof IconComponent;
  export const History: typeof IconComponent;
  export const UserCheck: typeof IconComponent;
  export const Plane: typeof IconComponent;
  export const UserX: typeof IconComponent;
  export const RefreshCw: typeof IconComponent;
  export const CalendarClock: typeof IconComponent;
  export const ArrowLeftRight: typeof IconComponent;
  export const FileWarning: typeof IconComponent;
  export const Building2: typeof IconComponent;
  export const MapPin: typeof IconComponent;
  export const Phone: typeof IconComponent;
  export const Mail: typeof IconComponent;
  export const Calendar: typeof IconComponent;
  export const CheckCircle: typeof IconComponent;
  export const XCircle: typeof IconComponent;
  export const RotateCw: typeof IconComponent;
  export const HelpCircle: typeof IconComponent;
  export const ClipboardCheck: typeof IconComponent;
  export const FileCheck: typeof IconComponent;
  export const Send: typeof IconComponent;
  export const PlusCircle: typeof IconComponent;
  export const Luggage: typeof IconComponent;
  export const Timer: typeof IconComponent;
  export const Users: typeof IconComponent;
  export const Ticket: typeof IconComponent;
  export const Bell: typeof IconComponent;
  export const Briefcase: typeof IconComponent;
  export const Building: typeof IconComponent;
  export const Globe: typeof IconComponent;
  export const ArrowUpDown: typeof IconComponent;
  export const User: typeof IconComponent;
  export const Stethoscope: typeof IconComponent;
  export const UsersRound: typeof IconComponent;
  export const X: typeof IconComponent;
  // Add more icons as needed
} 
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  colorVariant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
}

export function DashboardCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  colorVariant = 'primary',
}: DashboardCardProps) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-700',
    secondary: 'bg-secondary-50 text-secondary-700',
    accent: 'bg-accent-50 text-accent-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-amber-50 text-amber-700',
    error: 'bg-red-50 text-red-700',
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && (
          <div className={cn('rounded-full p-2', colorClasses[colorVariant])}>
            {React.cloneElement(icon as React.ReactElement, {
              className: 'h-4 w-4',
            })}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center text-xs text-muted-foreground">
            {trend && (
              <span
                className={cn(
                  'mr-1 flex items-center',
                  trend.isPositive ? 'text-success' : 'text-error'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
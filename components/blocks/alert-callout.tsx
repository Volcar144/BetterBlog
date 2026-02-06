'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { TinaMarkdown, TinaMarkdownContent } from 'tinacms/dist/rich-text';

interface AlertCalloutProps {
  type?: 'info' | 'warning' | 'danger' | 'success';
  children: TinaMarkdownContent;
  title?: string;
}

const typeConfig = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-900 dark:text-blue-200',
    icon: Info,
    label: 'Info',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-900 dark:text-amber-200',
    icon: AlertCircle,
    label: 'Warning',
  },
  danger: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-900 dark:text-red-200',
    icon: AlertTriangle,
    label: 'Danger',
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-900 dark:text-green-200',
    icon: CheckCircle,
    label: 'Success',
  },
};

export const AlertCallout: React.FC<AlertCalloutProps> = ({ type = 'info', children, title }) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={`rounded-lg border-l-4 p-4 ${config.bg} ${config.border} ${config.text}`}>
      <div className='flex gap-3'>
        <Icon className='mt-0.5 h-5 w-5 flex-shrink-0' />
        <div className='flex-1'>
          {title && <h4 className='mb-1 font-semibold'>{title}</h4>}
          <div className='prose-sm max-w-none'>
            <TinaMarkdown content={children} />
          </div>
        </div>
      </div>
    </div>
  );
};

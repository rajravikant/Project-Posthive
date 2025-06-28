import { cn } from '@/utils/style.utils';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  className?: string;
  textClassName?: string;
}

export default function Button({
  children,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onPress,
  className = '',
  textClassName = '',
}: ButtonProps) {  // Determine which style classes to apply based on variant and size
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary';
      case 'secondary':
        return 'bg-secondary dark:bg-neutral-800';
      case 'outline':
        return 'bg-transparent border border-primary';
      case 'ghost':
        return 'bg-transparent';
      case 'link':
        return 'bg-transparent p-0';
      case 'destructive':
        return 'bg-red-600';
      default:
        return 'bg-gray-800';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'py-1 px-2';
      case 'sm':
        return 'py-1.5 px-3';
      case 'lg':
        return 'py-3 px-6';
      case 'xl':
        return 'py-4 px-8';
      default: // md
        return 'py-2 px-4';
    }
  };

  const getTextSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'text-xs';
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      case 'xl':
        return 'text-xl';
      default: // md
        return 'text-base';
    }
  };
  const getTextColorClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'text-dark dark:text-white';
      case 'outline':
        return 'text-primary';
      case 'ghost':
        return 'text-primary';
      case 'link':
        return 'text-primary';
      default:
        return variant === 'destructive' || variant === 'primary' || variant === 'default' ? 'text-white' : 'text-dark';
    }
  };

  const buttonClasses = cn(
    'flex-row items-center justify-center rounded-md',
    getSizeClasses(),
    getVariantClasses(),
    fullWidth ? 'w-full' : 'w-auto',
    disabled ? 'opacity-50' : 'opacity-100',
    className
  );

  const textClasses = cn(
    'font-medium',
    getTextSizeClasses(),
    getTextColorClasses(),
    disabled ? 'opacity-50' : 'opacity-100',
    textClassName
  );
  return (
    <TouchableOpacity
      onPress={!disabled && !loading ? onPress : undefined}
      className={buttonClasses}
      activeOpacity={0.7}
      disabled={disabled || loading}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          className="mr-2"
          color={variant === 'outline' || variant === 'ghost' || variant === 'secondary' || variant === 'link' ? '#1F2937' : 'white'}
        />
      )}
      
      {!loading && leftIcon && <View className="mr-2">{leftIcon}</View>}
      
      <Text className={textClasses}>{children}</Text>
      
      {!loading && rightIcon && <View className="ml-2">{rightIcon}</View>}
    </TouchableOpacity>
  );
}
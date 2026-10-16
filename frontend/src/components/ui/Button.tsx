import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', size = 'default', variant = 'default', asChild = false, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg cursor-pointer';

    const sizeStyles = {
      default: 'h-10 py-2 px-4 text-sm',
      sm: 'h-8 px-3 rounded-md text-xs',
      lg: 'h-12 px-8 rounded-xl text-base',
      icon: 'h-10 w-10',
    }[size];

    const variantStyles = {
      default: 'bg-costco-blue text-white hover:bg-blue-700',
      destructive: 'bg-costco-red text-white hover:bg-red-700',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      ghost: 'hover:bg-gray-100 text-gray-700',
      link: 'text-costco-blue underline-offset-4 hover:underline p-0 h-auto',
    }[variant];

    const combinedClassName = `${baseStyles} ${sizeStyles} ${variantStyles} ${className}`.trim();

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        className: `${combinedClassName} ${child.props.className || ''}`.trim(),
        ...props,
      });
    }

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

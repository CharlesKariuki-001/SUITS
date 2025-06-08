import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, fullWidth = false, className = '', ...props }, ref) => {
    const selectClasses = `bg-gray-800 text-white border ${
      error ? 'border-red-500' : 'border-gray-600'
    } rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent ${
      fullWidth ? 'w-full' : ''
    } ${className}`;

    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-200 mb-1">
            {label}
          </label>
        )}
        <select ref={ref} className={selectClasses} {...props} />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
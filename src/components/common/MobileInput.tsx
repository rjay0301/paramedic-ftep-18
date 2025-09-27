
import React from 'react';

type MobileInputProps = {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number';
  placeholder?: string;
  value: any;
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
  options?: string[];
  required?: boolean;
  error?: string;
  className?: string;
};

const MobileInput: React.FC<MobileInputProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  options,
  required = false,
  error,
  className = '',
}) => {
  const touchFriendlyClasses = "touch-manipulation text-base";
  
  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {type === 'text' && (
        <input
          id={id}
          type="text"
          className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${touchFriendlyClasses} ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
      
      {type === 'textarea' && (
        <textarea
          id={id}
          className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${touchFriendlyClasses} ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          rows={4}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
      
      {type === 'select' && (
        <select
          id={id}
          className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${touchFriendlyClasses} ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        >
          <option value="">{placeholder || `Select ${label}`}</option>
          {options?.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
      
      {type === 'date' && (
        <input
          id={id}
          type="date"
          className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${touchFriendlyClasses} ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
      
      {type === 'number' && (
        <input
          id={id}
          type="number"
          className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${touchFriendlyClasses} ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          pattern="[0-9]*"
          inputMode="numeric"
        />
      )}
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default MobileInput;

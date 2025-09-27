
import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export interface SignatureFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean; // Added disabled prop
}

const SignatureField: React.FC<SignatureFieldProps> = ({
  value,
  onChange,
  label,
  required = false,
  error,
  disabled = false, // Add default value
}) => {
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const [isEmpty, setIsEmpty] = useState(!value);
  
  useEffect(() => {
    // If there's a saved value, restore it
    if (value && sigCanvas.current) {
      const img = new Image();
      img.onload = () => {
        if (sigCanvas.current) {
          const ctx = sigCanvas.current.getCanvas().getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            setIsEmpty(false);
          }
        }
      };
      img.src = value;
    }
  }, [value]);
  
  const handleClear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setIsEmpty(true);
      onChange('');
    }
  };
  
  const handleEnd = () => {
    if (sigCanvas.current) {
      if (!sigCanvas.current.isEmpty()) {
        setIsEmpty(false);
        const dataURL = sigCanvas.current.toDataURL('image/png');
        onChange(dataURL);
      } else {
        setIsEmpty(true);
        onChange('');
      }
    }
  };
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="border rounded-md p-2 bg-gray-50">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            className: 'w-full h-24',
          }}
          onEnd={handleEnd}
          // Apply disabled styling if component is disabled
          options={{
            disabled
          }}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <button
          type="button"
          className={`text-sm text-primary-600 hover:text-primary-800 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleClear}
          disabled={disabled}
        >
          Clear Signature
        </button>
        
        {isEmpty && (
          <span className="text-sm text-gray-500">
            Please sign above
          </span>
        )}
      </div>
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default SignatureField;

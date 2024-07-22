import React from 'react';

const FormCheckbox: React.FC<{ label: string, value: boolean, set: any, disabled: boolean }> = ({ label, value, set, disabled }) => {
  return (
    <div className="w-max flex justify-center items-center gap-4 xl:mt-8">
      <label htmlFor={`checkbox-${label}`} className="w-max block text-black dark:text-white">
        {label}
      </label>
      <input
        disabled={disabled}
        id={`checkbox-${label}`}
        name={`checkbox-${label}`}
        type="checkbox"
        className="form-checkbox w-4 h-4"
        checked={value}
        onChange={(e) => {set(e.target.checked)}}
      />
    </div>
  );
};

export default FormCheckbox;
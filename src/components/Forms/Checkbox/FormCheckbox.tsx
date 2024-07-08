import React from 'react';

const FormCheckbox: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div className="w-max flex justify-center items-center gap-4 xl:mt-8">
      <label htmlFor={`checkbox-${label}`} className="w-max block text-black dark:text-white">
        {label}
      </label>
      <input id={`checkbox-${label}`} name={`checkbox-${label}`} type="checkbox" className="form-checkbox w-4 h-4" />
    </div>
  );
};

export default FormCheckbox;
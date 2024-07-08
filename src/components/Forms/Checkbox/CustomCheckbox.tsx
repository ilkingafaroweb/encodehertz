import React from 'react';

const CustomCheckbox: React.FC<{ label: string }> = ({ label }) => {
  return (
    <label className="flex justify-center items-center space-x-3 w-1/2">
      <input type="checkbox" className="form-checkbox w-4 h-4" />
      <span className="text-black dark:text-white w-max">{label}</span>
    </label>
  );
};

export default CustomCheckbox;

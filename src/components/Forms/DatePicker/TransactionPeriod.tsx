import React, { useEffect, useState } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect/index';
import 'flatpickr/dist/plugins/monthSelect/style.css';

const TransactionPeriod: React.FC<{ labelName: string, disabled: boolean, setSelectedData: any,  value: string }> = ({ labelName, disabled, setSelectedData, value }) => {
  
  const [inputValue, setInputValue] = useState(value || '');

  const formatPropertyName = (propertyName) => {
    return propertyName.replace(/\s+/g, '')
      .replace(/^(.)/, (match) => match.toLowerCase())
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/\s+/g, '');
  };

  const propertyName = labelName;

  useEffect(() => {
    if(inputValue){
      setSelectedData(selectedData => ({
        ...selectedData,
        [formatPropertyName(propertyName)]: inputValue
      }));
    }
  }, [inputValue])
  
  useEffect(() => {
    flatpickr(`.form-datepicker-${formatPropertyName(propertyName)}`, {
      mode: 'single',
      static: true,
      dateFormat: 'm/Y',
      prevArrow:
        '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      plugins: [
        monthSelectPlugin({
          shorthand: true,
          dateFormat: 'm/Y', 
          altFormat: 'F Y', 
        })
      ],
      onChange: function(selectedDates, dateStr, instance) {
        setSelectedData(selectedData => ({
          ...selectedData,
          [formatPropertyName(propertyName)]: dateStr
        }));
      }
    });
  }, []);

  return (
    <div className='w-full'>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        {labelName}
      </label>
      <div className="relative">
        <input
          disabled={disabled}
          className={`form-datepicker-${formatPropertyName(propertyName)} w-full rounded border-[1.5px] text-black border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:text-white dark:bg-form-input dark:focus:border-primary`}
          placeholder="mm/yyyy"
          data-class="flatpickr-right"
          value={value}
          onChange={null}
        />
      </div>
    </div>
  );
};

export default TransactionPeriod;
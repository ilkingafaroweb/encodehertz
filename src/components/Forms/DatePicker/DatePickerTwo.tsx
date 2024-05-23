import React, { useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const DatePickerTwo: React.FC<{ text: string }> = ({ text }) => {
  useEffect(() => {
    flatpickr('.form-datepicker', {
      mode: 'single',
      static: true,
      monthSelectorType: 'static',
      dateFormat: 'd/m/Y H:i',
      enableTime: true,
      time_24hr: true,
      
      prevArrow:
        '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow:
        '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    });
  }, []);

  return (
    <div className='w-full'>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        {text}
      </label>
      <div className="relative">
        <input
          className="form-datepicker w-full rounded border-[1.5px] text-black border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:text-white dark:bg-form-input dark:focus:border-primary"
          placeholder="dd/mm/yyyy hh:mm"
          data-class="flatpickr-right"
        />
      </div>
    </div>
  );
};

export default DatePickerTwo;
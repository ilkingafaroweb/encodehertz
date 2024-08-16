import React, { useEffect, useState } from 'react';

interface Option {
  value: string;
  text: string;
}

interface SelectGroupOneProps {
  text: string;
  options: Option[] | null;
  setSelectedData: React.Dispatch<React.SetStateAction<any>>;
  disabled: boolean;
  defaultValue?: string;
  isInvalid?: boolean; 
}

const SelectGroupOne: React.FC<SelectGroupOneProps> = ({ text, options, setSelectedData, disabled, defaultValue, isInvalid }) => {
  const [selectedOption, setSelectedOption] = useState<string>(defaultValue || "");
  const propertyName = `selected${text.replace(/\s+/g, '')}`;

  useEffect(() => {
    setSelectedData((prevData: any) => ({
      ...prevData,
      [propertyName]: selectedOption
    }));
  }, [selectedOption]);

  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  const isDefaultValueValid = options?.some(option => option.value === defaultValue);

  return (
    <div className="w-full mb-2">
      <label className="mb-3 block text-black dark:text-white">
        {text}
      </label>
      <div className="relative z-20 bg-transparent dark:bg-form-input">
        <select
          disabled={disabled}
          onChange={(e) => {
            setSelectedOption(e.target.value);
            changeTextColor();
          }}
          className={`${isInvalid ? 'focus:border-danger active:border-danger border-danger bg-red-100 ' : 'focus:border-primary active:border-primary border-stroke dark:border-form-strokedark dark:bg-form-input'} relative z-20 w-full appearance-none rounded border bg-transparent py-3 px-5 outline-none transition  ${isOptionSelected ? 'text-black dark:text-white' : ''}`}
        >
          <option value="" selected={isDefaultValueValid}  className="text-body dark:text-bodydark hidden">
            Select {text}
          </option>
          {options?.map((option, index) => (
            <option
              key={index}
              value={option.value}
              selected={option.value === defaultValue}
              className='text-body dark:text-bodydark'
            >
              {option.text}
            </option>
          ))}
        </select>
        <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                fill=""
              ></path>
            </g>
          </svg>
        </span>
      </div>
    </div>
  );
};

export default SelectGroupOne;

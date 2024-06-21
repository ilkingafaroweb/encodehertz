import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface Option {
  id: number;
  name: string;
  price: number;
  isSelected: boolean;
}

interface DropdownProps {
  setSelectedData: React.Dispatch<React.SetStateAction<any>>;
  repairOptions: Option[];
  disabled: boolean;
  defaultValue: any;
  stateName: string;
}

const RepairTypesInput: React.FC<DropdownProps> = ({ repairOptions, disabled, setSelectedData, defaultValue, stateName }) => {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [sumOutsource, setSumOutsource] = useState(0);
  const [sumCustomer, setSumCustomer] = useState(0);

  useEffect(() => {
    if(defaultValue){
      setSelectedOptions(defaultValue.filter(option => option.isSelected))
    }
  }, [defaultValue])

  useEffect(() => {
    setSelectedData(prevSelectedData => ({
      ...prevSelectedData,
      [stateName]: selectedOptions
    }));
  }, [selectedOptions]);

  const toggleDropdown = () => {
    if (!disabled) setShowDropdown(!showDropdown);
  };

  const toggleOption = (option: Option) => {
    const updatedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((o) => o !== option)
      : [...selectedOptions, option];
    setSelectedOptions(updatedOptions);
  };


  return (
    <div className="relative z-50 w-full">
      <div className="flex flex-col items-center">
        <div onClick={toggleDropdown} className="w-full relative">
          <div className="mb-2 flex flex-wrap gap-3 rounded border border-stroke py-2 pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
            {selectedOptions.map((option, index) => (
              <div key={option.id} className="my-1 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray px-2.5 py-1.5 text-sm font-medium dark:border-strokedark dark:bg-white/30">
                <div className="w-full flex flex-col lg:gap-6 items-center justify-between lg:flex-row" onClick={(e) => e.stopPropagation()}>
                  <div className="w-40 flex justify-center items-center px-2 pb-2 mb-2 border-b-2 text-red-500 dark:text-yellow-400 font-bold lg:text-lg lg:mb-0 lg:border-0 lg:pb-0 lg:pr-6 lg:border-r lg:h-8">
                    {option.name}
                  </div>
                  <div className="flex flex-col mb-2 w-full lg:w-30">
                    <label className="mb-1 text-black dark:text-white">Price</label>
                    <input
                      type="number"
                      disabled={disabled}
                      value={option.price}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        const updatedOptions = [...selectedOptions];
                        updatedOptions[index].price = value;
                        setSelectedOptions(updatedOptions);
                      }}
                      className="rounded w-full border-[1.5px] border-boxdark-2 bg-transparent py-1 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                  {
                    !disabled && <div className="flex flex-auto flex-row-reverse">
                    <div onClick={() => toggleOption(option)} className="cursor-pointer pl-2 hover:text-danger">
                      <FontAwesomeIcon className="text-3xl mx-3" icon={faTimes} />
                    </div>
                  </div>
                  }
                </div>
              </div>
            ))}
            {!selectedOptions.length && (
              <div className="flex-1">
                <input
                  disabled={disabled}
                  placeholder="Select an option"
                  className="h-full w-full appearance-none bg-transparent p-1 px-2 outline-none"
                />
              </div>
            )}
          </div>
          <div className="flex w-12 items-center absolute top-[calc(50%-16px)] right-2">
            <button
              type="button"
              onClick={toggleDropdown}
              className="h-4 w-4 cursor-pointer outline-none focus:outline-none"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                  fill="#637381"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {showDropdown && (
        <div className="max-h-select  top-full left-0 z-40 w-full overflow-y-auto rounded bg-white shadow dark:bg-form-input">
          {repairOptions.map((option) => (
            <div
              key={option.id}
              className={`cursor-pointer rounded-t border-b border-stroke hover:bg-primary/5 dark:border-form-strokedark`}
              onClick={() => toggleOption(option)}
            >
              <div className="relative flex w-full items-center border-l-2 border-transparent p-2 pl-2">
                <div className="flex w-full items-center">
                  <div className="mx-2 leading-6">{option.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepairTypesInput;
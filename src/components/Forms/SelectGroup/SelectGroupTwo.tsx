import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';

interface Option {
  value: string;
  text: string;
  selected: boolean;
  quantity?: number; 
  customerPrice?: number; 
  outsourcePrice?: number; 
}

interface DropdownProps {
  ecpOptions: any[]; // ecpOptions'un tipini doldurun.
  disabled: boolean;
}

const MultiSelect: React.FC<DropdownProps> = ({ ecpOptions, disabled }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [show, setShow] = useState(false);
  const dropdownRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const trigger = useRef<any>(null);

  useEffect(() => {
    const loadOptions = () => {
      const newOptions: Option[] = ecpOptions.map((option: any) => ({
        value: option.id.toString(),
        text: option.name,
        selected: option.isSelected,
      }));
      setOptions(newOptions);
    };

    loadOptions();
  }, [ecpOptions]);

  const open = () => {
    setShow(true);
  };

  const isOpen = () => {
    return show === true;
  };

  const toggleSelect = (index: number) => {
    const newOptions = [...options];
    newOptions[index].selected = !newOptions[index].selected;
    setOptions(newOptions);
    updateSelectedOptions();
  };

  const updateSelectedOptions = () => {
    const selectedOptions = options.filter(option => option.selected);
    setSelectedOptions(selectedOptions);
  };

  const selectedValues = () => {
    return selectedOptions.map((option) => option.value);
  };

  return (
    <div className="relative z-50 w-full">
      <div>
        <div className={`flex flex-col items-center`}>
          <input name="values" type="hidden" defaultValue={selectedValues()} />
          <div className="relative z-20 inline-block w-full">
            <div className="relative flex flex-col items-center">
              <div ref={trigger} onClick={() => { !disabled && setShow(!show) }} className="w-full">
                <div className="mb-2 flex rounded border border-stroke py-2 pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                  <div className="flex flex-auto flex-wrap gap-3" >
                    {selectedOptions.map((selectedOption, index) => (
                      <div
                        key={selectedOption.value}
                        ref={inputRef}
                        className="my-1 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray px-2.5 py-1.5 text-sm font-medium dark:border-strokedark dark:bg-white/30"
                      >
                        <div className="w-full flex flex-col gap-1 items-center justify-between lg:flex-row" >
                          <div className='w-max min-w-16 text-boxdark-2 dark:text-white'>
                            {selectedOption.text}
                          </div>
                          <input
                            type="text"
                            placeholder='Quantity'
                            value={selectedOption.quantity || ''}
                            className="rounded w-full ml-2 border-[1.5px] border-boxdark-2 bg-transparent py-1 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          />
                          <input
                            type="text"
                            placeholder='Outsource Price'
                            value={selectedOption.outsourcePrice || ''}
                            className="rounded w-full ml-2 border-[1.5px] border-boxdark-2 bg-transparent py-1 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          />
                          <input
                            type="text"
                            placeholder='Customer Price'
                            value={selectedOption.customerPrice || ''}
                            className="rounded w-full ml-2 border-[1.5px] border-boxdark-2 bg-transparent py-1 px-2 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                          />
                        </div>
                        <div className="flex flex-auto flex-row-reverse">
                          <div
                            onClick={() => toggleSelect(index)}
                            className="cursor-pointer pl-2 hover:text-danger"
                          >
                            <FontAwesomeIcon className='text-lg' icon={faTimes} />
                          </div>
                        </div>
                      </div>
                    ))}
                    {!selectedOptions.length && (
                      <div className="flex-1">
                        <input
                          disabled={disabled}
                          placeholder="Select an option"
                          className="h-full w-full appearance-none bg-transparent p-1 px-2 outline-none"
                          defaultValue={selectedValues()}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex w-8 items-center py-1 pl-1 pr-1">
                    <button
                      type="button"
                      onClick={!disabled && open}
                      className="h-6 w-6 cursor-pointer outline-none focus:outline-none"
                    >
                      <svg
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
                            fill="#637381"
                          ></path>
                        </g>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full px-4">
                <div
                  className={`max-h-select absolute top-full left-0 z-40 w-full overflow-y-auto rounded bg-white shadow dark:bg-form-input ${isOpen() ? '' : 'hidden'
                    }`}
                  ref={dropdownRef}
                  onFocus={() => setShow(true)}
                  onBlur={() => setShow(false)}
                >
                  <div className="flex w-full flex-col">
                    {options.map((option, index) => (
                      <div key={option.value}>
                        <div
                          className="w-full cursor-pointer rounded-t border-b border-stroke hover:bg-primary/5 dark:border-form-strokedark"
                          onClick={() => toggleSelect(index)}
                        >
                          <div
                            className={`relative flex w-full items-center border-l-2 border-transparent p-2 pl-2 ${option.selected ? 'border-primary' : ''
                              }`}
                          >
                            <div className="flex w-full items-center">
                              <div className="mx-2 leading-6" >
                                {option.text}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
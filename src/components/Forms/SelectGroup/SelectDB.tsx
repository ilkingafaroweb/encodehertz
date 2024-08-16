import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import useTranslations from '../../../hooks/useTranslations';

interface Option {
  value: string;
  text: string;
  isSelected: boolean;
}

const SelectDB: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>();
  const [options, setOptions] = useState<Option[]>([]);

  const { translate } = useTranslations('nav_bar'); 

  useEffect(() => {
    const fetchBusinessUnits = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error('Token not found');
        }
        
        const response = await fetch('https://encodehertz.xyz/api/User/GetBusinessUnits', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        setOptions(data);
        const selected = data.find(option => option.isSelected);
        if (selected) {
          setSelectedOption(selected.value);
        }
      } catch (error) {
        console.error('Error fetching business units:', error);
      }
    };
  
    fetchBusinessUnits(); 
  }, []);
  

  const handleOptionChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error('Token not found');
      }
      
      const response = await fetch(`https://encodehertz.xyz/api/User/SetBusinessUnit?selectedBusinessUnit=${selectedValue}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to set selected business unit');
      }
  
      console.log('Selected business unit set successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error setting selected business unit:', error);
    }
  };

  return (
    <div className="w-max flex items-center">
      <label className="mr-2 hidden text-black dark:text-white lg:block">
        {translate('slctdBU_lbl')} :
      </label>
      <div className="relative z-20 bg-transparent dark:bg-form-input rounded-lg">
        <select
          value={selectedOption}
          onChange={handleOptionChange}
          className="relative w-full z-20 appearance-none rounded-lg border  border-stroke bg-transparent py-2 pl-3 pr-8 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        >
          {options.length > 0 && options.map((option, index) => (
            <option
              key={index}
              value={option.value}
              className="text-body dark:text-bodydark"
            >
              {option.text}
            </option>
          ))}
        </select>
        <span className="absolute top-1/2 right-1.5 z-30 -translate-y-1/2">
          <FontAwesomeIcon
            icon={faChevronDown}
            className="fill-current"
          />
        </span>
      </div>
    </div>
  );
};

export default SelectDB;
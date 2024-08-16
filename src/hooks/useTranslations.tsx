import { useEffect, useState } from 'react';

const useTranslations = (view: string) => {
  const [words, setWords] = useState<{ [key: string]: string }>({});
  const TOKEN = localStorage.getItem('token')

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(`https://encodehertz.xyz/api/General/Localization/GetViewLanguage?view=${view}`, {
            headers: {
              'Authorization': `Bearer ${TOKEN}`, 
              'Content-Type': 'application/json'
            }
          });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const translations = data.reduce((acc: { [key: string]: string }, item: { key: string, value: string }) => {
          acc[item.key] = item.value;
          return acc;
        }, {});
        setWords(translations);
      } catch (error) {
        console.error('Error fetching translations:', error);
      }
    };

    fetchTranslations();
  }, [view]);

  const translate = (key: string) => {
    return words[key] || key;
  };

  return { translate, words };
};

export default useTranslations;

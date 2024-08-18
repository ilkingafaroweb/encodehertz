import { useEffect, useState } from 'react';

const useTranslations = (views: string[]) => {
  const [words, setWords] = useState<{ [key: string]: string }>({});
  const TOKEN = localStorage.getItem('token');

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const allTranslations = await Promise.all(
          views.map(async (view) => {
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
            return data.reduce((acc: { [key: string]: string }, item: { key: string, value: string }) => {
              acc[item.key] = item.value;
              return acc;
            }, {});
          })
        );

        // Tüm çevirileri birleştir
        const mergedTranslations = allTranslations.reduce((acc, translations) => {
          return { ...acc, ...translations };
        }, {});

        setWords(mergedTranslations);
      } catch (error) {
        console.error('Error fetching translations:', error);
      }
    };

    fetchTranslations();
  }, [views]);

  const translate = (key: string) => {
    return words[key] || key;
  };

  return { translate, words };
};

export default useTranslations;

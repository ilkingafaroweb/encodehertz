import { useState, useEffect } from 'react';

const cache = new Map();

const useTranslations = (views: string[]) => {
  const [words, setWords] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchTranslations = async () => {
      const cacheKey = JSON.stringify(views);

      if (cache.has(cacheKey)) {
        setWords(cache.get(cacheKey));
        return;
      }

      try {
        const allTranslations = await Promise.all(
          views.map(async (view) => {
            const response = await fetch(`http://85.190.242.108:4483/api/General/Localization/GetViewLanguage?view=${view}`);
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

        const mergedTranslations = allTranslations.reduce((acc, translations) => {
          return { ...acc, ...translations };
        }, {});

        cache.set(cacheKey, mergedTranslations);
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
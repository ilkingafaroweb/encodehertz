import { useState, useEffect } from 'react';

const useLayout = (view: string) => {
  const [layout, setLayout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLayoutData = async () => {
      try {
        const response = await fetch(`http://85.190.242.108:4483/api/General/Layout/GetLayout?view=${view}`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setLayout(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLayoutData();
  }, [view]);

  return { layout, loading, error };
};

export default useLayout;

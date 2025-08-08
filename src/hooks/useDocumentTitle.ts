import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useDocumentTitle = (title: string): void => {
  const location = useLocation();

  useEffect(() => {
    document.title = title;
  }, [title, location.pathname]);
};

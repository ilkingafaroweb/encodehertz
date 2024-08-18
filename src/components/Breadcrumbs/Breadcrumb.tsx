import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import useTranslations from '../../hooks/useTranslations';

interface BreadcrumbProps {
  pageName: string;
  prevPageName: string;
  prevRoute: string;
}

const Breadcrumb = ({ pageName, prevPageName, prevRoute }: BreadcrumbProps) => {

  const { translate } = useTranslations(['breadcrumb', 'side_bar', 'general']); 

  return (
    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2> */}
      <Link 
        to={prevRoute}
        className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-gray text-black lg:text-lg lg:hover:text-primary dark:bg-boxdark-2 dark:text-white py-2 px-4 text-center font-medium lg:px-6 xl:px-4">
        <FontAwesomeIcon icon={faArrowLeft}/> {translate('back_lbl')}
      </Link>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium lg:text-lg" to={prevRoute}>
              {translate(prevPageName)} /
            </Link>
          </li>
          <li className="font-medium lg:text-lg text-primary">{translate(pageName)}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;

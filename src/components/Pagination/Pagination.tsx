import React from 'react';

interface PaginationProps {
    itemsPerPage: number
    itemsPerPageOptions: number[];
    totalItems: number;
    currentPage: number;
    setItemsPerPage: (itemsPerPage: number) => void
    setCurrentPage: (pageNumber: number) => void;
    onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ itemsPerPage, setItemsPerPage, itemsPerPageOptions, totalItems, currentPage, setCurrentPage, onPageChange }) => {

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const firstItemIndex = (currentPage - 1) * itemsPerPage + 1;
  const lastItemIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      onPageChange(pageNumber);
    }
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(event.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    onPageChange(1);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = 1;
    let endPage = totalPages;
  
    if (totalPages > maxVisiblePages) {
      if (currentPage <= Math.floor(maxVisiblePages / 2) + 1) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
        startPage = totalPages - maxVisiblePages + 1;
      } else {
        startPage = currentPage - Math.floor(maxVisiblePages / 2);
        endPage = currentPage + Math.floor(maxVisiblePages / 2);
      }
    }
  
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  
    return pageNumbers.map((number) => (
      <li
        key={number}
        onClick={() => handlePageChange(number)}
        className={`cursor-pointer text-xl ${currentPage === number ? 'text-primary font-bold' : 'text-black dark:text-white'}`}
      >
        {number}
      </li>
    ));
  };
  

  const renderPreviousButton = () => {
    if (currentPage === 1) {
      return <li className="cursor-not-allowed text-gray-400">&#8592;</li>;
    } else {
      return (
        <li className="cursor-pointer" onClick={() => handlePageChange(currentPage - 1)}>
          &#8592;
        </li>
      );
    }
  };

  const renderNextButton = () => {
    if (currentPage === totalPages) {
      return <li className="cursor-not-allowed text-gray-400">&#8594;</li>;
    } else {
      return (
        <li className="cursor-pointer" onClick={() => handlePageChange(currentPage + 1)}>
          &#8594;
        </li>
      );
    }
  };

  return (
    <div className="flex justify-between items-center my-4 p-4 bg-gray-2 dark:bg-meta-4">
      <div className="flex items-center space-x-2">
        <span className='hidden lg:block md:block text-black dark:text-white'>Show:</span>
        <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="p-2 border bg-white text-black border-gray-300 rounded-md dark:bg-boxdark dark:text-white">
          {itemsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className='hidden lg:block md:block text-black dark:text-white'>items</span>
      </div>
      <div>
      <div className='hidden lg:block md:block'>
        <p>{`${firstItemIndex} - ${lastItemIndex} of ${totalItems} items` }</p>
      </div>
      </div>
      <ul className="flex space-x-2">
        {renderPreviousButton()}
        {renderPageNumbers()}
        {renderNextButton()}
      </ul>
    </div>
  );
};

export default Pagination;

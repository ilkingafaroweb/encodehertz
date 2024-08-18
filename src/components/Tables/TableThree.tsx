import React, { useState, useEffect, useRef } from 'react';
import Pagination from '../Pagination/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownAZ, faArrowDownZA, faChevronDown, faChevronUp, faCopy, faDownload, faEdit, faEye, faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Tooltip } from "antd";
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { isDOMComponent } from 'react-dom/test-utils';
import useTranslations from '../../hooks/useTranslations';

const TableThree = ({layout, data, handleDelete, actions }: {layout: object, data: any, handleDelete: any, actions: any }) => {

  const { translate } = useTranslations(['general']);

  /* Initial table data */
  const [selectedIds, setSelectedIds] = useState([]);
  const [tableData, setTableData] = useState(data || []);
  const [columnOrder, setColumnOrder] = useState(Object.keys(data[0] || {}));

  useEffect(() => {
    setTableData(data);
    setColumnOrder(Object.keys(data[0] || {}));
  }, [data]);

  useEffect(() => {
    setVisibleColumns(columnOrder)
  }, [columnOrder])

  /* Column show/hide */
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columnOrder);
  const columnDropRef = useRef<HTMLDivElement>(null);

  const [columnDropOpen, setColumnDropOpen] = useState(false);

  /* Pagination props */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPageOptions = [5, 10, 20];
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[1]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  /* Sorting */
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const handleSort = (key: string) => {
    let direction = 'ascending';

    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        setSortConfig({ key: null, direction: 'ascending' });
        return;
      }
    }
    setSortConfig({ key, direction });
  };

  const handleDragStart = (e, columnIndex) => {
    e.dataTransfer.setData('columnIndex', columnIndex);
  };

  useEffect(() => {
    const sortableData = [...data];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    setTableData(sortableData);
  }, [sortConfig, data]);


  /* Column reordering */

  const handleDrop = (e: any, targetColumnIndex: number) => {
    const sourceColumnIndex = e.dataTransfer.getData('columnIndex');
    const newColumnOrder = [...columnOrder];
    const [removedColumn] = newColumnOrder.splice(sourceColumnIndex, 1);
    newColumnOrder.splice(targetColumnIndex, 0, removedColumn);
    setColumnOrder(newColumnOrder);
  };

  /* Column show/hide func */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (columnDropRef.current && !columnDropRef.current.contains(event.target as Node)) {
        setColumnDropOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleColumnToggle = (columnName: string) => {
    if (visibleColumns.includes(columnName)) {
      setVisibleColumns(visibleColumns.filter(col => col !== columnName));
    } else {
      setVisibleColumns([...visibleColumns, columnName]);
    }
  };

  /* Excel Actions */
  const handleExcelDownload = () => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'table_data.xlsx');
  };

  /* Add Local Storage Action ID */

  const addLocalActionId = (idList) => {
    localStorage.setItem("ActionID", idList);
  }

  // Selected row onchange function

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) => {
      if (Array.isArray(prevSelectedIds)) {
        if (prevSelectedIds.includes(id)) {
          const newSelectedIds = prevSelectedIds.filter((selectedId) => selectedId !== id);
          return newSelectedIds;
        } else {
          return [...prevSelectedIds, id];
        }
      } else {
        return prevSelectedIds === id ? [] : [prevSelectedIds, id];
      }
    });
  };

  useEffect(() => {
    addLocalActionId(selectedIds)
  }, [selectedIds])


  const handleClick = async () => {
    const success = await handleDelete();
    if (success) {
      setSelectedIds([]);
    }
  };


  return (
    <div className="relative rounded-sm border border-stroke bg-white px-3 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className='w-full mb-6 flex flex-wrap justify-end gap-1.5'>
        {
          selectedIds.length === 0 && (
            actions.includes('add') && (
              <Link
                to="./add"
                className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-gray text-black lg:hover:text-primary dark:bg-boxdark-2 dark:text-white py-2 px-4 text-center font-medium0 lg:px-6 xl:px-4"
              >
                <span className="hidden sm:inline">{translate('add_lbl')}</span>
                <FontAwesomeIcon icon={faPlus} />
              </Link>
            )
          )
        }
        {
          selectedIds.length === 1 && (
            <>
              {actions.includes('edit') && (
                <Link
                  to="./edit"
                  onClick={() => addLocalActionId(selectedIds[0])}
                  className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-gray text-black lg:hover:text-primary dark:bg-boxdark-2 dark:text-white py-2 px-4 text-center font-medium0 lg:px-6 xl:px-4"
                >
                  <span className="hidden sm:inline">{translate('edit_lbl')}</span>
                  <FontAwesomeIcon icon={faEdit} />
                </Link>
              )}
              {actions.includes('preview') && (
                <Link
                  to="./preview"
                  onClick={() => addLocalActionId(selectedIds[0])}
                  className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-gray text-black lg:hover:text-primary dark:bg-boxdark-2 dark:text-white py-2 px-4 text-center font-medium0 lg:px-6 xl:px-4"
                >
                  <span className="hidden sm:inline">{translate('preview_lbl')}</span>
                  <FontAwesomeIcon icon={faEye} />
                </Link>
              )}
              {actions.includes('duplicate') && (
                <Link
                  to="./duplicate"
                  onClick={() => addLocalActionId(selectedIds[0])}
                  className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-gray text-black lg:hover:text-primary dark:bg-boxdark-2 dark:text-white py-2 px-4 text-center font-medium0 lg:px-6 xl:px-4"
                >
                  <span className="hidden sm:inline">{translate('duplicate_lbl')}</span>
                  <FontAwesomeIcon icon={faCopy} />
                </Link>
              )}
              {actions.includes('delete') && (
                <button
                  className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-gray text-black lg:hover:text-primary dark:bg-boxdark-2 dark:text-white py-2 px-4 text-center font-medium0 lg:px-6 xl:px-4"
                  onClick={handleClick}
                >
                  <span className="hidden sm:inline">{translate('delete_lbl')}</span>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </>
          )
        }
        {
          selectedIds.length > 1 && (
            actions.includes('delete') && (
              <button
                className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-gray text-black lg:hover:text-primary dark:bg-boxdark-2 dark:text-white py-2 px-4 text-center font-medium0 lg:px-6 xl:px-4"
                onClick={handleClick}
              >
                <span className="hidden sm:inline">{translate('delete_lbl')}</span>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )
          )
        }
        {
          !!tableData.length && <><button
            onClick={handleExcelDownload}
            className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-gray text-black lg:hover:text-primary dark:bg-boxdark-2 dark:text-white py-2 px-4 text-center font-medium lg:px-6 xl:px-4"
          >
            <span className="hidden sm:inline">Excel</span>
            <FontAwesomeIcon icon={faDownload} />
          </button>
            <div ref={columnDropRef}>
              <button
                onClick={() => setColumnDropOpen(!columnDropOpen)}
                className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-gray text-black lg:hover:text-primary dark:bg-boxdark-2 dark:text-white py-2 px-4 text-center font-medium lg:px-6 xl:px-4"
              >
                <span className="hidden sm:inline">{translate('columns_lbl')}</span> {columnDropOpen ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
              </button>
              {columnDropOpen && (
                <div className="origin-top-right absolute p-2 right-7 mt-2 w-max min-w-36 max-h-56 overflow-y-scroll text-lg rounded-lg shadow-lg shadow-boxdark-2 bg-white ring-1 ring-black ring-opacity-5 dark:bg-boxdark-2 dark:text-white">
                  <div className="flex flex-col gap-1 overflow-hidden" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    {columnOrder.map((column, index) => (
                      <label key={index} className="inline-flex items-center px-2 py-.5 hover:bg-boxdark rounded-md">
                        <input
                          type="checkbox"
                          className="form-checkbox w-4 h-4 mr-1"
                          checked={visibleColumns.includes(column)}
                          onChange={() => handleColumnToggle(column)}
                        />
                        <span className="ml-2">{column.slice(0, 1).toLocaleUpperCase() + column.slice(1).toLocaleLowerCase()}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div></>
        }
      </div>
      <div className="max-w-full overflow-x-scroll">
        {tableData.length === 0 ? (
          <div className='flex justify-center items-center border border-dashed border-primary w-full h-[calc(100vh-360px)]'>
            <p className='font-medium text-xl text-black dark:text-white text-center'>No data available</p>
          </div>
        ) : (
          <table className="w-max min-w-full table-auto">
            <thead>
              <tr className="w-max bg-gray-2 text-left dark:bg-meta-4">
                {actions.length > 0 && (<th className="w-max py-4 px-4 font-medium text-black text-center dark:text-white">
                  <input
                    type="checkbox"
                    className='w-4 h-4'
                    onChange={(e) => {
                      if (e.target.checked) {
                        const allIds = tableData.map(item => item.id);
                        setSelectedIds(allIds);
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                  />
                </th>)}
                {columnOrder.length > 0 && columnOrder.map((header, index) => (
                  visibleColumns.includes(header) && (
                    <th
                      key={index}
                      className="w-max py-4 px-4 font-medium text-black text-center dark:text-white"
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <div className='flex gap-2'>
                        <div onClick={() => handleSort(header)} className='mx-auto'>
                          {header.toUpperCase()}
                        </div>
                        {sortConfig.key === header && (
                          <span>
                            {sortConfig.direction === 'ascending' ?
                              <FontAwesomeIcon icon={faArrowDownAZ} /> :
                              (sortConfig.direction === 'descending' ?
                                <FontAwesomeIcon icon={faArrowDownZA} /> :
                                null
                              )
                            }
                          </span>
                        )}
                      </div>
                    </th>
                  )
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((rowData, rowIndex) => (
                <tr key={rowIndex}>
                  {
                    actions.length > 0 && (<td className="border-b border-[#eee] py-4 px-4 text-center dark:border-strokedark">
                      <input
                        type="checkbox"
                        className='w-4 h-4'
                        checked={selectedIds.includes(rowData.id)}
                        onChange={() => handleCheckboxChange(rowData.id)}
                      />
                    </td>)
                  }
                  {columnOrder.map((header, colIndex) => (
                    visibleColumns.includes(header) && (
                      <td
                        key={colIndex}
                        className="border-b border-[#eee] py-4 px-4 text-center dark:border-strokedark"
                      >
                        <h5 className="font-medium text-center text-black dark:text-white">
                          {rowData[header]}
                        </h5>
                      </td>
                    )
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {
        tableData.length !== 0 && <Pagination
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          itemsPerPageOptions={itemsPerPageOptions}
          totalItems={tableData.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onPageChange={handlePageChange}
        />
      }
    </div>
  );
};

export default TableThree;
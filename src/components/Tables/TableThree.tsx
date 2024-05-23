import React, { useState, useEffect, useRef } from 'react';
import Pagination from '../Pagination/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownAZ, faArrowDownZA, faChevronDown, faChevronUp, faCopy, faDownload, faEye, faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Tooltip } from "antd";
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const TableThree = ({ data, handleDelete } : {data?: any[], handleDelete: any}) => {

  /* Initial table data */
  const [tableData, setTableData] = useState(data);
  const [columnOrder, setColumnOrder] = useState(Object.keys(tableData[0]));

  useEffect(()=>{
    setTableData(data)
  },[data])
  

  /* Column show/hide */
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columnOrder)
  const columnDropRef = useRef<HTMLDivElement>(null);

  const [columnDropOpen, setColumnDropOpen] = useState(false)

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
  }, [sortConfig]);

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

  /* Add Local Storage Action ID */
  const addLocalActionId = (id: number) => {
    localStorage.setItem("ActionID", id.toString());
  }


  /* Excel Actions */
  const handleExcelDownload = () => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'table_data.xlsx');
  };


  return (
    <div className="relative rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className='w-full mb-6 flex justify-end gap-2'>
        <Link
          to="./add"
          className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-gray text-black lg:hover:text-primary dark:bg-boxdark-2 dark:text-white py-2 px-4 text-center font-medium0 lg:px-6 xl:px-4"
        >
          Add <FontAwesomeIcon icon={faPlus} />
        </Link>
        <button
          onClick={handleExcelDownload}
          className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-gray text-black lg:hover:text-primary dark:bg-boxdark-2 dark:text-white py-2 px-4 text-center font-medium lg:px-6 xl:px-4"
        >
          Excel <FontAwesomeIcon icon={faDownload} />
        </button>
        <div ref={columnDropRef}>
          <button
            onClick={() => setColumnDropOpen(!columnDropOpen)}
            className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-gray text-black lg:hover:text-primary dark:bg-boxdark-2 dark:text-white py-2 px-4 text-center font-medium lg:px-6 xl:px-4"
          >
            Columns {columnDropOpen ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
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
                    <span className="ml-2">{column.slice(0,1).toLocaleUpperCase() + column.slice(1).toLocaleLowerCase()}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="max-w-full overflow-x-scroll">
        <table className="w-max min-w-full table-auto">
          <thead>
            <tr className="w-max bg-gray-2 text-left dark:bg-meta-4">
              {columnOrder.length > 0 ? columnOrder.map((header, index) => (
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
              )) : <th className='className="w-max py-4 px-4 font-medium text-black text-center dark:text-white"'>
                  <td>Bosdurrrr</td>
                </th>}
              <th className='w-max py-4 px-4 font-medium text-black dark:text-white text-center'>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((rowData: any, rowIndex: number) => (
              <tr key={rowIndex}>
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
                <td className='flex justify-center items-center max-w-max min-w-full gap-2 border-b text-boxdark-2 border-[#eee] py-5 px-4 dark:border-strokedark dark:text-white'>
                  <Tooltip placement="top" title="Preview">
                    <Link to="./preview" onClick={() => addLocalActionId(rowData.id)} className="flex justify-center items-center gap-3 w-12 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-boxdark-2 focus:outline-none hover:text-primary">
                      <FontAwesomeIcon icon={faEye} />
                    </Link>
                  </Tooltip>
                  <Tooltip placement="top" title="Edit">
                    <Link to="./edit" onClick={() => addLocalActionId(rowData.id)} className="flex justify-center items-center gap-3 w-12 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-boxdark-2 focus:outline-none hover:text-primary">
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </Link>
                  </Tooltip>
                  {/* <Tooltip placement="top" title="Duplicate">
                    <Link to="./duplicate" onClick={() => addLocalActionId(rowData.id)} className="flex justify-center items-center gap-3 w-12 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-boxdark-2 focus:outline-none hover:text-primary">
                      <FontAwesomeIcon icon={faCopy} />
                    </Link>
                  </Tooltip> */}
                  <Tooltip placement='top' title="Delete">
                    <button onClick={() => {addLocalActionId(rowData.id), handleDelete()}} className="flex justify-center items-center gap-3 w-12 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-boxdark-2 focus:outline-none hover:text-primary">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        itemsPerPageOptions={itemsPerPageOptions}
        totalItems={tableData.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default TableThree;
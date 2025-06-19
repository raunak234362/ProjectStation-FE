/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import React, {useEffect, useState} from 'react'
import Button from '../../../../fields/Button';
import { useSelector } from 'react-redux';
import { useSortBy, useTable, usePagination } from "react-table";
import Service from '../../../../../config/Service';
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import {useForm} from "react-hook-form"
import {toast} from 'react-toastify'

function Table({ columns, data }) {
    const { getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount, gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      state: { pageIndex, pageSize },
      prepareRow
    } = useTable({
      columns, data,
      initialState:{pageIndex: 0},
    }, useSortBy, usePagination)
   
  return (
    <>
      <table
        {...getTableProps()}
        className="min-w-full mt-5 text-lg text-center border border-collapse text-md rounded-xl"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="bg-teal-200/70"
            >
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="sticky top-0 z-10 px-2 py-2 bg-teal-200 border-2"
                >
                  {column.render("Header")}
                  <div>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? "desc"
                        : "asc"
                      : ""}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr
                {...row.getRowProps()}
                className="px-2 py-1 text-center border-2"
              >
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} className="px-2 py-2 border-2">
                      {cell.render("Cell")}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="flex flex-wrap items-center gap-2 mt-4 text-sm">
        <button
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          {"<<"}
        </button>
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          {"<"}
        </button>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          {">"}
        </button>
        <button
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          className="px-2 py-1 border rounded disabled:opacity-50"
        >
          {">>"}
        </button>

        <span className="ml-2">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>

        <span className="ml-2">
          Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            className="w-16 px-2 py-1 border rounded"
          />
        </span>

        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="px-2 py-1 ml-2 border rounded"
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}



const ViewCOTable = ({ onClose, COdata, coId }) => {
  console.log("COdata", COdata);
  const dataID = COdata;
  const [coTable, setCOTable] = useState([]);
  const [accept, setAccept] = useState() 
  const [acceptCO, setAcceptCO] = useState()
  console.log(dataID, "COdata");
  const {
      register,
      handleSubmit,
      setValue,
      getValue,
      watch,
      control,
      formState: { errors },
    } = useForm();
  
  const projectData = useSelector((state) => state.projectData.projectData);
    const  COid = coId
  // const handleAccept = () => {
    
  // }

  const viewCOTable = async () => {
    try {
      const response = await Service.fetchCOTable(dataID);
      console.log(response);
      if (response) {
        setCOTable(response?.data);
      } else {
        console.log("CO not found");
      }
    } catch (error) {
      console.log(error);
    }
  };

//  const onSubmit = async (data) => {
//    const formData = new FormData();
//    formData.append("status", accept ? "ACCEPT" : "REJECT");
//    formData.append("reason", data.description || "");

//    try {
//      const response = await Service.submitStatusOfCO(coId, formData);
//      if (response) {
//        setAcceptCO(response?.data);
//        onClose();
//        toast.success("CO updated successfully");
//      }
//    } catch (error) {
//      console.error("Submission failed:", error);
//      toast.error("CO update failed");
//    }
  //  };
  
  const onSubmit = async (data) => {
    const coAcceptData = {
      status: data.status,
      reason: data.description
    }
    try {
      const response = await Service.submitStatusOfCO(coId, coAcceptData);
      if (response) {
        setAcceptCO(response?.data);
        onClose();
        toast.success("CO updated successfully");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("CO update failed");
    }
  }


  
  useEffect(() => {
    viewCOTable();
  }, [dataID]);
 

  const columns = React.useMemo(
    () => [
      {
        Header: "Slno",
        accessor: (row, i) => i + 1,
        id: "slno",
      },
      {
        Header: "Description of Changes",
        accessor: "description",
      },
      {
        Header: "Reference/Drawings",
        accessor: "referenceDoc",
      },
      {
        Header: "Elements",
        accessor: "elements",
      },
      {
        Header: "Qty",
        accessor: "QtyNo",
      },
      {
        Header: "Hours",
        accessor: "hours",
      },
      {
        Header: "Cost",
        accessor: "cost",
      },
    ],
    []
  );

  const data = React.useMemo(()=>coTable||[],[coTable])
  return (
    <>
      <div>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="relative bg-white rounded-lg shadow-xl w-[80%] max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex gap-2">
              <div className="p-2 w-[90%] px-2 py-2 m-2 text-2xl font-bold text-white bg-teal-500 rounded-lg">
                <h1>Display Table CO</h1>
                <div>{COdata?.date}</div>
              </div>
              <Button className="h-10 hover:bg-red-600" onClick={onClose}>
                Close
              </Button>
            </div>
            <div className="p-1 m-2 border border-b-teal-500"></div>
            <div>
              <Table columns={columns} data={data}></Table>
            </div>
            <div className="p-2 mt-2 bg-teal-100 rounded-md">
              <form onSubmit={handleSubmit(onSubmit)}>
                <input
                  type="hidden"
                  {...register("status")}
                  value={accept ? "ACCEPT" : "REJECT"}
                />
                <DoneIcon
                  onClick={() => setAccept(true)}
                  className="m-1 text-white bg-green-500 rounded-md hover:bg-green-800"
                />
                <CloseIcon
                  onClick={() => setAccept(false)}
                  className="m-1 text-white bg-red-500 rounded-md hover:bg-red-800"
                />
                <textarea
                  {...register("description")}
                  id="description"
                  rows="3"
                  className="block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  placeholder="Add an optional description here..."
                  onChange={setValue}
                ></textarea>
                <div>
                  <Button type="submit" disabled={accept === undefined}>
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewCOTable
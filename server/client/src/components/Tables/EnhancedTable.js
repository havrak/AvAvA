import React, { useState, useEffect } from "react";
//source https://github.com/tannerlinsley/react-table/tree/master/examples/material-UI-kitchen-sink
import Checkbox from "@material-ui/core/Checkbox";
import MaUTable from "@material-ui/core/Table";
import PropTypes from "prop-types";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TablePaginationActions from "./TablePaginationActions";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableToolbar from "./TableToolbar";
import ClipLoader from "react-spinners/ClipLoader";
import {
   useGlobalFilter,
   usePagination,
   useRowSelect,
   useSortBy,
   useTable,
} from "react-table";
import { makeStyles } from "@material-ui/core/styles";
// import { waitForDebugger } from "inspector";

const useStyles = makeStyles(() => ({
   table: {
      fontWeight: "bold",
   },
}));

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
   const defaultRef = React.useRef();
   const resolvedRef = ref || defaultRef;

   React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
   }, [resolvedRef, indeterminate]);

   return (
      <>
         <Checkbox
            indeterminate={indeterminate}
            ref={resolvedRef}
            {...rest}
            color="primary"
         />
      </>
   );
});

const createHiddenColumnsArray = (columns, selectedView) => {
   const nameArray = [];
   for (const col of columns) {
      if (col.view !== "all" && col.view !== selectedView) {
         nameArray.push(col.accessor);
      }
      if (col.columns !== undefined) {
         for (const childCol of col.columns) {
            if (childCol.view !== "all" && col.view !== selectedView) {
               nameArray.push(childCol.accessor);
            }
         }
      }
   }
   return nameArray;
};

const EnhancedTable = ({
   columns,
   data,
   setData,
   updateMyData,
   skipPageReset,
   views,
   view,
   setView,
   userLimits,
   createHandler,
}) => {
   const {
      getTableProps,
      headerGroups,
      prepareRow,
      page,
      gotoPage,
      setPageSize,
      preGlobalFilteredRows,
      setGlobalFilter,
      setHiddenColumns,
      state: { pageIndex, pageSize, selectedRowIds, globalFilter },
   } = useTable(
      {
         columns,
         data,
         autoResetPage: !skipPageReset,
         // updateMyData isn't part of the API, but
         // anything we put into these options will
         // automatically be available on the instance.
         // That way we can call this function from our
         // cell renderer!
         updateMyData,
         initialState: {
            hiddenColumns: createHiddenColumnsArray(columns, views[0]),
            // hiddenColumns: "containers running stopped frozen"
         },
      },
      useGlobalFilter,
      useSortBy,
      usePagination,
      useRowSelect,
      (hooks) => {
         hooks.allColumns.push((columns) => [
            // Let's make a column for selection
            {
               id: "selection",
               // The header can use the table's getToggleAllRowsSelectedProps method
               // to render a checkbox.  Pagination is a problem since this will select all
               // rows even though not all rows are on the current page.  The solution should
               // be server side pagination.  For one, the clients should not download all
               // rows in most cases.  The client should only download data for the current page.
               // In that case, getToggleAllRowsSelectedProps works fine.
               Header: ({ getToggleAllRowsSelectedProps }) => (
                  <div>
                     <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
                  </div>
               ),
               // The cell can use the individual row's getToggleRowSelectedProps method
               // to the render a checkbox
               Cell: ({ row }) => (
                  <div>
                     {/* <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} /> */}
                     <div
                        style={{
                           marginLeft: "5px",
                           display: "flex",
                           alignItems: "center",
                        }}
                     >
                        <ClipLoader color={"#212529"} loading={true} size={30} />
                        <span style={{ marginLeft: "5px" }}>Deleting</span>
                     </div>
                  </div>
               ),
            },
            ...columns,
         ]);
      }
   );

   const handleChangePage = (event, newPage) => {
      gotoPage(newPage);
   };
   useEffect(() => {
      setHiddenColumns(createHiddenColumnsArray(columns, view));
   }, [view]);
   // const [, updateState] = React.useState();
   // useEffect(()=> {
   //    updateState();
   // }, [data])
   const handleChangeRowsPerPage = (event) => {
      setPageSize(Number(event.target.value));
   };

   const getByIndexs = (array, indexs) =>
      array.filter((_, i) => {
         return indexs.includes(i);
      });
   const removeByIndex = (array, index) => array.filter((_, i) => index !== i);
   // const getByIndexs = (array, indexs) => array.filter((_, i) => indexs.includes(i));

   const deleteUserHandler = (event) => {
      const newData = getByIndexs(
         data,
         Object.keys(selectedRowIds).map((x) => parseInt(x, 10))
      );
      // const selectedData = getByIndexs(data,
      // Object.keys(selectedRowIds).map((x) => parseInt(x, 10)));
      // for (const index of Object.keys(selectedRowIds)) {
      //    setTimeout((e) => {
      //       const newData = removeByIndex(data, parseInt(index, 10));
      //       setData(newData);
      //    }, 1);
      // }
      setData(newData);
   };

   const styles = useStyles();
   // Render the UI for your table
   return (
      <TableContainer>
         <TableToolbar
            numSelected={Object.keys(selectedRowIds).length}
            deleteUserHandler={deleteUserHandler}
            createHandler={createHandler}
            preGlobalFilteredRows={preGlobalFilteredRows}
            setGlobalFilter={setGlobalFilter}
            globalFilter={globalFilter}
            views={views}
            view={view}
            setView={setView}
            userLimits={userLimits}
         />
         <MaUTable {...getTableProps()} size={"small"}>
            <TableHead>
               {headerGroups.map((headerGroup) => (
                  <TableRow {...headerGroup.getHeaderGroupProps()}>
                     {headerGroup.headers.map((column) => {
                        return (
                           <TableCell
                              {...(column.columns !== undefined
                                 ? column.getHeaderProps()
                                 : column.getHeaderProps(column.getSortByToggleProps()))}
                              className={styles.table}
                              style={{ display: column.display }}
                           >
                              {column.render("Header")}
                              {column.columns === undefined &&
                              column.accessor !== undefined ? (
                                 <TableSortLabel
                                    active={column.isSorted}
                                    // react-table has a unsorted state which is not treated here
                                    direction={column.isSortedDesc ? "desc" : "asc"}
                                 />
                              ) : null}
                           </TableCell>
                        );
                     })}
                  </TableRow>
               ))}
            </TableHead>
            <TableBody>
               {page.map((row, i) => {
                  prepareRow(row);
                  return (
                     <TableRow hover {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                           return (
                              <TableCell {...cell.getCellProps()}>
                                 {cell.render("Cell")}
                              </TableCell>
                           );
                        })}
                     </TableRow>
                  );
               })}
            </TableBody>

            <TableFooter>
               <TableRow>
                  <TablePagination
                     rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: "All", value: data.length },
                     ]}
                     count={data.length}
                     rowsPerPage={pageSize}
                     page={pageIndex}
                     // colSpan={3}
                     onChangePage={handleChangePage}
                     onChangeRowsPerPage={handleChangeRowsPerPage}
                     ActionsComponent={TablePaginationActions}
                  />
               </TableRow>
            </TableFooter>
         </MaUTable>
      </TableContainer>
   );
};

EnhancedTable.propTypes = {
   columns: PropTypes.array.isRequired,
   data: PropTypes.array.isRequired,
   updateMyData: PropTypes.func.isRequired,
   setData: PropTypes.func.isRequired,
   skipPageReset: PropTypes.bool.isRequired,
};

export default EnhancedTable;

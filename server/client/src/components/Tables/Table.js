import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";
import StartIcon from '@material-ui/icons/PlayArrowSharp';
import StopIcon from '@material-ui/icons/StopSharp';
import FreezeIcon from '@material-ui/icons/AcUnitSharp';
import UnfreezeIcon from '@material-ui/icons/Whatshot';
import AddIcon from "@material-ui/icons/Add";
import FilterListIcon from "@material-ui/icons/FilterList";
//source: https://material-ui.com/components/tables/

function descendingComparator(a, b, orderBy) {
   if (b[orderBy] < a[orderBy]) {
      return -1;
   }
   if (b[orderBy] > a[orderBy]) {
      return 1;
   }
   return 0;
}

function getComparator(order, orderBy) {
   return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
   const stabilizedThis = array.map((el, index) => [el, index]);
   stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
   });
   return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
   const {
      styles,
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort,
      rows,
      headCells,
   } = props;
   const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
   };

   return (
      <TableHead>
         <TableRow classes={{ hover: styles.hover }} className={styles.tableRow}>
            <TableCell padding="checkbox">
               <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={onSelectAllClick}
                  inputProps={{ "aria-label": "select all desserts" }}
                  color="primary"
               />
            </TableCell>
            {headCells.map((headCell) => (
               <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? "right" : "left"}
                  padding={headCell.disablePadding ? "none" : "default"}
                  sortDirection={orderBy === headCell.id ? order : false}
                  style={{fontWeight: "bold"}}
               >
                  <TableSortLabel
                     active={orderBy === headCell.id}
                     direction={orderBy === headCell.id ? order : "asc"}
                     onClick={createSortHandler(headCell.id)}
                  >
                     {headCell.label}
                     {orderBy === headCell.id ? (
                        <span className={styles.visuallyHidden}>
                           {order === "desc" ? "sorted descending" : "sorted ascending"}
                        </span>
                     ) : null}
                  </TableSortLabel>
               </TableCell>
            ))}
         </TableRow>
      </TableHead>
   );
}

EnhancedTableHead.propTypes = {
   styles: PropTypes.object.isRequired,
   numSelected: PropTypes.number.isRequired,
   onRequestSort: PropTypes.func.isRequired,
   onSelectAllClick: PropTypes.func.isRequired,
   order: PropTypes.oneOf(["asc", "desc"]).isRequired,
   orderBy: PropTypes.string.isRequired,
   rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
   root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
   },
   highlight:
      theme.palette.type === "light"
         ? {
              color: theme.palette.primary.main,
              backgroundColor: lighten(theme.palette.primary.light, 0.85),
           }
         : {
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.primary.dark,
           },
   title: {
      flex: "1 1 100%",
   },
}));

const EnhancedTableToolbar = (props) => {
   const classes = useToolbarStyles();
   const { numSelected, selected, headding } = props;

   return (
      <Toolbar
         className={clsx(classes.root, {
            [classes.highlight]: numSelected > 0,
         })}
      >
         {numSelected > 0 ? (
            <Typography
               className={classes.title}
               color="inherit"
               variant="subtitle1"
               component="div"
            >
               {numSelected} selected
            </Typography>
         ) : (
            <Typography
               className={classes.title}
               variant="h6"
               id="tableTitle"
               component="div"
            >
               {headding}
            </Typography>
         )}

         {numSelected > 0 ? (
         <>
            <Tooltip title="Start">
               <IconButton aria-label="Start" onClick={(e) => console.log(selected)} >
                  <StartIcon />
               </IconButton>
            </Tooltip>
            <Tooltip title="Stop">
               <IconButton aria-label="Stop" onClick={(e) => console.log(selected)} >
                  <StopIcon />
               </IconButton>
            </Tooltip>
            <Tooltip title="Freeze">
               <IconButton aria-label="Freeze" onClick={(e) => console.log(selected)} >
                  <FreezeIcon />
               </IconButton>
            </Tooltip>
            <Tooltip title="Unfreeze">
               <IconButton aria-label="Unfreeze" onClick={(e) => console.log(selected)} >
                  <UnfreezeIcon />
               </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
               <IconButton aria-label="Delete" onClick={(e) => console.log(selected)} >
                  <DeleteIcon />
               </IconButton>
            </Tooltip>
            </>
         ) : (
            <>
               <Tooltip title="Filter list">
                  <IconButton aria-label="filter projects">
                     <FilterListIcon />
                  </IconButton>
               </Tooltip>
               <Tooltip title="Add" aria-label="Create new project">
                  <IconButton>
                     <AddIcon />
                  </IconButton>
               </Tooltip>
            </>
         )}
      </Toolbar>
   );
};

EnhancedTableToolbar.propTypes = {
   numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
   root: {
      width: "100%",
   },
   paper: {
      width: "100%",
      marginBottom: theme.spacing(2),
   },
   table: {
      minWidth: 750,
   },
   visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
   },
   tableRow: {
      "&$selected, &$selected:hover": {
         backgroundColor: "#eaecf7",
      },
   },
   selected: {},
}));

function EnhancedTable(props) {
   const { headding, rows, headCells } = props;
   const styles = useStyles();
   const [order, setOrder] = React.useState("asc");
   const [orderBy, setOrderBy] = React.useState("calories");
   const [selected, setSelected] = React.useState([]);
   const [page, setPage] = React.useState(0);
   const [dense, setDense] = React.useState(false);
   const [rowsPerPage, setRowsPerPage] = React.useState(5);

   const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
   };

   const handleSelectAllClick = (event) => {
      if (event.target.checked) {
         const newSelecteds = rows.map((n) => n.name);
         setSelected(newSelecteds);
         return;
      }
      setSelected([]);
   };

   const handleClick = (event, name) => {
      const selectedIndex = selected.indexOf(name);
      let newSelected = [];

      if (selectedIndex === -1) {
         newSelected = newSelected.concat(selected, name);
      } else if (selectedIndex === 0) {
         newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
         newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
         newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1)
         );
      }

      setSelected(newSelected);
   };

   const handleChangePage = (event, newPage) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
   };

   const handleChangeDense = (event) => {
      setDense(event.target.checked);
   };

   const isSelected = (name) => selected.indexOf(name) !== -1;

   // const emptyRows =
   //    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

   return (
      <div className={styles.root}>
         <Paper
            className={styles.paper}
            style={{ boxShadow: "none", border: "1px solid rgba(0,0,0,.125)" }}
         >
            <EnhancedTableToolbar headding={headding} selected={selected} numSelected={selected.length} />
            <TableContainer>
               <Table
                  className={styles.table}
                  aria-labelledby="tableTitle"
                  size={dense ? "small" : "medium"}
                  aria-label="enhanced table"
               >
                  <EnhancedTableHead
                     styles={styles}
                     selected={selected}
                     numSelected={selected.length}
                     order={order}
                     orderBy={orderBy}
                     onSelectAllClick={handleSelectAllClick}
                     onRequestSort={handleRequestSort}
                     rows={rows}
                     headCells={headCells}
                     rowCount={rows.length}
                  />
                  <TableBody>
                     {stableSort(rows, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {
                           const isItemSelected = isSelected(row.name);
                           const labelId = `enhanced-table-checkbox-${index}`;

                           return (
                              <TableRow
                                 hover
                                 onClick={(event) => handleClick(event, row.name)}
                                 role="checkbox"
                                 aria-checked={isItemSelected}
                                 tabIndex={-1}
                                 key={row.name}
                                 selected={isItemSelected}
                                 classes={{ selected: styles.selected }}
                                 className={styles.tableRow}
                              >
                                 <TableCell padding="checkbox">
                                    <Checkbox
                                       checked={isItemSelected}
                                       inputProps={{ "aria-labelledby": labelId }}
                                       color="primary"
                                    />
                                 </TableCell>
                                 <TableCell
                                    component="th"
                                    id={labelId}
                                    scope="row"
                                    padding="none"
                                 >
                                    {row.name}
                                 </TableCell>
                                 <TableCell align="right">{row.calories}</TableCell>
                                 <TableCell align="right">{row.fat}</TableCell>
                                 <TableCell align="right">{row.carbs}</TableCell>
                                 {/* <TableCell align="right">{row.protein}</TableCell> */}
                              </TableRow>
                           );
                        })}
                     {/* {emptyRows > 0 && (
                        <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                           <TableCell colSpan={6} />
                        </TableRow>
                     )} */}
                  </TableBody>
               </Table>
            </TableContainer>
            <TablePagination
               rowsPerPageOptions={[5, 10, 25]}
               component="div"
               count={rows.length}
               rowsPerPage={rowsPerPage}
               page={page}
               onChangePage={handleChangePage}
               onChangeRowsPerPage={handleChangeRowsPerPage}
            />
         </Paper>
         <FormControlLabel
            control={
               <Switch checked={dense} onChange={handleChangeDense} color="primary" />
            }
            label="Dense padding"
         />
      </div>
   );
}

export default EnhancedTable;

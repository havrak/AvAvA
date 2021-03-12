import React, { useEffect } from "react";
//https://github.com/tannerlinsley/react-table/tree/master/examples/material-UI-kitchen-sink
import CreateProjectDialog from "./Dialogs/CreateProjectDialog";
import clsx from "clsx";
import DeleteIcon from "@material-ui/icons/Delete";
import GlobalFilter from "./GlobalFilter";
import IconButton from "@material-ui/core/IconButton";
import { lighten, makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

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
   formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
   },
}));

const TableToolbar = (props) => {
   const classes = useToolbarStyles();
   const {
      numSelected,
      createHandler,
      deleteUserHandler,
      preGlobalFilteredRows,
      setGlobalFilter,
      globalFilter,
      view,
      views,
      setView,
      userLimits
   } = props;
   return (
      <Toolbar
         className={clsx(classes.root, {
            [classes.highlight]: numSelected > 0,
         })}
      >
         <CreateProjectDialog createHandler={createHandler} userLimits={userLimits} />
         <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">View</InputLabel>
            <Select
               labelId="demo-simple-select-label"
               id="demo-simple-select"
               value={view}
               onChange={(e) => setView(e.target.value)}
            >
               {views.map((view) => {
                  return (
                     <MenuItem key={view} value={view}>
                        {view}
                     </MenuItem>
                  );
               })}
            </Select>
         </FormControl>
         {numSelected > 0 ? (
            <Typography
               className={classes.title}
               color="inherit"
               style={{ fontSize: "16px" }}
            >
               {numSelected} selected
            </Typography>
         ) : (
            <Typography
               className={classes.title}
               variant="h6"
               id="tableTitle"
            ></Typography>
         )}

         {numSelected > 0 ? (
            <Tooltip title="Delete">
               <IconButton aria-label="delete" onClick={deleteUserHandler}>
                  <DeleteIcon />
               </IconButton>
            </Tooltip>
         ) : (
            <GlobalFilter
               preGlobalFilteredRows={preGlobalFilteredRows}
               globalFilter={globalFilter}
               setGlobalFilter={setGlobalFilter}
            />
         )}
      </Toolbar>
   );
};

TableToolbar.propTypes = {
   numSelected: PropTypes.number.isRequired,
   createHandler: PropTypes.func.isRequired,
   deleteUserHandler: PropTypes.func.isRequired,
   setGlobalFilter: PropTypes.func.isRequired,
   preGlobalFilteredRows: PropTypes.array.isRequired,
   // globalFilter: PropTypes.string.isRequired,
};

export default TableToolbar;

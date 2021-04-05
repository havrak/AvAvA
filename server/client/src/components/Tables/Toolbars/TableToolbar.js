import React, { useEffect } from "react";
//https://github.com/tannerlinsley/react-table/tree/master/examples/material-UI-kitchen-sink
import clsx from "clsx";
import GlobalFilter from "../GlobalFilter";
import { lighten, makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
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
      fontSize: "16px", 
      textAlign: "right",
      color: "#444444"
   },
   formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
   },
}));

const TableToolbar = (props) => {
   const classes = useToolbarStyles();
   const {
      selectedData,
      addIcon,
      preGlobalFilteredRows,
      setGlobalFilter,
      globalFilter,
      view,
      views,
      setView,
      backIcons
   } = props;
   
   return (
      <Toolbar
         className={clsx(classes.root, {
            [classes.highlight]: selectedData.length > 0,
         })}
      >
         {addIcon}
         <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">View</InputLabel>
            <Select
               labelId="demo-simple-select-label"
               id="demo-simple-select"
               value={view}
               onChange={(e) => setView(e.target.value)}
            >
               {Object.keys(views).map((view) => {
                  return (
                     <MenuItem key={view} value={view}>
                        {view}
                     </MenuItem>
                  );
               })}
            </Select>
         </FormControl>

         {selectedData.length > 0 ? (
            <>
               <Typography
                  className={classes.title}
                  // color="primary"
               >
                  {selectedData.length} selected
               </Typography>
               {backIcons}
            </>
         ) : (
            <>
               <Typography
                  className={classes.title}
                  variant="h6"
                  id="tableTitle"
               ></Typography>
               <GlobalFilter
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
               />
            </>
         )}
      </Toolbar>
   );
};

TableToolbar.propTypes = {
   setGlobalFilter: PropTypes.func.isRequired,
   preGlobalFilteredRows: PropTypes.array.isRequired,
   // globalFilter: PropTypes.string.isRequired,
};

export default TableToolbar;

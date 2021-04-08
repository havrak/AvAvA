import React, { useState, useRef } from "react";
//source: https://github.com/tannerlinsley/react-table/tree/master/examples/material-UI-kitchen-sink
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DialogContent } from "@material-ui/core";

const AreYouSureDialog = ({
   open,
   setOpen,
   actionCallback,
   whatToDo,
   smallText
}) => {

   const handleClose = () => {
      setOpen(false);
   };

   const handleAdd = (event) => {
      actionCallback();
      setOpen(false);
   };

   return (
      <div>
         <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            className={"dialog are-you-sure-dialog"}
         >
            <DialogTitle id="form-dialog-title">{whatToDo}</DialogTitle>
            <DialogContent>
               {smallText}
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose} color="primary">
                  No
               </Button>
               <Button onClick={handleAdd} color="primary">
                  Yes
               </Button>
            </DialogActions>
         </Dialog>
      </div>
   );
};

export default AreYouSureDialog;

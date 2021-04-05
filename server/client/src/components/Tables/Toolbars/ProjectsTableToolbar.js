import React from 'react';
import TableToolbar from "./TableToolbar";
import { projectIdDelete, startSpinnerProjectDelete } from "actions/ProjectActions";
import {
   AddClickableIcon,
   DeleteClickableIcon,
} from "components/Icons/ClickableIcons.js";
import { connect } from "react-redux";
import CreateProjectDialog from "components/Dialogs/CreateProjectDialog.js";

function ProjectsTableToolbar(props) {
   const {
      selectedData,
      preGlobalFilteredRows,
      setGlobalFilter,
      globalFilter,
      notify,
      view,
      views,
      setView,
      projectIdDelete,
      startSpinnerProjectDelete,
   } = props;

   const [dialogOpen, setDialogOpen] = React.useState(false);
   
   const deleteProjectsHandler = () => {
      for (const project of selectedData) {
         startSpinnerProjectDelete(project);
         projectIdDelete(project.id, projectDeleteFailNotification(project.name));
      }
   };

   const projectDeleteFailNotification = (name) => {
      return () => {
         notify(`project "${name}" could not be deleted`, "danger", 4);
      };
   };

   const backIcons = [
      <DeleteClickableIcon key={"DeleteIconButton"} handler={deleteProjectsHandler} />,
   ];

   return (
      <>
         <CreateProjectDialog notify={notify} open={dialogOpen} setOpen={setDialogOpen} />
         <TableToolbar
            selectedData={selectedData}
            preGlobalFilteredRows={preGlobalFilteredRows}
            setGlobalFilter={setGlobalFilter}
            globalFilter={globalFilter}
            views={views}
            view={view}
            setView={setView}
            notify={notify}
            addIcon={
               <AddClickableIcon
                  handler={(e) => {
                     setDialogOpen(true);
                  }}
               />
            }
            backIcons={backIcons}
         />
      </>
   );
}

const mapDispatchToProps = (dispatch) => {
   return {
      startSpinnerProjectDelete: (project) => {
         dispatch(startSpinnerProjectDelete(project));
      },
      projectIdDelete: (id, projectDeleteFailNotification) => {
         dispatch(projectIdDelete(id, projectDeleteFailNotification));
      },
   };
};

export default connect(null, mapDispatchToProps)(ProjectsTableToolbar);

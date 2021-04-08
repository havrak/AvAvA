import React from "react";
import TableToolbar from "./TableToolbar";
import { projectIdDelete, startSpinnerProjectDelete } from "actions/ProjectActions";
import {
   AddClickableIcon,
   DeleteClickableIcon,
} from "components/Icons/ClickableIcons.js";
import { connect } from "react-redux";
import CreateProjectDialog from "components/Dialogs/CreateProjectDialog.js";
import AreYouSureDialog from "components/Dialogs/AreYouSureDialog";

const baseState = () => {
   return {
      name: "",
      owner: {},
      limits: {
         RAM: null,
         CPU: null,
         disk: null,
         internet: {
            upload: null,
            download: null,
         },
      },
   };
};

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
   } = props;
   const createdProject = React.useRef(baseState);

   const openDialogHandler = () => {
      createdProject.current = baseState();
      setDialogOpen(true);
   };

   const [dialogOpen, setDialogOpen] = React.useState(false);
   const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

   const deleteProjectsHandler = () => {
      setDeleteDialogOpen(true);
   };

   const proceedWithDeletionHandler = () => {
      for (const project of selectedData) {
         projectIdDelete(project.id, notify);
      }
   }

   const backIcons = [
      <DeleteClickableIcon key={"DeleteIconButton"} handler={deleteProjectsHandler} />,
   ];

   return (
      <>
         <CreateProjectDialog
            createdProject={createdProject}
            notify={notify}
            open={dialogOpen}
            setOpen={setDialogOpen}
         />
         <AreYouSureDialog
         open={deleteDialogOpen}
         setOpen={setDeleteDialogOpen}
         actionCallback={proceedWithDeletionHandler}
         whatToDo={`Do you want to delete there projects?`}
         smallText={selectedData.map(selectedProject => {
            return <div className="small-text-item">{selectedProject.name}</div>
         })}
      />
         <TableToolbar
            selectedData={selectedData}
            preGlobalFilteredRows={preGlobalFilteredRows}
            setGlobalFilter={setGlobalFilter}
            globalFilter={globalFilter}
            views={views}
            view={view}
            setView={setView}
            notify={notify}
            addIcon={<AddClickableIcon handler={openDialogHandler} />}
            backIcons={backIcons}
         />
      </>
   );
}

const mapDispatchToProps = (dispatch) => {
   return {
      projectIdDelete: (id, projectDeleteFailNotification) => {
         dispatch(projectIdDelete(id, projectDeleteFailNotification));
      },
   };
};

export default connect(null, mapDispatchToProps)(ProjectsTableToolbar);

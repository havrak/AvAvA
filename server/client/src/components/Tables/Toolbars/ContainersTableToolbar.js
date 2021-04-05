import React from 'react';
import TableToolbar from "./TableToolbar";
import { containerIdDelete, startSpinnerContainer } from "actions/ContainerActions";
import {
   AddClickableIcon,
   DeleteClickableIcon,
   StartClickableIcon,
   StopClickableIcon,
   FreezeClickableIcon
} from "components/Icons/ClickableIcons.js";
import { connect } from "react-redux";
import CreateContainerDialog from "components/Dialogs/CreateContainerDialog.js";

function ContainersTableToolbar(props) {
   const {
      project,
      selectedData,
      preGlobalFilteredRows,
      setGlobalFilter,
      globalFilter,
      notify,
      view,
      views,
      setView,
      startSpinnerContainer,
   } = props;
   const [dialogOpen, setDialogOpen] = React.useState(false);
   
   const startContainersHandler = () => {
      for (const container of selectedData) {
         startSpinnerContainer(project.id, container.id, "starting");
         containerIdStart(project.id, container.id, containerDeleteFailNotification(project.name));
      }
   };
   
   const stopContainersHandler = () => {
      for (const container of selectedData) {
         startSpinnerContainer(project.id, container.id, "stopping");
         // ContainerIdDelete(project.id, containerDeleteFailNotification(project.name));
      }
   };
   
   const freezeContainersHandler = () => {
      for (const container of selectedData) {
         startSpinnerContainer(project.id, container.id, "freezing");
         // ContainerIdDelete(project.id, containerDeleteFailNotification(project.name));
      }
   };
   
   const deleteContainersHandler = () => {
      for (const container of selectedData) {
         startSpinnerContainer(project.id, container.id, "deleting");
         // ContainerIdDelete(project.id, containerDeleteFailNotification(project.name));
      }
   };

   const containerFailNotificationn = (message) => {
      return () => {
         notify(message, "danger", 4);
      };
   };

   const backIcons = [
      <StartClickableIcon key={"StartClickableIcon"} handler={startContainersHandler} />,
      <StopClickableIcon key={"StopClickableIcon"} handler={stopContainersHandler} />,
      <FreezeClickableIcon key={"FreezeClickableIcon"} handler={freezeContainersHandler} />,
      <DeleteClickableIcon key={"DeleteIconButton"} handler={deleteContainersHandler} />,
   ];

   return (
      <>
         <CreateContainerDialog notify={notify} open={dialogOpen} setOpen={setDialogOpen} />
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
      startSpinnerContainer: (projectId, containerId, message) => {
         dispatch(startSpinnerContainer(projectId, containerId, message));
      },
      containerIdDelete: (id, containerDeleteFailNotification) => {
         dispatch(containerIdDelete(id, containerDeleteFailNotification));
      },
   };
};

export default connect(null, mapDispatchToProps)(ContainersTableToolbar);

import React from "react";
import TableToolbar from "./TableToolbar";
import {
   containerIdDelete,
   containerIdStart,
   containerIdStop,
   containerIdFreeze,
   containerIdUnfreeze,
   instancesCreateInstanceConfigDataGet,
} from "actions/ContainerActions";
import {
   AddClickableIcon,
   DeleteClickableIcon,
   StartClickableIcon,
   StopClickableIcon,
   FreezeClickableIcon,
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
      containerIdDelete,
      containerIdStart,
      containerIdStop,
      containerIdFreeze,
      containerIdUnfreeze,
      instancesCreateInstanceConfigDataGet
   } = props;
   const [dialogOpen, setDialogOpen] = React.useState(false);

   const openDialogHandler = () => {
      instancesCreateInstanceConfigDataGet();
      setDialogOpen(true);
   };

   const startContainersHandler = () => {
      for (const container of selectedData) {
         if (container.state.operationState.status === "Stopped") {
            containerIdStart(project.id, container.id, notify);
         } else if (container.state.operationState.status === "Frozen") {
            containerIdUnfreeze(project.id, container.id, notify);
         }
      }
   };

   const stopContainersHandler = () => {
      for (const container of selectedData) {
         if (container.state.operationState.status !== "Stopped") {
            containerIdStop(project.id, container.id, notify);
         }
      }
   };

   const freezeContainersHandler = () => {
      for (const container of selectedData) {
         if (
            container.state.operationState.status !== "Stopped" &&
            container.state.operationState.status !== "Frozen"
         ) {
            containerIdFreeze(project.id, container.id, notify);
         }
      }
   };

   const deleteContainersHandler = () => {
      for (const container of selectedData) {
         containerIdDelete(project.id, container.id, notify);
      }
   };

   const backIcons = [
      <StartClickableIcon key={"StartClickableIcon"} handler={startContainersHandler} />,
      <StopClickableIcon key={"StopClickableIcon"} handler={stopContainersHandler} />,
      <FreezeClickableIcon
         key={"FreezeClickableIcon"}
         handler={freezeContainersHandler}
      />,
      <DeleteClickableIcon key={"DeleteIconButton"} handler={deleteContainersHandler} />,
   ];

   return (
      <>
         <CreateContainerDialog
            notify={notify}
            open={dialogOpen}
            setOpen={setDialogOpen}
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
            addIcon={
               <AddClickableIcon
                  handler={openDialogHandler}
               />
            }
            backIcons={backIcons}
         />
      </>
   );
}

const mapDispatchToProps = (dispatch) => {
   return {
      containerIdDelete: (id, containerDeleteFailNotification) => {
         dispatch(containerIdDelete(id, containerDeleteFailNotification));
      },
      containerIdStart: (id, containerDeleteFailNotification) => {
         dispatch(containerIdStart(id, containerDeleteFailNotification));
      },
      containerIdStop: (id, containerDeleteFailNotification) => {
         dispatch(containerIdStop(id, containerDeleteFailNotification));
      },
      containerIdFreeze: (id, containerDeleteFailNotification) => {
         dispatch(containerIdFreeze(id, containerDeleteFailNotification));
      },
      containerIdUnfreeze: (id, containerDeleteFailNotification) => {
         dispatch(containerIdUnfreeze(id, containerDeleteFailNotification));
      },
      instancesCreateInstanceConfigDataGet: () => {
         dispatch(instancesCreateInstanceConfigDataGet());
      },
   };
};

export default connect(null, mapDispatchToProps)(ContainersTableToolbar);

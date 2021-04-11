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
import AreYouSureDialog from "components/Dialogs/AreYouSureDialog";

const containerCreateBaseState = (projectId, firstTemplate) => {
   return {
      projectId: projectId,
      name: "",
      applicationsToInstall: [],
      templateId: firstTemplate.id,
      connectToInternet: false,
      rootPassword: "",
      limits: {
         RAM: 0,
         CPU: 0,
         disk: firstTemplate.minDiskUsage,
         internet: {
            upload: 0,
            download: 0,
         },
      },
   };
};

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
      instancesCreateInstanceConfigDataGet,
      createInstanceConfigData
   } = props;
   const [dialogOpen, setDialogOpen] = React.useState(false);
   console.log(project);
   const createdContainer = React.useRef(containerCreateBaseState(project.id, createInstanceConfigData.templates[0]))

   const openDialogHandler = () => {
      instancesCreateInstanceConfigDataGet();
      createdContainer.current = containerCreateBaseState(project.id, createInstanceConfigData.templates[0]);
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
   const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

   const deleteContainersHandler = () => {
      setDeleteDialogOpen(true);
   };

   const proceedWithDeletionHandler = () => {
      for (const container of selectedData) {
         containerIdDelete(project.id, container.id, notify);
      }
   }

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
            createdContainer={createdContainer}
         />
         <AreYouSureDialog
            open={deleteDialogOpen}
            setOpen={setDeleteDialogOpen}
            actionCallback={proceedWithDeletionHandler}
            whatToDo={`Do you want to delete there containers?`}
            smallText={selectedData.map(selectedContainer => {
               return <div className="small-text-item">{selectedContainer.name}</div>
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

const mapStateToProps = (state) => {
   return {
      createInstanceConfigData: state.combinedUserData.createInstanceConfigData,
   }
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

export default connect(mapStateToProps, mapDispatchToProps)(ContainersTableToolbar);

import React from "react";
import PatchContainerDialog from "components/Dialogs/PatchContainerDialog";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { getCurrentProjectAndContainer } from "service/RoutesHelper";
import { removePathParts } from "service/RoutesHelper";
import AreYouSureDialog from "components/Dialogs/AreYouSureDialog";

import * as UserApi from "api/index";
const api = new UserApi.DefaultApi();

function DownloadBackup({ name, link, currentProject, currentContainer, notify }) {
   const [openDialog, setDialogOpen] = React.useState(false);
   if (!currentContainer) {
      return <Redirect to={removePathParts(2)} />;
   }
   const openDialogHandler = () => {
      setDialogOpen(true);
   };
   const proceedWithBackupDownload = () => {const callback = function (error, data, response) {
      if (error) {
         notify(`Error occured: ${response.body.message}`);
      } else {
         console.log(data);
         console.log(response);
      }
   };
      api.projectsProjectIdInstancesInstanceIdExportGet(currentProject.id, currentContainer.id, callback);
   }
   return (
      <>
         <AreYouSureDialog
            open={openDialog}
            setOpen={setDialogOpen}
            actionCallback={proceedWithBackupDownload}
            whatToDo={`Do you download backup of this container?`}
         />{" "}
         <Link
            to={link}
            onClick={(e) => {
               e.preventDefault();
               openDialogHandler();
            }}
         >
            <span className="no-icon">{name}</span>
         </Link>
      </>
   );
}

const mapStateToProps = (state) => {
   const cp = getCurrentProjectAndContainer(state.combinedUserData.userProjects.projects);
   return {
      currentContainer: cp?.currentContainer,
      currentProject: cp?.currentProject,
   };
};

export default connect(mapStateToProps, null)(DownloadBackup);

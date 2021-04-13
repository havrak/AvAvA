import React from "react";
import PatchContainerDialog from "components/Dialogs/PatchContainerDialog";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { getCurrentProjectAndContainer } from "service/RoutesHelper";
import { removePathParts } from "service/RoutesHelper";
import {DownloadBackupIcon} from 'components/Icons/ClickableIcons';
import AreYouSureDialog from "components/Dialogs/AreYouSureDialog";
import axios from "axios";
import download from "downloadjs";

import * as UserApi from "api/index";
const api = new UserApi.DefaultApi();

function DownloadBackup({ currentProject, currentContainer, notify }) {
   const [openDialog, setDialogOpen] = React.useState(false);
   if (!currentContainer) {
      return <Redirect to={removePathParts(2)} />;
   }
   const openDialogHandler = () => {
      setDialogOpen(true);
   };
   const proceedWithBackupDownload = () => {
      //    const callback = function (error, data, response) {
      //       console.log(response);
      //       // if (error) {
      //       //    notify(`Error occured: ${response.body.message}`);
      //       // } else {
      //       //    console.log(data);
      //       //    console.log(response);
      //       // }
      //    };
      //    api.projectsProjectIdInstancesInstanceIdExportGet(
      //       currentProject.id,
      //       currentContainer.id,
      //       callback
      //    );

      let opts = {
         url: `http://localhost:3000/api/projects/${currentProject.id}/instances/${currentContainer.id}/export`,
         method: "GET",
         responseType: "blob", // Important
      };
      axios(opts)
         .then((result) => {
            console.log(result, "result");
            download(
               result.data,
               `${currentContainer.name}.tar.gz`,
               result.headers["content-type"]
            );
         })
         .catch((error) => {
            console.log(error);
         });
   };
   return (
      <>
         <AreYouSureDialog
            open={openDialog}
            setOpen={setDialogOpen}
            actionCallback={proceedWithBackupDownload}
            whatToDo={`Do you download backup of this container?`}
         />{" "}
         <span>Download backup</span>
         <DownloadBackupIcon handler={e=>{
            openDialogHandler();
         }}/>
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

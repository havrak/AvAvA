import React from "react";
import PatchContainerDialog from "components/Dialogs/PatchContainerDialog";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getCurrentProjectAndContainer } from "service/RoutesHelper";
import {
   ramToMB,
   diskToGB,
   CPUToMHz,
   networkSpeedToMbits,
} from "service/UnitsConvertor.js";

function PatchContainer({ name, link, currentProject, currentContainer, notify }) {
   const [openDialog, setDialogOpen] = React.useState(false);
   const baseState = () => {
      return {
         id: currentContainer.id,
         name: currentContainer.name,
         owner: currentContainer.owner,
         // connectToContainer: currentContainer.connectToContainer,
         rootPassword: null,
         limits: {
            RAM: ramToMB(currentContainer.state.RAM.limit),
            CPU: CPUToMHz(currentContainer.state.CPU.limit),
            disk: diskToGB(currentContainer.state.disk.limit),
            internet: {
               upload: networkSpeedToMbits(currentContainer.state.internet.limits.upload),
               download: networkSpeedToMbits(currentContainer.state.internet.limits.download),
            },
         },
      };
   };
   const patchedContainer = React.useRef(baseState());
   const openDialogHandler = () => {
      patchedContainer.current = baseState();
      setDialogOpen(true);
   };
   return (
      <>
         <PatchContainerDialog
            patchedContainer={patchedContainer}
            currentContainer={currentContainer}
            currentProject={currentProject}
            open={openDialog}
            setOpen={setDialogOpen}
            notify={notify}
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

export default connect(mapStateToProps, null)(PatchContainer);

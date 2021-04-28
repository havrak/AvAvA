import React from "react";
import PatchProjectDialog from "components/Dialogs/PatchProjectDialog";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { getCurrentProject, removePathParts } from "service/RoutesHelper";
import {
   ramToMB,
   diskToGB,
   CPUToMHz,
   networkSpeedToMbits,
} from "service/UnitsConvertor.js";

function PatchProject({ name, link, currentProject, notify }) {
   const [openDialog, setDialogOpen] = React.useState(false);
   const baseState = () => {
      return {
         id: currentProject?.id,
         name: currentProject?.name,
         limits: {
            RAM: ramToMB(currentProject?.limits?.RAM),
            CPU: CPUToMHz(currentProject?.limits?.CPU),
            disk: diskToGB(currentProject?.limits?.disk),
            internet: {
               upload: networkSpeedToMbits(currentProject?.limits?.internet?.upload),
               download: networkSpeedToMbits(currentProject?.limits?.internet?.download),
            },
         },
      };
   };

   const patchedProject = React.useRef(baseState());
   // if (!currentProject) {
   //    return <Redirect to={removePathParts(2)} />;
   // }
   if(!currentProject){
      return null;
   }
   const openDialogHandler = () => {
      patchedProject.current = baseState();
      setDialogOpen(true);
   };
   return (
      <>
         <PatchProjectDialog
            patchedProject={patchedProject}
            currentProject={currentProject}
            open={openDialog}
            setOpen={setDialogOpen}
            notify={notify}
         />
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
   return {
      currentProject: getCurrentProject(state.combinedUserData.userProjects.projects),
   };
};

export default connect(mapStateToProps, null)(PatchProject);

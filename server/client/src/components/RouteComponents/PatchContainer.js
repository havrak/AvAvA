import React from 'react';
import PatchProjectDialog from "components/Dialogs/PatchProjectDialog";

function PatchContainer({name, link}){
   
   const [openDialog, setDialogOpen] = React.useState(false);
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
   const patchedProject = React.useRef(baseState);
   const openDialogHandler = () => {
      patchedProject.current = baseState();
      setDialogOpen(true);
   };
   return (
      <>
         <PatchProjectDialog patchedProject={patchedProject} open={openDialog} setOpen={setDialogOpen} />
         <Link
            to={link}
            onClick={(e) => {
               e.preventDefault();
               setDialogOpen(true);
            }}
         >
            <span className="no-icon">{name}</span>
         </Link>
      </>
   );
}

export default PatchContainer;
import { ProgressBar } from "react-bootstrap";

export function ProjectProgressBar({ usedPercent, allocatedPercent, freePercent }) {
   return freePercent ? (
      <ProjectProgressBarWithLimits
         usedPercent={usedPercent}
         allocatedPercent={allocatedPercent}
         freePercent={freePercent}
      />
   ) : null;
}

function ProjectProgressBarWithLimits({ usedPercent, allocatedPercent, freePercent }) {
   return (
      <ProgressBar>
         <ProgressBar variant="used" now={usedPercent} key={1} />
         <ProgressBar variant="allocated" now={allocatedPercent} key={2} />
         <ProgressBar variant="free" now={freePercent} key={3} />
      </ProgressBar>
   );
}

export function ContainerProgressBar({ usedPercent, freePercent }) {
   return (
      <ProgressBar>
         <ProgressBar variant="used" now={usedPercent} key={1} />
         <ProgressBar variant="free" now={freePercent} key={3} />
      </ProgressBar>
   );
}

import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import AcUnitIcon from '@material-ui/icons/AcUnit';

function Icon({iconName, iconComponent, handler}) {
   return (
      <Tooltip title={iconName}>
         <IconButton aria-label={iconName} onClick={handler}>
            {iconComponent}
         </IconButton>
      </Tooltip>
   );
}

export function AddClickableIcon({handler}) {
   return (
      <Icon iconName={"Add"} iconComponent={<AddIcon />} handler={handler} />
   );
}

export function DeleteClickableIcon({handler}) {
   return (
      <Icon iconName={"Delete"} iconComponent={<DeleteIcon />} handler={handler} />
   );
}

export function StartClickableIcon({handler}) {
   return (
      <Icon iconName={"Start"} iconComponent={<PlayArrowIcon className={"running"} />} handler={handler} />
   );
}

export function StopClickableIcon({handler}) {
   return (
      <Icon iconName={"Stop"} iconComponent={<StopIcon className={"stopped"} />} handler={handler} />
   );
}

export function FreezeClickableIcon({handler}) {
   return (
      <Icon iconName={"Freeze"} iconComponent={<AcUnitIcon className={"frozen"} />} handler={handler} />
   );
}


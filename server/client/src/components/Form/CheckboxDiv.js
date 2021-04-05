import Checkbox from "@material-ui/core/Checkbox";
import {HelpIcon} from "components/Icons/ClickableIcons";

export default function CheckboxDiv({inputText, tooltipText}) {
   return (
      <div className={"checkbox-div"}>
         <Checkbox size="small" color="primary" onChange={() => {}} />
         <span>{inputText} </span>
         <HelpIcon tooltipText={tooltipText} />
      </div>
   );
}

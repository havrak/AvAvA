import React, {useEffect} from "react";
import { connect } from "react-redux";
import { removePathParts } from "service/RoutesHelper";
import { setCustomizableBrandText } from "actions/FrontendActions";

function Containers({ setCustomizableBrandText }) {
   const brand = [
      {
         text: "Project",
         link: removePathParts(1),
         connectChar: " - ",
      },
      {
         text: "Containers",
      },
   ];
   useEffect(() => {
      setCustomizableBrandText(brand);
   });
   return null;
}

const mapStateToProps = (state) => {
   return {};
};

const mapDispathToProps = (dispatch) => {
   return {
      setCustomizableBrandText: (text) => {
         dispatch(setCustomizableBrandText(text));
      },
   };
};

export default connect(mapStateToProps, mapDispathToProps)(Containers);

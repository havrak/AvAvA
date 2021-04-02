import React, { useEffect } from "react";
import { connect } from "react-redux";
import { removePathParts } from "service/RoutesHelper";
import { setCustomizableBrandText } from "actions/FrontendActions";

function Info({ setCustomizableBrandText }) {
   console.log(removePathParts(3));
   const brand = [
      {
         text: "DVP",
         link: removePathParts(3),
         connectChar: "/",
      },
      {
         text: "Moodle",
         connectChar: " - ",
      },
      {
         text: "Info",
      },
   ];
   console.log("f");
   useEffect(() => {
      setCustomizableBrandText(brand);
   }, []);
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

export default connect(mapStateToProps, mapDispathToProps)(Info);

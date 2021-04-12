import React, { useEffect, useState, useMemo } from "react";

// react-bootstrap components
import { Card, Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";

import CssBaseline from "@material-ui/core/CssBaseline";
import EnhancedTable from "components/Tables/EnhancedTable.js";
import { ProjectProgressBar } from "components/Tables/ProgressBars.js";
import { Link } from "react-router-dom";
import { removePathParts, getCurrentProjectAndContainer } from "service/RoutesHelper";

import { userProjectsGet } from "actions/UserActions";
import { setCustomizableBrandText } from "actions/FrontendActions";
import {
   bytesToAdequateValue,
   bytesPerSecondToAdequateValue,
   secondsToAdequateValue,
   HzToAdequateValue,
} from "service/UnitsConvertor.js";
import SnapshotsTableToolbar from "components/Tables/Toolbars/SnapshotsTableToolbar";

function Snapshots(props) {
   const {
      currentProject,
      currentContainer,
      currentSnapshots,
      userProjectsGet,
      setCustomizableBrandText,
      notify
   } = props;
   
   const brand = [
      {
         text: currentProject.name,
         link: removePathParts(3),
         connectChar: "/",
      },
      {
         text: currentContainer.name,
         connectChar: " - ",
      },
      {
         text: "Info",
      },
   ];
   useEffect(() => {
      setCustomizableBrandText(brand);
   });
   useEffect(() => {
      userProjectsGet();
   }, []);

   const views = {
      "Basic info": "Basic info",
   };
   const [view, setView] = useState(views["Basic info"]);
   console.log(currentSnapshots)
   const columns = React.useMemo(
      () => [
         {
            Header: "Name",
            accessor: "name",
            view: "all",
            Cell: (props) => {
               const data = props.row.original;
               return (
                  <Link className="table-link" to={`/user/projects/${data.id}`}>
                     {data.name}
                  </Link>
               );
            },
         },
         {
            Header: "Created on",
            accessor: "createdOn",
            view: views["Basic info"],
            Cell: ({ value }) => {
               return new Date(value).toLocaleString();
            },
         },
         {
            Header: "Stateful",
            accessor: "stateful",
            view: views["Basic info"],
            Cell: ({ value }) => {
               return value.toString()
            },
         },
      ],
      []
   );

   // const [skipPageReset, setSkipPageReset] = useState(false);

   // We need to keep the table from resetting the pageIndex when we
   // Update data. So we can keep track of that flag with a ref.
   // When our cell renderer calls updateMyData, we'll use
   // the rowIndex, columnId and new value to update the
   // original data
   // const updateMyData = (rowIndex, columnId, value) => {
   //    // We also turn on the flag to not reset the page
   //    setSkipPageReset(true);
   //    setData((old) =>
   //       old.map((row, index) => {
   //          if (index === rowIndex) {
   //             return {
   //                ...old[rowIndex],
   //                [columnId]: value,
   //             };
   //          }
   //          return row;
   //       })
   //    );
   // };
   return (
      <>
         <Container fluid>
            <Row>
               <Col md="12">
                  <Card>
                     <CssBaseline />
                     <EnhancedTable
                        columns={columns}
                        data={currentSnapshots}
                        // updateMyData={updateMyData}
                        // skipPageReset={skipPageReset}
                        views={views}
                        view={view}
                        notify={notify}
                        setView={setView}
                        tableToolbar={<SnapshotsTableToolbar notify={notify}/>}
                     />
                  </Card>
               </Col>
            </Row>
         </Container>
      </>
   );
}

const mapStateToProps = (state) => {
   const cp = getCurrentProjectAndContainer(state.combinedUserData.userProjects.projects);
   return {
      currentContainer: cp?.currentContainer,
      currentProject: cp?.currentProject,
      currentSnapshots: cp?.currentContainer?.snapshots
   };
};

const mapDispatchToProps = (dispatch) => {
   return {
      setCustomizableBrandText: (text) => {
         dispatch(setCustomizableBrandText(text));
      },
      userProjectsGet: () => {
         dispatch(userProjectsGet());
      },
      startSpinnerProjectDelete: (project) => {
         dispatch(startSpinnerProjectDelete(project));
      },
      projectIdDelete: (id, projectDeleteFailNotification) => {
         dispatch(projectIdDelete(id, projectDeleteFailNotification));
      },
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(Snapshots);

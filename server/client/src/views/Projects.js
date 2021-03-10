import React, { useEffect, useState, useMemo } from "react";

// react-bootstrap components
import {
   Badge,
   Button,
   Card,
   Navbar,
   Nav,
   Table,
   Container,
   Row,
   Col,
} from "react-bootstrap";
import { connect } from "react-redux";

import CssBaseline from "@material-ui/core/CssBaseline";
import EnhancedTable from "../components/Tables/EnhancedTable.js";
// import makeData from "../service/makeData.js";

import MaterialTable from "../components/Tables/Table.js";
import { userProjectsGet } from "../actions/myaction";

function Projects({ projects, userProjectsGet }) {
   useEffect(() => {
      userProjectsGet();
   }, []);

   const views = ["Basic info", "Containers", "Limits", "Resources"];
   const columns = React.useMemo(
      () => [
         {
            Header: "Name",
            accessor: "name",
            view: "all",
         },
         {
            Header: "Owner",
            accessor: "owner",
            view: views[0],
            columns: [
               {
                  Header: "First name",
                  accessor: "firstName",
                  view: views[0],
               },
               {
                  Header: "Last name",
                  accessor: "lastName",
                  view: views[0],
               },
            ],
         },
         {
            Header: "Participants",
            accessor: "participants",
            view: views[0],
         },
         {
            Header: "Created at",
            accessor: "createdAt",
            view: views[0],
            Cell: ({ value }) => {
               return new Date(value).toLocaleString();
            },
         },
         {
            Header: "Containers",
            accessor: "containers",
            view: views[1],
            columns: [
               // {
               //    Header: "Yours",
               //    accessor: "yourContainers"
               // },
               {
                  Header: "Running",
                  accessor: "running",
                  view: views[1],
               },
               {
                  Header: "Stopped",
                  accessor: "stopped",
                  view: views[1],
               },
               {
                  Header: "Frozen",
                  accessor: "frozen",
                  view: views[1],
               },
            ],
         },
         {
            Header: "RAM",
            accessor: "ramLimit",
            view: views[2],
         },
         {
            Header: "CPU",
            accessor: "cpuLimit",
            view: views[2],
         },
         {
            Header: "Disk",
            accessor: "diskLimit",
            view: views[2],
         },
         {
            Header: "Download",
            accessor: "downloadLimit",
            view: views[2],
         },
         {
            Header: "Upload",
            accessor: "uploadLimit",
            view: views[2],
         },
         {
            Header: "RAM",
            accessor: "ramResources",
            view: views[3],
            columns: [
               { Header: "F/A/U", accessor: "ramResourcesFAU", view: views[3] },
               { Header: "Free %", accessor: "ramFreePercent", view: views[3] },
            ],
         },
         {
            Header: "CPU",
            accessor: "cpuResources",
            view: views[3],
            columns: [
               { Header: "F/A/U", accessor: "cpuResourcesFAU", view: views[3] },
               // { Header: "Free %", accessor: "cpuFreePercent", view: views[3] },
            ],
         },
         {
            Header: "Disk",
            accessor: "diskResources",
            view: views[3],
            columns: [
               { Header: "F/A/U", accessor: "diskResourcesFAU", view: views[3] },
               { Header: "Free %", accessor: "diskFreePercent", view: views[3] },
            ],
         },
         {
            Header: "Download",
            accessor: "downloadResources",
            view: views[3],
            columns: [
               { Header: "F/A/U", accessor: "downloadResourcesFAU", view: views[3] },
               { Header: "Free %", accessor: "downloadFreePercent", view: views[3] },
            ],
         },
         {
            Header: "Upload",
            accessor: "uploadResources",
            view: views[3],
            columns: [
               { Header: "F/A/U", accessor: "uploadResourcesFAU", view: views[3] },
               { Header: "Free %", accessor: "uploadFreePercent", view: views[3] },
            ],
         },
      ],
      []
   );

   const makeData = () => {
      let dataArray = [];
      for (const project of projects) {
         let projectData = {};
         projectData.id = Math.round(Math.random() * 10_000);
         // projectData.id = project.id;
         projectData.name = project.name;
         projectData.firstName = project.owner.givenName;
         projectData.lastName = project.owner.familyName;
         projectData.participants = project.coworkers.length;
         projectData.createdAt = project.createdOn;
         projectData.running = 0;
         projectData.stopped = 0;
         projectData.frozen = 0;
         for (const container of project.containers) {
            if (container.state.status === "Running") {
               projectData.runningContainers++;
            } else if (container.state.status === "Stopped") {
               projectData.stoppedContainers++;
            } else if (container.state.status === "Frozen") {
               projectData.frozenContainers++;
            }
         }
         dataArray.push(projectData);
      }
      return dataArray;
   };

   const [view, setView] = useState(views[1]);
   const [data, setData] = useState(useMemo(() => makeData(), []));
   const [skipPageReset, setSkipPageReset] = useState(false);

   // We need to keep the table from resetting the pageIndex when we
   // Update data. So we can keep track of that flag with a ref.
   // When our cell renderer calls updateMyData, we'll use
   // the rowIndex, columnId and new value to update the
   // original data
   const updateMyData = (rowIndex, columnId, value) => {
      // We also turn on the flag to not reset the page
      setSkipPageReset(true);
      setData((old) =>
         old.map((row, index) => {
            if (index === rowIndex) {
               return {
                  ...old[rowIndex],
                  [columnId]: value,
               };
            }
            return row;
         })
      );
   };

   return (
      <>
         <Container fluid>
            <Row>
               <Col md="12">
                  <Card>
                     <CssBaseline />
                     <EnhancedTable
                        columns={columns}
                        data={data}
                        setData={setData}
                        updateMyData={updateMyData}
                        skipPageReset={skipPageReset}
                        views={views}
                        view={view}
                        setView={setView}
                        createRecordHeadding={"Create new project"}
                        // createRecordProperties={createRecordProperties}
                     />
                  </Card>
               </Col>
            </Row>
         </Container>
      </>
   );
}

const mapStateToProps = (state) => {
   return {
      projects: state.combinedUserData.userProjects.projects,
   };
};

const mapDispatchToProps = (dispatch) => {
   return {
      userProjectsGet: () => {
         dispatch(userProjectsGet());
      },
      projectIdDelete: () => {
         dispatch(projectIdDelete());
      },
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(Projects);

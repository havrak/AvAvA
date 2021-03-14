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

import {
   userProjectsGet,
   projectIdDelete,
   startSpinnerProjectPost,
   projectPost,
   startSpinnerProjectDelete,
} from "../actions/myaction";
import { limitsFromParentState } from "../service/LimitsHelper";
import NotificationAlert from "react-notification-alert";

function Projects({
   projects,
   userState,
   userProjectsGet,
   projectIdDelete,
   projectPost,
   startSpinnerProjectPost,
   startSpinnerProjectDelete,
}) {
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
         projectData.name = project.name;
         if (project.pendingState) {
            projectData.pendingState = project.pendingState;
         } else {
            // projectData.id = Math.round(Math.random() * 10_000);
            projectData.id = project.id;
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
         }
         dataArray.push(projectData);
      }
      return dataArray;
   };

   const [view, setView] = useState(views[1]);
   const [data, setData] = useState(useMemo(() => makeData(), []));
   const [skipPageReset, setSkipPageReset] = useState(false);
   useEffect(() => {
      setData(makeData());
      // console.log(makeData())
   }, [projects]);
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

   const createProjectHandler = (project) => {
      startSpinnerProjectPost(project);
      projectPost(project, projectPostFailNotification);
   };

   const projectPostFailNotification = (name) => {
      notify(`project "${name}" could not be created`, "danger", 4);
   };

   const deleteProjectsHandler = (projects) => {
      for (const project of projects) {
         console.log(project);
         startSpinnerProjectDelete(project);
         projectIdDelete(project.id, projectDeleteFailNotification(project.name));
      }
   };

   const projectDeleteFailNotification = (name) => {
      return () => {
         notify(`project "${name}" could not be deleted`, "danger", 4);
      };
   };

   const notificationAlertRef = React.useRef(null);
   const notify = (message, type, autoDismiss) => {
      const options = {
         place: "tr",
         message,
         type,
         autoDismiss,
      };
      notificationAlertRef.current.notificationAlert(options);
   };
   return (
      <>
         <Container fluid>
            <NotificationAlert ref={notificationAlertRef} />
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
                        userLimits={limitsFromParentState(userState.limits, userState)}
                        createHandler={createProjectHandler}
                        deleteHandler={deleteProjectsHandler}
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
      userState: state.combinedUserData.userProjects.userState,
   };
};

const mapDispatchToProps = (dispatch) => {
   return {
      userProjectsGet: () => {
         dispatch(userProjectsGet());
      },
      projectPost: (project, projectPostFailNotification) => {
         dispatch(projectPost(project, projectPostFailNotification));
      },
      startSpinnerProjectPost: (project) => {
         dispatch(startSpinnerProjectPost(project));
      },
      startSpinnerProjectDelete: (project) => {
         dispatch(startSpinnerProjectDelete(project));
      },
      projectIdDelete: (id, projectDeleteFailNotification) => {
         dispatch(projectIdDelete(id, projectDeleteFailNotification));
      },
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(Projects);

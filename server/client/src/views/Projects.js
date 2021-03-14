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
   ProgressBar
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

   const views = [
      "Basic info",
      "Containers",
      "Limits",
      "RAM",
      "CPU",
      "Disk",
      "Upload",
      "Download",
   ];
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
         //CONTAINERS
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
         //LIMITS
         {
            Header: "RAM (MB)",
            accessor: "ramLimit",
            view: views[2],
         },
         {
            Header: "CPU (%)",
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
         //RAM
         {
            Header: "used/allocated/free",
            accessor: "ramProgressBar",
            view: views[3],
            Cell: ({ value }) => {
               return (
                  <ProgressBar>
                     <ProgressBar variant="used" now={35} key={1} label={`${35}%`} />
                     <ProgressBar variant="allocated" now={20} key={2} label={`${20}%`} />
                     <ProgressBar variant="free" now={45} key={3} label={`${45}%`} />
                  </ProgressBar>
               );
            },
         },
         {
            Header: "max (MB)",
            accessor: "ramUsedSpecific",
            view: views[3],
         },
         {
            Header: "used",
            accessor: "ramUsed",
            view: views[3],
            columns: [
               {
                  Header: "MB",
                  accessor: "ramUsedMB",
                  view: views[3],
               },
               {
                  Header: "%",
                  accessor: "ramUsed%",
                  view: views[3],
               },
            ],
         },
         {
            Header: "allocated",
            accessor: "ramLimitSpecific",
            view: views[3],
            columns: [
               {
                  Header: "MB",
                  accessor: "ramAllocatedMB",
                  view: views[3],
               },
               {
                  Header: "%",
                  accessor: "ramAllocated%",
                  view: views[3],
               },
            ],
         },
         {
            Header: "free",
            accessor: "ramFreeSpecific",
            view: views[3],
            columns: [
               {
                  Header: "MB",
                  accessor: "ramFreeMB",
                  view: views[3],
               },
               {
                  Header: "%",
                  accessor: "ramFree%",
                  view: views[3],
               },
            ],
         },
         //CPU
         {
            Header: "used/allocated/free",
            accessor: "cpuProgressBar",
            view: views[4],
         },
         {
            Header: "max (% from 0 GHz)",
            accessor: "cpuUsedSpecific",
            view: views[4],
         },
         {
            Header: "used %",
            accessor: "cpuUsed",
            view: views[4],
         },
         {
            Header: "allocated %",
            accessor: "cpuLimitSpecific",
            view: views[4],
         },
         {
            Header: "free %",
            accessor: "cpuFreeSpecific",
            view: views[4],
         },
         //DISK
         {
            Header: "used/allocated/free",
            accessor: "diskProgressBar",
            view: views[5],
         },
         {
            Header: "max (GB)",
            accessor: "diskUsedSpecific",
            view: views[5],
         },
         {
            Header: "used",
            accessor: "diskUsed",
            view: views[5],
            columns: [
               {
                  Header: "GB",
                  accessor: "diskUsedGB",
                  view: views[5],
               },
               {
                  Header: "%",
                  accessor: "diskUsed%",
                  view: views[5],
               },
            ],
         },
         {
            Header: "allocated",
            accessor: "diskLimitSpecific",
            view: views[5],
            columns: [
               {
                  Header: "GB",
                  accessor: "diskAllocatedGB",
                  view: views[5],
               },
               {
                  Header: "%",
                  accessor: "diskAllocated%",
                  view: views[5],
               },
            ],
         },
         {
            Header: "free",
            accessor: "diskFreeSpecific",
            view: views[5],
            columns: [
               {
                  Header: "GB",
                  accessor: "diskFreeGB",
                  view: views[5],
               },
               {
                  Header: "%",
                  accessor: "diskFree%",
                  view: views[5],
               },
            ],
         },
         //DOWNLOAD
         {
            Header: "used/allocated/free",
            accessor: "downloadProgressBar",
            view: views[6],
         },
         {
            Header: "max (Mb/s)",
            accessor: "downloadUsedSpecific",
            view: views[6],
         },
         {
            Header: "used",
            accessor: "downloadUsed",
            view: views[6],
            columns: [
               {
                  Header: "Mb/s",
                  accessor: "downloadUsedMb/s",
                  view: views[6],
               },
               {
                  Header: "%",
                  accessor: "downloadUsed%",
                  view: views[6],
               },
            ],
         },
         {
            Header: "allocated",
            accessor: "downloadLimitSpecific",
            view: views[6],
            columns: [
               {
                  Header: "Mb/s",
                  accessor: "downloadAllocatedMb/s",
                  view: views[6],
               },
               {
                  Header: "%",
                  accessor: "downloadAllocated%",
                  view: views[6],
               },
            ],
         },
         {
            Header: "free",
            accessor: "downloadFreeSpecific",
            view: views[6],
            columns: [
               {
                  Header: "Mb/s",
                  accessor: "downloadFreeMb/s",
                  view: views[6],
               },
               {
                  Header: "%",
                  accessor: "downloadFree%",
                  view: views[6],
               },
            ],
         },
         //UPLOAD
         {
            Header: "used/allocated/free",
            accessor: "uploadProgressBar",
            view: views[7],
         },
         {
            Header: "max (Mb/s)",
            accessor: "uploadUsedSpecific",
            view: views[7],
         },
         {
            Header: "used",
            accessor: "uploadUsed",
            view: views[7],
            columns: [
               {
                  Header: "Mb/s",
                  accessor: "uploadUsedMb/s",
                  view: views[7],
               },
               {
                  Header: "%",
                  accessor: "uploadUsed%",
                  view: views[7],
               },
            ],
         },
         {
            Header: "allocated",
            accessor: "uploadLimitSpecific",
            view: views[7],
            columns: [
               {
                  Header: "Mb/s",
                  accessor: "uploadAllocatedMb/s",
                  view: views[7],
               },
               {
                  Header: "%",
                  accessor: "uploadAllocated%",
                  view: views[7],
               },
            ],
         },
         {
            Header: "free",
            accessor: "uploadFreeSpecific",
            view: views[7],
            columns: [
               {
                  Header: "Mb/s",
                  accessor: "uploadFreeMb/s",
                  view: views[7],
               },
               {
                  Header: "%",
                  accessor: "uploadFree%",
                  view: views[7],
               },
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

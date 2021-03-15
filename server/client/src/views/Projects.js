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
   ProgressBar,
} from "react-bootstrap";
import { connect } from "react-redux";

import CssBaseline from "@material-ui/core/CssBaseline";
import EnhancedTable from "../components/Tables/EnhancedTable.js";
// import makeData from "../service/makeData.js";
import NotificationAlert from "react-notification-alert";
import TableSortLabel from "@material-ui/core/TableSortLabel";

import {
   userProjectsGet,
   projectIdDelete,
   startSpinnerProjectPost,
   projectPost,
   startSpinnerProjectDelete,
} from "../actions/myaction";
import {
   limitsFromParentState,
   calculateFreeAmount,
   calculateFreePercent,
} from "../service/LimitsHelper";
import {
   bytesToAdequateMessage,
   bytesPerSecondToAdequateMessage,
   secondsToAdequateMessage,
} from "../service/UnitsConvertor.js";

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
         // RAM
         {
            Header: "Used | Allocated | Free",
            accessor: "ramProgressBar",
            view: views[3],
            Cell: (props) => {
               const data = props.row.original;
               return (
                  <ProgressBar>
                     <ProgressBar variant="used" now={data.ramUsedPercent} key={1} />
                     <ProgressBar
                        variant="allocated"
                        now={data.ramAllocatedPercent}
                        key={2}
                     />
                     <ProgressBar variant="free" now={data.ramFreePercent} key={3} />
                  </ProgressBar>
               );
            },
         },
         {
            Header: "Max",
            accessor: "ramLimitSpecific",
            view: views[3],
            Cell: ({ value }) => {
               return bytesToAdequateMessage(value);
            },
         },
         {
            Header: "Used",
            accessor: "ramUsed",
            view: views[3],
            columns: [
               {
                  Header: "Value",
                  accessor: "ramUsedValue",
                  view: views[3],
                  Cell: ({ value }) => {
                     return bytesToAdequateMessage(value);
                  },
               },
               {
                  Header: "%",
                  accessor: "ramUsedPercent",
                  view: views[3],
               },
            ],
         },
         {
            Header: "Allocated",
            accessor: "ramAllocated",
            view: views[3],
            columns: [
               {
                  Header: "Value",
                  accessor: "ramAllocatedValue",
                  view: views[3],
                  Cell: ({ value }) => {
                     return bytesToAdequateMessage(value);
                  },
               },
               {
                  Header: "%",
                  accessor: "ramAllocatedPercent",
                  view: views[3],
               },
            ],
         },
         {
            Header: "Free",
            accessor: "ramFreeSpecific",
            view: views[3],
            columns: [
               {
                  Header: "Value",
                  accessor: "ramFreeValue",
                  view: views[3],
                  Cell: ({ value }) => {
                     return bytesToAdequateMessage(value);
                  },
               },
               {
                  Header: "%",
                  accessor: "ramFreePercent",
                  view: views[3],
               },
            ],
         },
         //CPU
         {
            Header: "Used | Allocated | Free ",
            accessor: "cpuProgressBar",
            view: views[4],
            Cell: (props) => {
               const data = props.row.original;
               return (
                  <ProgressBar>
                     <ProgressBar variant="used" now={data.cpuUsedPercent} key={1} />
                     <ProgressBar
                        variant="allocated"
                        now={data.cpuAllocatedPercent}
                        key={2}
                     />
                     <ProgressBar variant="free" now={data.cpuFreePercent} key={3} />
                  </ProgressBar>
               );
            },
         },
         {
            Header: "Max (% from 0 GHz)",
            accessor: "cpuLimitSpecific",
            view: views[4],
         },
         {
            Header: "Used",
            accessor: "cpuUsed",
            view: views[4],
            columns: [
               { Header: "Value", accessor: "cpuUsedValue", view: views[4] },
               { Header: "%", accessor: "cpuUsedPercent", view: views[4] },
            ],
         },
         {
            Header: "Allocated %",
            accessor: "cpuAllocatedPercent",
            view: views[4],
         },
         {
            Header: "Free %",
            accessor: "cpuFreePercent",
            view: views[4],
         },
         //DISK
         {
            Header: "Used | Allocated | Free ",
            accessor: "diskProgressBar",
            view: views[5],
            Cell: (props) => {
               const data = props.row.original;
               return (
                  <ProgressBar>
                     <ProgressBar variant="used" now={data.diskUsedPercent} key={1} />
                     <ProgressBar
                        variant="allocated"
                        now={data.diskAllocatedPercent}
                        key={2}
                     />
                     <ProgressBar variant="free" now={data.diskFreePercent} key={3} />
                  </ProgressBar>
               );
            },
         },
         {
            Header: "max",
            accessor: "diskLimitSpecific",
            view: views[5],
            Cell: ({ value }) => {
               return bytesToAdequateMessage(value);
            },
         },
         {
            Header: "used",
            accessor: "diskUsed",
            view: views[5],
            columns: [
               {
                  Header: "value",
                  accessor: "diskUsedValue",
                  view: views[5],
                  Cell: ({ value }) => {
                     return bytesToAdequateMessage(value);
                  },
               },
               {
                  Header: "%",
                  accessor: "diskUsedPercent",
                  view: views[5],
               },
            ],
         },
         {
            Header: "allocated",
            accessor: "diskAllocated",
            view: views[5],
            columns: [
               {
                  Header: "value",
                  accessor: "diskAllocatedValue",
                  view: views[5],
                  Cell: ({ value }) => {
                     return bytesToAdequateMessage(value);
                  },
               },
               {
                  Header: "%",
                  accessor: "diskAllocatedPercent",
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
                  Header: "value",
                  accessor: "diskFreeValue",
                  view: views[5],
                  Cell: ({ value }) => {
                     return bytesToAdequateMessage(value);
                  },
               },
               {
                  Header: "%",
                  accessor: "diskFreePercent",
                  view: views[5],
               },
            ],
         },
         //DOWNLOAD
         {
            Header: "Used | Allocated | Free",
            accessor: "downloadProgressBar",
            view: views[6],
            Cell: (props) => {
               const data = props.row.original;
               return (
                  <ProgressBar>
                     <ProgressBar variant="used" now={data.downloadUsedPercent} key={1} />
                     <ProgressBar
                        variant="allocated"
                        now={data.downloadAllocatedPercent}
                        key={2}
                     />
                     <ProgressBar variant="free" now={data.downloadFreePercent} key={3} />
                  </ProgressBar>
               );
            },
         },
         {
            Header: "Max",
            accessor: "downloadLimitSpecific",
            view: views[6],
            Cell: ({ value }) => {
               return bytesPerSecondToAdequateMessage(value);
            },
         },
         {
            Header: "Used",
            accessor: "downloadUsed",
            view: views[6],
            columns: [
               {
                  Header: "Value",
                  accessor: "downloadUsedValue",
                  view: views[6],
                  Cell: ({ value }) => {
                     return bytesPerSecondToAdequateMessage(value);
                  },
               },
               {
                  Header: "%",
                  accessor: "downloadUsedPercent",
                  view: views[6],
               },
            ],
         },
         {
            Header: "Allocated",
            accessor: "downloadAllocated",
            view: views[6],
            columns: [
               {
                  Header: "Value",
                  accessor: "downloadAllocatedValue",
                  view: views[6],
                  Cell: ({ value }) => {
                     return bytesPerSecondToAdequateMessage(value);
                  },
               },
               {
                  Header: "%",
                  accessor: "downloadAllocatedPercent",
                  view: views[6],
               },
            ],
         },
         {
            Header: "Free",
            accessor: "downloadFreeSpecific",
            view: views[6],
            columns: [
               {
                  Header: "Value",
                  accessor: "downloadFreeValue",
                  view: views[6],
                  Cell: ({ value }) => {
                     return bytesPerSecondToAdequateMessage(value);
                  },
               },
               {
                  Header: "%",
                  accessor: "downloadFreePercent",
                  view: views[6],
               },
            ],
         },
         //UPLOAD    
         {
            Header: "Used | Allocated | Free",
            accessor: "uploadProgressBar",
            view: views[7],
            Cell: (props) => {
               const data = props.row.original;
               return (
                  <ProgressBar>
                     <ProgressBar variant="used" now={data.uploadUsedPercent} key={1} />
                     <ProgressBar
                        variant="allocated"
                        now={data.uploadAllocatedPercent}
                        key={2}
                     />
                     <ProgressBar variant="free" now={data.uploadFreePercent} key={3} />
                  </ProgressBar>
               );
            },
         },
         {
            Header: "Max",
            accessor: "uploadLimitSpecific",
            view: views[7],
            Cell: ({ value }) => {
               return bytesPerSecondToAdequateMessage(value);
            },
         },
         {
            Header: "Used",
            accessor: "uploadUsed",
            view: views[7],
            columns: [
               {
                  Header: "Value",
                  accessor: "uploadUsedValue",
                  view: views[7],
                  Cell: ({ value }) => {
                     return bytesPerSecondToAdequateMessage(value);
                  },
               },
               {
                  Header: "%",
                  accessor: "uploadUsedPercent",
                  view: views[7],
               },
            ],
         },
         {
            Header: "Allocated",
            accessor: "uploadAllocated",
            view: views[7],
            columns: [
               {
                  Header: "Value",
                  accessor: "uploadAllocatedValue",
                  view: views[7],
                  Cell: ({ value }) => {
                     return bytesPerSecondToAdequateMessage(value);
                  },
               },
               {
                  Header: "%",
                  accessor: "uploadAllocatedPercent",
                  view: views[7],
               },
            ],
         },
         {
            Header: "Free",
            accessor: "uploadFreeSpecific",
            view: views[7],
            columns: [
               {
                  Header: "Value",
                  accessor: "uploadFreeValue",
                  view: views[7],
                  Cell: ({ value }) => {
                     return bytesPerSecondToAdequateMessage(value);
                  },
               },
               {
                  Header: "%",
                  accessor: "uploadFreePercent",
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
            //LIMITS
            projectData.ramLimit = bytesToAdequateMessage(project.projectState.limits.RAM);
            projectData.cpuLimit = project.projectState.limits.CPU;
            projectData.diskLimit = bytesToAdequateMessage(project.projectState.limits.disk);
            projectData.downloadLimit = bytesPerSecondToAdequateMessage(project.projectState.limits.network.download);
            projectData.uploadLimit = bytesPerSecondToAdequateMessage(project.projectState.limits.network.upload);
            //RAM
            projectData.ramLimitSpecific = project.projectState.limits.RAM;
            projectData.ramUsedValue = project.projectState.RAM.usage;
            projectData.ramAllocatedValue = project.projectState.RAM.allocated;
            projectData.ramFreeValue = calculateFreeAmount(
               project.projectState.limits.RAM,
               project.projectState.RAM.usage,
               project.projectState.RAM.allocated
            );
            projectData.ramUsedPercent = project.projectState.RAM.percentConsumed;
            projectData.ramAllocatedPercent = project.projectState.RAM.percentAllocated;
            projectData.ramFreePercent = calculateFreePercent(
               project.projectState.RAM.percentConsumed,
               project.projectState.RAM.percentAllocated
            );
            //CPU
            projectData.cpuLimitSpecific = project.projectState.limits.CPU;
            projectData.cpuUsedValue = project.projectState.CPU.consumedTime;
            projectData.cpuUsedPercent = project.projectState.CPU.percentConsumed;
            projectData.cpuAllocatedPercent = project.projectState.CPU.percentAllocated;
            projectData.cpuFreePercent = calculateFreePercent(
               project.projectState.limits.CPU,
               project.projectState.CPU.percentConsumed,
               project.projectState.CPU.percentAllocated
            );

            //DISK
            projectData.diskLimitSpecific = project.projectState.limits.disk;
            projectData.diskUsedValue = project.projectState.disk.usage;
            projectData.diskAllocatedValue = project.projectState.disk.allocated;
            projectData.diskFreeValue = calculateFreeAmount(
               project.projectState.limits.disk,
               project.projectState.disk.usage,
               project.projectState.disk.allocated
            );
            projectData.diskUsedPercent = project.projectState.disk.percentConsumed;
            projectData.diskAllocatedPercent = project.projectState.disk.percentAllocated;
            projectData.diskFreePercent = calculateFreePercent(
               project.projectState.disk.percentConsumed,
               project.projectState.disk.percentAllocated
            );
            //DOWNLOAD
            projectData.downloadLimitSpecific = project.projectState.limits.network.download
            projectData.downloadUsedValue = project.projectState.network.download.downloadSpeed;
            projectData.downloadAllocatedValue = project.projectState.network.download.allocatedDownloadSpeed;
            projectData.downloadFreeValue = calculateFreeAmount(
               project.projectState.limits.network.download,
               project.projectState.network.download.downloadSpeed,
               project.projectState.network.download.allocatedDownloadSpeed
            );
            projectData.downloadUsedPercent = project.projectState.network.download.downloadBandwidthUsage;
            projectData.downloadAllocatedPercent = project.projectState.network.download.allocatedBandwidthUsage;
            projectData.downloadFreePercent = calculateFreePercent(
               project.projectState.network.download.allocatedBandwidthUsage,
               project.projectState.network.download.downloadBandwidthUsage
            );
            //UPLOAD
            projectData.uploadLimitSpecific = project.projectState.limits.network.upload
            projectData.uploadUsedValue = project.projectState.network.upload.uploadSpeed;
            projectData.uploadAllocatedValue = project.projectState.network.upload.allocatedDownloadSpeed;
            projectData.uploadFreeValue = calculateFreeAmount(
               project.projectState.limits.network.upload,
               project.projectState.network.upload.uploadSpeed,
               project.projectState.network.upload.allocatedDownloadSpeed
            );
            projectData.uploadUsedPercent = project.projectState.network.upload.uploadBandwidthUsage;
            projectData.uploadAllocatedPercent = project.projectState.network.upload.allocatedBandwidthUsage;
            projectData.uploadFreePercent = calculateFreePercent(
               project.projectState.network.upload.allocatedBandwidthUsage,
               project.projectState.network.upload.uploadBandwidthUsage
            );
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

import React, { useEffect, useState, useMemo } from "react";

// react-bootstrap components
import { Card, Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import EnhancedTable from "components/Tables/EnhancedTable.js";
import NotificationAlert from "react-notification-alert";
import { ProjectProgressBar } from "components/Tables/ProgressBars.js";

import { userProjectsGet } from "actions/UserActions";
import { projectIdDelete, startSpinnerProjectDelete } from "actions/ProjectActions";
import { setCustomizableBrandText } from "actions/FrontendActions";
import {
   bytesToAdequateValue,
   bytesPerSecondToAdequateValue,
   secondsToAdequateValue,
   HzToAdequateValue,
} from "service/UnitsConvertor.js";
import { removePathParts, getCurrentProject } from "service/RoutesHelper";
import CreateProjectDialog from "components/Dialogs/CreateProjectDialog.js";

function Containers(props) {
   const {
      currentProject,
      userState,
      userProjectsGet,
      projectIdDelete,
      startSpinnerProjectDelete,
      setCustomizableBrandText,
   } = props;
   if (!currentProject) {
      return <Redirect to={removePathParts(2)} />;
   }
   const brand = [
      {
         text: currentProject.name,
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
      Limits: "Limits",
      RAM: "RAM",
      CPU: "CPU",
      Disk: "Disk",
      Upload: "Upload",
      Download: "Download",
   };
   const [view, setView] = useState(views["Basic info"]);
   const columns = React.useMemo(
      () => [
         {
            Header: "Name",
            accessor: "name",
            view: "all",
            Cell: (props) => {
               const data = props.row.original;
               return (
                  <Link className="table-link" to={`/user/projects/${currentProject.id}/containers/${data.id}`}>
                     {data.name}
                  </Link>
               );
            },
         },
         {
            Header: "Url",
            accessor: "url",
            view: views["Basic info"],
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
            Header: "Last started on",
            accessor: "lastStartedOn",
            view: views["Basic info"],
            Cell: ({ value }) => {
               return new Date(value).toLocaleString();
            },
         },
         {
            Header: "State",
            accessor: "state.operationState",
            view: views["Basic info"],
            Cell: ({ value }) => {
               if (value.status === "Running") {
               } else if (value.status === "Frozen") {
               } else if (value.status === "Stopped") {
               }
               return value.status;
            },
         },
         //LIMITS
         {
            Header: view === views["Limits"] ? "RAM" : "Max",
            accessor: "limits.RAM",
            view: views["Limits"],
            Cell: ({ value }) => {
               return value ? bytesToAdequateValue(value).getMessage() : "-";
            },
         },
         {
            Header: view === views["Limits"] ? "CPU" : "Max",
            accessor: "limits.CPU",
            view: views["Limits"],
            Cell: ({ value }) => {
               return value ? HzToAdequateValue(value).getMessage() : "-";
            },
         },
         {
            Header: view === views["Limits"] ? "Disk" : "Max",
            accessor: "limits.disk",
            view: views["Limits"],
            Cell: ({ value }) => {
               return value ? bytesToAdequateValue(value).getMessage() : "-";
            },
         },
         {
            Header: view === views["Limits"] ? "Download" : "Max",
            accessor: "limits.internet.download",
            view: views["Limits"],
            Cell: ({ value }) => {
               return value ? bytesPerSecondToAdequateValue(value).getMessage() : "-";
            },
         },
         {
            Header: view === views["Limits"] ? "Upload" : "Max",
            accessor: "limits.internet.upload",
            view: views["Limits"],
            Cell: ({ value }) => {
               return value ? bytesPerSecondToAdequateValue(value).getMessage() : "-";
            },
         },
         // RAM
         {
            Header: "Used | Allocated | Free",
            accessor: "ramProgressBar",
            view: views["RAM"],
            Cell: (props) => {
               const data = props.row.original;
               return (
                  <ProjectProgressBar
                     usedPercent={data.state.RAM.usedPercent}
                     allocatedPercent={data.state.RAM.allocatedPercent}
                     freePercent={data.state.RAM.freePercent}
                  />
               );
            },
         },
         {
            Header: "Used",
            accessor: "ramUsed",
            view: views["RAM"],
            columns: [
               {
                  Header: "Value",
                  accessor: "state.RAM.usage",
                  view: views["RAM"],
                  Cell: ({ value }) => {
                     return bytesToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.RAM.usedPercent",
                  view: views["RAM"],
               },
            ],
         },
         {
            Header: "Allocated",
            accessor: "ramAllocated",
            view: views["RAM"],
            columns: [
               {
                  Header: "Value",
                  accessor: "state.RAM.allocated",
                  view: views["RAM"],
                  Cell: ({ value }) => {
                     return bytesToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.RAM.allocatedPercent",
                  view: views["RAM"],
               },
            ],
         },
         {
            Header: "Free",
            accessor: "ramFreeSpecific",
            view: views["RAM"],
            columns: [
               {
                  Header: "Value",
                  accessor: "state.RAM.free",
                  view: views["RAM"],
                  Cell: (props) => {
                     const data = props.row.original;
                     return data.limits?.RAM
                        ? bytesToAdequateValue(props.value).getMessage()
                        : bytesToAdequateValue(userState.RAM.free).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.RAM.freePercent",
                  view: views["RAM"],
               },
            ],
         },
         //CPU
         {
            Header: "Used | Allocated | Free ",
            accessor: "cpuProgressBar",
            view: views["CPU"],
            Cell: (props) => {
               const data = props.row.original;
               return (
                  <ProjectProgressBar
                     usedPercent={data.state.CPU.usedPercent}
                     allocatedPercent={data.state.CPU.allocatedPercent}
                     freePercent={data.state.CPU.freePercent}
                  />
               );
            },
         },
         {
            Header: "Used",
            accessor: "cpuUsed",
            view: views["CPU"],
            columns: [
               {
                  Header: "Time from beginning",
                  accessor: "state.CPU.usedTime",
                  view: views["CPU"],
                  Cell: ({ value }) => {
                     return secondsToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "Value",
                  accessor: "state.CPU.usage",
                  view: views["CPU"],
                  Cell: ({ value }) => {
                     return HzToAdequateValue(value).getMessage();
                  },
               },
               { Header: "%", accessor: "state.CPU.usedPercent", view: views["CPU"] },
            ],
         },
         {
            Header: "Allocated",
            accessor: "cpuAllocated",
            view: views["CPU"],
            columns: [
               {
                  Header: "Value",
                  accessor: "state.CPU.allocated",
                  view: views["CPU"],
                  Cell: ({ value }) => {
                     return HzToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.CPU.allocatedPercent",
                  view: views["CPU"],
               },
            ],
         },
         {
            Header: "Free",
            accessor: "cpuFree",
            view: views["CPU"],
            columns: [
               {
                  Header: "Value",
                  accessor: "state.CPU.free",
                  view: views["CPU"],
                  Cell: (props) => {
                     const data = props.row.original;
                     return data.limits?.CPU
                        ? HzToAdequateValue(props.value).getMessage()
                        : HzToAdequateValue(userState.CPU.free).getMessage();
                  },
               },
               { Header: "%", accessor: "state.CPU.freePercent", view: views["CPU"] },
            ],
         },
         //DISK
         {
            Header: "Used | Allocated | Free ",
            accessor: "diskProgressBar",
            view: views["Disk"],
            Cell: (props) => {
               const data = props.row.original;
               return (
                  <ProjectProgressBar
                     usedPercent={data.state.disk.usedPercent}
                     allocatedPercent={data.state.disk.allocatedPercent}
                     freePercent={data.state.disk.freePercent}
                  />
               );
            },
         },
         {
            Header: "Used",
            accessor: "diskUsed",
            view: views["Disk"],
            columns: [
               {
                  Header: "value",
                  accessor: "state.disk.usage",
                  view: views["Disk"],
                  Cell: ({ value }) => {
                     return bytesToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.disk.usedPercent",
                  view: views["Disk"],
               },
            ],
         },
         {
            Header: "Allocated",
            accessor: "diskAllocated",
            view: views["Disk"],
            columns: [
               {
                  Header: "value",
                  accessor: "state.disk.allocated",
                  view: views["Disk"],
                  Cell: ({ value }) => {
                     return bytesToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.disk.allocatedPercent",
                  view: views["Disk"],
               },
            ],
         },
         {
            Header: "Free",
            accessor: "diskFreeSpecific",
            view: views["Disk"],
            columns: [
               {
                  Header: "value",
                  accessor: "state.disk.free",
                  view: views["Disk"],
                  Cell: (props) => {
                     const data = props.row.original;
                     return data.limits?.disk
                        ? bytesToAdequateValue(props.value).getMessage()
                        : bytesToAdequateValue(userState.disk.free).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.disk.freePercent",
                  view: views["Disk"],
               },
            ],
         },
         //DOWNLOAD
         {
            Header: "Used | Allocated | Free",
            accessor: "downloadProgressBar",
            view: views["Download"],
            Cell: (props) => {
               const data = props.row.original;
               return (
                  <ProjectProgressBar
                     usedPercent={data.state.internet.download.usedPercent}
                     allocatedPercent={data.state.internet.download.allocatedPercent}
                     freePercent={data.state.internet.download.freePercent}
                  />
               );
            },
         },
         {
            Header: "Used",
            accessor: "downloadUsed",
            view: views["Download"],
            columns: [
               {
                  Header: "Value",
                  accessor: "state.internet.download.usage",
                  view: views["Download"],
                  Cell: ({ value }) => {
                     return bytesPerSecondToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.internet.download.usedPercent",
                  view: views["Download"],
               },
            ],
         },
         {
            Header: "Allocated",
            accessor: "downloadAllocated",
            view: views["Download"],
            columns: [
               {
                  Header: "Value",
                  accessor: "state.internet.download.allocated",
                  view: views["Download"],
                  Cell: ({ value }) => {
                     return bytesPerSecondToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.internet.download.allocatedPercent",
                  view: views["Download"],
               },
            ],
         },
         {
            Header: "Free",
            accessor: "downloadFreeSpecific",
            view: views["Download"],
            columns: [
               {
                  Header: "Value",
                  accessor: "state.internet.download.free",
                  view: views["Download"],
                  Cell: (props) => {
                     const data = props.row.original;
                     return data.limits?.internet?.download
                        ? bytesPerSecondToAdequateValue(props.value).getMessage()
                        : bytesPerSecondToAdequateValue(
                             userState.internet.download.free
                          ).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.internet.download.freePercent",
                  view: views["Download"],
               },
            ],
         },
         //UPLOAD
         {
            Header: "Used | Allocated | Free",
            accessor: "uploadProgressBar",
            view: views["Upload"],
            Cell: (props) => {
               const data = props.row.original;
               return (
                  <ProjectProgressBar
                     usedPercent={data.state.internet.upload.usedPercent}
                     allocatedPercent={data.state.internet.upload.allocatedPercent}
                     freePercent={data.state.internet.upload.freePercent}
                  />
               );
            },
         },
         {
            Header: "Used",
            accessor: "uploadUsed",
            view: views["Upload"],
            columns: [
               {
                  Header: "Value",
                  accessor: "state.internet.upload.usage",
                  view: views["Upload"],
                  Cell: ({ value }) => {
                     return bytesPerSecondToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.internet.upload.usedPercent",
                  view: views["Upload"],
               },
            ],
         },
         {
            Header: "Allocated",
            accessor: "uploadAllocated",
            view: views["Upload"],
            columns: [
               {
                  Header: "Value",
                  accessor: "state.internet.upload.allocated",
                  view: views["Upload"],
                  Cell: ({ value }) => {
                     return bytesPerSecondToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.internet.upload.allocatedPercent",
                  view: views["Upload"],
               },
            ],
         },
         {
            Header: "Free",
            accessor: "uploadFreeSpecific",
            view: views["Upload"],
            columns: [
               {
                  Header: "Value",
                  accessor: "state.internet.upload.free",
                  view: views["Upload"],
                  Cell: (props) => {
                     const data = props.row.original;
                     return data.limits?.internet?.upload
                        ? bytesPerSecondToAdequateValue(props.value).getMessage()
                        : bytesPerSecondToAdequateValue(
                             userState.internet.upload.free
                          ).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.internet.upload.freePercent",
                  view: views["Upload"],
               },
            ],
         },
      ],
      []
   );

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

   const deleteProjectsHandler = (projects) => {
      for (const project of projects) {
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
                        data={currentProject.containers}
                        updateMyData={updateMyData}
                        skipPageReset={skipPageReset}
                        views={views}
                        view={view}
                        setView={setView}
                        creationLimits={{
                           RAM: userState.RAM.free,
                           CPU: userState.CPU.free,
                           disk: userState.disk.free,
                           internet: {
                              upload: userState.internet.upload.free,
                              download: userState.internet.download.free,
                           },
                        }}
                        deleteHandler={deleteProjectsHandler}
                        createDialog={<CreateProjectDialog notify={notify} />}
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
      currentProject: getCurrentProject(state.combinedUserData.userProjects.projects),
      userState: state.combinedUserData.userProjects.state,
      userLimits: state.combinedUserData.userProjects.limits,
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

export default connect(mapStateToProps, mapDispatchToProps)(Containers);

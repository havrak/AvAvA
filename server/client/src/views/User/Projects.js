import React, { useEffect, useState, useMemo } from "react";

// react-bootstrap components
import { Card, Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";

import CssBaseline from "@material-ui/core/CssBaseline";
import EnhancedTable from "components/Tables/EnhancedTable.js";
import NotificationAlert from "react-notification-alert";
import { ProjectProgressBar } from "components/Tables/ProgressBars.js";

import {
   userProjectsGet,
   projectIdDelete,
   startSpinnerProjectDelete,
} from "actions/myaction";
import { setCustomizableBrandText } from "actions/FrontendActions";
import {
   bytesToAdequateValue,
   bytesPerSecondToAdequateValue,
   secondsToAdequateValue,
   HzToAdequateValue,
} from "service/UnitsConvertor.js";
import CreateProjectDialog from "components/Tables/Dialogs/CreateProjectDialog.js";

function Project(props) {
   const {
      projects,
      userState,
      userProjectsGet,
      projectIdDelete,
      startSpinnerProjectDelete,
      setCustomizableBrandText,
   } = props;
   const brand = [
      {
         text: "Projects",
      },
   ];
   setCustomizableBrandText(brand);

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
   const [view, setView] = useState(views[1]);
   const columns = React.useMemo(
      () => [
         {
            Header: "Name",
            accessor: "name",
            view: "all",
            // Cell: (props) => {
            //    return <Link to="/user/projects/"
            // }
         },
         {
            Header: "Owner",
            accessor: "owner",
            view: views[0],
            columns: [
               {
                  Header: "First name",
                  accessor: "owner.givenName",
                  view: views[0],
               },
               {
                  Header: "Last name",
                  accessor: "owner.familyName",
                  view: views[0],
               },
            ],
         },
         {
            Header: "Participants",
            accessor: "coworkers",
            view: views[0],
            Cell: ({ value }) => {
               return value ? value.length : 0;
            },
         },
         {
            Header: "Created on",
            accessor: "createdOn",
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
                  accessor: "state.containers.running",
                  view: views[1],
               },
               {
                  Header: "Stopped",
                  accessor: "state.containers.stopped",
                  view: views[1],
               },
               {
                  Header: "Frozen",
                  accessor: "state.containers.frozen",
                  view: views[1],
               },
            ],
         },
         //LIMITS
         {
            Header: view === 2 ? "RAM" : "Max",
            accessor: "limits.RAM",
            view: views[2],
            Cell: ({ value }) => {
               return value ? bytesToAdequateValue(value).getMessage() : "-";
            },
         },
         {
            Header: view === 2 ? "CPU" : "Max",
            accessor: "limits.CPU",
            view: views[2],
            Cell: ({ value }) => {
               return value ? HzToAdequateValue(value).getMessage() : "-";
            },
         },
         {
            Header: view === 2 ? "Disk" : "Max",
            accessor: "limits.disk",
            view: views[2],
            Cell: ({ value }) => {
               return value ? bytesToAdequateValue(value).getMessage() : "-";
            },
         },
         {
            Header: view === 2 ? "Download" : "Max",
            accessor: "limits.internet.download",
            view: views[2],
            Cell: ({ value }) => {
               return value ? bytesPerSecondToAdequateValue(value).getMessage() : "-";
            },
         },
         {
            Header: view === 2 ? "Upload" : "Max",
            accessor: "limits.internet.upload",
            view: views[2],
            Cell: ({ value }) => {
               return value ? bytesPerSecondToAdequateValue(value).getMessage() : "-";
            },
         },
         // RAM
         {
            Header: "Used | Allocated | Free",
            accessor: "ramProgressBar",
            view: views[3],
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
            view: views[3],
            columns: [
               {
                  Header: "Value",
                  accessor: "state.RAM.usage",
                  view: views[3],
                  Cell: ({ value }) => {
                     return bytesToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.RAM.usedPercent",
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
                  accessor: "state.RAM.allocated",
                  view: views[3],
                  Cell: ({ value }) => {
                     return bytesToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.RAM.allocatedPercent",
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
                  accessor: "state.RAM.free",
                  view: views[3],
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
            view: views[4],
            columns: [
               {
                  Header: "Time from beginning",
                  accessor: "state.CPU.usedTime",
                  view: views[4],
                  Cell: ({ value }) => {
                     return secondsToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "Value",
                  accessor: "state.CPU.usage",
                  view: views[4],
                  Cell: ({ value }) => {
                     return HzToAdequateValue(value).getMessage();
                  },
               },
               { Header: "%", accessor: "state.CPU.usedPercent", view: views[4] },
            ],
         },
         {
            Header: "Allocated",
            accessor: "cpuAllocated",
            view: views[4],
            columns: [
               {
                  Header: "Value",
                  accessor: "state.CPU.allocated",
                  view: views[4],
                  Cell: ({ value }) => {
                     return HzToAdequateValue(value).getMessage();
                  },
               },
               { Header: "%", accessor: "state.CPU.allocatedPercent", view: views[4] },
            ],
         },
         {
            Header: "Free",
            accessor: "cpuFree",
            view: views[4],
            columns: [
               {
                  Header: "Value",
                  accessor: "state.CPU.free",
                  view: views[4],
                  Cell: (props) => {
                     const data = props.row.original;
                     return data.limits?.CPU
                        ? HzToAdequateValue(props.value).getMessage()
                        : HzToAdequateValue(userState.CPU.free).getMessage();
                  },
               },
               { Header: "%", accessor: "state.CPU.freePercent", view: views[4] },
            ],
         },
         //DISK
         {
            Header: "Used | Allocated | Free ",
            accessor: "diskProgressBar",
            view: views[5],
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
            view: views[5],
            columns: [
               {
                  Header: "value",
                  accessor: "state.disk.usage",
                  view: views[5],
                  Cell: ({ value }) => {
                     return bytesToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.disk.usedPercent",
                  view: views[5],
               },
            ],
         },
         {
            Header: "Allocated",
            accessor: "diskAllocated",
            view: views[5],
            columns: [
               {
                  Header: "value",
                  accessor: "state.disk.allocated",
                  view: views[5],
                  Cell: ({ value }) => {
                     return bytesToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.disk.allocatedPercent",
                  view: views[5],
               },
            ],
         },
         {
            Header: "Free",
            accessor: "diskFreeSpecific",
            view: views[5],
            columns: [
               {
                  Header: "value",
                  accessor: "state.disk.free",
                  view: views[5],
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
            view: views[6],
            columns: [
               {
                  Header: "Value",
                  accessor: "state.internet.download.usage",
                  view: views[6],
                  Cell: ({ value }) => {
                     return bytesPerSecondToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.internet.download.usedPercent",
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
                  accessor: "state.internet.download.allocated",
                  view: views[6],
                  Cell: ({ value }) => {
                     return bytesPerSecondToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.internet.download.allocatedPercent",
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
                  accessor: "state.internet.download.free",
                  view: views[6],
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
            view: views[7],
            columns: [
               {
                  Header: "Value",
                  accessor: "state.internet.upload.usage",
                  view: views[7],
                  Cell: ({ value }) => {
                     return bytesPerSecondToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.internet.upload.usedPercent",
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
                  accessor: "state.internet.upload.allocated",
                  view: views[7],
                  Cell: ({ value }) => {
                     return bytesPerSecondToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.internet.upload.allocatedPercent",
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
                  accessor: "state.internet.upload.free",
                  view: views[7],
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
                  view: views[7],
               },
            ],
         },
      ],
      []
   );

   // const [data, setData] = useState(useMemo(() => makeData(), []));
   const [skipPageReset, setSkipPageReset] = useState(false);
   // useEffect(() => {
   //    setData(makeData());
   //    // console.log(makeData())
   // }, [projects]);

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
                        data={projects}
                        updateMyData={updateMyData}
                        skipPageReset={skipPageReset}
                        views={views}
                        view={view}
                        setView={setView}
                        createRecordHeadding={"Create new project"}
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
      projects: state.combinedUserData.userProjects.projects,
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

export default connect(mapStateToProps, mapDispatchToProps)(Project);

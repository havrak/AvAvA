import React, { useEffect, useState, useMemo } from "react";

// react-bootstrap components
import { Card, Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import EnhancedTable from "components/Tables/EnhancedTable.js";
import { ContainerProgressBar } from "components/Tables/ProgressBars.js";

import { projectIdDelete, projectIdGet } from "actions/ProjectActions";
import { setCustomizableBrandText } from "actions/FrontendActions";
import {
   bytesToAdequateValue,
   bitsPerSecondToAdequateValue,
   secondsToAdequateValue,
   HzToAdequateValue,
} from "service/UnitsConvertor.js";
import { removePathParts, getCurrentProject } from "service/RoutesHelper";
import ContainersTableToolbar from "components/Tables/Toolbars/ContainersTableToolbar";

function Containers(props) {
   const {
      currentProject,
      projectIdGet,
      setCustomizableBrandText,
      notify
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
      projectIdGet(currentProject.id, notify);
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
                  <Link
                     className="table-link"
                     to={`/user/projects/${currentProject.id}/containers/${data.id}`}
                  >
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
            Header: "Template",
            accessor: "template.name",
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
            Cell: (props) => {
               const data = props.row.original;
               if(data.pendingState){
                  return <b className={data.pendingState.toLowerCase()} >{data.pendingState}</b>
               } else {
                  return <b className={data.state.operationState.status.toLowerCase()} >{data.state.operationState.status}</b>
               }
            },
         },
         //LIMITS
         {
            Header: view === views["Limits"] ? "RAM" : "Max",
            accessor: "state.RAM.limit",
            view: views["Limits"],
            Cell: ({ value }) => {
               return value ? bytesToAdequateValue(value).getMessage() : "-";
            },
         },
         {
            Header: view === views["Limits"] ? "CPU" : "Max",
            accessor: "state.CPU.limit",
            view: views["Limits"],
            Cell: ({ value }) => {
               return value ? HzToAdequateValue(value).getMessage() : "-";
            },
         },
         {
            Header: view === views["Limits"] ? "Disk" : "Max",
            accessor: "state.disk.limit",
            view: views["Limits"],
            Cell: ({ value }) => {
               return value ? bytesToAdequateValue(value).getMessage() : "-";
            },
         },
         {
            Header: view === views["Limits"] ? "Download" : "Max",
            accessor: "state.internet.limits.download",
            view: views["Limits"],
            Cell: ({ value }) => {
               return value ? bitsPerSecondToAdequateValue(value).getMessage() : "-";
            },
         },
         {
            Header: view === views["Limits"] ? "Upload" : "Max",
            accessor: "state.internet.limits.upload",
            view: views["Limits"],
            Cell: ({ value }) => {
               return value ? bitsPerSecondToAdequateValue(value).getMessage() : "-";
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
                  <ContainerProgressBar
                     usedPercent={data.state.RAM.usedPercent}
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
               {
                  Header: "Peak",
                  accessor: "state.RAM.usagePeak",
                  view: views["RAM"],
                  Cell: ({ value }) => {
                     return bytesToAdequateValue(value).getMessage();
                  },
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
                  Cell: ({ value }) => {
                     return bytesToAdequateValue(value).getMessage();
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
                  <ContainerProgressBar
                     usedPercent={data.state.CPU.usedPercent}
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
            Header: "Free",
            accessor: "cpuFree",
            view: views["CPU"],
            columns: [
               {
                  Header: "Value",
                  accessor: "state.CPU.free",
                  view: views["CPU"],
                  Cell: ({ value }) => {
                     return bytesToAdequateValue(value).getMessage();
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
                  <ContainerProgressBar
                     usedPercent={data.state.disk.usedPercent}
                     freePercent={data.state.disk.freePercent}
                  />
               );
            },
         },
         {
            Header: "Devices",
            accessor: "state.disk.devices",
            view: views["Disk"],
            Cell: ({ value }) => {
               return value.length;
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
            Header: "Free",
            accessor: "diskFreeSpecific",
            view: views["Disk"],
            columns: [
               {
                  Header: "value",
                  accessor: "state.disk.free",
                  view: views["Disk"],
                  Cell: ({ value }) => {
                     return bytesToAdequateValue(value).getMessage();
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
                  <ContainerProgressBar
                     usedPercent={data.state.internet.counters.download.usedPercent}
                     freePercent={data.state.internet.counters.download.freePercent}
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
                  accessor: "state.internet.counters.download.usedSpeed",
                  view: views["Download"],
                  Cell: ({ value }) => {
                     return bitsPerSecondToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.internet.counters.download.usedPercent",
                  view: views["Download"],
               },
               {
                  Header: "Bytes from beginning",
                  accessor: "state.internet.counters.download.bytesFromStart",
                  view: views["Download"],
                  Cell: ({ value }) => {
                     return bytesToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "Packets from beginning",
                  accessor: "state.internet.counters.download.packetsFromStart",
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
                  accessor: "state.internet.counters.download.freeSpeed",
                  view: views["Download"],
                  Cell: ({ value }) => {
                     return bitsPerSecondToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.internet.counters.download.freePercent",
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
                  <ContainerProgressBar
                     usedPercent={data.state.internet.counters.upload.usedPercent}
                     freePercent={data.state.internet.counters.upload.freePercent}
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
                  accessor: "state.internet.counters.upload.usedSpeed",
                  view: views["Upload"],
                  Cell: ({ value }) => {
                     return bitsPerSecondToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.internet.counters.upload.usedPercent",
                  view: views["Upload"],
               },
               {
                  Header: "Bytes from beginning",
                  accessor: "state.internet.counters.upload.bytesFromStart",
                  view: views["Upload"],
                  Cell: ({ value }) => {
                     return bytesToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "Packets from beginning",
                  accessor: "state.internet.counters.upload.packetsFromStart",
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
                  accessor: "state.internet.counters.upload.freeSpeed",
                  view: views["Upload"],
                  Cell: ({ value }) => {
                     return bitsPerSecondToAdequateValue(value).getMessage();
                  },
               },
               {
                  Header: "%",
                  accessor: "state.internet.counters.upload.freePercent",
                  view: views["Upload"],
               },
            ],
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
                        data={currentProject.containers}
                        // updateMyData={updateMyData}
                        // skipPageReset={skipPageReset}
                        views={views}
                        view={view}
                        notify={notify}
                        setView={setView}
                        tableToolbar={<ContainersTableToolbar project={currentProject}/>}
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
      projectIdGet: (projectId, notify) => {
         dispatch(projectIdGet(projectId, notify));
      },
      projectIdDelete: (id, projectDeleteFailNotification, notify) => {
         dispatch(projectIdDelete(id, projectDeleteFailNotification, notify));
      },
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(Containers);

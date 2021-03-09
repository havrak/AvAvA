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
import makeData from "../service/makeData.js";

import MaterialTable from "../components/Tables/Table.js";
import { userProjectsGet } from "../actions/myaction";

function Projects({ projects, userProjectsGet }) {
   useEffect(() => {
      userProjectsGet();
   }, []);

   const columns = React.useMemo(
      () => [
         {
            Header: "Name",
            accessor: "name",
            view: "all"
         },
         // {
         //    Header: "Owner",
         //    columns: [
         //       {
         //          Header: "First name",
         //          accessor: "firstName"
         //       },
         //       {
         //          Header: "Last name",
         //          accessor: "lastName"
         //       }
         //    ]
         // },
         {
            Header: "Containers",
            accessor: "containers",
            view: "Containers",
            columns: [
               // {
               //    Header: "Yours",
               //    accessor: "yourContainers"
               // },
               {
                  Header: "Running",
                  accessor: "running",
                  view: "Containers"
               },
               {
                  Header: "Stopped",
                  accessor: "stopped",
                  view: "Containers"
               },
               {
                  Header: "Frozen",
                  accessor: "frozen",
                  view: "Containers"
               },
            ],
         },
         // {
         //    Header: "Status",
         //    accessor: "status",
         // },
         // {
         //    Header: "Profile Progress",
         //    accessor: "progress",
         // },
      ],
      []
   );
   const views=['Basic info', 'Containers', 'Limits', 'Allocated resources', 'Used resources'];
   const [view, setView] = useState(views[0]);

   const [data, setData] = useState(useMemo(() => makeData(20), []));
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
            {/* <Row>
               <Col md="12">
                  <MaterialTable
                     headding={"Project list"}
                     headCells={headCells}
                     rows={rows}
                     rightUpperList={undefined}
                  />
               </Col>
            </Row> */}
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
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(Projects);

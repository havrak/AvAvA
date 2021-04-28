import React from "react";
import { Chart } from "react-google-charts";
// react-bootstrap components
import { Card, Container } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";

import {
   bytesToAdequateValue,
   bitsPerSecondToAdequateValue,
   HzToAdequateValue,
} from "service/UnitsConvertor.js";
import { secondsToAdequateValue } from "service/UnitsConvertor";

export function CircularStateChartCardForContainer({
   stateData,
   max,
   usedExtraData,
   stateName,
   convertorCallback,
   baseUnit,
   headdingTypeLeft,
}) {
   const { usage, free, usedPercent, freePercent } = stateData;
   let usageMessage = convertorCallback(usage).getMessage();
   let freeMessage = convertorCallback(free).getMessage();
   return (
      <Card className="card-dashboard">
         <Card.Body className="p-0">
            <Chart
               chartType="PieChart"
               loader={<ClipLoader color={"#212529"} loading={true} size={30} />}
               data={[
                  [
                     "stateType",
                     "amount",
                     {
                        role: "tooltip",
                        type: "string",
                        p: { html: true },
                     },
                  ],
                  [
                     "used",
                     usage,
                     `<div class="ggl-tooltip"><b>used</b><br/>${usageMessage}<br/>${
                        usage + baseUnit
                     }<br/>${usedPercent}%
                     <br/>${usedExtraData ? `<hr/>${usedExtraData}` : ""}</div>`,
                  ],
                  [
                     "free",
                     free,
                     `<div class="ggl-tooltip"><b>free</b><br/>${freeMessage}<br/>${
                        free + baseUnit
                     }<br/>${freePercent}%
                     <br/>${usedExtraData ? `<hr/>${usedExtraData}` : ""}</div>`,
                  ],
               ]}
               options={{
                  legend: "bottom",
                  height: 300,
                  chartArea: {
                     width: "100%",
                  },
                  pieHole: 0.8,
                  pieSliceText: "none",
                  slices: {
                     0: { color: "#FB404B" },
                     1: { color: "#E9ECEF" },
                  },
                  tooltip: { isHtml: true, trigger: "visible" },
                  sliceVisibilityThreshold: 0
               }}
               rootProps={{ "data-testid": "1" }}
            />
            {headdingTypeLeft ? (
               <div className="resource-chart-headding">
                  <p className="stat-name">{stateName}</p>
                  <p className="used-size">{freeMessage}</p>
                  <p className="max-size">{`of ${convertorCallback(
                     max
                  ).getMessage()} left`}</p>
               </div>
            ) : (
               <div className="resource-chart-headding">
                  <p className="stat-name">{stateName}</p>
                  <p className="used-size">{usedPercent}%</p>
                  <p className="max-size">{`of ${convertorCallback(
                     max
                  ).getMessage()} used`}</p>
               </div>
            )}
         </Card.Body>
      </Card>
   );
}

export function DiskCircularStateChartCardForContainer({ disk, max }) {
   const deviceItems = disk.devices.map((device) => {
      return `<li >${device.name}: ${bytesToAdequateValue(
         device.usage
      ).getMessage()}</li>`;
   });
   return (
      <CircularStateChartCardForContainer
         stateData={disk}
         max={max}
         usedExtraData={`devices: <br />${deviceItems.toString()}`}
         stateName={"Disk"}
         convertorCallback={bytesToAdequateValue}
         baseUnit={"B"}
         headdingTypeLeft={true}
      />
   );
}

export function CPUCircularStateChartCardForContainer({ CPU, max }) {
   return (
      <CircularStateChartCardForContainer
         stateData={CPU}
         usedExtraData={`total used time: ${secondsToAdequateValue(
            CPU.usedTime
         ).getMessage()} <br />`}
         max={max}
         stateName={"CPU"}
         convertorCallback={HzToAdequateValue}
         baseUnit={"Hz"}
         headdingTypeLeft={false}
      />
   );
}

export function RAMCircularStateChartCardForContainer({ RAM, max }) {
   return (
      <CircularStateChartCardForContainer
         stateData={RAM}
         usedExtraData={`usage peak: ${bytesToAdequateValue(
            RAM.usagePeak
         ).getMessage()} <br />`}
         max={max}
         stateName={"RAM"}
         convertorCallback={bytesToAdequateValue}
         baseUnit={"B"}
         headdingTypeLeft={false}
      />
   );
}

export function DownloadCircularStateChartCardForContainer({ download, max }) {
   const stateData = {
      usage: download.usedSpeed,
      free: download.freeSpeed,
      ...download,
   };
   return (
      <CircularStateChartCardForContainer
         stateData={stateData}
         max={max}
         usedExtraData={`All bytes received: ${bytesToAdequateValue(
            download.bytesFromStart
         ).getMessage()} <br />All packets reveived: ${download.packetsFromStart} <br />`}
         stateName={"Download"}
         convertorCallback={bitsPerSecondToAdequateValue}
         baseUnit={"b/s"}
         headdingTypeLeft={false}
      />
   );
}

export function UploadCircularStateChartCardForContainer({ upload, max }) {
   const stateData = {
      usage: upload.usedSpeed,
      free: upload.freeSpeed,
      ...upload,
   };
   return (
      <CircularStateChartCardForContainer
         max={max}
         stateData={stateData}
         usedExtraData={`All bytes sent: ${bytesToAdequateValue(
            upload.bytesFromStart
         ).getMessage()} <br />All packets sent: ${upload.packetsFromStart} <br />`}
         stateName={"Upload"}
         convertorCallback={bitsPerSecondToAdequateValue}
         baseUnit={"b/s"}
         headdingTypeLeft={false}
      />
   );
}

export function NumberOfProcessesCard({ numberOfProcesses }) {
   return (
      <Card className="card-dashboard">
         <Card.Header>
            <Card.Title as="h4">{numberOfProcesses}</Card.Title>
         </Card.Header>
         <Card.Body className="p-0">
            <Container fluid>processes running</Container>
         </Card.Body>
      </Card>
   );
}

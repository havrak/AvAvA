import React from "react";
import { Chart } from "react-google-charts";
// react-bootstrap components
import { Card, Container } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { calculatePercent } from "service/StateCalculator";
import {
   bytesToAdequateValue,
   bitsPerSecondToAdequateValue,
   HzToAdequateValue,
} from "service/UnitsConvertor.js";

function CircularStateChartCard({
   parentStateData,
   stateData,
   max,
   stateName,
   convertorCallback,
   baseUnit,
}) {
   const { usage, allocated } = stateData;
   const usedPercent = calculatePercent(usage, max);
   const allocatedPercent = calculatePercent(allocated, max);
   let usageMessage = convertorCallback(usage).getMessage();
   let allocatedMessage = convertorCallback(allocated).getMessage();
   let freeMessage = convertorCallback(parentStateData.free).getMessage();
   const usedByOtherProjects = parentStateData.usage - usage;
   const usedByOtherProjectsPercent = calculatePercent(usedByOtherProjects, max);
   const allocatedByOtherProjects = parentStateData.allocated - allocated;
   const allocatedByOtherProjectsPercent = calculatePercent(allocatedByOtherProjects, max);
   let usedOtherProjectsMessage = convertorCallback(usedByOtherProjects).getMessage();
   let allocatedOtherProjectsMessage = convertorCallback(
      allocatedByOtherProjects
   ).getMessage();
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
                     "usedOtherProjects",
                     usedByOtherProjects,
                     `<div class="ggl-tooltip"><b>used by other projects</b><br/>${usedOtherProjectsMessage}<br/>${
                        usedByOtherProjects + baseUnit
                     }<br/>${usedByOtherProjectsPercent}%</div>`,
                  ],
                  [
                     "usedOtherProjects",
                     allocatedByOtherProjects,
                     `<div class="ggl-tooltip"><b>allocated to other projects</b><br/>${allocatedOtherProjectsMessage}<br/>${
                        allocatedByOtherProjects + baseUnit
                     }<br/>${allocatedByOtherProjectsPercent}%</div>`,
                  ],
                  [
                     "used",
                     usage,
                     `<div class="ggl-tooltip"><b>used</b><br/>${usageMessage}<br/>${
                        usage + baseUnit
                     }<br/>${usedPercent}%</div>`,
                  ],
                  [
                     "allocated",
                     allocated,
                     `<div class="ggl-tooltip"><b>allocated</b><br/>${allocatedMessage}<br/>${
                        allocated + baseUnit
                     }<br/>${allocatedPercent}%</div>`,
                  ],
                  [
                     "free",
                     parentStateData.free,
                     `<div class="ggl-tooltip"><b>free</b><br/>${freeMessage}<br/>${
                        parentStateData.free + baseUnit
                     }<br/>${parentStateData.freePercent}%</div>`,
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
                     0: { color: "#3E2723" },
                     1: { color: "#BF360C" },
                     2: { color: "#FB404B" },
                     3: { color: "#FFA534" },
                     4: { color: "#E9ECEF" },
                  },
                  tooltip: { isHtml: true, trigger: "visible" },
               }}
               rootProps={{ "data-testid": "1" }}
            />
            <div className="resource-chart-headding">
               <p className="stat-name">{stateName}</p>
               <p className="used-size">{freeMessage}</p>
               <p className="max-size">{`of ${convertorCallback(
                  max
               ).getMessage()} left`}</p>
            </div>
         </Card.Body>
      </Card>
   );
}

export function DiskCircularStateChartCardWithoutLimits({
   parentDiskState,
   diskState,
   max,
}) {
   return (
      <CircularStateChartCard
         parentStateData={parentDiskState}
         stateData={diskState}
         max={max}
         stateName={"Disk"}
         convertorCallback={bytesToAdequateValue}
         baseUnit={"B"}
      />
   );
}

export function CPUCircularStateChartCardWithoutLimits({
   parentCPUState,
   CPUState,
   max,
}) {
   return (
      <CircularStateChartCard
         parentStateData={parentCPUState}
         stateData={CPUState}
         max={max}
         stateName={"CPU"}
         convertorCallback={HzToAdequateValue}
         baseUnit={"Hz"}
      />
   );
}

export function RAMCircularStateChartCardWithoutLimits({
   parentRAMState,
   RAMState,
   max,
}) {
   return (
      <CircularStateChartCard
         parentStateData={parentRAMState}
         stateData={RAMState}
         max={max}
         stateName={"RAM"}
         convertorCallback={bytesToAdequateValue}
         baseUnit={"B"}
      />
   );
}

export function DownloadCircularStateChartCardWithoutLimits({
   parentDownloadState,
   downloadState,
   max,
}) {
   return (
      <CircularStateChartCard
         parentStateData={parentDownloadState}
         stateData={downloadState}
         max={max}
         stateName={"Download"}
         convertorCallback={bitsPerSecondToAdequateValue}
         baseUnit={"b/s"}
      />
   );
}

export function UploadCircularStateChartCardWithoutLimits({
   parentUploadState,
   uploadState,
   max,
}) {
   return (
      <CircularStateChartCard
         max={max}
         parentStateData={parentUploadState}
         stateData={uploadState}
         stateName={"Upload"}
         convertorCallback={bitsPerSecondToAdequateValue}
         baseUnit={"b/s"}
      />
   );
}
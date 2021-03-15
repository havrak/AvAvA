import React from "react";
import { Chart } from "react-google-charts";
// react-bootstrap components
import { Card } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";

import {
   bytesToAdequateMessage,
   bytesPerSecondToAdequateMessage,
   secondsToAdequateMessage,
   HzToAdequateMessage,
} from "../../service/UnitsConvertor.js";
import { calculateFreeAmount, calculateFreePercent } from "../../service/LimitsHelper.js";

export function CircularStateChartCard({
   usedAmount,
   allocatedAmount,
   maxAmount,
   percentConsumed,
   percentAllocated,
   stateName,
   convertorCallback,
   baseUnit,
}) {
   let freeAmount = calculateFreeAmount(maxAmount, usedAmount, allocatedAmount);
   let percentFree = calculateFreePercent(percentAllocated, percentConsumed);

   let usedAmountMessage = convertorCallback(usedAmount);
   let allocatedAmountMessage = convertorCallback(allocatedAmount);
   let freeAmountMessage = convertorCallback(freeAmount);
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
                     usedAmount,
                     `<div class="ggl-tooltip"><b>used</b><br/>${usedAmountMessage}<br/>${
                        usedAmount + baseUnit
                     }<br/>${percentConsumed}%</div>`,
                  ],
                  [
                     "allocated",
                     allocatedAmount,
                     `<div class="ggl-tooltip"><b>allocated</b><br/>${allocatedAmountMessage}<br/>${
                        allocatedAmount + baseUnit
                     }<br/>${percentAllocated}%</div>`,
                  ],
                  [
                     "free",
                     freeAmount,
                     `<div class="ggl-tooltip"><b>free</b><br/>${freeAmountMessage}<br/>${
                        freeAmount + baseUnit
                     }<br/>${percentFree}%</div>`,
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
                     1: { color: "#FFA534" },
                     2: { color: "#E9ECEF" },
                  },
                  tooltip: { isHtml: true, trigger: "visible" },
               }}
               rootProps={{ "data-testid": "1" }}
            />
            <div className="resource-chart-headding">
               <p className="stat-name">{stateName}</p>
               <p className="used-size">{freeAmountMessage}</p>
               <p className="max-size">{`of ${convertorCallback(maxAmount)} left`}</p>
            </div>
         </Card.Body>
      </Card>
   );
}

export function DiskCircularStateChartCard({
   usedAmount,
   allocatedAmount,
   maxAmount,
   percentConsumed,
   percentAllocated,
}) {
   return (
      <CircularStateChartCard
         usedAmount={usedAmount}
         allocatedAmount={allocatedAmount}
         maxAmount={maxAmount}
         percentConsumed={percentConsumed}
         percentAllocated={percentAllocated}
         stateName={"Disk"}
         convertorCallback={bytesToAdequateMessage}
         baseUnit={"B"}
      />
   );
}

export function CPUCircularStateChartCard({
   usedTime,
   percentConsumed,
   maxHz,
   consumedHz,
   percentAllocated,
   allocatedHz,
   cpuInfo,
}) {
   let percentFree = calculateFreePercent(percentAllocated, percentConsumed);
   let freeHz = calculateFreeAmount(maxHz, consumedHz, allocatedHz);
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
                     percentConsumed,
                     `<div class="ggl-tooltip"><b>used</b><br/>${secondsToAdequateMessage(
                        usedTime
                     )}<br/>${usedTime}ns<br/>${HzToAdequateMessage(
                        consumedHz
                     )}<br/>${percentConsumed}%</div>`,
                  ],
                  [
                     "allocated",
                     percentAllocated,
                     `<div class="ggl-tooltip"><b>allocated</b><br/>${HzToAdequateMessage(
                        allocatedHz
                     )}<br/>${percentAllocated}%</div>`,
                  ],
                  [
                     "free",
                     percentFree,
                     `<div class="ggl-tooltip"><b>free</b><br/>${HzToAdequateMessage(
                        freeHz
                     )}<br/>${percentFree}%</div>`,
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
                     1: { color: "#FFA534" },
                     2: { color: "#E9ECEF" },
                  },
                  tooltip: { isHtml: true, trigger: "visible" },
               }}
               rootProps={{ "data-testid": "1" }}
            />
            <div className="resource-chart-headding">
               <p className="stat-name">{"CPU"}</p>
               <p className="used-size">{HzToAdequateMessage(freeHz)}</p>
               <p className="max-size">of {HzToAdequateMessage(maxHz)} left</p>
            </div>
         </Card.Body>
      </Card>
   );
}

export function RAMCircularStateChartCard({
   usedAmount,
   allocatedAmount,
   maxAmount,
   percentConsumed,
   percentAllocated,
}) {
   return (
      <CircularStateChartCard
         usedAmount={usedAmount}
         allocatedAmount={allocatedAmount}
         maxAmount={maxAmount}
         percentConsumed={percentConsumed}
         percentAllocated={percentAllocated}
         stateName={"RAM"}
         convertorCallback={bytesToAdequateMessage}
         baseUnit={"B"}
      />
   );
}

export function DownloadCircularStateChartCard({
   usedAmount,
   allocatedAmount,
   maxAmount,
   percentConsumed,
   percentAllocated,
}) {
   return (
      <CircularStateChartCard
         usedAmount={usedAmount}
         allocatedAmount={allocatedAmount}
         maxAmount={maxAmount}
         percentConsumed={percentConsumed}
         percentAllocated={percentAllocated}
         stateName={"Download"}
         convertorCallback={bytesPerSecondToAdequateMessage}
         baseUnit={"b/s"}
      />
   );
}

export function UploadCircularStateChartCard({
   usedAmount,
   allocatedAmount,
   maxAmount,
   percentConsumed,
   percentAllocated,
}) {
   return (
      <CircularStateChartCard
         usedAmount={usedAmount}
         allocatedAmount={allocatedAmount}
         maxAmount={maxAmount}
         percentConsumed={percentConsumed}
         percentAllocated={percentAllocated}
         stateName={"Upload"}
         convertorCallback={bytesPerSecondToAdequateMessage}
         baseUnit={"b/s"}
      />
   );
}

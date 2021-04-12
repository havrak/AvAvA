import React from "react";
import { Chart } from "react-google-charts";
// react-bootstrap components
import { Card } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import prettyDate from 'service/UnitsConvertor';

import {
   bytesToAdequateValue,
   bytesPerSecondToAdequateValue,
   HzToAdequateValue,
} from "service/UnitsConvertor.js";

export function HistoryStateCard({title, unit}) {
   return (
      <Card className="">
         <Card.Body className="p-0">
            <Chart
               chartType="AreaChart"
               loader={<ClipLoader color={"#212529"} loading={true} size={30} />}
               data={[
                  ["Time", "Sales"],
                  ["19:22", 1000],
                  ["19:32", 1170],
                  ["19:42", 660],
                  ["19:52", 1030],
                  ["20:02", 1000],
                  ["20:12", 1170],
                  ["20:22", 660],
                  ["20:32", 1030],
                  ["20:42", 10000],
                  ["20:52", 1170],
                  ["21:02", 660],
                  ["21:12", 1030],
                  ["21:16", 1030],
               ]}
               options={{
                  title: title,
                  vAxis: { minValue: 0 },
                  // For the legend to fit, we make the chart area smaller
                  // chartArea: { width: "50%", height: "70%" },
                  // lineWidth: 25

                  chartArea: {
                     height: "100%",
                     width: "100%",
                     top: 48,
                     left: 58,
                     right: 16,
                     bottom: 48,
                  },
                  height: "100%",
                  width: "100%",
               }}
               // For tests
               rootProps={{ "data-testid": "1" }}
            />
         </Card.Body>
      </Card>
   );
}

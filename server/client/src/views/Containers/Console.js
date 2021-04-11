import React, { Component } from "react";
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
// import * as attach from "xterm/lib/addons/attach/attach";
import NewWindow from "react-new-window";
import ReactDOM from "react-dom";
import { ResizeObserver } from "resize-observer";
import MyWindowPortal from "components/WindowPortal.js";
import {terminalSocket} from 'api/WebSockets';
// Terminal.applyAddon(attach);

class Console extends Component {
   async componentDidMount() {
      const instanceId = 142;
      const projectId = 18;
      const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
      let socketURL =
         protocol +
         window.location.hostname +
         (window.location.port ? ":" + window.location.port : "") +
         "/websockets/terminals/" + projectId + "/" + instanceId + "/";
      const term = new Terminal(this.dimensions());
      term.open(this.termElm);
      const res = await fetch("/projects/" + projectId + "/instances/" + instanceId + "/console", {
         method: "GET",
      });
      // const res = await fetch("/instnces/1/console?project=1", {
      //    method: "POST",
      // });
      const data = JSON.parse(await res.text());
      console.log(data);

      let shouldOutput = true;
      let firstTime = true;
      const ro = new ResizeObserver(async () => {
         // const res = await fetch(
         //    "/terminals/" + processId + "/size?cols=" + term.rows + "&rows=" + term.cols,
         //    {
         //       method: "POST",
         //    }
         // );
         const dimensions = this.dimensions();
         console.log(dimensions, 'resized');
         term.resize(dimensions.cols, dimensions.rows);
         if(!firstTime){
            shouldOutput = false;
         }
         firstTime = false;
      });
      ro.observe(this.termElm);

      // const pid = processId;
      console.log(socketURL + data.terminal)
      const terminalSocket = new WebSocket(socketURL + data.terminal);
      terminalSocket.onopen = () => {
         console.log('f');
         // term.attach(socket);
         term.onData((data) => {
            terminalSocket.send(data);
         });
         terminalSocket.onmessage = (data) => {
            if (shouldOutput) {
               term.write(data.data);
            } else {
               shouldOutput = true;
            }
         };
         term._initialized = true;
      };
      const controlSocket = new WebSocket(socketURL + data.control);

      controlSocket.onopen = () => {
         // term.attach(socket);
         controlSocket.onmessage = (data) => {
            console.log(data);
         };
         term._initialized = true;
      };
      this.term = term;
   }

   dimensions() {
      if (this.termElm != null) {
         return {
            cols: Math.round(this.termElm.clientWidth / 9),
            rows: Math.round(window.innerHeight / 17.6 - 12),
         };
      } else {
         return {
            cols: Math.round(window.innerWidth / 9 - 1),
            rows: Math.round(window.innerHeight / 17.6 - 10),
         };
      }
      // cols: Math.round(window.innerWidth / 9 - 1),
      // rows: Math.round(window.innerHeight / 17.6 - 1),
   }

   render() {
      return (
         <div className="App">
            <div style={{ backgroundColor: "black" }}>
               <div
                  ref={(ref) => {
                     this.termElm = ref;
                  }}
               ></div>
            </div>
         </div>
      );
   }
}

export default Console;

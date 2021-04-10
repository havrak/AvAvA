import React, { Component } from "react";
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
// import * as attach from "xterm/lib/addons/attach/attach";
import NewWindow from "react-new-window";
import ReactDOM from "react-dom";
import { ResizeObserver } from "resize-observer";
import MyWindowPortal from "components/WindowPortal.js";
// Terminal.applyAddon(attach);

class Console extends Component {
   async componentDidMount() {
      const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
      let socketURL =
         protocol +
         window.location.hostname +
         (window.location.port ? ":" + window.location.port : "") +
         "/terminals/";
      const term = new Terminal(this.dimensions());
      console.log(term.cols);
      term.open(this.termElm);
      const res = await fetch("/terminals?cols=" + term.rows + "&rows=" + term.cols, {
         method: "POST",
      });
      const processId = await res.text();

      let shouldOutput = true;
      let firstTime = true;
      const ro = new ResizeObserver(async () => {
         const res = await fetch(
            "/terminals/" + processId + "/size?cols=" + term.rows + "&rows=" + term.cols,
            {
               method: "POST",
            }
         );
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
      socketURL += processId;
      const socket = new WebSocket(socketURL);

      socket.onopen = () => {
         // term.attach(socket);
         term.onData((data) => {
            
            socket.send(data);
         });
         socket.onmessage = (data) => {
            console.log(shouldOutput);
            // if (shouldOutput) {
               term.write(data.data);
            // } else {
            //    shouldOutput = true;
            // }
         };
         term._initialized = true;
      };
      this.term = term;
   }

   dimensions() {
      if (this.termElm != null) {
         return {
            cols: Math.round(this.termElm.clientWidth / 9),
            rows: Math.round(window.innerHeight / 17.6 - 3),
         };
      } else {
         return {
            cols: Math.round(window.innerWidth / 9 - 1),
            rows: Math.round(window.innerHeight / 17.6 - 1),
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

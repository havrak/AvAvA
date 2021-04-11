import React, { Component } from "react";
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
// import * as attach from "xterm/lib/addons/attach/attach";
import { ResizeObserver } from "resize-observer";
import { connect } from "react-redux";
import { createTerminalSocket } from "api/WebSockets";
import { getCurrentProjectAndContainer } from "service/RoutesHelper";
// Terminal.applyAddon(attach);
import * as UserApi from "api/index";

const api = new UserApi.DefaultApi();

class Console extends Component {
   constructor({ projectId, instanceId }) {
      super();
      projectId = 18;
      instanceId = 142;
      this.projectId = projectId;
      this.instanceId = instanceId;
   }

   async componentDidMount() {
      const term = new Terminal(this.dimensions());
      term.open(this.termElm);
      const successConsoleCreationCallback = (error, data, response) => {
         data = response.body;

         let shouldOutput = true;
         let firstTime = true;

         const terminalSocket = createTerminalSocket(data.terminal);
         terminalSocket.onopen = () => {
            console.log("f");
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

         const controlSocket = createTerminalSocket(data.control);
         controlSocket.onopen = () => {
            // term.attach(socket);
            controlSocket.onmessage = (data) => {
               console.log(data);
            };
            const ro = new ResizeObserver(async () => {
               const dimensions = this.dimensions();
               console.log(dimensions, "resized");
               controlSocket.send({
                  command: "window-resize",
                  args: {
                     width: dimensions.cols,
                     height: dimensions.rows,
                  },
               });
               term.resize(dimensions.cols, dimensions.rows);
               if (!firstTime) {
                  shouldOutput = false;
               }
               firstTime = false;
            });
            ro.observe(this.termElm);
         };
         this.term = term;
      };
      api.projectsProjectIdInstancesInstanceIdConsoleGet(
         this.projectId,
         this.instanceId,
         successConsoleCreationCallback
      );
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

const mapStateToProps = (state) => {
   const { currentProject, currentContainer } = getCurrentProjectAndContainer(
      state.combinedUserData.userProjects.projects
   );
   return {
      projectId: currentProject.id,
      instanceId: currentContainer.id,
   };
};

export default connect(mapStateToProps, null)(Console);

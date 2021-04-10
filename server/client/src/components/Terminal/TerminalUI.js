// TerminalUI.js

// You will need a bundler like webpack or parcel to use these imports.
// The example in codesandboxes and github uses parcel.

import { Terminal } from "xterm";
import "xterm/css/xterm.css"; // DO NOT forget importing xterm.css

export class TerminalUI {
   constructor(socket, id) {
		this.terminal = new Terminal();

      /* You can make your terminals colorful :) */
      this.terminal.setOption("theme", {
         background: "#202B33",
         foreground: "#F5F8FA",
      });

      this.socket = socket;
      this.id = id;
   }

   /**
    * Attach event listeners for terminal UI and socket.io client
    */
   startListening() {
      this.terminal.onData((data) => {
         this.sendInput(data);
      });
      this.socket.on("output", (data) => {
         // When there is data from PTY on server, print that on Terminal.
         this.write(data);
      });
      this.registerTerminal();
   }

   /**
    * Print something to terminal UI.
    */
   write(text) {
      const receivedMessage = JSON.parse(text);
      if(receivedMessage.terminalId === this.id){
         this.terminal.write(receivedMessage.message);
      }
   }

   /**
    * Utility function to print new line on terminal.
    */
   prompt() {
      this.terminal.write(`\\r\\n$ `);
   }

   /**
    * Send whatever you type in Terminal UI to PTY process in server.
    * @param {*} input Input to send to server
    */
   sendInput(input) {
      const wrappingObject = {
         terminalId: this.id,
         message: input
      }
      this.socket.emit("input", JSON.stringify(wrappingObject));
   }

   registerTerminal() {
      const wrappingObject = {
         terminalId: this.id,
         message: "new terminal",
         createNewTerminal: true
      }
      this.socket.emit("input", JSON.stringify(wrappingObject));
   }

   /**
    *
    * container is a HTMLElement where xterm can attach terminal ui instance.
    * div#terminal-container in this example.
    */
   attachTo(container) {
      this.terminal.open(container);
      // Default text to display on terminal.
      this.terminal.write("Terminal Connected");
      this.terminal.write("");
      this.prompt();
   }
   clear() {
      this.terminal.clear();
   }
}

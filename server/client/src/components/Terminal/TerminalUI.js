import { Terminal } from "xterm";
import "xterm/css/xterm.css";

export class TerminalUI {
   constructor(socket, id) {
		this.terminal = new Terminal();

      this.terminal.setOption("theme", {
         background: "#202B33",
         foreground: "#F5F8FA",
      });

      this.socket = socket;
      this.id = id;
   }

   startListening() {
      this.terminal.onData((data, e) => {
         this.sendInput(data);
         e.domEvent.stopPropagation()
         e.domEvent.preventDefault()
      });
      this.socket.on("output", (data) => {
         this.write(data);
      });
      this.registerTerminal();
   }

   write(text) {
      const receivedMessage = JSON.parse(text);
      if(receivedMessage.terminalId === this.id){
         this.terminal.write(receivedMessage.message);
      }
   }

   prompt() {
      this.terminal.write(`\\r\\n$ `);
   }

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

   attachTo(container) {
      this.terminal.open(container);
      this.terminal.write("Terminal Connected");
      this.terminal.write("");
      this.prompt();
   }
   
   clear() {
      this.terminal.clear();
   }
}

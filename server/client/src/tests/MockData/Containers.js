import { templates } from "./Templates";
import { snapshots } from "./Snapshots";

export const containers = {
   otherContainer: {
      id: 53,
      name: "OtherContainer",
      url: "othercontainer.moodle.vavra.avava.gyarab.cz",
      template: templates.Ubuntu,
      stateful: true,
      createdOn: new Date(),
      lastStartedOn: new Date(),
      state: {
         measuredOn: new Date(),
         CPU: {
            limit: 100_000_000,
            usedTime: 100_000_000,
            usage: 80_000_000,
         },
         RAM: {
            limit: 200_000_000,
            usage: 80_000_000,
            usagePeak: 200_000_000,
         },
         disk: {
            limit: 250_000_000,
            devices: [
               {
                  name: "root",
                  usage: 80_000_000,
               },
            ],
         },
         internet: {
            name: "eth0",
            limits: {
               download: 400_000_000,
               upload: 500_000_000,
            },
            adresses: [
               {
                  family: "inet",
                  adress: "10.0.3.27",
                  netmask: 8,
                  scope: "global",
               },
               {
                  family: "inet6",
                  adress: "fe80::216:3eff:feec:65a8",
                  netmask: 64,
                  scope: "link",
               },
            ],
            counters: {
               download: {
                  usedSpeed: 80_000_000,
                  bytesFromStart: 100_000_000,
                  packetsFromStart: 10_000_000,
               },
               upload: {
                  usedSpeed: 80_000_000,
                  bytesFromStart: 100_000_000,
                  packetsFromStart: 10_000_000,
               },
            },
            hwaddr: "00:16:3e:ec:65:a8,",
            hostName: "vethBWTSU5,",
            mtu: "1400,",
            state: "up,",
            type: "broadcast",
         },
         numberOfProcesses: 140,
         operationState: {
            status: "Running",
            statusCode: 103,
         },
      },
   },
   ////////
   noUsageContainer: {
      id: 53,
      name: "OtherContainer",
      url: "othercontainer.moodle.vavra.avava.gyarab.cz",
      template: templates.Ubuntu,
      stateful: true,
      createdOn: new Date(),
      lastStartedOn: new Date(),
      state: {
         measuredOn: new Date(),
         CPU: {
            limit: 100_000_000,
            usedTime: 100_000_000,
            usage: 0,
         },
         RAM: {
            limit: 100_000_000,
            usage: 0,
            usagePeak: 100_000_000,
         },
         disk: {
            limit: 100_000_000,
            devices: [
               {
                  name: "root",
                  usage: 0,
               },
            ],
         },
         internet: {
            name: "eth0",
            limits: {
               download: 100_000_000,
               upload: 100_000_000,
            },
            adresses: [
               {
                  family: "inet",
                  adress: "10.0.3.27",
                  netmask: 8,
                  scope: "global",
               },
               {
                  family: "inet6",
                  adress: "fe80::216:3eff:feec:65a8",
                  netmask: 64,
                  scope: "link",
               },
            ],
            counters: {
               download: {
                  usedSpeed: 0,
                  bytesFromStart: 100_000_000,
                  packetsFromStart: 10_000_000,
               },
               upload: {
                  usedSpeed: 0,
                  bytesFromStart: 100_000_000,
                  packetsFromStart: 10_000_000,
               },
            },
            hwaddr: "00:16:3e:ec:65:a8,",
            hostName: "vethBWTSU5,",
            mtu: "1400,",
            state: "up,",
            type: "broadcast",
         },
         numberOfProcesses: 140,
         operationState: {
            status: "Running",
            statusCode: 103,
         },
      },
   },
   ///////
   fullUsageContainer: {
      id: 53,
      name: "OtherContainer",
      url: "othercontainer.moodle.vavra.avava.gyarab.cz",
      template: templates.Ubuntu,
      stateful: true,
      createdOn: new Date(),
      lastStartedOn: new Date(),
      state: {
         measuredOn: new Date(),
         CPU: {
            limit: 100_000_000,
            usedTime: 100_000_000,
            usage: 100_000_000,
         },
         RAM: {
            limit: 100_000_000,
            usage: 100_000_000,
            usagePeak: 100_000_000,
         },
         disk: {
            limit: 100_000_000,
            devices: [
               {
                  name: "root",
                  usage: 100_000_000,
               },
            ],
         },
         internet: {
            name: "eth0",
            limits: {
               download: 100_000_000,
               upload: 100_000_000,
            },
            adresses: [
               {
                  family: "inet",
                  adress: "10.0.3.27",
                  netmask: 8,
                  scope: "global",
               },
               {
                  family: "inet6",
                  adress: "fe80::216:3eff:feec:65a8",
                  netmask: 64,
                  scope: "link",
               },
            ],
            counters: {
               download: {
                  usedSpeed: 100_000_000,
                  bytesFromStart: 100_000_000,
                  packetsFromStart: 10_000_000,
               },
               upload: {
                  usedSpeed: 100_000_000,
                  bytesFromStart: 100_000_000,
                  packetsFromStart: 10_000_000,
               },
            },
            hwaddr: "00:16:3e:ec:65:a8,",
            hostName: "vethBWTSU5,",
            mtu: "1400,",
            state: "up,",
            type: "broadcast",
         },
         numberOfProcesses: 140,
         operationState: {
            status: "Running",
            statusCode: 103,
         },
      },
   },
};

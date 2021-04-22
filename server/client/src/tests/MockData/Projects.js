import { containers } from "./Containers";
import { users } from "./Users";

export const projects = {
   otherProject: {
      id: 15,
      name: "OtherProject",
      owner: users.vavra,
      limits: {
         CPU: 1_000_000_000,
         RAM: 2_000_000_000,
         disk: 3_000_000_000,
         internet: {
            download: 4_000_000_000,
            upload: 5_000_000_000,
         },
      },
      createdOn: new Date(),
      containers: [
         containers.otherContainer,
         containers.noUsageContainer,
         containers.fullUsageContainer,
      ],
   },
   emptyProject: {
      id: 15,
      name: "EmptyProject",
      owner: users.vavra,
      limits: {
         RAM: 1_000_000_000,
         CPU: 1_000_000_000,
         disk: 1_000_000_000,
         internet: {
            download: 1_000_000_000,
            upload: 1_000_000_000,
         },
      },
      createdOn: new Date(),
      containers: [],
   },
   projectWithoutLimits: {
      id: 14,
      name: "Digitalizce výuky programování",
      owner: users.vavra,
      createdOn: new Date(),
      coworkers: [],
      containers: [
         containers.otherContainer,
         containers.noUsageContainer,
         containers.fullUsageContainer,
      ],
   },
   emptyProjectWithoutLimits: {
      id: 14,
      name: "Digitalizce výuky programování",
      owner: users.vavra,
      createdOn: new Date(),
      coworkers: [],
      containers: [],
   },
};

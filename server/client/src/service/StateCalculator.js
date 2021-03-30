import { DataUsage } from "@material-ui/icons";
import { create } from "lodash";

const createEmptyState = () => {
   return {
      RAM: {
         usage: 0,
         allocated: 0,
      },
      CPU: {
         usage: 0,
         allocated: 0,
      },
      disk: {
         usage: 0,
         allocated: 0,
      },
      internet: {
         download: {
            usage: 0,
            allocated: 0,
         },
         upload: {
            usage: 0,
            allocated: 0,
         },
      },
      containers: {
         running: 0,
         stopped: 0,
         frozen: 0,
      },
   };
};

export const addStateToUserData = (userData) => {
   const { user, userProjects } = userData;
   const state = (userProjects.state = createEmptyState());
   const { RAM, CPU, disk, internet, containers } = state;
   const projects = (state.projects = {
      own: 0,
      foreign: 0,
   });
   CPU.usedTime = 0;
   for (const project of userProjects.projects) {
      if (!project.pendingState) {
         addStateToProject(project);
         RAM.usage += project.state.RAM.usage;
         if (project?.limits?.RAM) {
            RAM.allocated += project.limits.RAM - project.state.RAM.usage;
         } else {
            RAM.allocated += project.state.RAM.allocated;
         }

         CPU.usedTime += project.state.CPU.usedTime;
         CPU.usage += project.state.CPU.usage;
         if (project?.limits?.CPU) {
            CPU.allocated += project.limits.CPU - project.state.CPU.usage;
         } else {
            CPU.allocated += project.state.CPU.allocated;
         }

         disk.usage += project.state.disk.usage;
         if (project?.limits?.disk) {
            disk.allocated += project.limits.disk - project.state.disk.usage;
         } else {
            disk.allocated += project.state.disk.allocated;
         }

         internet.download.usage += project.state.internet.download.usage;
         if (project?.limits?.internet?.download) {
            internet.download.allocated +=
               project.limits.internet.download - project.state.internet.download.usage;
         } else {
            internet.download.allocated += project.state.internet.download.allocated;
         }
         internet.upload.usage += project.state.internet.upload.usage;
         if (project?.limits?.internet?.upload) {
            internet.upload.allocated +=
               project.limits.internet.upload - project.state.internet.upload.usage;
         } else {
            internet.upload.allocated += project.state.internet.upload.allocated;
         }

         containers.running += project.state.containers.running;
         containers.stopped += project.state.containers.stopped;
         containers.frozen += project.state.containers.frozen;

         if (project.owner.id === user.id) {
            projects.own++;
         } else {
            projects.foreign++;
         }
      }
   }

   RAM.free = userProjects.limits.RAM - RAM.allocated - RAM.usage;
   RAM.freePercent = calculatePercent(RAM.free, userProjects.limits.RAM);
   RAM.usedPercent = calculatePercent(RAM.usage, userProjects.limits.RAM);
   RAM.allocatedPercent = calculatePercent(RAM.allocated, userProjects.limits.RAM);

   CPU.free = userProjects.limits.CPU - CPU.allocated - CPU.usage;
   CPU.freePercent = calculatePercent(CPU.free, userProjects.limits.CPU);
   CPU.usedPercent = calculatePercent(CPU.usage, userProjects.limits.CPU);
   CPU.allocatedPercent = calculatePercent(CPU.allocated, userProjects.limits.CPU);

   disk.free = userProjects.limits.disk - disk.allocated - disk.usage;
   disk.freePercent = calculatePercent(disk.free, userProjects.limits.disk);
   disk.usedPercent = calculatePercent(disk.usage, userProjects.limits.disk);
   disk.allocatedPercent = calculatePercent(disk.allocated, userProjects.limits.disk);

   internet.download.free =
      userProjects.limits.internet.download -
      internet.download.allocated -
      internet.download.usage;
   internet.download.freePercent = calculatePercent(
      internet.download.free,
      userProjects.limits.internet.download
   );
   internet.download.usedPercent = calculatePercent(
      internet.download.usage,
      userProjects.limits.internet.download
   );
   internet.download.allocatedPercent = calculatePercent(
      internet.download.allocated,
      userProjects.limits.internet.download
   );
   internet.upload.free =
      userProjects.limits.internet.upload -
      internet.upload.allocated -
      internet.upload.usage;
   internet.upload.freePercent = calculatePercent(
      internet.upload.free,
      userProjects.limits.internet.upload
   );
   internet.upload.usedPercent = calculatePercent(
      internet.upload.usage,
      userProjects.limits.internet.upload
   );
   internet.upload.allocatedPercent = calculatePercent(
      internet.upload.allocated,
      userProjects.limits.internet.upload
   );
   return userProjects;
};

export const addStateToProject = (project) => {
   const state = (project.state = createEmptyState());
   const { RAM, CPU, disk, internet, containers } = state;
   CPU.usedTime = 0;
   for (const container of project.containers) {
      if (!container.pendingState) {
         addStateToContainer(container);
         RAM.usage += container.state.RAM.usage;
         RAM.allocated += container.state.RAM.limit;

         CPU.usage += container.state.CPU.usage;
         CPU.usedTime += container.state.CPU.usedTime;
         CPU.allocated += container.state.CPU.limit;

         disk.usage += container.state.disk.usage;
         disk.allocated += container.state.disk.limit;

         internet.download.usage += container.state.internet.counters.download.usedSpeed;
         internet.download.allocated += container.state.internet.limits.download;
         internet.upload.usage += container.state.internet.counters.upload.usedSpeed;
         internet.upload.allocated += container.state.internet.limits.upload;

         if (container.state.operationState.status === "Running") {
            containers.running++;
         } else if (container.state.operationState.status === "Stopped") {
            containers.stopped++;
         } else if (container.state.operationState.status === "Frozen") {
            containers.frozen++;
         }
      }
   }
   RAM.allocated -= RAM.usage;
   if (project.limits?.RAM) {
      RAM.free = project.limits.RAM - RAM.allocated - RAM.usage;
      RAM.freePercent = calculatePercent(RAM.free, project.limits.RAM);
      RAM.usedPercent = calculatePercent(RAM.usage, project.limits.RAM);
      RAM.allocatedPercent = calculatePercent(RAM.allocated, project.limits.RAM);
   }
   CPU.allocated -= CPU.usage;
   if (project.limits?.CPU) {
      CPU.free = project.limits.CPU - CPU.allocated - CPU.usage;
      CPU.freePercent = calculatePercent(CPU.free, project.limits.CPU);
      CPU.usedPercent = calculatePercent(CPU.usage, project.limits.CPU);
      CPU.allocatedPercent = calculatePercent(CPU.allocated, project.limits.CPU);
   }
   disk.allocated -= disk.usage;
   if (project.limits?.disk) {
      disk.free = project.limits.disk - disk.allocated - disk.usage;
      disk.freePercent = calculatePercent(disk.free, project.limits.disk);
      disk.usedPercent = calculatePercent(disk.usage, project.limits.disk);
      disk.allocatedPercent = calculatePercent(disk.allocated, project.limits.disk);
   }
   internet.download.allocated -= internet.download.usage;
   if (project.limits?.internet?.download) {
      internet.download.free =
         project.limits.internet.download -
         internet.download.allocated -
         internet.download.usage;
      internet.download.freePercent = calculatePercent(
         internet.download.free,
         project.limits.internet.download
      );
      internet.download.usedPercent = calculatePercent(
         internet.download.usage,
         project.limits.internet.download
      );
      internet.download.allocatedPercent = calculatePercent(
         internet.download.allocated,
         project.limits.internet.download
      );
   }
   internet.upload.allocated -= internet.upload.usage;
   if (project.limits?.internet?.download) {
      internet.upload.free =
         project.limits.internet.upload -
         internet.upload.allocated -
         internet.upload.usage;
      internet.upload.freePercent = calculatePercent(
         internet.upload.free,
         project.limits.internet.upload
      );
      internet.upload.usedPercent = calculatePercent(
         internet.upload.usage,
         project.limits.internet.upload
      );
      internet.upload.allocatedPercent = calculatePercent(
         internet.upload.allocated,
         project.limits.internet.upload
      );
   }
   return project;
};

export const addStateToContainer = (container) => {
   const { state } = container;
   const { RAM } = state;
   RAM.free = RAM.limit - RAM.usage;
   RAM.freePercent = calculatePercent(RAM.free, RAM.limit);
   RAM.usedPercent = calculatePercent(RAM.usage, RAM.limit);

   const { CPU } = state;
   CPU.free = CPU.limit - CPU.usage;
   CPU.freePercent = calculatePercent(CPU.free, CPU.limit);
   CPU.usedPercent = calculatePercent(CPU.usage, CPU.limit);

   const { disk } = state;
   disk.usage = 0;
   for (const device of disk.devices) {
      disk.usage += device.usage;
   }
   disk.free = disk.limit - disk.usage;
   disk.freePercent = calculatePercent(disk.free, disk.limit);
   disk.usedPercent = calculatePercent(disk.usage, disk.limit);

   const { internet } = state;
   internet.counters.download.freeSpeed =
      internet.limits.download - internet.counters.download.usedSpeed;
   internet.counters.download.freePercent = calculatePercent(
      internet.counters.download.freeSpeed,
      internet.limits.download
   );
   internet.counters.download.usedPercent = calculatePercent(
      internet.counters.download.usedSpeed,
      internet.limits.download
   );
   internet.counters.upload.freeSpeed =
      internet.limits.upload - internet.counters.upload.usedSpeed;
   internet.counters.upload.freePercent = calculatePercent(
      internet.counters.upload.freeSpeed,
      internet.limits.upload
   );
   internet.counters.upload.usedPercent = calculatePercent(
      internet.counters.upload.usedSpeed,
      internet.limits.upload
   );

   //loopback has no limits

   if (state.networks) {
      for (const network of state.networks) {
         if (network.limits) {
            network.counters.download.freeSpeed =
               network.limits.download - network.counters.download.usedSpeed;
            network.counters.download.freePercent = calculatePercent(
               network.counters.download.freeSpeed,
               network.limits.download
            );
            network.counters.download.usedPercent = calculatePercent(
               network.counters.download.usedSpeed,
               network.limits.download
            );
            network.counters.upload.freeSpeed =
               network.limits.upload - network.counters.upload.usedSpeed;
            network.counters.upload.freePercent = calculatePercent(
               network.counters.upload.freeSpeed,
               network.limits.upload
            );
            network.counters.upload.usedPercent = calculatePercent(
               network.counters.upload.usedSpeed,
               network.limits.upload
            );
         }
      }
   }
   return container;
};

function calculatePercent(value, max) {
   return Math.round((value / max) * 10_000.0) / 100.0;
}

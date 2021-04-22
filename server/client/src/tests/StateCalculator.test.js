import {
   addStateToUserData,
   addStateToProject,
   addStateToContainer,
} from "service/StateCalculator.js";

import _ from "lodash";

import { containers } from "./MockData/Containers";
import { projects } from "./MockData/Projects";
import { userDatas } from "./MockData/UserDatas";

const testOtherContainer = (otherContainer) => {
   const { CPU, RAM, disk, internet, numberOfProcesses } = otherContainer.state;
   expect(CPU.free).toBe(20_000_000);
   expect(RAM.free).toBe(120_000_000);
   expect(disk.free).toBe(170_000_000);
   expect(internet.counters.download.freeSpeed).toBe(320_000_000);
   expect(internet.counters.upload.freeSpeed).toBe(420_000_000);
   expect(numberOfProcesses).toBe(140);

   expect(CPU.freePercent).toBe(20);
   expect(RAM.freePercent).toBe(60);
   expect(disk.freePercent).toBe(68);
   expect(internet.counters.download.freePercent).toBe(80);
   expect(internet.counters.upload.freePercent).toBe(84);

   expect(CPU.usedPercent).toBe(80);
   expect(RAM.usedPercent).toBe(40);
   expect(disk.usedPercent).toBe(32);
   expect(internet.counters.download.usedPercent).toBe(20);
   expect(internet.counters.upload.usedPercent).toBe(16);
};

const testFullUsageContainer = (fullUsageContainer) => {
   const { CPU, RAM, disk, internet, numberOfProcesses } = fullUsageContainer.state;
   expect(CPU.free).toBe(0);
   expect(RAM.free).toBe(0);
   expect(disk.free).toBe(0);
   expect(internet.counters.download.freeSpeed).toBe(0);
   expect(internet.counters.upload.freeSpeed).toBe(0);
   expect(CPU.freePercent).toBe(0);
   expect(RAM.freePercent).toBe(0);
   expect(disk.freePercent).toBe(0);
   expect(internet.counters.download.freePercent).toBe(0);
   expect(internet.counters.upload.freePercent).toBe(0);
};

const testNoUsageContainer = (noUsageContainer) => {
   const { CPU, RAM, disk, internet, numberOfProcesses } = noUsageContainer.state;
   expect(CPU.free).toBe(100_000_000);
   expect(RAM.free).toBe(100_000_000);
   expect(disk.free).toBe(100_000_000);
   expect(internet.counters.download.freeSpeed).toBe(100_000_000);
   expect(internet.counters.upload.freeSpeed).toBe(100_000_000);
   expect(CPU.freePercent).toBe(100);
   expect(RAM.freePercent).toBe(100);
   expect(disk.freePercent).toBe(100);
   expect(internet.counters.download.freePercent).toBe(100);
   expect(internet.counters.upload.freePercent).toBe(100);
};

const testOtherProject = (otherProject) => {
   const { CPU, RAM, disk, internet } = otherProject.state;
   testOtherContainer(otherProject.containers[0]);
   testNoUsageContainer(otherProject.containers[1]);
   testFullUsageContainer(otherProject.containers[2]);
   expect(CPU.free).toBe(700_000_000);
   expect(RAM.free).toBe(1_600_000_000);
   expect(disk.free).toBe(2_550_000_000);
   expect(internet.download.free).toBe(3_400_000_000);
   expect(internet.upload.free).toBe(4_300_000_000);
   expect(CPU.freePercent).toBe(70);
   expect(RAM.freePercent).toBe(80);
   expect(disk.freePercent).toBe(85);
   expect(internet.download.freePercent).toBe(85);
   expect(internet.upload.freePercent).toBe(86);

   expect(CPU.usage).toBe(180_000_000);
   expect(RAM.usage).toBe(180_000_000);
   expect(disk.usage).toBe(180_000_000);
   expect(internet.download.usage).toBe(180_000_000);
   expect(internet.upload.usage).toBe(180_000_000);
   expect(CPU.usedPercent).toBe(18);
   expect(RAM.usedPercent).toBe(9);
   expect(disk.usedPercent).toBe(6);
   expect(internet.download.usedPercent).toBe(4.5);
   expect(internet.upload.usedPercent).toBe(3.6);

   expect(CPU.allocated).toBe(120_000_000);
   expect(RAM.allocated).toBe(220_000_000);
   expect(disk.allocated).toBe(270_000_000);
   expect(internet.download.allocated).toBe(420_000_000);
   expect(internet.upload.allocated).toBe(520_000_000);
   expect(CPU.allocatedPercent).toBe(12);
   expect(RAM.allocatedPercent).toBe(11);
   expect(disk.allocatedPercent).toBe(9);
   expect(internet.download.allocatedPercent).toBe(10.5);
   expect(internet.upload.allocatedPercent).toBe(10.4);
};

const testEmptyProject = (emptyProject) => {
   const { CPU, RAM, disk, internet } = emptyProject.state;
   expect(CPU.free).toBe(1_000_000_000);
   expect(RAM.free).toBe(1_000_000_000);
   expect(disk.free).toBe(1_000_000_000);
   expect(internet.download.free).toBe(1_000_000_000);
   expect(internet.upload.free).toBe(1_000_000_000);
   expect(CPU.freePercent).toBe(100);
   expect(RAM.freePercent).toBe(100);
   expect(disk.freePercent).toBe(100);
   expect(internet.download.freePercent).toBe(100);
   expect(internet.upload.freePercent).toBe(100);

   expect(CPU.usage).toBe(0);
   expect(RAM.usage).toBe(0);
   expect(disk.usage).toBe(0);
   expect(internet.download.usage).toBe(0);
   expect(internet.upload.usage).toBe(0);
   expect(CPU.usedPercent).toBe(0);
   expect(RAM.usedPercent).toBe(0);
   expect(disk.usedPercent).toBe(0);
   expect(internet.download.usedPercent).toBe(0);
   expect(internet.upload.usedPercent).toBe(0);

   expect(CPU.allocated).toBe(0);
   expect(RAM.allocated).toBe(0);
   expect(disk.allocated).toBe(0);
   expect(internet.download.allocated).toBe(0);
   expect(internet.upload.allocated).toBe(0);
   expect(CPU.allocatedPercent).toBe(0);
   expect(RAM.allocatedPercent).toBe(0);
   expect(disk.allocatedPercent).toBe(0);
   expect(internet.download.allocatedPercent).toBe(0);
   expect(internet.upload.allocatedPercent).toBe(0);
};

const testProjectWithoutLimits = (projectWithoutLimits) => {
   const { CPU, RAM, disk, internet } = projectWithoutLimits.state;
   testOtherContainer(projectWithoutLimits.containers[0]);
   testNoUsageContainer(projectWithoutLimits.containers[1]);
   testFullUsageContainer(projectWithoutLimits.containers[2]);
   expect(CPU.free).toBe(undefined);
   expect(RAM.free).toBe(undefined);
   expect(disk.free).toBe(undefined);
   expect(internet.download.free).toBe(undefined);
   expect(internet.upload.free).toBe(undefined);
   expect(CPU.freePercent).toBe(undefined);
   expect(RAM.freePercent).toBe(undefined);
   expect(disk.freePercent).toBe(undefined);
   expect(internet.download.freePercent).toBe(undefined);
   expect(internet.upload.freePercent).toBe(undefined);

   expect(CPU.usage).toBe(180_000_000);
   expect(RAM.usage).toBe(180_000_000);
   expect(disk.usage).toBe(180_000_000);
   expect(internet.download.usage).toBe(180_000_000);
   expect(internet.upload.usage).toBe(180_000_000);
   expect(CPU.usedPercent).toBe(undefined);
   expect(RAM.usedPercent).toBe(undefined);
   expect(disk.usedPercent).toBe(undefined);
   expect(internet.download.usedPercent).toBe(undefined);
   expect(internet.upload.usedPercent).toBe(undefined);

   expect(CPU.allocated).toBe(120_000_000);
   expect(RAM.allocated).toBe(220_000_000);
   expect(disk.allocated).toBe(270_000_000);
   expect(internet.download.allocated).toBe(420_000_000);
   expect(internet.upload.allocated).toBe(520_000_000);
   expect(CPU.allocatedPercent).toBe(undefined);
   expect(RAM.allocatedPercent).toBe(undefined);
   expect(disk.allocatedPercent).toBe(undefined);
   expect(internet.download.allocatedPercent).toBe(undefined);
   expect(internet.upload.allocatedPercent).toBe(undefined);
};

const testEmptyProjectWithoutLimits = (emptyProjectWithoutLimits) => {
   const { CPU, RAM, disk, internet } = emptyProjectWithoutLimits.state;
   expect(CPU.free).toBe(undefined);
   expect(RAM.free).toBe(undefined);
   expect(disk.free).toBe(undefined);
   expect(internet.download.free).toBe(undefined);
   expect(internet.upload.free).toBe(undefined);
   expect(CPU.freePercent).toBe(undefined);
   expect(RAM.freePercent).toBe(undefined);
   expect(disk.freePercent).toBe(undefined);
   expect(internet.download.freePercent).toBe(undefined);
   expect(internet.upload.freePercent).toBe(undefined);

   expect(CPU.usage).toBe(0);
   expect(RAM.usage).toBe(0);
   expect(disk.usage).toBe(0);
   expect(internet.download.usage).toBe(0);
   expect(internet.upload.usage).toBe(0);
   expect(CPU.usedPercent).toBe(undefined);
   expect(RAM.usedPercent).toBe(undefined);
   expect(disk.usedPercent).toBe(undefined);
   expect(internet.download.usedPercent).toBe(undefined);
   expect(internet.upload.usedPercent).toBe(undefined);

   expect(CPU.allocated).toBe(0);
   expect(RAM.allocated).toBe(0);
   expect(disk.allocated).toBe(0);
   expect(internet.download.allocated).toBe(0);
   expect(internet.upload.allocated).toBe(0);
   expect(CPU.allocatedPercent).toBe(undefined);
   expect(RAM.allocatedPercent).toBe(undefined);
   expect(disk.allocatedPercent).toBe(undefined);
   expect(internet.download.allocatedPercent).toBe(undefined);
   expect(internet.upload.allocatedPercent).toBe(undefined);
};

test("addStateToContainer - OtherContainer - test", () => {
   const otherContainer = _.cloneDeep(containers.otherContainer);
   addStateToContainer(otherContainer);
   testOtherContainer(otherContainer);
});

test("addStateToContainer - FullUsageContainer - test", () => {
   const fullUsageContainer = _.cloneDeep(containers.fullUsageContainer);
   addStateToContainer(fullUsageContainer);
   testFullUsageContainer(fullUsageContainer);
});

test("addStateToContainer - noUsageContainer - test", () => {
   const noUsageContainer = _.cloneDeep(containers.noUsageContainer);
   addStateToContainer(noUsageContainer);
   testNoUsageContainer(noUsageContainer);
});

test("addStateToProject - OtherProject - test", () => {
   const otherProject = _.cloneDeep(projects.otherProject);
   addStateToProject(otherProject);
   testOtherProject(otherProject);
});

test("addStateToProject - EmptyProject - test", () => {
   const emptyProject = _.cloneDeep(projects.emptyProject);
   addStateToProject(emptyProject);
   testEmptyProject(emptyProject);
});

test("addStateToProject - projectWithoutLimits - test", () => {
   const projectWithoutLimits = _.cloneDeep(projects.projectWithoutLimits);
   addStateToProject(projectWithoutLimits);
   testProjectWithoutLimits(projectWithoutLimits);
});

test("addStateToProject - emptyProjectWithoutLimits - test", () => {
   const emptyProjectWithoutLimits = _.cloneDeep(projects.emptyProjectWithoutLimits);
   addStateToProject(emptyProjectWithoutLimits);
   testEmptyProjectWithoutLimits(emptyProjectWithoutLimits);
});

test("addStateToUserData - userData - test", () => {
   const classicUserData = _.cloneDeep(userDatas.classicUserData);
   addStateToUserData(classicUserData);
   testOtherProject(classicUserData.userProjects.projects[0]);
   testEmptyProject(classicUserData.userProjects.projects[1]);
   testProjectWithoutLimits(classicUserData.userProjects.projects[2]);
   testEmptyProjectWithoutLimits(classicUserData.userProjects.projects[3]);

   const { CPU, RAM, disk, internet } = classicUserData.userProjects.state;
   // console.log(classicUserData.userProjects.state);
   expect(CPU.free).toBe(7_700_000_000);
   expect(RAM.free).toBe(16_600_000_000);
   expect(disk.free).toBe(25_550_000_000);
   expect(internet.download.free).toBe(34_400_000_000);
   expect(internet.upload.free).toBe(43_300_000_000);
   expect(CPU.freePercent).toBe(77);
   expect(RAM.freePercent).toBe(83);
   // expect(disk.freePercent).toBe(100);
   expect(internet.download.freePercent).toBe(86);
   expect(internet.upload.freePercent).toBe(86.6);

   expect(CPU.usage).toBe(360_000_000);
   expect(RAM.usage).toBe(360_000_000);
   expect(disk.usage).toBe(360_000_000);
   expect(internet.download.usage).toBe(360_000_000);
   expect(internet.upload.usage).toBe(360_000_000);
   expect(CPU.usedPercent).toBe(3.6);
   expect(RAM.usedPercent).toBe(1.8);
   expect(disk.usedPercent).toBe(1.2);
   expect(internet.download.usedPercent).toBe(0.9);
   expect(internet.upload.usedPercent).toBe(0.72);

   expect(CPU.allocated).toBe(1_940_000_000);
   expect(RAM.allocated).toBe(3_040_000_000);
   expect(disk.allocated).toBe(4_090_000_000);
   expect(internet.download.allocated).toBe(5_240_000_000);
   expect(internet.upload.allocated).toBe(6_340_000_000);
   expect(CPU.allocatedPercent).toBe(19.4);
   expect(RAM.allocatedPercent).toBe(15.2);
   // expect(disk.allocatedPercent).toBe();
   expect(internet.download.allocatedPercent).toBe(13.1);
   expect(internet.upload.allocatedPercent).toBe(12.68);
});
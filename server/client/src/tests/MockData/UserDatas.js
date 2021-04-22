import {projects} from './Projects';
import {users} from './Users';
import {templates} from './Templates';
import {applicationsToInstall} from './ApplicationsToInstall';

export const userDatas = {
   classicUserData: {
      user: users.vavra,
      createInstanceConfigData: {
         templates: [templates.Ubuntu, templates.Debian],
         applicationsToInstall: [
            applicationsToInstall.Tomcat,
            applicationsToInstall.Vim,
            applicationsToInstall.Apache,
         ],
      },
      userProjects: {
         limits: {
            CPU: 10_000_000_000,
            RAM: 20_000_000_000,
            disk: 30_000_000_000,
            internet: {
               download: 40_000_000_000,
               upload: 50_000_000_000,
            },
         },
         projects: [projects.otherProject, projects.emptyProject, projects.projectWithoutLimits, projects.emptyProjectWithoutLimits],
      },
   },
};

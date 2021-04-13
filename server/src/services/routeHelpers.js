import ProjectStateWithHistory from "../models/ProjectStateWithHistory.js";
import OperationState from "../models/OperationState.js";
import userSQL from "./sql/userSQL.js";
import projectSQL from "./sql/projectSQL.js";
import containerSQL from "./sql/containerSQL.js";
import * as lxd from "../routes/lxdRoute.js";

/* const to verify whether user is logged in via google auth
 *
 */
export const isLoggedIn = (req, res, next) => {
  next();
  //if (req.user) { // due to testing purposes authentifikation is removed.
  //  next();
  //} else {
  //  res.sendStatus(401);
  //}
};

/*  const to verify whether project which id was given in
 *	request truly belongs to the user or whether user is
 *	coworker on it
 *
 */
export const isProjectUsers = (req, res, next) => {
  next();
  // userSQL
  //   .doesUserOwnGivenProject(req.params.projectId, req.user.email)
  //   .then((result) => {
  //     if (result) next();
  //     else res.sendStatus(401);
  //   });
};

/*  const to verify whether container which id was given in
 *	request truly belongs to the user or whether user is
 *	coworker on project which container is part of
 *
 */
export const isContainerUsers = (req, res, next) => {
  next();
  // userSQL
  //   .doesUserOwnGivenContainer(req.params.instanceId, req.user.email)
  //   .then((result) => {
  //     if (result) next();
  //     else res.sendStatus(401);
  //   });
};

export function getProjectObject(projectId) {
  return new Promise((resolve) => {
    projectSQL.createProjectObject(projectId).then((project) => {
      if (project.statusCode == 400) {
        resolve(project);
      }
      lxd.getInstances(project.containers).then((result) => {
        if (result.statusCode) resolve(project);
        project.containers = result;
        resolve(project);
      });
    });
  });
}

export function getProjectStateWithHistory(id) {
  return new Promise((resolve) =>
    projectSQL.getIdOfContainersInProject(id).then((containerIds) => {
      let counter = 0;
      let toReturn = new ProjectStateWithHistory(id, new Array());
      if (containerIds.length > 0)
        containerIds.forEach((containerId) =>
          getContainerStateWithHistory(containerId).then((result) => {
            if (result.statusCode && result.statusCode != 200) resolve(result);
            toReturn.containerStateHistory.push(result);
            counter++;
            if (counter == containerIds.length) resolve(toReturn);
          })
        );
      else resolve(new ProjectStateWithHistory(id, new Array()));
    })
  );
}

export function getContainerObject(id) {
  return new Promise((resolve) => {
    containerSQL.createContainerObject(id).then((container) => {
      if (container.statusCode == 400) resolve(container);
      containerSQL.createContainerStateObject(id).then((result) => {
        container.state = result;
        return lxd.getInstance(container).then((result) => {
          resolve(result);
          containerSQL.updateContainerStateObject(
            id,
            false,
            result.state.operationState.statusCode
          );
        });
      });
    });
  });
}
export function deleteContainer(id) {
  return containerSQL.getProjectIdOfContainer(id).then((project) => {
    if (project.statusCode == 400) {
      return project;
    }
    return lxd.stopInstance(id, project).then((result) => {
      if (result.statusCode != 200) return result;
      return lxd.deleteInstance(id, project).then((result) => {
        if (result.statusCode != 200) return result;
        containerSQL.removeContainer(id);
        return result;
      });
    });
  });
}

export function getContainerState(containerId, projectId) {
  return containerSQL
    .createContainerStateObject(containerId)
    .then((result) => lxd.getState(containerId, projectId, result))
    .then((result) => {
      return result;
    });
}

export function getContainerStateWithHistory(id) {
  return containerSQL.getProjectIdOfContainer(id).then((result) => {
    if (result.statusCode == 400) return result;
    else
      return getContainerState(id, result).then((result) =>
        containerSQL.getContainerHistory(id).then((history) => {
          history.push(result);
          return { id: id, stateHistory: history };
        })
      );
  });
}

let queue = new Array();
export function reloadHaproxy() {
  return new Promise((resolve) => {
    queue.push(() =>
      containerSQL.generateHaProxyConfigurationFile().then((result) =>
        lxd
          .postFileToInstance(
            "haproxy",
            "default",
            "../../config/serverconfiguartions/haproxy.cfg",
            "/etc/haproxy/haproxy.cfg"
          )
          .then((result) =>
            lxd
              .execInstance(
                "haproxy",
                "default",
                ["sleep 5; systemctl reload haproxy.service"], // it takes a little bit of time for new container to react
                false
              )
              .then((result) => {
                queue.shift();
                if (queue.length > 0) queue[0]();
                resolve(result);
              })
          )
      )
    );
    if (queue.length == 1) queue[0]();
  });
}

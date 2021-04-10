-- appsToInstall
INSERT INTO appsToInstall (name, description, icon_path, package_name) VALUES ("git", "běžně používaný verzovací systém", "https://git-scCtrl-C -- exit!gos/downloads/Git-Icon-1788C.png", "git");
INSERT INTO appsToInstall (name, description, icon_path, package_name) VALUES ("neovim", "vylepšená verze populárního textového editoru vim", "https://www.vim.org/images/vim_small.gif", "neovim");
INSERT INTO appsToInstall (name, description, icon_path, package_name) VALUES ("ranger", "prohlížeč souborů pro terminál", "https://camo.githubusercontent.com/b410f2706397b50e183a62e72ea470c31109928d92bbfa357848413843545e33/68747470733a2f2f72616e6765722e6769746875622e696f2f72616e6765725f6c6f676f2e706e67", "ranger");
INSERT INTO appsToInstall (name, description, icon_path, package_name) VALUES ("apache", "http server", "https://en.wikipedia.org/wiki/File:Apache_HTTP_server_logo_(2016).svg", "apache2");
INSERT INTO appsToInstall (name, description, icon_path, package_name) VALUES ("nginx", "http server", "https://en.wikipedia.org/wiki/File:Nginx_logo.svg", "nginx");


-- templates
INSERT INTO templates (profile_name, image_name, version, profile_description, image_description, profile_path, min_disk_size) VALUES ("default Ubuntu", "Ubuntu","20.04","basic cofiguration", "ubuntu is debian based distro", "defaultUbuntu", 2147483648);

-- Users
INSERT INTO users (email, given_name, family_name, icon, role, coins) VALUES("krystof.havranek@student.gyarab.cz", "Kryštof", "Havránek", "https://lh3.googleusercontent.com/a-/AOh14GjYfKo6KOkKITXLoVOm6ye_c91QVt1WSDc7m7Z6Hg=s96-c", 3, 1000000);

-- UsersResourcesLimits
INSERT INTO usersResourcesLimits (user_email, ram, cpu, disk, upload, download) VALUES ("krystof.havranek@student.gyarab.cz", 2147483648, 10, 10737418240, 100000000, 100000000);



-- Mock containers data
INSERT INTO containers (project_id, name, url, template_id, state) VALUES (18, "cool", "cool.testProjects.krystof.havranek.havrak.xyz", 2,1);
INSERT INTO containers (project_id, name, url, template_id, state) VALUES (18, "test", "test.testProjects.krystof.havranek.havrak.xyz", 2,1);
INSERT INTO containers (project_id, name, url, template_id, state) VALUES (18, "despise", "despise.testProjects.krystof.havranek.havrak.xyz", 2,1);
INSERT INTO containers (project_id, name, url, template_id, state) VALUES (18, "this", "this.testProjects.krystof.havranek.hravrak.xyz", 2,1);
INSERT INTO containers (project_id, name, url, template_id, state) VALUES (18, "stupid", "stupid.testProjects.krystof.havranek.havrak.xyz", 2,1);
INSERT INTO containers (project_id, name, url, template_id, state) VALUES (18, "mouse", "mouse.testProjects.krystof.havranek.havrak.xyz", 2,1);
INSERT INTO containers (project_id, name, url, template_id, state) VALUES (18, "pad", "pad.testProjects.krystof.havranek.havrak.xyz", 2,1);
INSERT INTO containers (project_id, name, url, template_id, state) VALUES (18, "objection", "objection.testProjects.krystof.havranek.havrak.xyz", 2,1);

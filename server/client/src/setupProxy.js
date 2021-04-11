const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
   app.use(createProxyMiddleware("/auth/google", { target: "http://localhost:5000/" }));
   app.use(createProxyMiddleware("/api/*", { target: "http://localhost:5000/" }));
   app.use(
      createProxyMiddleware("/api/instances/*", { target: "http://localhost:5000/" })
   );
   app.use(
      createProxyMiddleware("/api/instances/*/*", { target: "http://localhost:5000/" })
   );
   app.use(
      createProxyMiddleware("/api/projects/*", { target: "http://localhost:5000/" })
   );
   app.use(createProxyMiddleware("/api/user/*", { target: "http://localhost:5000/" }));
   app.use(
      createProxyMiddleware("/api/projects/*/instances/*/console", { target: "http://localhost:7000/" })
   );
   app.use(
      createProxyMiddleware("/websockets/terminals/*", { target: "http://localhost:7000/", ws: true })
   );
};

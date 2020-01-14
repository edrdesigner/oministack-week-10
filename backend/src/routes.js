const { Router } = require("express");
const DevController = require("./controllers/DevController");
const SearchController = require("./controllers/SearchController");

const routes = Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Hello Oministacsk" });
});

routes.post("/devs", DevController.store);
routes.get("/devs", DevController.index);
routes.put("/devs/:id", DevController.update);
routes.delete("/devs/:id", DevController.destroy);
routes.get("/search", SearchController.index);

module.exports = routes;

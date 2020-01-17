const api = require("../services/api");
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");
const { findConnections, sendMessage } = require("../websocket");

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();
    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;
    const response = await api.get(`/users/${github_username}`);
    const { name = login, avatar_url, bio } = response.data;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const techsArray = parseStringAsArray(techs);

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });

      // filter connection that are in 10km of distance
      // and that the new dev has this techs
      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      );

      sendMessage(sendSocketMessageTo, "new-dev", dev);
    }

    return res.json(dev);
  },

  async update(req, res) {
    const { id } = req.params;
    let dev = await Dev.findOne({ _id: id });

    if (!dev) {
      return res.status(400).json({ error: "Dev does not exits" });
    }

    const { github_username, techs, latitude, longitude } = req.body;
    const response = await api.get(`/users/${github_username}`);
    const { name = login, avatar_url, bio } = response.data;

    const techArray = parseStringAsArray(techs);

    const location = {
      type: "Point",
      coordinates: [longitude, latitude]
    };

    dev.github_username = github_username;
    dev.name = name;
    dev.avatar_url = avatar_url;
    dev.bio = bio;
    dev.techs = techArray;
    dev.location = location;

    dev.save();

    return res.json(dev);
  },

  async destroy(req, res) {
    const { id } = req.params;
    let dev = await Dev.findOne({ _id: id });

    if (!dev) {
      return res.status(400).json({ error: "Dev does not exits" });
    }

    await Dev.deleteOne({ _id: id });

    return res.send();
  }
};

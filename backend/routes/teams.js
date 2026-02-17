const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");

let io;
router.setSocketIO = (socketIO) => { io = socketIO; };

// Get all teams
router.get("/", (req, res) => teamController.getTeams(req, res));

// Get team members
router.get("/:teamId/members", (req, res) => teamController.getTeamMembers(req, res));

// Create a new team
router.post("/", (req, res) => teamController.createTeam(req, res));

// Add a member to a team
router.post("/:teamId/members", (req, res) => teamController.addMember(req, res, io));

// Remove a member from a team
router.delete("/:teamId/members/:memberId", (req, res) => teamController.removeMember(req, res, io));

// Update member status
router.put("/:teamId/members/:memberId/status", (req, res) => teamController.updateMemberStatus(req, res, io));

module.exports = router;

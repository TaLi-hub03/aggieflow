const express = require("express");
const router = express.Router();
const { getTeams, createTeam, addMember } = require("../controllers/teamController");

// Get all teams
router.get("/", getTeams);

// Create a new team
router.post("/", createTeam);

// Add a member to a team
router.put("/:id/members", addMember);

module.exports = router;

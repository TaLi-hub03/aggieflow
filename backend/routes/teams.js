const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");
const { sendWelcomeEmail } = require("../emailService"); // <-- import at top

let io;
router.setSocketIO = (socketIO) => { io = socketIO; };

// Get all teams
router.get("/", (req, res) => teamController.getTeams(req, res));

// Get team members
router.get("/:teamId/members", (req, res) => teamController.getTeamMembers(req, res));

// Create new team
router.post("/", (req, res) => teamController.createTeam(req, res));

// Add member to team
router.post("/:teamId/members", async (req, res) => {
  // Call original controller logic
  const result = await teamController.addMember(req, res, io);

  // If a new member was successfully added, send welcome email
  if (result && result.email && result.name) {
    sendWelcomeEmail(result.email, result.name)
      .then(() => console.log("Welcome email sent"))
      .catch(err => console.error("Error sending welcome email:", err));
  }

  return result;
});

// Remove a member from a team
router.delete("/:teamId/members/:memberId", (req, res) => teamController.removeMember(req, res, io));

// Update member status
router.put("/:teamId/members/:memberId/status", (req, res) => teamController.updateMemberStatus(req, res, io));

module.exports = router;

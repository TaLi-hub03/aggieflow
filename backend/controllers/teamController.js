let teams = [];
let defaultTeamId = 1;
const { sendWelcomeEmail } = require("../services/emailService");

// Initialize with a default team
if (teams.length === 0) {
  teams.push({
    id: defaultTeamId,
    name: "AggieFlow Team",
    members: [
      { id: 1, name: "Taliah", email: "taliah@aggieflow.dev", role: "Admin", status: "online", tasksAssigned: 0, tasksCompleted: 0 },
      { id: 2, name: "Moses", email: "moses@aggieflow.dev", role: "Member", status: "online", tasksAssigned: 0, tasksCompleted: 0 },
      { id: 3, name: "Deshawn", email: "deshawn@aggieflow.dev", role: "Member", status: "offline", tasksAssigned: 0, tasksCompleted: 0 },
      { id: 4, name: "Jalen", email: "jalen@aggieflow.dev", role: "Member", status: "online", tasksAssigned: 0, tasksCompleted: 0 },
      { id: 5, name: "Jason", email: "jason@aggieflow.dev", role: "Member", status: "offline", tasksAssigned: 0, tasksCompleted: 0 }
    ]
  });
}

const getTeams = (req, res) => {
  res.json(teams);
};

const getTeamMembers = (req, res) => {
  const teamId = parseInt(req.params.teamId);
  const team = teams.find(t => t.id === teamId);
  if (!team) return res.status(404).send("Team not found");
  res.json(team.members || []);
};

const createTeam = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send("Team name is required");

  const newTeam = {
    id: Math.max(...teams.map(t => t.id), 0) + 1,
    name,
    members: []
  };

  teams.push(newTeam);
  res.status(201).json(newTeam);
};

const addMember = (req, res, io) => {
  const teamId = parseInt(req.params.teamId);
  const team = teams.find(t => t.id === teamId);
  if (!team) return res.status(404).send("Team not found");

  const { name, email, role } = req.body;
  if (!name || !email) return res.status(400).send("Name and email are required");

  const newMember = {
    id: Math.max(...(team.members || []).map(m => m.id), 0) + 1,
    name,
    email,
    role: role || "Member",
    status: "offline",
    tasksAssigned: 0,
    tasksCompleted: 0
  };

  if (!team.members) team.members = [];
  team.members.push(newMember);

  // Send welcome email (async, don't block response)
  sendWelcomeEmail(email, name, team.name).catch(err => 
    console.error("Background email send failed:", err)
  );

  if (io) io.emit("memberAdded", { teamId, member: newMember });

  res.status(201).json(newMember);
};

const removeMember = (req, res, io) => {
  const teamId = parseInt(req.params.teamId);
  const memberId = parseInt(req.params.memberId);
  const team = teams.find(t => t.id === teamId);
  if (!team) return res.status(404).send("Team not found");

  const idx = (team.members || []).findIndex(m => m.id === memberId);
  if (idx === -1) return res.status(404).send("Member not found");

  const removed = team.members.splice(idx, 1)[0];

  if (io) io.emit("memberRemoved", { teamId, memberId });

  res.json({ success: true });
};

const updateMemberStatus = (req, res, io) => {
  const teamId = parseInt(req.params.teamId);
  const memberId = parseInt(req.params.memberId);
  const { status } = req.body;
  const team = teams.find(t => t.id === teamId);
  if (!team) return res.status(404).send("Team not found");

  const member = (team.members || []).find(m => m.id === memberId);
  if (!member) return res.status(404).send("Member not found");

  member.status = status || "offline";

  if (io) io.emit("memberStatusChanged", { teamId, memberId, status: member.status });

  res.json(member);
};

module.exports = { getTeams, getTeamMembers, createTeam, addMember, removeMember, updateMemberStatus };

let teams = []; // temporary storage for demo

// Get all teams
const getTeams = (req, res) => {
  res.json(teams);
};

// Create a new team
const createTeam = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send("Team name is required");

  const newTeam = {
    id: teams.length + 1,
    name,
    members: [], // start empty
  };

  teams.push(newTeam);
  res.status(201).json(newTeam);
};

// Add a member to a team
const addMember = (req, res) => {
  const team = teams.find(t => t.id == req.params.id);
  if (!team) return res.status(404).send("Team not found");

  const { member } = req.body;
  if (!member) return res.status(400).send("Member name is required");

  team.members.push(member);
  res.json(team);
};

module.exports = { getTeams, createTeam, addMember };

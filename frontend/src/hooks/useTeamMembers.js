import { useCallback, useEffect, useState } from "react";
import { io as ioClient } from "socket.io-client";

export default function useTeamMembers(teamId = 1) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/teams/${teamId}/members`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    load();
    const socket = ioClient();
    socket.on("memberAdded", ({ teamId: tid, member }) => {
      if (tid === teamId) setMembers((prev) => [...prev, member]);
    });
    socket.on("memberRemoved", ({ teamId: tid, memberId }) => {
      if (tid === teamId) setMembers((prev) => prev.filter(m => m.id !== memberId));
    });
    socket.on("memberStatusChanged", ({ teamId: tid, memberId, status }) => {
      if (tid === teamId) setMembers((prev) => prev.map(m => m.id === memberId ? { ...m, status } : m));
    });
    return () => socket.disconnect();
  }, [teamId, load]);

  const addMember = useCallback(async (formData) => {
    const res = await fetch(`/api/teams/${teamId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      const newMember = await res.json();
      setMembers((prev) => [...prev, newMember]);
      return newMember;
    }
    throw new Error("Failed to add member");
  }, [teamId]);

  const removeMember = useCallback(async (memberId) => {
    const res = await fetch(`/api/teams/${teamId}/members/${memberId}`, { method: "DELETE" });
    if (res.ok) {
      setMembers((prev) => prev.filter(m => m.id !== memberId));
      return true;
    }
    throw new Error("Failed to remove member");
  }, [teamId]);

  const updateStatus = useCallback(async (member, newStatus) => {
    const res = await fetch(`/api/teams/${teamId}/members/${member.id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setMembers((prev) => prev.map(m => m.id === member.id ? { ...m, status: newStatus } : m));
      return true;
    }
    throw new Error("Failed to update status");
  }, [teamId]);

  return {
    members,
    loading,
    error,
    addMember,
    removeMember,
    updateStatus,
    refresh: load,
  };
}
"use client";

import withAdminAuth from "@/components/auth/withAdminAuth";
import Timeline from "@/components/timeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";

interface Member {
  member_id: number;
  name: string;
  email: string;
  is_leader: boolean;
}

interface Team {
  team_id: number;
  team_name: string;
  track_name: string;
  status: string;
  members: Member[];
  problem_statement: string;
  idea: string;
}

interface Submission {
  submission_id: number;
  type: "review1" | "review2" | "final";
  title: string;
  description: string;
  links?: {
    presentation?: string;
    github?: string;
    figma?: string;
    file?: string;
  };
}

interface TeamDetails extends Team {
  submissions: Submission[];
}

const hackathonPhases = [
  "Participants reach",
  "Ideation",
  "Review 1",
  "Lunch",
  "Speaker Sessions",
  "Review 2",
  "Dinner",
  "Begin Hacking",
  "Final Review",
];

const judgingCriteria = [
  "Innovation & Creativity",
  "Impact",
  "Technical Implementation",
  "Design & User Experience",
  "Functionality & Working Demo",
  "Presentation & Pitch",
  "Scalability",
];


const AdminDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedTeamDetails, setSelectedTeamDetails] =
    useState<TeamDetails | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [timelinePhase, setTimelinePhase] = useState("");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState("");
  const [teamToEliminate, setTeamToEliminate] = useState<number | null>(null);
  const [isEliminationModalOpen, setIsEliminationModalOpen] = useState(false);
  const activeTeams = useMemo(
    () => teams.filter((team) => team.status !== "Eliminated"),
    [teams]
  );

  const currentTotalScore = useMemo(() => {
    return Object.values(scores).reduce((sum, score) => sum + score, 0);
  }, [scores]);
  const latestSubmission = useMemo(() => {
    if (!selectedTeamDetails) return null;
    return (
      selectedTeamDetails.submissions.find((s) => s.type === "final") ||
      selectedTeamDetails.submissions.find((s) => s.type === "review2") ||
      selectedTeamDetails.submissions.find((s) => s.type === "review1") ||
      null
    );
  }, [selectedTeamDetails]);
  const filteredTeams = useMemo(
    () =>
      teams.filter((team) =>
        team.team_name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [teams, searchTerm]
  );
  const fetchTeams = async () => {
    try {
      const response = await api.get("/admin/teams");
      setTeams(response.data.teams);
    } catch (error) {
      toast.error("Failed to refresh teams list.");
    }
  };
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [teamsRes, homeRes] = await Promise.all([
          api.get("/admin/teams"),
          api.get("/users/home"),
        ]);
        setTeams(teamsRes.data.teams);
        setTimelinePhase(homeRes.data.currentPhase);
      } catch (error) {
        toast.error("Failed to fetch initial admin data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);
  useEffect(() => {
    if (selectedTeam) {
      setIsDetailsLoading(true);
      setSelectedTeamDetails(null);
      api
        .get(`/admin/team/${selectedTeam.team_id}`)
        .then((response) => {
          const { team, members, submissions } = response.data;
          setSelectedTeamDetails({
            ...team,
            members,
            submissions,
          });
        })
        .catch((error) => {
          toast.error("Failed to fetch team details.");
        })
        .finally(() => {
          setIsDetailsLoading(false);
        });
    }
    setScores({});
    setComments("");
  }, [selectedTeam]);

  const handleTimelineUpdate = async () => {
    try {
      await api.post("/admin/timeline/phase", { phase: timelinePhase });
      toast.success(`Timeline has been updated to: ${timelinePhase}`);
    } catch (error) {
      toast.error("Failed to update timeline. You must be a Super Admin.");
    }
  };
  const handleEliminateConfirm = async () => {
    if (!teamToEliminate) {
      toast.error("No team selected for elimination.");
      return;
    }

    try {
      await api.post(`/admin/team/${teamToEliminate}/status`, {
        status: "rejected",
      });
      const teamName =
        teams.find((t) => t.team_id === teamToEliminate)?.team_name ||
        "The team";
      toast.success(`${teamName} has been eliminated.`);

      fetchTeams();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to eliminate team. You may not have permission."
      );
    } finally {
      setIsEliminationModalOpen(false);
      setTeamToEliminate(null);
    }
  };

  const getTeamLeader = (team: Team) => {
    return team.members.find((member) => member.is_leader)?.name || "N/A";
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-white text-center flex items-center justify-center text-3xl text-black">
        Loading...
      </div>
    );
  }

  const handleScoreChange = (criteria: string, value: string) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 10) {
      setScores((prev) => ({ ...prev, [criteria]: numericValue }));
    } else if (value === "") {
      setScores((prev) => {
        const newScores = { ...prev };
        delete newScores[criteria];
        return newScores;
      });
    }
  };

  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const latestSubmission = selectedTeamDetails?.submissions?.[0];

    if (!selectedTeam || !latestSubmission) {
      toast.error("Please select a team with a submission to judge.");
      return;
    }

    const payload = {
      score: currentTotalScore,
      comments: comments,
    };

    try {
      await api.post(
        `/admin/submission/${latestSubmission.submission_id}/review`,
        payload
      );
      toast.success(
        `Score of ${currentTotalScore} submitted for ${selectedTeam.team_name}`
      );
      setSelectedTeam(null);
      setSelectedTeamDetails(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit score.");
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Image
        src="/vector7.svg"
        alt=""
        width={600}
        height={600}
        className="absolute top-0 right-0 z-10"
      />
      <Image
        src="/vector8.svg"
        alt=""
        width={250}
        height={250}
        className="absolute bottom-0 right-0 z-10"
      />

      <div className="flex h-screen">
        <Timeline currentPhase={timelinePhase || "Participants reach"} />
        <div className="flex-1 flex flex-col w-[calc(100%-18rem)]">
          <div className="bg-white border-b-4 border-[#242e6c] text-[#242e6c] p-[1.15rem] relative">
            <h1 className="text-6xl font-bold text-left castoro">
              Hi, {user?.name || "Admin"}
            </h1>
          </div>

          <div className="flex-1 p-8 flex-col items-center justify-center gap-8 z-20 overflow-y-auto">
            <div className="flex-1 space-y-8 w-full">
              <div className="bg-[#CF3D00] p-6 rounded-2xl border-r-8 border-b-8 border-black space-y-4">
                <Input
                  placeholder="Search for a team..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-[44px] text-lg border-r-4 border-b-4 border-black rounded-lg bg-white placeholder:text-[#a8a8a7] text-black"
                />
                <div className="max-h-[250px] overflow-y-auto overflow-x-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white [&::-webkit-scrollbar-thumb]:rounded-full">
                  <table className="w-full text-white afacad text-left whitespace-nowrap">
                    <thead className="sticky top-0 bg-[#CF3D00]">
                      <tr>
                        <th className="p-2">S.No</th>
                        <th className="p-2">Team Name</th>
                        <th className="p-2">Leader</th>
                        <th className="p-2">Members</th>
                        <th className="p-2">Track</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTeams.map((team, index) => (
                        <tr
                          key={team.team_id}
                          onClick={() => setSelectedTeam(team)}
                          className={`border-t border-white/30 hover:bg-white/10 cursor-pointer`}
                        >
                          <td className="p-2">{index + 1}</td>
                          <td className="p-2">{team.team_name}</td>
                          <td className="p-2">{getTeamLeader(team)}</td>
                          <td className="p-2">
                            {team.members.map((m) => m.name).join(", ")}
                          </td>
                          <td className="p-2">{team.track_name}</td>
                          <td className="p-2 capitalize">{team.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-[#010027] p-8 rounded-2xl text-white border-r-8 border-b-8 border-black flex items-center justify-between">
                <div className="afacad">
                  <h3 className="text-3xl font-bold">Timeline Control</h3>
                  <p className="text-white/70">
                    Select the current phase of the hackathon.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Select
                    value={timelinePhase}
                    onValueChange={setTimelinePhase}
                  >
                    <SelectTrigger className="w-[280px] h-[44px] text-lg border-r-4 border-b-4 border-black rounded-lg bg-white text-black">
                      <SelectValue placeholder="Select a phase" />
                    </SelectTrigger>
                    <SelectContent>
                      {hackathonPhases.map((phase) => (
                        <SelectItem
                          key={phase}
                          value={phase}
                          className="focus:bg-[#CF3D00] focus:text-white"
                        >
                          {phase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleTimelineUpdate}
                    className="bg-[#CF3D00] hover:bg-[#CF3D00] text-white text-lg font-semibold px-8 py-5 rounded-lg border-r-4 border-b-4 border-black"
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-full mt-8">
              <div className="bg-[#010027] p-8 rounded-2xl text-white border-r-8 border-b-8 border-black">
                <h3 className="text-3xl !font-bold mb-4 afacad">
                  Project Details
                </h3>
                {selectedTeam ? (
                  isDetailsLoading ? (
                    <div className="text-center py-10">Loading details...</div>
                  ) : (
                    <div className="space-y-4 afacad">
                      <div>
                        <label className="text-lg font-semibold block mb-1">
                          Track Name
                        </label>
                        <Input
                          disabled
                          value={selectedTeamDetails?.track_name || "N/A"}
                          className="h-[44px] text-lg border-r-4 border-b-4 border-black rounded-lg bg-white/80 text-black placeholder:text-[#a8a8a7]"
                        />
                      </div>
                      <div>
                        <label className="text-lg font-semibold block mb-1">
                          Problem Statement
                        </label>
                        <Input
                          disabled
                          value={
                            selectedTeamDetails?.problem_statement || "N/A"
                          }
                          className="h-[44px] text-lg border-r-4 border-b-4 border-black rounded-lg bg-white/80 text-black placeholder:text-[#a8a8a7]"
                        />
                      </div>
                      <div>
                        <label className="text-lg font-semibold block mb-1">
                          Idea Name
                        </label>
                        <Input
                          disabled
                          value={latestSubmission?.title || "N/A"}
                          className="h-[44px] text-lg border-r-4 border-b-4 border-black rounded-lg bg-white/80 text-black placeholder:text-[#a8a8a7]"
                        />
                      </div>
                      <div>
                        <label className="text-lg font-semibold block mb-1">
                          Description
                        </label>
                        <Input
                          disabled
                          value={latestSubmission?.description || "N/A"}
                          className="h-[44px] text-lg border-r-4 border-b-4 border-black rounded-lg bg-white/80 text-black placeholder:text-[#a8a8a7]"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-lg font-semibold block mb-1">
                            GitHub Link
                          </label>
                          <Input
                            disabled
                            value={latestSubmission?.links?.github || "N/A"}
                            className="h-[44px] text-lg border-r-4 border-b-4 border-black rounded-lg bg-white/80 text-black"
                          />
                        </div>
                        <div>
                          <label className="text-lg font-semibold block mb-1">
                            Figma Link
                          </label>
                          <Input
                            disabled
                            value={latestSubmission?.links?.figma || "N/A"}
                            className="h-[44px] text-lg border-r-4 border-b-4 border-black rounded-lg bg-white/80 text-black"
                          />
                        </div>
                        <div>
                          <label className="text-lg font-semibold block mb-1">
                            Presentation Link
                          </label>
                          <Input
                            disabled
                            value={
                              latestSubmission?.links?.presentation || "N/A"
                            }
                            className="h-[44px] text-lg border-r-4 border-b-4 border-black rounded-lg bg-white/80 text-black"
                          />
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="text-center py-10 afacad">
                    <p className="text-2xl text-white/70">
                      Select a team to view their project details.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full mt-8">
              <div className="bg-[#010027] p-8 rounded-2xl text-white border-r-8 border-b-8 border-black">
                <h3 className="text-3xl !font-bold mb-4 afacad">
                  Judging Panel
                </h3>
                {selectedTeam ? (
                  <form onSubmit={handleScoreSubmit} className="afacad">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-3xl font-bold">
                          Judging: {selectedTeam.team_name}
                        </h3>
                        <p className="text-white/70">
                          Current Score: {currentTotalScore}
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => setSelectedTeam(null)}
                        className="bg-white border-b-2 border-r-2 border-black text-black hover:bg-white text-lg"
                      >
                        Clear Selection
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                      {judgingCriteria.map((criterion) => (
                        <div key={criterion}>
                          <label className="text-lg font-semibold block mb-1">
                            {criterion} (0-10)
                          </label>
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            value={scores[criterion] || ""}
                            onChange={(e) =>
                              handleScoreChange(criterion, e.target.value)
                            }
                            className="h-[44px] text-lg border-r-4 border-b-4 border-black rounded-lg bg-white text-black"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="text-lg font-semibold block mb-1">
                        Comments
                      </label>
                      <Textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Provide feedback for the team..."
                        className="bg-white text-black rounded-lg border-r-4 border-b-4 border-black"
                      />
                    </div>
                    <div className="flex justify-end mt-6">
                      <Button
                        type="submit"
                        className="bg-[#CF3D00] hover:bg-[#CF3D00] text-white text-xl font-semibold px-8 py-5 rounded-lg border-r-4 border-b-4 border-black"
                      >
                        Submit Score
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-10 afacad">
                    <p className="text-2xl text-white/70">
                      Select a team from the table above to begin judging.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full mt-8">
              <div className="bg-[#CF3D00] p-6 rounded-2xl border-r-8 border-b-8 border-black space-y-4">
                <div className="afacad text-white">
                  <h3 className="text-3xl font-bold">Eliminate Team</h3>
                  <p className="text-white/70">
                    Select a team to eliminate them from Hackulus'25.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Select
                    onValueChange={(value) => setTeamToEliminate(Number(value))}
                  >
                    <SelectTrigger className="w-full h-[44px] text-lg border-r-4 border-b-4 border-black rounded-lg bg-white text-black">
                      <SelectValue placeholder="Select a team to eliminate" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeTeams.map((team) => (
                        <SelectItem
                          key={team.team_id}
                          value={String(team.team_id)}
                          className="focus:bg-red-600 focus:text-white"
                        >
                          {team.team_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() =>
                      teamToEliminate && setIsEliminationModalOpen(true)
                    }
                    disabled={!teamToEliminate}
                    className="bg-red-600 hover:bg-red-600 disabled:cursor-not-allowed text-white text-lg font-semibold px-8 py-5 rounded-lg border-r-4 border-b-4 border-black"
                  >
                    Eliminate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isEliminationModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 backdrop-blur-sm bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                className="w-full max-w-md p-8 rounded-2xl shadow-2xl border-r-8 border-b-8 border-black bg-gradient-to-b from-[#010027] via-[#13184E] to-[#3142B4]"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 200 }}
              >
                <h2 className="text-3xl font-bold text-white afacad text-center">
                  Confirm Elimination
                </h2>
                <p className="text-center text-white mt-2 mb-6">
                  Are you sure you want to eliminate team "
                  {teams.find((t) => t.team_id === teamToEliminate)?.team_name}
                  "? This action cannot be reversed.
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => setIsEliminationModalOpen(false)}
                    className="bg-white hover:bg-white text-black text-lg font-semibold px-8 py-5 rounded-lg border-r-4 border-b-4 border-black"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEliminateConfirm}
                    className="bg-red-600 hover:bg-red-600 text-white text-lg font-semibold px-8 py-5 rounded-lg border-r-4 border-b-4 border-black"
                  >
                    Eliminate
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default withAdminAuth(AdminDashboard);

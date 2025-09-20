"use client";

import withAuth from "@/components/auth/withAuth";
import ProjectModifyForm from "@/components/project-forms/project-modify-form";
import ProjectSubmissionForm from "@/components/project-forms/project-submission-form";
import Timeline from "@/components/timeline";
import TrackModal from "@/components/track-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { trackinfo, tracks } from "@/lib/data";
import { AnimatePresence, easeOut, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface Member {
  user_id: number;
  name: string;
  email: string;
  is_leader: boolean;
}

interface Team {
  team_id: number;
  team_name: string;
  track_name: string;
}

interface Submission {
  submission_id: number;
  type: "review1" | "review2" | "final";
  title: string;
  description: string;
  links?: {
    presentation_link?: string;
    github_link?: string;
    figma_link?: string;
    file?: string;
  };
}

interface DashboardData {
  user: {
    user_id: number;
    name: string;
    is_leader: boolean;
  };
  team: Team;
  members: Member[];
  windows: {
    review1: boolean;
    review2: boolean;
    final: boolean;
  };
  currentPhase: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<
    (typeof trackinfo)[0] | null
  >(null);
  const [isProjectSubmitModalOpen, setIsProjectSubmitModalOpen] =
    useState(false);
  const [isProjectModifyModalOpen, setIsProjectModifyModalOpen] =
    useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const getCurrentReviewStage = () => {
    if (dashboardData?.windows?.final) return "Final Review";
    if (dashboardData?.windows?.review2) return "Review 2";
    if (dashboardData?.windows?.review1) return "Review 1";
    return "";
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeRes, submissionsRes] = await Promise.all([
          api.get("/users/home"),
          api.get("/users/submissions"),
        ]);
        setDashboardData(homeRes.data);
        setSubmissions(submissionsRes.data.submissions);
      } catch (error) {
        toast.error("Failed to fetch dashboard data:");
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const existingIdeaSubmission = useMemo(
    () => submissions.find((s) => s.type === "review1"),
    [submissions]
  );
  const submissionForCurrentPhase = useMemo(() => {
    if (!dashboardData?.currentPhase) return null;

    if (dashboardData.currentPhase === "Review 2") {
      return submissions.find((s) => s.type === "review2");
    }
    if (dashboardData.currentPhase === "Final Review") {
      return submissions.find((s) => s.type === "final");
    }
    return null;
  }, [submissions, dashboardData?.currentPhase]);
  const handleTrackClick = (trackName: string) => {
    const trackData = trackinfo.find((t) => t.name === trackName);
    if (trackData) {
      setSelectedTrack(trackData);
      setIsModalOpen(true);
    } else {
      return;
    }
  };
  const sortedMembers = useMemo(() => {
    if (!dashboardData?.members) return [];
    return [...dashboardData.members].sort((a, b) => {
      if (a.is_leader) return -1;
      if (b.is_leader) return 1;
      return 0;
    });
  }, [dashboardData?.members]);
  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-white text-center flex items-center justify-center text-3xl text-black">
        Loading...
      </div>
    );
  }
  const getButtonState = () => {
    const { windows } = dashboardData || {};
    const { currentPhase } = dashboardData || {};
    if (windows?.review1) {
      return {
        text: existingIdeaSubmission ? "Modify Idea" : "Submit Idea",
        action: "idea",
      };
    }
    if (currentPhase === "Review 2" && windows?.review2) {
      return {
        text: submissionForCurrentPhase ? "Modify Project" : "Submit Project",
        action: "review2",
      };
    }
    if (currentPhase === "Final Review" && windows?.final) {
      return {
        text: submissionForCurrentPhase ? "Modify Project" : "Submit Project",
        action: "final",
      };
    }
    return { text: "Submissions Closed", action: "closed" };
  };
  const handleButtonClick = () => {
    if (!user?.is_leader) {
      toast.error("Only the team leader can perform this action.");
      return;
    }
    const { action } = getButtonState();
    switch (action) {
      case "idea":
        const route = existingIdeaSubmission
          ? "/idea-modification"
          : "/idea-submission";
        router.push(route);
        break;
      case "review2":
      case "final":
        if (submissionForCurrentPhase) {
          setIsProjectModifyModalOpen(true);
        } else {
          setIsProjectSubmitModalOpen(true);
        }
        break;
      default:
        break;
    }
  };
  const buttonState = getButtonState();
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
        <Timeline
          currentPhase={dashboardData?.currentPhase || "Participants reach"}
        />
        <div className="flex-1 flex flex-col w-[calc(100%-18rem)]">
          <div className="bg-white border-b-4 border-[#242e6c] text-[#242e6c] p-[1.15rem] relative">
            <h1 className="text-6xl font-bold text-left castoro">
              Hi, {user?.name || "User"}
            </h1>
          </div>

          <div className="flex-1 p-8 flex gap-8 z-20">
            <div className="flex-1 space-y-12 w-1/2">
              <div className="bg-[#CF3D00] p-6 rounded-2xl border-r-8 border-b-8 border-black">
                <div className="flex gap-6">
                  <div className="afacad flex-1 relative top-5">
                    <div className="mx-auto bg-gradient-to-t from-[#D97158] to-white rounded-lg p-4 mb-4 w-fit border border-black">
                      <Image
                        src="/vector9.svg"
                        alt=""
                        width={140}
                        height={140}
                        className="mx-auto"
                      />
                      <div className="afacad text-black !font-extrabold text-2xl text-center mb-4">
                        THE SQUAD THAT
                        <br />
                        MAKES IT HAPPEN!
                      </div>
                      <div className="rounded-lg h-fit w-full bg-[#FFC640] text-black text-lg !font-bold text-center p-1 border-b-2 border-r-2 border-black">
                        {dashboardData?.team?.track_name || "No Track Selected"}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-5">
                    <div className="afacad text-white text-2xl !font-bold text-left">
                      {dashboardData?.team?.team_name || "Your Team"}
                    </div>
                    {sortedMembers.length > 0 ? (
                      sortedMembers.map((member: Member) => (
                        <div
                          key={member.user_id}
                          className="relative flex items-center w-full"
                        >
                          <Input
                            readOnly
                            value={member.name}
                            className="bg-white border-r-4 border-b-4 border-black text-gray-800 rounded-lg w-full pr-10"
                          />
                          {member.is_leader && (
                            <>
                              <Image
                                src="/vector11.svg"
                                alt=""
                                width={24}
                                height={24}
                                className="absolute right-2 top-1"
                              />
                              <Image
                                src="/vector10.svg"
                                alt="Team Leader"
                                width={14}
                                height={14}
                                className="absolute right-[0.8rem] top-[45%] -translate-y-1/2"
                              />
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-white text-center">
                        You are not part of a team yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-[#010027] p-8 rounded-2xl text-white border-r-8 border-b-8 border-black">
                <div className="flex items-center justify-center gap-20 p-5 bg-gradient-to-t from-[#3142B4] to-white rounded-2xl">
                  <Image src="/vector12.svg" alt="" width={150} height={150} />
                  <div className="afacad text-black flex flex-col items-center justify-center">
                    <h3 className="text-4xl !font-extrabold mb-1 text-center">
                      Turn your ideas
                    </h3>
                    <h3 className="text-4xl !font-extrabold mb-4 text-center">
                      into reality
                    </h3>
                    <Button
                      onClick={handleButtonClick}
                      disabled={buttonState.action === "closed"}
                      className="border-r-4 border-b-4 border-black bg-white text-[#242e6c] text-2xl px-6 py-5 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    >
                      {buttonState.text}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-1/2">
              <div className="castoro text-3xl mx-auto w-fit bg-black text-white px-10 py-1 rounded-full text-center font-bold mb-2">
                TRACKS
              </div>

              <div className="border-b-8 border-r-8 border-black bg-[#010027] p-9 rounded-2xl h-[37.7rem] overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#CF3D00] [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:#CF3D00]">
                <div className="grid grid-cols-2 gap-12">
                  {tracks.map((track) => (
                    <div
                      key={track.name}
                      onClick={() => handleTrackClick(track.name)}
                      className="mb-1 aspect-square bg-gradient-to-b from-[#13184E] to-[#FFFFFF_90%] rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer"
                    >
                      <Image
                        src={track.logo}
                        alt={track.name}
                        width={150}
                        height={140}
                        className="mb-2"
                      />
                      <p
                        className={`${
                          track.name === "Healthcare" ? "-mt-0" : ""
                        }  ${
                          track.name === "AI and Mathematical Modelling"
                            ? "mt-7"
                            : ""
                        } castoro text-black text-center !font-bold mt-2`}
                      >
                        {track.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 backdrop-blur-sm bg-white/60"
              style={{
                backgroundImage: `radial-gradient(circle, #a8a8a7 5px, transparent 1px)`,
                backgroundSize: "90px 90px",
              }}
              initial={{ y: "-100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ ease: easeOut, duration: 0.6 }}
            />

            <div
              className="fixed inset-0 z-50 flex items-center justify-center"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedTrack(null);
              }}
            >
              {selectedTrack && (
                <TrackModal
                  trackData={selectedTrack}
                  onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTrack(null);
                  }}
                />
              )}
            </div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isProjectSubmitModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 backdrop-blur-sm bg-white/60"
              style={{
                backgroundImage: `radial-gradient(circle, #a8a8a7 5px, transparent 1px)`,
                backgroundSize: "90px 90px",
              }}
              initial={{ y: "-100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ ease: easeOut, duration: 0.6 }}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <ProjectSubmissionForm
                reviewStage={getCurrentReviewStage()}
                onClose={() => setIsProjectSubmitModalOpen(false)}
                submissionType={getButtonState().action as "review2" | "final"}
              />
            </div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isProjectModifyModalOpen && submissionForCurrentPhase && (
          <>
            <motion.div
              className="fixed inset-0 z-40 backdrop-blur-sm bg-white/60"
              style={{
                backgroundImage: `radial-gradient(circle, #a8a8a7 5px, transparent 1px)`,
                backgroundSize: "90px 90px",
              }}
              initial={{ y: "-100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ ease: easeOut, duration: 0.6 }}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <ProjectModifyForm
                reviewStage={getCurrentReviewStage()}
                submission={submissionForCurrentPhase}
                onClose={() => setIsProjectModifyModalOpen(false)}
                submissionType={
                  submissionForCurrentPhase.type as "review2" | "final"
                }
              />
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default withAuth(Dashboard);

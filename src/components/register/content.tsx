"use client";

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import Step from "@/components/Step";
import ProgressBar from "@/components/ProgressBar";
import RadioButton from "./RadioButton";
import JoinTeam from "./JoinTeam";
import { supabase } from "../../lib/supabaseClient";
import { MemberInformationsDetails } from "./MemberInformationsDetails";
import { dataRegistrationProps } from "@/utils/validation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function Content() {
  const [step, setStep] = useState(0);
  const [teamType, setTeamType] = useState("solo");
  const [teamAction, setTeamAction] = useState("create");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registeredTeamId, setRegisteredTeamId] = useState("");
  const [formData, setFormData] = useState({
    teamAction: "create",
    teamId: "",
    teamName: "",
    teamMembers: "solo",
    membersCount: 1,
    email: "",
    firstName: "",
    lastName: "",
    programmingSkill: "Beginner",
    electronicsSkill: "Beginner",
    mechanicalSkill: "Beginner",
    phone: "",
    wilaya: "",
    dob: "",
    university: "",
    fos: "",
    yos: "",
    motivation: "",
    howHeard: "",
    howHeardOther: "",
    participatedBefore: "No",
    previousCompetitionDetails: "",
    formalRoboticsTraining: "No",
    roboticsTrainingDetails: "",
    anythingElse: "",
    code: "",
  });

  const storeTeamRegistration = async (payload: dataRegistrationProps) => {
    setIsLoading(true);
    setError("");

    try {
      const teamInsertData = {
        name: payload.teamName,
        is_solo: payload.teamMembers === "solo",
      };

      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .insert([teamInsertData])
        .select("id, code");

      if (teamError || !teamData || teamData.length === 0) {
        throw new Error(
          teamError?.message || "Failed to create team. Please try again.",
        );
      }

      const teamId = teamData[0].id as string;

      const { data: participantData, error: participantError } = await supabase
        .from("participants")
        .insert([
          {
            first_name: payload.firstName,
            last_name: payload.lastName,
            birth_date: payload.dob,
            email: payload.email,
            phone_number: payload.phone,
            wilaya: payload.wilaya,
            team_id: teamId,
            university: payload.university,
            field_of_study: payload.fos,
            year_of_study: payload.yos,
            motivation: payload.motivation,
            anything_else: payload.anythingElse,
            programming_skill: payload.programmingSkill,
            electronics_skill: payload.electronicsSkill,
            mechanical_skill: payload.mechanicalSkill,
            how_heard: payload.howHeard,
            how_heard_other: payload.howHeard === "Other" ? payload.howHeardOther : null,
            participated_before: payload.participatedBefore === "Yes",
            previous_competition_details:
              payload.participatedBefore === "Yes"
                ? payload.previousCompetitionDetails
                : null,
            formal_robotics_training: payload.formalRoboticsTraining === "Yes",
            robotics_training_details:
              payload.formalRoboticsTraining === "Yes"
                ? payload.roboticsTrainingDetails
                : null,
          },
        ])
        .select();

      if (participantError || !participantData || participantData.length === 0) {
        throw new Error(
          participantError?.message ||
            "Failed to register participant. Please try again.",
        );
      }

      setRegisteredTeamId(teamData[0].code);
      nextStep();
    } catch (caughtError) {
      setError("An error occurred while registering the team");
      console.error(caughtError);
    } finally {
      setIsLoading(false);
    }
  };

  const storeMemberRegistration = async (payload: dataRegistrationProps) => {
    try {
      setIsLoading(true);

      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("is_solo, participants(team_id), id")
        .eq("code", payload.code)
        .single();

      if (teamError) {
        throw new Error("Team not found");
      }

      if (!teamData) {
        throw new Error("Invalid team ID");
      }

      const teamMembers = teamData.participants ?? [];
      if (teamData.is_solo) {
        throw new Error("Cannot join a solo team");
      }

      if (teamMembers.length >= 4) {
        throw new Error("The team is already full (maximum 4 members)");
      }

      const teamId = teamData.id;

      const { error: insertError } = await supabase
        .from("participants")
        .insert([
          {
            first_name: payload.firstName,
            last_name: payload.lastName,
            birth_date: payload.dob,
            email: payload.email,
            phone_number: payload.phone,
            wilaya: payload.wilaya,
            team_id: teamId,
            university: payload.university,
            field_of_study: payload.fos,
            year_of_study: payload.yos,
            programming_skill: payload.programmingSkill,
            electronics_skill: payload.electronicsSkill,
            mechanical_skill: payload.mechanicalSkill,
            motivation: payload.motivation,
            anything_else: payload.anythingElse,
            how_heard: payload.howHeard,
            how_heard_other: payload.howHeard === "Other" ? payload.howHeardOther : null,
            participated_before: payload.participatedBefore === "Yes",
            previous_competition_details:
              payload.participatedBefore === "Yes"
                ? payload.previousCompetitionDetails
                : null,
            formal_robotics_training: payload.formalRoboticsTraining === "Yes",
            robotics_training_details:
              payload.formalRoboticsTraining === "Yes"
                ? payload.roboticsTrainingDetails
                : null,
          },
        ]);

      if (insertError) {
        console.error(insertError);
        throw new Error("Failed to register team member");
      }

      setRegisteredTeamId(payload.code);
      setError("");
      nextStep();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "An unexpected error occurred",
      );
      console.error(caughtError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamType(e.target.value);
    setFormData((prev) => ({
      ...prev,
      teamMembers: e.target.value,
    }));
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (teamAction === "create") {
      await storeTeamRegistration(formData);
    } else {
      await storeMemberRegistration(formData);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-white text-zinc-900">
      <div className="absolute inset-0 z-0">
        <img
          src="/bgmaze.webp"
          alt="Background Maze"
          className="h-full w-full object-cover opacity-[0.08]"
          loading="eager"
        />
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4 border border-zinc-200">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-900" />
            <p className="text-zinc-900 font-medium tracking-wide">
              Processing your registration...
            </p>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-start pt-24 px-4 w-full">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="block text-4xl md:text-5xl font-bold text-zinc-900 mb-5 tracking-[0.08em] uppercase"
        >
          POLYMAZE Registration
        </motion.h1>

        <ProgressBar currentStep={step} totalSteps={4} />

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="w-full max-w-3xl"
        >
          <Step
            isActive={step === 0}
            stepNumber={0}
            onNext={nextStep}
            isFirstStep={true}
          >
            <h2 className="text-2xl font-bold text-zinc-900 mb-4 tracking-[0.06em] uppercase">
              Welcome to POLYMAZE
            </h2>
            <p className="text-zinc-900 mb-6 leading-relaxed tracking-[0.02em]">
              <span className="font-bold">Welcome to POLYMAZE,</span> an
              exhilarating robotic competition where innovation meets adventure!
              This is your chance to showcase your skills in programming,
              electronics, and mechanical design while competing against the
              brightest minds in robotics. Join us for an unforgettable
              experience filled with creativity and cutting-edge technology. Are
              you ready to take on the POLYMAZE challenge and prove your
              prowess?
              <br />
              <br />
              Sign up now and let your robotic journey begin!
            </p>
          </Step>

          <Step
            isActive={step === 1}
            stepNumber={1}
            onNext={() => {
              if (teamAction === "create" && formData.teamName.trim() === "") {
                setError("Team Name is required.");
                return;
              }

              if (teamAction === "join" && formData.code.trim() === "") {
                setError("Team Code is required.");
                return;
              }

              setError("");
              nextStep();
            }}
            onPrevious={prevStep}
          >
            <h2 className="text-2xl font-bold text-zinc-900 mb-6 tracking-[0.06em] uppercase">
              Team Registration
            </h2>

            <div className="mb-6">
              <p className="text-zinc-900 mb-3 tracking-[0.03em] uppercase text-xs">
                Would you like to create a new team or join an existing one?
              </p>
              <div className="flex gap-6">
                <RadioButton
                  name="teamAction"
                  value="create"
                  checked={teamAction === "create"}
                  onChange={(e) => {
                    setTeamAction(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      teamAction: e.target.value,
                    }));
                  }}
                  label="Create a team"
                />

                <RadioButton
                  name="teamAction"
                  value="join"
                  checked={teamAction === "join"}
                  onChange={(e) => {
                    setTeamAction(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      teamAction: e.target.value,
                    }));
                  }}
                  label="Join a team"
                />
              </div>
            </div>

            {teamAction === "create" && (
              <>
                <div className="mb-6">
                  <p className="text-zinc-900 mb-3 tracking-[0.03em] uppercase text-xs">
                    Will you participate solo or in a team?
                  </p>
                  <div className="flex gap-6">
                    <RadioButton
                      name="teamMembers"
                      value="solo"
                      checked={teamType === "solo"}
                      onChange={handleRadioChange}
                      label="Solo"
                    />

                    <RadioButton
                      name="teamMembers"
                      value="team"
                      checked={teamType === "team"}
                      onChange={handleRadioChange}
                      label="In a team"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <FieldInput
                    id="teamName"
                    name="teamName"
                    label="Team Name"
                    value={formData.teamName}
                    onChange={handleInputChange}
                    placeholder="Enter your team name"
                    required={teamAction === "create"}
                  />
                </div>
              </>
            )}

            {teamAction === "join" && (
              <JoinTeam code={formData.code} onChange={handleInputChange} />
            )}
          </Step>

          <Step
            isActive={step === 2}
            stepNumber={2}
            onNext={() => {
              if (
                !formData.firstName ||
                !formData.lastName ||
                !formData.email ||
                !formData.phone ||
                !formData.wilaya ||
                !formData.dob ||
                !formData.university ||
                !formData.fos ||
                !formData.yos
              ) {
                setError("Please fill in all required fields");
                return;
              }

              nextStep();
            }}
            onPrevious={prevStep}
            isLastStep={false}
          >
            <MemberInformationsDetails
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </Step>

          <Step
            isActive={step === 3}
            stepNumber={3}
            onNext={() => {
              const reactEvent = {
                preventDefault: () => {},
              } as React.FormEvent;
              handleSubmit(reactEvent);
            }}
            onPrevious={prevStep}
            isLastStep={true}
          >
            <div className="flex flex-col gap-8">
              <div>
                <label className="block text-zinc-900 mb-2 font-medium tracking-[0.03em] uppercase text-xs">
                  Rate your programming skill <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <RadioButton
                      key={level}
                      name="programmingSkill"
                      value={level}
                      checked={formData.programmingSkill === level}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          programmingSkill: e.target.value,
                        }))
                      }
                      label={level}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-zinc-900 mb-2 font-medium tracking-[0.03em] uppercase text-xs">
                  Rate your electronics skill <span className="text-red-500">*</span>
                </label>

                <div className="flex gap-4">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <RadioButton
                      key={level}
                      name="electronicsSkill"
                      value={level}
                      checked={formData.electronicsSkill === level}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          electronicsSkill: e.target.value,
                        }))
                      }
                      label={level}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-zinc-900 mb-2 font-medium tracking-[0.03em] uppercase text-xs">
                  Rate your mechanical skill <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <RadioButton
                      key={level}
                      name="mechanicalSkill"
                      value={level}
                      checked={formData.mechanicalSkill === level}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          mechanicalSkill: e.target.value,
                        }))
                      }
                      label={level}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-zinc-900 mb-2 font-medium tracking-[0.03em] uppercase text-xs">
                  What motivated you to participate in POLYMAZE?
                  <span className="text-red-500">*</span>
                </label>
                <Textarea
                  className="bg-white border border-zinc-200 text-zinc-900"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      motivation: e.target.value,
                    }))
                  }
                  placeholder="Write your Motivation here."
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-900 mb-2 font-medium tracking-[0.03em] uppercase text-xs">
                  How did you hear about our competition?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col gap-4">
                  {[
                    "Through our social media platforms",
                    "TV/Radio",
                    "Through a friend",
                    "Other",
                  ].map((option) => (
                    <RadioButton
                      key={option}
                      name="howHeard"
                      value={option}
                      checked={formData.howHeard === option}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          howHeard: e.target.value,
                        }))
                      }
                      label={option}
                    />
                  ))}
                </div>
                {formData.howHeard === "Other" && (
                  <div className="mt-6">
                    <FieldInput
                      id="howHeardOther"
                      name="howHeardOther"
                      label="Please specify other source"
                      value={formData.howHeardOther}
                      onChange={handleInputChange}
                      placeholder="Write the other source here."
                      required={formData.howHeard === "Other"}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-zinc-900 mb-2 font-medium tracking-[0.03em] uppercase text-xs">
                  Have you participated in any robotics competitions before?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <RadioButton
                    name="participatedBefore"
                    value="Yes"
                    checked={formData.participatedBefore === "Yes"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        participatedBefore: e.target.value,
                      }))
                    }
                    label="Yes"
                  />
                  <RadioButton
                    name="participatedBefore"
                    value="No"
                    checked={formData.participatedBefore === "No"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        participatedBefore: e.target.value,
                      }))
                    }
                    label="No"
                  />
                </div>
                {formData.participatedBefore === "Yes" && (
                  <div className="mt-3">
                    <label className="block text-zinc-900 mb-2 font-medium tracking-[0.03em] uppercase text-xs">
                      Please provide details (competition name, year,
                      achievements, etc.) <span className="text-red-500">*</span>
                    </label>

                    <Textarea
                      className="bg-white border border-zinc-200 text-zinc-900"
                      name="previousCompetitionDetails"
                      value={formData.previousCompetitionDetails}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          previousCompetitionDetails: e.target.value,
                        }))
                      }
                      placeholder="e.g., ARC 2024 - 3rd Place"
                      required={formData.participatedBefore === "Yes"}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-zinc-900 mb-2 font-medium tracking-[0.03em] uppercase text-xs">
                  Do you have any formal training or education in robotics?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <RadioButton
                    name="formalRoboticsTraining"
                    value="Yes"
                    checked={formData.formalRoboticsTraining === "Yes"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        formalRoboticsTraining: e.target.value,
                      }))
                    }
                    label="Yes"
                  />
                  <RadioButton
                    name="formalRoboticsTraining"
                    value="No"
                    checked={formData.formalRoboticsTraining === "No"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        formalRoboticsTraining: e.target.value,
                      }))
                    }
                    label="No"
                  />
                </div>
                {formData.formalRoboticsTraining === "Yes" && (
                  <div className="mt-3">
                    <label className="block text-zinc-900 mb-2 font-medium tracking-[0.03em] uppercase text-xs">
                      Please specify the type of training or education{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      className="bg-white border border-zinc-200 text-zinc-900"
                      name="roboticsTrainingDetails"
                      value={formData.roboticsTrainingDetails}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          roboticsTrainingDetails: e.target.value,
                        }))
                      }
                      placeholder="e.g., Online Course, Workshop..."
                      required={formData.formalRoboticsTraining === "Yes"}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-zinc-900 mb-2 font-medium tracking-[0.03em] uppercase text-xs">
                  Is there anything else you would like to share or ask about
                  the competition?
                </label>

                <Textarea
                  className="bg-white border border-zinc-200 text-zinc-900"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      anythingElse: e.target.value,
                    }))
                  }
                  placeholder="Write any questions or remarks you have."
                />
              </div>
            </div>
          </Step>

          <Step
            isActive={step === 4}
            stepNumber={4}
            isLastStep={false}
            hideNavigation={true}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <div className="w-24 h-24 rounded-full bg-emerald-500 mx-auto flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </motion.div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl font-bold text-zinc-900 mb-4 tracking-[0.06em] uppercase"
              >
                Registration Complete!
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-zinc-900 mb-8 text-lg tracking-[0.02em]"
              >
                Thank you for registering for POLYMAZE. Your registration has
                been confirmed.
              </motion.p>
              {teamAction === "create" && formData.teamMembers !== "solo" && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white p-6 rounded-lg border border-zinc-200 mb-8 inline-block shadow-sm"
                >
                  <h3 className="text-zinc-900 text-xs mb-2 tracking-[0.2em] uppercase">
                    Your Team Code
                  </h3>
                  <p className="text-2xl font-mono font-bold text-zinc-900 tracking-wider">
                    {registeredTeamId}
                  </p>
                  <p className="text-zinc-900 text-xs mt-2 tracking-[0.02em]">
                    Keep this code safe - you need to give it to your teammates
                  </p>
                </motion.div>
              )}

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Link to="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-zinc-900 text-white py-3 px-8 rounded-lg font-medium tracking-[0.18em] uppercase"
                  >
                    Return to Home Page
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </Step>

          {error && (
            <div className="fixed bottom-4 right-4 z-50">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onAnimationComplete={() => {
                  setTimeout(() => {
                    setError("");
                  }, 7000);
                }}
              >
                <ErrorAlert message={error} />
              </motion.div>
            </div>
          )}
        </motion.form>
      </div>
    </div>
  );
}

const ErrorAlert = ({ message }: { message: string }) => {
  if (!message) return null;

  return (
    <Alert variant="destructive" className="mt-4 bg-white text-zinc-900 border border-red-200">
      <AlertCircle className="h-4 w-4 text-zinc-900" />
      <div>
        <AlertTitle className="text-zinc-900 tracking-[0.08em] uppercase text-xs">Error</AlertTitle>
        <AlertDescription className="text-zinc-900">{message}</AlertDescription>
      </div>
    </Alert>
  );
};

const FieldInput = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}: {
  id: string;
  name: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: React.HTMLInputTypeAttribute;
}) => (
  <div className="mb-6">
    <label
      htmlFor={id}
      className="block text-zinc-900 mb-2 font-medium tracking-[0.03em] uppercase text-xs"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full bg-white text-zinc-900 border border-zinc-900 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--cyan-neon)] focus:border-transparent"
    />
  </div>
);

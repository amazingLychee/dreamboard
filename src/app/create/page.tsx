// src/app/create/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import StepTime from "@/components/StepTime";
import StepDreams from "@/components/StepDreams";
import StepPersonal from "@/components/StepPersonal";
import LoadingScreen from "@/components/LoadingScreen";
import { DreamDetails } from "@/types";

const STEP_LABELS = ["Time Range", "Your Dreams", "Personal Touch"];

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form state
  const [time, setTime] = useState("");
  const [dreams, setDreams] = useState<string[]>([]);
  const [details, setDetails] = useState<Record<string, DreamDetails>>({});
  const [name, setName] = useState("");
  const [motto, setMotto] = useState("");
  const [addLabels, setAddLabels] = useState(true);

  const canNext = () => {
    if (step === 0) return !!time;
    if (step === 1) return dreams.length >= 2;
    return true;
  };

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          time,
          dreams,
          details,
          name,
          motto,
          addLabels,
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert("Generation failed: " + data.error);
        setLoading(false);
        return;
      }

      // Store result and navigate
      sessionStorage.setItem("dreamboard-result", JSON.stringify(data));
      router.push("/result");
    } catch (err) {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-db-cream to-db-cream-dark p-5">
      <div className="max-w-[600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {step === 0 ? (
            <Link
              href="/"
              className="flex items-center gap-1 text-text-sub text-sm font-medium hover:text-text-main transition-colors"
            >
              <ArrowLeft size={16} /> Home
            </Link>
          ) : (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1 text-text-sub text-sm font-medium hover:text-text-main transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <Sparkles size={18} className="text-amber-brand" />
            <span className="font-bold text-text-main text-[0.95rem]">
              DreamBoard.ai
            </span>
          </div>

          <div className="w-[60px]" />
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-2">
          {STEP_LABELS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-sm transition-all duration-300 ${
                i <= step ? "bg-amber-brand" : "bg-border"
              }`}
            />
          ))}
        </div>
        <div className="text-xs text-text-muted font-medium mb-7">
          Step {step + 1} of 3 · {STEP_LABELS[step]}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-7 shadow-lg shadow-amber-brand/5 min-h-[400px]">
          {step === 0 && <StepTime time={time} setTime={setTime} />}
          {step === 1 && (
            <StepDreams
              dreams={dreams}
              setDreams={setDreams}
              details={details}
              setDetails={setDetails}
            />
          )}
          {step === 2 && (
            <StepPersonal
              name={name}
              setName={setName}
              motto={motto}
              setMotto={setMotto}
              addLabels={addLabels}
              setAddLabels={setAddLabels}
            />
          )}
        </div>

        {/* Bottom button */}
        <div className="mt-5 pb-8">
          <button
            onClick={() => {
              if (step < 2) setStep((s) => s + 1);
              else handleGenerate();
            }}
            disabled={!canNext()}
            className={`w-full py-4 rounded-2xl font-bold text-[0.95rem] flex items-center justify-center gap-2 transition-all
              ${canNext()
                ? "bg-gradient-to-br from-amber-brand to-amber-dark text-white shadow-lg shadow-amber-brand/25 cursor-pointer hover:shadow-xl"
                : "bg-border text-white cursor-not-allowed"
              }`}
          >
            {step < 2 ? (
              <>
                Next <ChevronRight size={18} />
              </>
            ) : (
              <>✨ Generate My DreamBoard</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Step01 } from "@/app/components/Step01";
import { Step02 } from "@/app/components/Step02";
import { Step03 } from "@/app/components/Step03";
import { PlayerMatching } from "@/app/components/PlayerMatching";

interface FormData {
  plan: string;
  match_date: string;
  kickoff_time: string;
  location: string;
  home_team: string;
  away_team: string;
  video_url_1: string;
  video_url_2: string;
  formation: string;
  players: Array<{ name: string; position: string; number: string }>;
  substitutes: Array<{ name: string; position: string; number: string }>;
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPlayerMatching, setShowPlayerMatching] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    plan: "",
    match_date: "",
    kickoff_time: "",
    location: "",
    home_team: "",
    away_team: "",
    video_url_1: "",
    video_url_2: "",
    formation: "4-3-3",
    players: [],
    substitutes: [],
  });

  const handleFormUpdate = (data: FormData) => {
    setFormData(data);
  };

const handleSubmit = async () => {
  if (isSubmitting) return;

  const payload = {
    plan: formData.plan,
    match_date: formData.match_date,
    kickoff_time: formData.kickoff_time,
    location: formData.location,
    home_team: formData.home_team,
    away_team: formData.away_team,
    video_url_1: formData.video_url_1,
    video_url_2: formData.video_url_2,
    formation: formData.formation,
    players: formData.players,
    substitutes: formData.substitutes,
  };

  try {
    setIsSubmitting(true);

    const base = import.meta.env.VITE_API_BASE_URL || '';
    const res = await fetch(`${base}/submit-application`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || 'Submit failed');
    }

    setCurrentStep(3);
  } catch (e) {
    console.error(e);
    alert('접수에 실패했습니다. 잠시 후 다시 시도해주세요.');
  } finally {
    setIsSubmitting(false);
  }
};

  const handleComplete = () => {
    setFormData({
      plan: "",
      match_date: "",
      kickoff_time: "",
      location: "",
      home_team: "",
      away_team: "",
      video_url_1: "",
      video_url_2: "",
      formation: "4-3-3",
      players: [],
      substitutes: [],
    });
    setCurrentStep(1);
  };

  const steps = [
    { number: "01", label: "신청" },
    { number: "02", label: "검토" },
    { number: "03", label: "완료" },
  ];

  return (
    <div className="dark min-h-screen bg-white flex items-center justify-center">
      <div className="w-full h-screen max-w-[390px] max-h-[844px] bg-black text-white flex flex-col relative shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <button className="text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white">신청</h1>
          <div className="w-6" />
        </div>

        {/* Step Navigation */}
        <div className="flex border-b border-gray-800">
          {steps.map((step, index) => (
            <button
              key={step.number}
              onClick={() => {
                if (index + 1 <= currentStep) {
                  setCurrentStep(index + 1);
                }
              }}
              className={`flex-1 py-4 text-center border-b-2 transition-colors ${
                currentStep === index + 1
                  ? "border-[#FF8C00] text-[#FF8C00]"
                  : currentStep > index + 1
                  ? "border-transparent text-gray-400"
                  : "border-transparent text-gray-600"
              }`}
            >
              <div className="text-xs mb-1">{step.number}</div>
              <div className="text-sm">{step.label}</div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {currentStep === 1 && (
            <Step01
              formData={formData}
              onUpdate={handleFormUpdate}
              onNext={() => setCurrentStep(2)}
              onOpenPlayerMatching={() => setShowPlayerMatching(true)}
            />
          )}

          {currentStep === 2 && (
            <Step02 formData={formData} onBack={() => setCurrentStep(1)} onNext={handleSubmit} isSubmitting={isSubmitting} />
          )}

          {currentStep === 3 && <Step03 onComplete={handleComplete} />}
        </div>

        {/* Player Matching Modal */}
        {showPlayerMatching && (
          <PlayerMatching
            formData={formData}
            onUpdate={handleFormUpdate}
            onClose={() => setShowPlayerMatching(false)}
          />
        )}
      {/* ✅ Loading Overlay: 프레임 내부에 둬야 함 */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#0a0a1a] border border-gray-700 rounded-lg px-5 py-4 flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-gray-500 border-t-transparent animate-spin" />
              <div className="text-sm text-white">접수 중입니다. 잠시만 기다려주세요…</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

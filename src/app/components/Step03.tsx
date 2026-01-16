import { Check } from 'lucide-react';

interface Step03Props {
  onComplete: () => void;
}

export function Step03({ onComplete }: Step03Props) {
  return (
    <div className="flex flex-col h-full items-center justify-center px-4">
      <div className="flex flex-col items-center">
        {/* Check Icon */}
        <div className="w-24 h-24 bg-[#FF8C00] rounded-2xl flex items-center justify-center mb-8">
          <Check className="w-12 h-12 text-black" strokeWidth={3} />
        </div>

        {/* Title */}
        <h2 className="text-[#FF8C00] text-2xl mb-4">신청 완료</h2>

        {/* Description */}
        <div className="text-center mb-12">
          <p className="text-gray-400">열심히 분석하여</p>
          <p className="text-gray-400">알림으로 안내드릴게요!</p>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black border-t border-gray-800 max-w-[390px] mx-auto">
        <button
          onClick={onComplete}
          className="w-full bg-[#1a1a4a] text-white py-3 rounded-lg"
        >
          완료
        </button>
      </div>
    </div>
  );
}
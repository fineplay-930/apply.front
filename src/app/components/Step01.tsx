import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface Step01Props {
  formData: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onOpenPlayerMatching: () => void;
}

export function Step01({ formData, onUpdate, onNext, onOpenPlayerMatching }: Step01Props) {
  const plans = [
    { id: 'TEAM_DATA', name: '팀 데이터 리포트', desc: '사진/데이터 없이 경기 분석', price: '₩30,000' },
    { id: 'TEAM_INTEGRATED', name: '팀 통합 리포트', desc: '경기영상의 실명 선수 경기 통합분석', price: '₩60,000' }
  ];

  const handleInputChange = (field: string, value: string) => {
    onUpdate({ ...formData, [field]: value });
  };

  const canProceed = formData.plan && formData.match_date && formData.kickoff_time && 
                     formData.location && formData.home_team && formData.away_team &&
                     formData.video_url_1;

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {/* Plans */}
        <div className="mt-6">
          <div className="text-[#FF8C00] text-sm mb-3">1-1. 플랜 선택</div>
          <div className="grid grid-cols-2 gap-3">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => handleInputChange('plan', plan.id)}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  formData.plan === plan.id
                    ? 'border-[#8B7FFF] bg-[#8B7FFF]/10'
                    : 'border-gray-700 bg-[#1a1a1a]'
                }`}
              >
                <div className="text-white text-sm mb-1">{plan.name}</div>
                <div className="text-gray-400 text-xs mb-3">{plan.desc}</div>
                <div className="text-white">{plan.price}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Match Info */}
        <div className="mt-8">
          <div className="text-[#FF8C00] text-sm mb-3">1-2. 경기 정보 입력</div>
          <div className="space-y-3">
            <div>
              <label className="text-gray-400 text-xs block mb-2">날짜</label>
              <input
                type="date"
                value={formData.match_date || ''}
                onChange={(e) => handleInputChange('match_date', e.target.value)}
                className="w-full bg-[#0a0a1a] border border-gray-700 rounded px-3 py-2.5 text-white placeholder-gray-600 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-2">시간</label>
              <input
                type="time"
                value={formData.kickoff_time || ''}
                onChange={(e) => handleInputChange('kickoff_time', e.target.value)}
                className="w-full bg-[#0a0a1a] border border-gray-700 rounded px-3 py-2.5 text-white placeholder-gray-600 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-2">장소</label>
              <input
                type="text"
                placeholder="경기장 이름을 입력해주세요"
                value={formData.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full bg-[#0a0a1a] border border-gray-700 rounded px-3 py-2.5 text-white placeholder-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Team Info */}
        <div className="mt-8">
          <div className="text-[#FF8C00] text-sm mb-3">1-3. 팀/대표자 정보</div>
          <div className="space-y-3">
            <div>
              <label className="text-gray-400 text-xs block mb-2">Home</label>
              <input
                type="text"
                placeholder="홈팀 이름"
                value={formData.home_team || ''}
                onChange={(e) => handleInputChange('home_team', e.target.value)}
                className="w-full bg-[#0a0a1a] border border-gray-700 rounded px-3 py-2.5 text-white placeholder-gray-600"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-2">대표자 성함</label>
              <input
                type="text"
                placeholder="대표자 성함을 입력해주세요"
                value={formData.representative_name || ''}
                onChange={(e) => handleInputChange('representative_name', e.target.value)}
                className="w-full bg-[#0a0a1a] border border-gray-700 rounded px-3 py-2.5 text-white placeholder-gray-600"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-2">대표자 연락처</label>
              <input
                type="tel"
                placeholder="연락처를 입력해주세요"
                value={formData.representative_contact || ''}
                onChange={(e) => handleInputChange('representative_contact', e.target.value)}
                className="w-full bg-[#0a0a1a] border border-gray-700 rounded px-3 py-2.5 text-white placeholder-gray-600"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-2">Away</label>
              <input
                type="text"
                placeholder="원정팀 이름"
                value={formData.away_team || ''}
                onChange={(e) => handleInputChange('away_team', e.target.value)}
                className="w-full bg-[#0a0a1a] border border-gray-700 rounded px-3 py-2.5 text-white placeholder-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Video URLs */}
        <div className="mt-8">
          <div className="text-[#FF8C00] text-sm mb-3">1-4. 영상</div>
          <div className="space-y-3">
            <div>
              <label className="text-gray-400 text-xs block mb-2">비디오 1</label>
              <input
                type="text"
                placeholder="비디오 URL을 입력해주세요"
                value={formData.video_url_1 || ''}
                onChange={(e) => handleInputChange('video_url_1', e.target.value)}
                className="w-full bg-[#0a0a1a] border border-gray-700 rounded px-3 py-2.5 text-white placeholder-gray-600"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-2">비디오 2</label>
              <input
                type="text"
                placeholder="경기 영상 링크 입력(선택사항)"
                value={formData.video_url_2 || ''}
                onChange={(e) => handleInputChange('video_url_2', e.target.value)}
                className="w-full bg-[#0a0a1a] border border-gray-700 rounded px-3 py-2.5 text-white placeholder-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Player Matching Button */}
        <div className="mt-8">
          <div className="text-[#FF8C00] text-sm mb-3">1-5. 선수 매칭</div>
          <button
            onClick={onOpenPlayerMatching}
            className="w-full bg-[#0a0a1a] border border-gray-700 rounded px-4 py-3 flex items-center justify-between text-white"
          >
            <span className="text-sm">
              {(formData.players && formData.players.length > 0) || (formData.substitutes && formData.substitutes.length > 0)
                ? `${(formData.players?.length || 0) + (formData.substitutes?.length || 0)}명 등록됨`
                : '선수 매칭하기'}
            </span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Player Count Info */}
        <div className="mt-6 bg-[#0a0a1a] border border-gray-700 rounded px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">매칭 인원</span>
            <span className="text-white">
              {(formData.players?.length || 0) + (formData.substitutes?.length || 0)} / 18
            </span>
          </div>
          {((formData.players?.length || 0) + (formData.substitutes?.length || 0)) < 11 && (
            <div className="text-red-400 text-xs mt-2">*최소인원인 11명을 채워주세요</div>
          )}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black border-t border-gray-800">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`w-full py-3 rounded-lg ${
            canProceed
              ? 'bg-[#1a1a4a] text-white'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}
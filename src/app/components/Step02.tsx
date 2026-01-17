import { ChevronRight, X } from 'lucide-react';
import { useState } from 'react';

interface Step02Props {
  formData: any;
  onBack: () => void;
  onNext: () => void;
  isSubmitting?: boolean;
}

interface FormationPosition {
  row: number;
  col: number;
  label: string;
}

// YouTube 비디오 ID 추출 함수
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\/\s]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

// YouTube 썸네일 URL 생성 함수
function getYouTubeThumbnail(url: string): string | null {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

const formationLayouts: Record<string, FormationPosition[]> = {
  '4-3-3': [
    { row: 3, col: 2, label: 'GK' },
    { row: 2, col: 0.5, label: 'LB' },
    { row: 2, col: 1.5, label: 'CB' },
    { row: 2, col: 2.5, label: 'CB' },
    { row: 2, col: 3.5, label: 'RB' },
    { row: 1, col: 1, label: 'CM' },
    { row: 1, col: 2, label: 'CM' },
    { row: 1, col: 3, label: 'CM' },
    { row: 0, col: 1, label: 'LW' },
    { row: 0, col: 2, label: 'ST' },
    { row: 0, col: 3, label: 'RW' },
  ],
  '4-4-2': [
    { row: 3, col: 2, label: 'GK' },
    { row: 2, col: 0.5, label: 'LB' },
    { row: 2, col: 1.5, label: 'CB' },
    { row: 2, col: 2.5, label: 'CB' },
    { row: 2, col: 3.5, label: 'RB' },
    { row: 1, col: 0.5, label: 'LM' },
    { row: 1, col: 1.5, label: 'CM' },
    { row: 1, col: 2.5, label: 'CM' },
    { row: 1, col: 3.5, label: 'RM' },
    { row: 0, col: 1, label: 'ST' },
    { row: 0, col: 3, label: 'ST' },
  ],
  '3-5-2': [
    { row: 3, col: 2, label: 'GK' },
    { row: 2, col: 1, label: 'CB' },
    { row: 2, col: 2, label: 'CB' },
    { row: 2, col: 3, label: 'CB' },
    { row: 1, col: 0, label: 'LM' },
    { row: 1, col: 1, label: 'CM' },
    { row: 1, col: 2, label: 'CM' },
    { row: 1, col: 3, label: 'CM' },
    { row: 1, col: 4, label: 'RM' },
    { row: 0, col: 1, label: 'ST' },
    { row: 0, col: 3, label: 'ST' },
  ],
  '4-2-3-1': [
    { row: 3, col: 2, label: 'GK' },
    { row: 2, col: 0.5, label: 'LB' },
    { row: 2, col: 1.5, label: 'CB' },
    { row: 2, col: 2.5, label: 'CB' },
    { row: 2, col: 3.5, label: 'RB' },
    { row: 1.5, col: 1.3, label: 'CDM' },
    { row: 1.5, col: 2.7, label: 'CDM' },
    { row: 0.8, col: 1, label: 'LM' },
    { row: 0.8, col: 2, label: 'CAM' },
    { row: 0.8, col: 3, label: 'RM' },
    { row: 0, col: 2, label: 'ST' },
  ],
  '3-4-3': [
    { row: 3, col: 2, label: 'GK' },
    { row: 2, col: 1, label: 'CB' },
    { row: 2, col: 2, label: 'CB' },
    { row: 2, col: 3, label: 'CB' },
    { row: 1, col: 0, label: 'LM' },
    { row: 1, col: 1, label: 'CM' },
    { row: 1, col: 3, label: 'CM' },
    { row: 1, col: 4, label: 'RM' },
    { row: 0, col: 1, label: 'LW' },
    { row: 0, col: 2, label: 'ST' },
    { row: 0, col: 3, label: 'RW' },
  ],
};

export function Step02({ formData, onBack, onNext }: Step02Props) {
  const [isAgreed, setIsAgreed] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [isRefundConfirmed, setIsRefundConfirmed] = useState(false);

  const plans = {
    TEAM_DATA: '팀 데이터 리포트',
    TEAM_INTEGRATED: '팀 통합 리포트'
  };

  const prices = {
    TEAM_DATA: '₩30,000',
    TEAM_INTEGRATED: '₩60,000'
  };

  const currentLayout = formData.formation ? formationLayouts[formData.formation as keyof typeof formationLayouts] : null;

  const canSubmit = isPaymentConfirmed && isRefundConfirmed && isAgreed;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="mt-6 space-y-6">
          {/* Plan */}
          <div>
            <div className="text-gray-400 text-xs mb-2">플랜</div>
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white">{plans[formData.plan as keyof typeof plans]}</div>
                  <div className="text-gray-400 text-sm mt-1">{formData.plan}</div>
                </div>
                <div className="text-white">{prices[formData.plan as keyof typeof prices]}</div>
              </div>
            </div>
          </div>

          {/* Match Info */}
          <div>
            <div className="text-gray-400 text-xs mb-2">경기 정보</div>
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">날짜</span>
                <span className="text-white">{formData.match_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">킥오프</span>
                <span className="text-white">{formData.kickoff_time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">장소</span>
                <span className="text-white">{formData.location}</span>
              </div>
            </div>
          </div>

          {/* Teams */}
          <div>
            <div className="text-gray-400 text-xs mb-2">팀/대표자 정보</div>
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Home</span>
                <span className="text-white">{formData.home_team}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">대표자 성함</span>
                <span className="text-white">{formData.representative_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">대표자 연락처</span>
                <span className="text-white">{formData.representative_contact}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Away</span>
                <span className="text-white">{formData.away_team}</span>
              </div>
            </div>
          </div>

          {/* Video URLs */}
          <div>
            <div className="text-gray-400 text-xs mb-2">URL</div>
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 space-y-4">
              <div>
                <div className="text-gray-400 text-xs mb-2">비디오 1</div>
                {getYouTubeThumbnail(formData.video_url_1) ? (
                  <div className="relative rounded overflow-hidden">
                    <img 
                      src={getYouTubeThumbnail(formData.video_url_1)!} 
                      alt="YouTube Thumbnail"
                      className="w-full h-auto object-cover"
                      onError={(e) => {
                        // 썸네일 로드 실패시 fallback
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden bg-[#2a2a2a] rounded p-3 h-24 flex items-center justify-center">
                      <div className="text-gray-500 text-sm truncate px-2">{formData.video_url_1}</div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#2a2a2a] rounded p-3 h-24 flex items-center justify-center">
                    <div className="text-gray-500 text-sm truncate px-2">{formData.video_url_1}</div>
                  </div>
                )}
              </div>
              {formData.video_url_2 && (
                <div>
                  <div className="text-gray-400 text-xs mb-2">비디오 2</div>
                  {getYouTubeThumbnail(formData.video_url_2) ? (
                    <div className="relative rounded overflow-hidden">
                      <img 
                        src={getYouTubeThumbnail(formData.video_url_2)!} 
                        alt="YouTube Thumbnail"
                        className="w-full h-auto object-cover"
                        onError={(e) => {
                          // 썸네일 로드 실패시 fallback
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden bg-[#2a2a2a] rounded p-3 h-24 flex items-center justify-center">
                        <div className="text-gray-500 text-sm truncate px-2">{formData.video_url_2}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#2a2a2a] rounded p-3 h-24 flex items-center justify-center">
                      <div className="text-gray-500 text-sm truncate px-2">{formData.video_url_2}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Formation & Players */}
          <div>
            <div className="text-gray-400 text-xs mb-2">포메이션 정보</div>
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
              <div className="text-white mb-4">포메이션: {formData.formation || '없음'}</div>
              
              {/* Mini Soccer Field */}
              {currentLayout && formData.players && formData.players.length > 0 && (
                <div className="relative bg-gradient-to-b from-[#4CAF50] to-[#66BB6A] rounded-lg p-4 aspect-[3/4] mb-4">
                  {/* Field markings */}
                  <div className="absolute inset-4 border-2 border-white/30 rounded" />
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-10 border-2 border-white/30 rounded-t" />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-10 border-2 border-white/30 rounded-b" />
                  <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/30" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-white/30 rounded-full" />

                  {/* Formation Display */}
                  <div className="absolute inset-0 p-4">
                    <div className="relative h-full">
                      {formData.players.map((player: any, index: number) => {
                        if (index >= currentLayout.length) return null;
                        const pos = currentLayout[index];
                        const rowSpan = 3;
                        const colSpan = 4;
                        
                        return (
                          <div
                            key={index}
                            className="absolute bg-[#1a1a4a] text-white rounded p-1.5 text-[10px] text-center min-w-[40px]"
                            style={{
                              top: `${((pos.row / rowSpan) * 80) + 10}%`,
                              left: `${((pos.col / colSpan) * 80) + 10}%`,
                              transform: 'translate(-50%, -50%)',
                            }}
                          >
                            <div className="text-[#FF8C00]">{player.number}</div>
                            <div className="truncate text-[9px]">{player.name}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="text-gray-400 text-sm mb-3">
                등록된 선수: {formData.players ? formData.players.length : 0}명
              </div>
              
              {/* Substitutes Display */}
              {formData.substitutes && formData.substitutes.length > 0 && (
                <div>
                  <div className="text-gray-400 text-xs mb-2">교체 선수 ({formData.substitutes.length})</div>
                  <div className="grid grid-cols-7 gap-2">
                    {formData.substitutes.map((sub: any, index: number) => (
                      <div
                        key={index}
                        className="aspect-square rounded bg-[#1a1a4a] text-white text-[10px] flex flex-col items-center justify-center"
                      >
                        <div className="text-[#FF8C00] text-xs">{sub.number}</div>
                        <div className="truncate text-[8px] w-full px-1 text-center">{sub.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 결제 안내 */}
          <div>
            <div className="text-gray-400 text-xs mb-2">결제 안내</div>
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 space-y-3">
              <div className="text-sm space-y-2">
                <div className="text-gray-300">
                  <span className="text-white">결제 방식:</span> 계좌이체
                </div>
                <div className="text-gray-300">
                  <span className="text-white">입금 계좌:</span> 신한은행 110-513-974027
                </div>
                <div className="text-gray-300">
                  <span className="text-white">예금주:</span> 대표자 이용근 (Fine Play)
                </div>
                <div className="text-gray-300">
                  <span className="text-white">입금 기한:</span> 신청 후 24시간 이내
                </div>
                <div className="text-[#FF8C00] text-xs mt-3">
                  • 입금 확인 후 분석이 진행됩니다.
                </div>
                <div className="text-[#FF8C00] text-xs">
                  • 미입금 시 신청은 자동 취소됩니다.
                </div>
              </div>
              <div className="pt-3 border-t border-gray-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPaymentConfirmed}
                    onChange={(e) => setIsPaymentConfirmed(e.target.checked)}
                    className="w-4 h-4 accent-[#FF8C00] cursor-pointer"
                  />
                  <span className="text-white text-sm">[필수] 확인했습니다</span>
                </label>
              </div>
            </div>
          </div>

          {/* 환불 안내 */}
          <div>
            <div className="text-gray-400 text-xs mb-2">환불 안내</div>
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 space-y-3">
              <div className="text-sm space-y-2">
                <div className="text-gray-300">
                  • 분석 시작 전 취소 시 <span className="text-white">전액 환불</span>
                </div>
                <div className="text-gray-300">
                  • 분석 개시 후에는 <span className="text-white">환불이 불가</span>합니다.
                </div>
                <div className="text-[#FF8C00] text-xs mt-3">
                  • 환불문의는 fineplay 카카오톡 플러스 친구로 진행해주세요
                </div>
              </div>
              <div className="pt-3 border-t border-gray-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRefundConfirmed}
                    onChange={(e) => setIsRefundConfirmed(e.target.checked)}
                    className="w-4 h-4 accent-[#FF8C00] cursor-pointer"
                  />
                  <span className="text-white text-sm">[필수] 확인했습니다</span>
                </label>
              </div>
            </div>
          </div>

          {/* 동의란 */}
          <div>
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[#FF8C00] cursor-pointer"
                />
                <div className="flex-1">
                  <div className="text-white text-sm">
                    [필수] 서비스 관련 안내 사항에 동의합니다.
                  </div>
                  <button
                    onClick={onNext}
                    disabled={!!isSubmitting}
                    className={`w-full py-3 rounded-lg ${
                        isSubmitting ? "bg-gray-800 text-gray-500" : "bg-[#1a1a4a] text-white"
                    }`}
                  >
                    {isSubmitting ? "접수 중..." : "신청 확정"}
                  </button>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Modal */}
      {showDisclaimerModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a1a] border border-gray-700 rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-white">서비스 관련 안내 사항</h3>
              <button
                onClick={() => setShowDisclaimerModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-300 space-y-4">
              <p>
                본인은 본 서비스 이용을 위해 입력한 모든 정보가 사실이며,
                경기 정보, 선수 정보, 영상 URL 등 입력 내용의 정확성에 대한 책임은
                이용자 본인에게 있음을 확인합니다.
              </p>
              <p>
                입력된 정보의 오류, 누락, 불일치 또는
                제공된 영상의 화질·각도·길이 등 촬영 환경으로 인해
                분석 결과의 일부 정확도가 저하되거나
                분석이 제한될 수 있음에 동의합니다.
              </p>
              <p>
                본 서비스는 입력된 정보 및 제공된 영상 데이터를 기반으로
                AI 분석을 제공하는 서비스로,
                입력 정보의 오류로 발생한 분석 결과의 해석 차이 또는
                기대와의 불일치에 대하여 Fine Play는 책임을 지지 않습니다.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={() => setShowDisclaimerModal(false)}
                className="w-full py-3 bg-[#1a1a4a] text-white rounded-lg"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Buttons */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black border-t border-gray-800 max-w-[390px] mx-auto">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onBack}
            className="py-3 rounded-lg border border-gray-700 text-white"
          >
            이전
          </button>
          <button
            onClick={onNext}
            disabled={!canSubmit}
            className={`py-3 rounded-lg text-white transition-opacity ${
              canSubmit 
                ? 'bg-[#1a1a4a] cursor-pointer' 
                : 'bg-[#1a1a4a]/40 cursor-not-allowed'
            }`}
          >
            신청 확정
          </button>
        </div>
      </div>
    </div>
  );
}
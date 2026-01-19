import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Plus, Search, Trash2, X } from 'lucide-react';

interface Player {
  name: string;
  position: string;
  number: string;
}

interface PlayerMatchingProps {
  formData: any;
  onUpdate: (data: any) => void;
  onClose: () => void;
}

interface FormationPosition {
  row: number;
  col: number;
  label: string;
}

const formationLayouts: Record<string, FormationPosition[]> = {
  '4-3-3': [
    // GK
    { row: 3, col: 2, label: 'GK' },
    // Defense (4)
    { row: 2, col: 0.5, label: 'LB' },
    { row: 2, col: 1.5, label: 'CB' },
    { row: 2, col: 2.5, label: 'CB' },
    { row: 2, col: 3.5, label: 'RB' },
    // Midfield (3)
    { row: 1, col: 1, label: 'CM' },
    { row: 1, col: 2, label: 'CM' },
    { row: 1, col: 3, label: 'CM' },
    // Forward (3)
    { row: 0, col: 1, label: 'LW' },
    { row: 0, col: 2, label: 'ST' },
    { row: 0, col: 3, label: 'RW' },
  ],
  '4-4-2': [
    // GK
    { row: 3, col: 2, label: 'GK' },
    // Defense (4)
    { row: 2, col: 0.5, label: 'LB' },
    { row: 2, col: 1.5, label: 'CB' },
    { row: 2, col: 2.5, label: 'CB' },
    { row: 2, col: 3.5, label: 'RB' },
    // Midfield (4)
    { row: 1, col: 0.5, label: 'LM' },
    { row: 1, col: 1.5, label: 'CM' },
    { row: 1, col: 2.5, label: 'CM' },
    { row: 1, col: 3.5, label: 'RM' },
    // Forward (2)
    { row: 0, col: 1, label: 'ST' },
    { row: 0, col: 3, label: 'ST' },
  ],
  '3-5-2': [
    // GK
    { row: 3, col: 2, label: 'GK' },
    // Defense (3)
    { row: 2, col: 1, label: 'CB' },
    { row: 2, col: 2, label: 'CB' },
    { row: 2, col: 3, label: 'CB' },
    // Midfield (5)
    { row: 1, col: 0, label: 'LM' },
    { row: 1, col: 1, label: 'CM' },
    { row: 1, col: 2, label: 'CM' },
    { row: 1, col: 3, label: 'CM' },
    { row: 1, col: 4, label: 'RM' },
    // Forward (2)
    { row: 0, col: 1, label: 'ST' },
    { row: 0, col: 3, label: 'ST' },
  ],
  '4-2-3-1': [
    // GK
    { row: 3, col: 2, label: 'GK' },
    // Defense (4)
    { row: 2, col: 0.5, label: 'LB' },
    { row: 2, col: 1.5, label: 'CB' },
    { row: 2, col: 2.5, label: 'CB' },
    { row: 2, col: 3.5, label: 'RB' },
    // Defensive Mid (2)
    { row: 1.5, col: 1.3, label: 'CDM' },
    { row: 1.5, col: 2.7, label: 'CDM' },
    // Attacking Mid (3)
    { row: 0.8, col: 1, label: 'LM' },
    { row: 0.8, col: 2, label: 'CAM' },
    { row: 0.8, col: 3, label: 'RM' },
    // Forward (1)
    { row: 0, col: 2, label: 'ST' },
  ],
  '3-4-3': [
    // GK
    { row: 3, col: 2, label: 'GK' },
    // Defense (3)
    { row: 2, col: 1, label: 'CB' },
    { row: 2, col: 2, label: 'CB' },
    { row: 2, col: 3, label: 'CB' },
    // Midfield (4)
    { row: 1, col: 0, label: 'LM' },
    { row: 1, col: 1, label: 'CM' },
    { row: 1, col: 3, label: 'CM' },
    { row: 1, col: 4, label: 'RM' },
    // Forward (3)
    { row: 0, col: 1, label: 'LW' },
    { row: 0, col: 2, label: 'ST' },
    { row: 0, col: 3, label: 'RW' },
  ],
};

export function PlayerMatching({ formData, onUpdate, onClose }: PlayerMatchingProps) {
  const [formation, setFormation] = useState(formData.formation || '4-3-3');
  const [players, setPlayers] = useState<(Player | null)[]>(
    formData.players && formData.players.length === 11 
      ? formData.players 
      : Array(11).fill(null)
  );
  const [substitutes, setSubstitutes] = useState<(Player | null)[]>(
    formData.substitutes && Array.isArray(formData.substitutes) && formData.substitutes.length > 0
      ? [...formData.substitutes, ...Array(Math.max(0, 7 - formData.substitutes.length)).fill(null)]
      : Array(7).fill(null)
  );
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [selectedSubIndex, setSelectedSubIndex] = useState<number | null>(null);
  const [newPlayer, setNewPlayer] = useState({ name: '', position: '', number: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const formations = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1', '3-4-3'];

  const handleFormationChange = (newFormation: string) => {
    setFormation(newFormation);
    // Reset players array to match new formation
    setPlayers(Array(11).fill(null));
  };

  const handlePositionClick = (index: number) => {
    setSelectedPosition(index);
    setSelectedSubIndex(null);
    const currentPlayer = players[index];
    if (currentPlayer) {
      setNewPlayer(currentPlayer);
    } else {
      const positionLabel = formationLayouts[formation][index].label;
      setNewPlayer({ name: '', position: positionLabel, number: '' });
    }
  };

  const handleSubstituteClick = (index: number) => {
    setSelectedSubIndex(index);
    setSelectedPosition(null);
    const currentSub = substitutes[index];
    if (currentSub) {
      setNewPlayer(currentSub);
    } else {
      setNewPlayer({ name: '', position: 'SUB', number: '' });
    }
  };

  const handleAddPlayer = () => {
    if (newPlayer.name && newPlayer.number) {
      if (selectedPosition !== null) {
        const updatedPlayers = [...players];
        updatedPlayers[selectedPosition] = { ...newPlayer };
        setPlayers(updatedPlayers);
        setSelectedPosition(null);
      } else if (selectedSubIndex !== null) {
        const updatedSubs = [...substitutes];
        updatedSubs[selectedSubIndex] = { ...newPlayer };
        setSubstitutes(updatedSubs);
        setSelectedSubIndex(null);
      }
      setNewPlayer({ name: '', position: '', number: '' });
    }
  };

  const handleDeletePlayer = (index: number) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = null;
    setPlayers(updatedPlayers);
  };

  const handleDeleteSubstitute = (index: number) => {
    const updatedSubs = [...substitutes];
    updatedSubs[index] = null;
    setSubstitutes(updatedSubs);
  };

  const handleSave = () => {
    // Filter out null values and save
    const filledPlayers = players.filter((p): p is Player => p !== null);
    const filledSubs = substitutes.filter((p): p is Player => p !== null);
    
    // Minimum 11 players required
    if (filledPlayers.length < 11) {
      alert('최소 11명의 선수를 등록해야 합니다.');
      return;
    }
    
    onUpdate({ ...formData, formation, players: filledPlayers, substitutes: filledSubs });
    onClose();
  };

  const filledPlayers = players.filter((p): p is Player => p !== null);
  const filledSubs = substitutes.filter((p): p is Player => p !== null);
  const allPlayers = [...filledPlayers, ...filledSubs];
  const filteredPlayers = allPlayers.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentLayout = formationLayouts[formation];

  // refs for scroll and controls to ensure visibility on mobile browsers
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sc = scrollRef.current;
    const hdr = headerRef.current;
    const bot = bottomRef.current;
    if (!sc) return;

    const extraOffset = document.documentElement.classList.contains('ios-chrome') ? 24 : 8;

    const ensureVisible = (el: HTMLElement | null) => {
      if (!el || !sc) return;
      const scRect = sc.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();

      // if element top is above visible area, scroll up
      if (elRect.top < scRect.top + extraOffset) {
        const delta = elRect.top - (scRect.top + extraOffset);
        sc.scrollBy({ top: delta, behavior: 'smooth' });
        return;
      }

      // if element bottom is below visible area, scroll down
      if (elRect.bottom > scRect.bottom - extraOffset) {
        const delta = elRect.bottom - (scRect.bottom - extraOffset);
        sc.scrollBy({ top: delta, behavior: 'smooth' });
      }
    };

    // try to ensure header and bottom are visible after layout
    const t1 = window.setTimeout(() => ensureVisible(hdr), 120);
    const t2 = window.setTimeout(() => ensureVisible(bot), 240);

    const onResize = () => {
      ensureVisible(hdr);
      ensureVisible(bot);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="fp-frame bg-black flex flex-col shadow-2xl w-full h-full max-w-[390px] max-h-[844px] overflow-hidden">
        {/* Header */}
        <div ref={headerRef} className="flex items-center justify-between p-4 border-b border-gray-800">
          <button onClick={onClose} className="text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-white">선수 매칭</h2>
          <div className="w-6" />
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto pb-24">
          {/* Formation Selector */}
          <div className="p-4">
            <div className="text-gray-400 text-sm mb-3">포메이션 선택</div>
            <select
              value={formation}
              onChange={(e) => handleFormationChange(e.target.value)}
              className="w-full bg-[#0a0a1a] border border-gray-700 rounded px-3 py-2.5 text-white"
            >
              {formations.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            
            {/* Player Counts */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-[#0a0a1a] border border-gray-700 rounded px-3 py-2">
                <div className="text-gray-400 text-xs mb-1">선발 선수</div>
                <div className="text-white text-lg">
                  {filledPlayers.length} <span className="text-gray-400 text-sm">/ 11</span>
                </div>
              </div>
              <div className="bg-[#0a0a1a] border border-gray-700 rounded px-3 py-2">
                <div className="text-gray-400 text-xs mb-1">교체 선수</div>
                <div className="text-white text-lg">
                  {filledSubs.length} <span className="text-gray-400 text-sm">/ 7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Soccer Field Visual */}
          <div className="mx-4 mb-4">
            <div className="relative bg-gradient-to-b from-[#4CAF50] to-[#66BB6A] rounded-lg p-4 aspect-[3/4]">
              {/* Field markings */}
              <div className="absolute inset-4 border-2 border-white/30 rounded" />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-12 border-2 border-white/30 rounded-t" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-12 border-2 border-white/30 rounded-b" />
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/30" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/30 rounded-full" />

              {/* Formation Display */}
              <div className="absolute inset-0 p-4">
                <div className="relative h-full grid grid-rows-4 gap-1">
                  {currentLayout.map((pos, index) => {
                    const player = players[index];
                    const rowSpan = 3;
                    const colSpan = 4;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handlePositionClick(index)}
                        className={`absolute ${
                          player ? 'bg-[#1a1a4a]' : 'bg-white/20 border-2 border-dashed border-white/40'
                        } text-white rounded p-1.5 text-[10px] text-center min-w-[45px] transition-all hover:scale-110`}
                        style={{
                          top: `${((pos.row / rowSpan) * 80) + 10}%`,
                          left: `${((pos.col / colSpan) * 80) + 10}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        {player ? (
                          <>
                            <div className="text-[#FF8C00] mb-0.5">{player.number}</div>
                            <div className="truncate text-[9px]">{player.name}</div>
                          </>
                        ) : (
                          <>
                            <div className="text-white/60 mb-0.5">+</div>
                            <div className="text-white/60 text-[8px]">{pos.label}</div>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Add Player Modal/Section */}
          {(selectedPosition !== null || selectedSubIndex !== null) && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 w-full max-w-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white">
                    {players[selectedPosition] ? '선수 수정' : '선수 추가'}
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedPosition(null);
                      setSelectedSubIndex(null);
                      setNewPlayer({ name: '', position: '', number: '' });
                    }}
                    className="text-gray-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-gray-400 text-xs block mb-2">포지션</label>
                    <input
                      type="text"
                      value={newPlayer.position}
                      readOnly
                      className="w-full bg-[#0a0a1a] border border-gray-700 rounded px-3 py-2 text-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs block mb-2">선수 이름</label>
                    <input
                      type="text"
                      placeholder="이름을 입력하세요"
                      value={newPlayer.name}
                      onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                      className="w-full bg-[#0a0a1a] border border-gray-700 rounded px-3 py-2 text-white text-sm placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs block mb-2">등번호</label>
                    <input
                      type="text"
                      placeholder="번호를 입력하세요"
                      value={newPlayer.number}
                      onChange={(e) => setNewPlayer({ ...newPlayer, number: e.target.value })}
                      className="w-full bg-[#0a0a1a] border border-gray-700 rounded px-3 py-2 text-white text-sm placeholder-gray-600"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  {selectedPosition !== null && players[selectedPosition] && (
                    <button
                      onClick={() => {
                        handleDeletePlayer(selectedPosition);
                        setSelectedPosition(null);
                        setNewPlayer({ name: '', position: '', number: '' });
                      }}
                      className="flex-1 py-2.5 rounded-lg border border-red-500 text-red-500"
                    >
                      삭제
                    </button>
                  )}
                  {selectedSubIndex !== null && substitutes[selectedSubIndex] && (
                    <button
                      onClick={() => {
                        handleDeleteSubstitute(selectedSubIndex);
                        setSelectedSubIndex(null);
                        setNewPlayer({ name: '', position: '', number: '' });
                      }}
                      className="flex-1 py-2.5 rounded-lg border border-red-500 text-red-500"
                    >
                      삭제
                    </button>
                  )}
                  <button
                    onClick={handleAddPlayer}
                    disabled={!newPlayer.name || !newPlayer.number}
                    className={`flex-1 py-2.5 rounded-lg ${
                      newPlayer.name && newPlayer.number
                        ? 'bg-[#1a1a4a] text-white'
                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {(selectedPosition !== null && players[selectedPosition]) || (selectedSubIndex !== null && substitutes[selectedSubIndex]) ? '수정' : '추가'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Substitutes Section */}
          <div className="px-4 mb-6">
            <div className="text-gray-400 text-sm mb-3">교체 선수</div>
            <div className="grid grid-cols-7 gap-2">
              {substitutes.map((sub, index) => (
                <button
                  key={index}
                  onClick={() => handleSubstituteClick(index)}
                  className={`aspect-square rounded ${
                    sub ? 'bg-[#1a1a4a]' : 'bg-gray-800 border-2 border-dashed border-gray-600'
                  } text-white text-[10px] flex flex-col items-center justify-center transition-all hover:scale-105`}
                >
                  {sub ? (
                    <>
                      <div className="text-[#FF8C00] text-xs">{sub.number}</div>
                      <div className="truncate text-[8px] w-full px-1 text-center">{sub.name}</div>
                    </>
                  ) : (
                    <Plus className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Total Player Count */}
          <div className="px-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-white">매칭 인원</span>
              <span className="text-white">
                {filledPlayers.length + filledSubs.length} / 18
                {filledPlayers.length < 11 && (
                  <span className="text-orange-400 text-xs ml-2">* 최소 11명의 선발 선수가 필요합니다</span>
                )}
              </span>
            </div>
          </div>

          {/* Player List */}
          <div className="px-4 mt-6">
            <div className="text-gray-400 text-sm mb-3">선수 목록</div>
            
            {/* Search */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="선수 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0a0a1a] border border-gray-700 rounded px-3 py-2 pl-10 text-white text-sm placeholder-gray-600"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>

            <div className="space-y-2">
              {filteredPlayers.map((player, index) => {
                // Find the actual position index in the players array
                const actualIndex = players.findIndex(p => p === player);
                
                return (
                  <div
                    key={index}
                    className="bg-[#0a0a1a] border border-gray-700 rounded px-4 py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-[#4CAF50] text-white rounded px-2 py-1 text-xs min-w-[40px] text-center">
                        {player.number}
                      </div>
                      <div>
                        <div className="text-white text-sm">{player.name}</div>
                        <div className="text-gray-400 text-xs">{player.position}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeletePlayer(actualIndex)}
                      className="text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Button */}
        <div ref={bottomRef} className="fp-bottom p-4 bg-black border-t border-gray-800 w-full">
          <button
            onClick={handleSave}
            className="w-full bg-[#1a1a4a] text-white py-4 rounded-lg text-sm"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
}
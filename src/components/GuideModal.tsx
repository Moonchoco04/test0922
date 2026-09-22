import { X, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuideModal({ isOpen, onClose }: GuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-stone-200">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-stone-900">비즈니스 메일 에티켓 가이드</h3>
            </div>
            <button
              type="button"
              id="close-guide-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-4 text-xs text-stone-700 leading-relaxed max-h-[70vh] overflow-y-auto pr-1">
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-stone-900 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>1. 제목은 대괄호 [말머리]로 용건을 명확히</span>
              </div>
              <p className="text-stone-600">
                수신자가 수많은 메일 속에서도 한눈에 파악할 수 있도록 <strong>[요청]</strong>, <strong>[안내]</strong>, <strong>[일정 조율]</strong>, <strong>[회신]</strong> 등의 말머리를 붙이고 핵심 용건을 작성합니다.
              </p>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-stone-900 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>2. 두괄식 전개와 명확한 행동 요청(Call to Action)</span>
              </div>
              <p className="text-stone-600">
                인사말 직후 메일을 보내는 목적을 먼저 밝히고, 상대방이 언제까지 무엇을 해주어야 하는지(기한 및 행동)를 명확한 일시와 함께 완곡하게 요청합니다.
              </p>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-stone-900 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>3. 거절 및 양해는 쿠션어(완곡한 표현) 사용</span>
              </div>
              <p className="text-stone-600">
                "안 됩니다", "불가능합니다" 대신 <em>"유감스럽게도 현재 일정상 지원이 어려운 점 너른 양해 부탁드립니다"</em> 또는 <em>"검토해주신 노고에 깊이 감사드리며, 차후 좋은 기회에 다시 뵙기를 희망합니다"</em>와 같이 정중히 거절합니다.
              </p>
            </div>

            <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-amber-900 text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>자주 실수하는 호칭 주의점</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-stone-700">
                <li>'과장님'에 이미 존칭이 포함되어 있으므로 '과장님 님'으로 쓰지 않습니다.</li>
                <li>타사 임직원에게는 직함 뒤에 '님'을 붙여 존중을 표합니다 (예: 김민우 팀장님).</li>
                <li>본인을 소개할 때는 직급 뒤에 '님'을 붙이지 않습니다 (예: 마케팅팀 홍길동 대리 드림).</li>
              </ul>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-100 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              확인했습니다
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

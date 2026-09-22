import { Mail, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export default function Header({ onOpenGuide, onOpenHistory, historyCount }: HeaderProps) {
  return (
    <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-xs">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-stone-900 tracking-tight">비즈니스 메일 정중 변환기</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-900">
                <Sparkles className="w-3 h-3 mr-1 text-amber-600" />
                AI 초안 생성
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              거친 메모나 짧은 메시지를 품격 있는 비즈니스 메일로 자동 변환합니다
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="open-history-btn"
            type="button"
            onClick={onOpenHistory}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            기록
            {historyCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-stone-200 text-stone-700 rounded-full text-[10px] font-semibold">
                {historyCount}
              </span>
            )}
          </button>
          <button
            id="open-guide-btn"
            type="button"
            onClick={onOpenGuide}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1" />
            작성 가이드
          </button>
        </div>
      </div>
    </header>
  );
}

import { X, Trash2, Clock, ArrowUpRight, Copy } from 'lucide-react';
import { GeneratedEmailResponse } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: GeneratedEmailResponse[];
  onSelect: (item: GeneratedEmailResponse) => void;
  onClearHistory: () => void;
  onToast: (msg: string) => void;
}

export default function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onSelect,
  onClearHistory,
  onToast,
}: HistoryDrawerProps) {
  if (!isOpen) return null;

  const handleCopy = async (item: GeneratedEmailResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`[제목] ${item.subject}\n\n${item.body}`);
      onToast('기록 내용이 복사되었습니다.');
    } catch {
      onToast('복사에 실패했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-stone-200 shadow-xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-stone-500" />
              <h2 className="text-sm font-bold text-stone-900">최근 생성 기록 ({history.length})</h2>
            </div>
            <div className="flex items-center space-x-2">
              {history.length > 0 && (
                <button
                  type="button"
                  id="clear-history-btn"
                  onClick={onClearHistory}
                  className="text-xs text-rose-600 hover:text-rose-700 flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>전체 삭제</span>
                </button>
              )}
              <button
                type="button"
                id="close-history-btn"
                onClick={onClose}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center text-stone-400 space-y-2">
                <Clock className="w-8 h-8 stroke-[1.5] text-stone-300" />
                <p className="text-xs">아직 생성된 메일 기록이 없습니다.</p>
                <p className="text-[11px] text-stone-400">메일을 생성하면 이곳에 자동으로 보관됩니다.</p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/20 cursor-pointer transition-all space-y-2 group shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full">
                      {item.tone === 'formal'
                        ? '격식체'
                        : item.tone === 'polite'
                        ? '부드러운 비즈니스'
                        : item.tone === 'concise'
                        ? '핵심 요약'
                        : '양해/사과'}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={(e) => handleCopy(item, e)}
                        className="p-1 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100"
                        title="복사하기"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <span className="text-[10px] text-stone-400">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xs font-semibold text-stone-900 line-clamp-1 group-hover:text-amber-900">
                    {item.subject}
                  </h3>
                  <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                    {item.body}
                  </p>
                  <div className="flex items-center text-[10px] text-stone-400 pt-1 border-t border-stone-100">
                    <span className="truncate flex-1">원문: {item.rawText}</span>
                    <ArrowUpRight className="w-3 h-3 text-stone-400 group-hover:text-amber-600 ml-1 shrink-0" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

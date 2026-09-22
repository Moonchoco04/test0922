import { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Send,
  Edit3,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  Columns,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { GeneratedEmailResponse } from '../types';

interface EmailResultCardProps {
  result: GeneratedEmailResponse;
  onRegenerate: () => void;
  isLoading: boolean;
  onToast: (msg: string) => void;
}

export default function EmailResultCard({
  result,
  onRegenerate,
  isLoading,
  onToast,
}: EmailResultCardProps) {
  const [activeTab, setActiveTab] = useState<'standard' | 'concise' | 'comparison'>('standard');
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Local editable state
  const [editableSubject, setEditableSubject] = useState(result.subject);
  const [editableBody, setEditableBody] = useState(result.body);

  // Sync when result changes
  useEffect(() => {
    setEditableSubject(result.subject);
    setEditableBody(activeTab === 'concise' ? result.conciseBody : result.body);
    setIsEditing(false);
  }, [result, activeTab]);

  const handleCopySubject = async () => {
    try {
      await navigator.clipboard.writeText(editableSubject);
      setCopiedSubject(true);
      onToast('메일 제목이 클립보드에 복사되었습니다.');
      setTimeout(() => setCopiedSubject(false), 2000);
    } catch {
      onToast('복사에 실패했습니다.');
    }
  };

  const handleCopyAll = async () => {
    try {
      const fullText = `[제목] ${editableSubject}\n\n${editableBody}`;
      await navigator.clipboard.writeText(fullText);
      setCopiedAll(true);
      onToast('메일 제목과 본문 전체가 복사되었습니다.');
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      onToast('복사에 실패했습니다.');
    }
  };

  const handleOpenMailClient = () => {
    const encodedSubject = encodeURIComponent(editableSubject);
    const encodedBody = encodeURIComponent(editableBody);
    window.location.href = `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden space-y-0">
      {/* Header bar with tabs & actions */}
      <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50/70 flex flex-wrap items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center space-x-1 bg-stone-200/70 p-1 rounded-xl">
          <button
            type="button"
            id="tab-standard-btn"
            onClick={() => {
              setActiveTab('standard');
              setEditableBody(result.body);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'standard'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 inline mr-1" />
            표준 정중본
          </button>
          <button
            type="button"
            id="tab-concise-btn"
            onClick={() => {
              setActiveTab('concise');
              setEditableBody(result.conciseBody);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'concise'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 inline mr-1 text-amber-500" />
            핵심 요약본
          </button>
          <button
            type="button"
            id="tab-comparison-btn"
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'comparison'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Columns className="w-3.5 h-3.5 inline mr-1" />
            원문 비교
          </button>
        </div>

        {/* Global actions */}
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            id="toggle-edit-mode-btn"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center space-x-1 ${
              isEditing
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? '수정 완료' : '직접 편집'}</span>
          </button>
          <button
            type="button"
            id="open-mail-client-btn"
            onClick={handleOpenMailClient}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors flex items-center space-x-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">메일 앱으로 보내기</span>
          </button>
          <button
            type="button"
            id="copy-all-btn"
            onClick={handleCopyAll}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors flex items-center space-x-1 shadow-xs"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? '복사됨!' : '전체 복사'}</span>
          </button>
        </div>
      </div>

      {/* Comparison Tab View */}
      {activeTab === 'comparison' ? (
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-500 uppercase">입력 원문 메모</span>
              <span className="text-[11px] text-stone-400">변환 전</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-700 whitespace-pre-wrap leading-relaxed font-mono">
              {result.rawText}
            </p>
          </div>

          <div className="border border-amber-200 rounded-xl p-4 bg-amber-50/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-900 uppercase">완성된 정중 메일</span>
              <span className="text-[11px] font-medium text-amber-700">비즈니스 격식체</span>
            </div>
            <div className="text-xs font-semibold text-stone-900 mb-2 pb-2 border-b border-amber-200/60">
              {editableSubject}
            </div>
            <p className="text-xs sm:text-sm text-stone-800 whitespace-pre-wrap leading-relaxed">
              {editableBody}
            </p>
          </div>
        </div>
      ) : (
        /* Standard or Concise Draft View */
        <div className="p-5 sm:p-6 space-y-4">
          {/* Subject Field */}
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="email-subject-field" className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                메일 제목
              </label>
              <button
                type="button"
                id="copy-subject-btn"
                onClick={handleCopySubject}
                className="text-xs text-stone-600 hover:text-stone-900 flex items-center space-x-1"
              >
                {copiedSubject ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedSubject ? '복사 완료' : '제목만 복사'}</span>
              </button>
            </div>
            {isEditing ? (
              <input
                id="email-subject-field"
                type="text"
                value={editableSubject}
                onChange={(e) => setEditableSubject(e.target.value)}
                className="w-full text-sm font-semibold text-stone-900 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            ) : (
              <div className="text-sm font-semibold text-stone-900 select-all">
                {editableSubject}
              </div>
            )}
          </div>

          {/* Body Field */}
          <div className="bg-stone-50/50 rounded-xl p-4 border border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                메일 본문
              </span>
              <span className="text-[11px] text-stone-400">
                {isEditing ? '직접 편집 중입니다' : '클릭하여 내용 선택 가능'}
              </span>
            </div>
            {isEditing ? (
              <textarea
                id="email-body-field"
                rows={12}
                value={editableBody}
                onChange={(e) => setEditableBody(e.target.value)}
                className="w-full text-sm text-stone-900 bg-white border border-stone-300 rounded-lg p-3 font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y"
              />
            ) : (
              <div
                id="email-body-display"
                className="text-sm text-stone-800 font-sans leading-relaxed whitespace-pre-wrap select-all bg-white p-4 rounded-lg border border-stone-100 shadow-2xs"
              >
                {editableBody}
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Insights & Etiquette Tip */}
      <div className="border-t border-stone-200 bg-stone-50/50 p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Highlights */}
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs">
          <div className="flex items-center space-x-2 text-stone-900 font-semibold text-xs mb-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>어떻게 개선되었나요? (변환 포인트)</span>
          </div>
          <ul className="space-y-1.5 text-xs text-stone-600 leading-relaxed">
            {result.highlights && result.highlights.length > 0 ? (
              result.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-stone-400">원문의 핵심을 살려 완곡하고 정중한 격식체로 다듬었습니다.</li>
            )}
          </ul>
        </div>

        {/* Etiquette Tip */}
        <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/80 shadow-2xs">
          <div className="flex items-center space-x-2 text-amber-900 font-semibold text-xs mb-2">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>비즈니스 에티켓 팁</span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed">
            {result.etiquetteTip || '메일 발송 전 수신인의 성함과 직함 표기를 다시 한번 확인하는 것이 좋습니다.'}
          </p>
          <div className="mt-3 pt-2 border-t border-amber-200/40 flex justify-end">
            <button
              type="button"
              id="regenerate-draft-btn"
              onClick={onRegenerate}
              disabled={isLoading}
              className="text-xs font-medium text-amber-800 hover:text-amber-950 flex items-center space-x-1 disabled:opacity-50"
            >
              <RotateCcw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>다른 스타일로 다시 생성</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

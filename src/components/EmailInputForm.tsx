import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, RotateCcw, ArrowRight } from 'lucide-react';
import { EmailTone, EmailRecipient, PresetSample } from '../types';
import ToneSelector from './ToneSelector';
import { PRESET_SAMPLES } from '../data/presets';

interface EmailInputFormProps {
  rawText: string;
  onChangeRawText: (val: string) => void;
  tone: EmailTone;
  onChangeTone: (tone: EmailTone) => void;
  recipient: EmailRecipient;
  onChangeRecipient: (recipient: EmailRecipient) => void;
  senderName: string;
  onChangeSenderName: (val: string) => void;
  recipientName: string;
  onChangeRecipientName: (val: string) => void;
  organization: string;
  onChangeOrganization: (val: string) => void;
  additionalContext: string;
  onChangeAdditionalContext: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function EmailInputForm({
  rawText,
  onChangeRawText,
  tone,
  onChangeTone,
  recipient,
  onChangeRecipient,
  senderName,
  onChangeSenderName,
  recipientName,
  onChangeRecipientName,
  organization,
  onChangeOrganization,
  additionalContext,
  onChangeAdditionalContext,
  onSubmit,
  isLoading,
}: EmailInputFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleApplyPreset = (sample: PresetSample) => {
    onChangeRawText(sample.rawText);
    onChangeTone(sample.tone);
    onChangeRecipient(sample.recipient);
    if (sample.recipientName) onChangeRecipientName(sample.recipientName);
    if (sample.senderName) onChangeSenderName(sample.senderName);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && rawText.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6 space-y-6">
      {/* Preset pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
            빠른 예시 불러오기
          </span>
          <span className="text-[11px] text-stone-600">클릭하여 바로 체험해보세요</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_SAMPLES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              id={`preset-sample-${idx}`}
              onClick={() => handleApplyPreset(sample)}
              className="px-2.5 py-1 text-xs rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900 transition-colors"
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="raw-email-input" className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
            변환할 내용 / 작성 메모 <span className="text-rose-500">*</span>
          </label>
          {rawText.length > 0 && (
            <button
              type="button"
              onClick={() => onChangeRawText('')}
              className="text-xs text-stone-600 hover:text-stone-700 flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>지우기</span>
            </button>
          )}
        </div>
        <div className="relative">
          <textarea
            id="raw-email-input"
            rows={5}
            value={rawText}
            onChange={(e) => onChangeRawText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="예시: 내일 2시 회의 다른 일 때문에 못 갈 거 같음. 4시나 모레로 미뤄줘. 자료는 미리 보내놓을게."
            className="w-full rounded-xl border border-stone-300 p-3.5 text-sm text-stone-900 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all leading-relaxed resize-y min-h-[120px]"
          />
          <div className="flex justify-between items-center mt-1.5 px-1 text-[11px] text-stone-600">
            <span>단축키: Ctrl + Enter 또는 ⌘ + Enter</span>
            <span>{rawText.length}자</span>
          </div>
        </div>
      </div>

      {/* Tone & Recipient Selector */}
      <ToneSelector
        tone={tone}
        onSelectTone={onChangeTone}
        recipient={recipient}
        onSelectRecipient={onChangeRecipient}
      />

      {/* Advanced Details Toggle */}
      <div className="border-t border-stone-100 pt-4">
        <button
          type="button"
          id="toggle-advanced-btn"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-xs font-medium text-stone-600 hover:text-stone-900"
        >
          <span className="flex items-center space-x-1.5">
            <span>수신자/발신자 정보 상세 설정 (선택)</span>
            {(recipientName || senderName || organization || additionalContext) && (
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            )}
          </span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-stone-100">
            <div>
              <label htmlFor="recipient-name-input" className="block text-[11px] font-medium text-stone-600 mb-1">
                받는 분 성함 / 직함
              </label>
              <input
                id="recipient-name-input"
                type="text"
                placeholder="예: 김민우 팀장님, 홍길동 실장님"
                value={recipientName}
                onChange={(e) => onChangeRecipientName(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-200 px-3 py-2 text-stone-800 placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label htmlFor="sender-name-input" className="block text-[11px] font-medium text-stone-600 mb-1">
                보내는 분 성함 / 직급
              </label>
              <input
                id="sender-name-input"
                type="text"
                placeholder="예: 이서연 대리, 박준영 팀장"
                value={senderName}
                onChange={(e) => onChangeSenderName(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-200 px-3 py-2 text-stone-800 placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label htmlFor="organization-input" className="block text-[11px] font-medium text-stone-600 mb-1">
                소속 회사 / 부서명
              </label>
              <input
                id="organization-input"
                type="text"
                placeholder="예: (주)알파솔루션 기획팀"
                value={organization}
                onChange={(e) => onChangeOrganization(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-200 px-3 py-2 text-stone-800 placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label htmlFor="additional-context-input" className="block text-[11px] font-medium text-stone-600 mb-1">
                추가 전달 및 주의사항
              </label>
              <input
                id="additional-context-input"
                type="text"
                placeholder="예: 오늘 18시까지 회신 필수, 첨부파일 언급"
                value={additionalContext}
                onChange={(e) => onChangeAdditionalContext(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-200 px-3 py-2 text-stone-800 placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit button */}
      <div>
        <button
          id="generate-email-btn"
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !rawText.trim()}
          className="w-full py-3.5 px-5 rounded-xl bg-stone-900 text-amber-400 hover:bg-stone-800 active:bg-black font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white">정중한 비즈니스 메일 초안 작성 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-white">정중한 메일 초안 생성하기</span>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

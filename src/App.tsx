import { useState, useEffect } from 'react';
import Header from './components/Header';
import EmailInputForm from './components/EmailInputForm';
import EmailResultCard from './components/EmailResultCard';
import HistoryDrawer from './components/HistoryDrawer';
import GuideModal from './components/GuideModal';
import Toast from './components/Toast';
import { EmailTone, EmailRecipient, GeneratedEmailResponse } from './types';
import { Sparkles, Mail, ShieldAlert, ArrowRight } from 'lucide-react';
import { PRESET_SAMPLES } from './data/presets';

const STORAGE_KEY = 'polite_email_history_v1';

export default function App() {
  const [rawText, setRawText] = useState('');
  const [tone, setTone] = useState<EmailTone>('polite');
  const [recipient, setRecipient] = useState<EmailRecipient>('client');
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [organization, setOrganization] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');

  const [result, setResult] = useState<GeneratedEmailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<GeneratedEmailResponse[]>([]);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history from localStorage', e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  const handleGenerate = async () => {
    if (!rawText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rawText,
          tone,
          recipient,
          senderName,
          recipientName,
          organization,
          additionalContext,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '이메일 생성에 실패했습니다.');
      }

      setResult(data);
      showToast('정중한 메일 초안이 생성되었습니다.');

      // Update history
      const updatedHistory = [data, ...history.filter((h) => h.id !== data.id)].slice(0, 15);
      setHistory(updatedHistory);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      } catch (err) {
        console.error('Failed to save to localStorage', err);
      }
    } catch (err: any) {
      setError(err.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      showToast('생성 기록이 모두 삭제되었습니다.');
    } catch (e) {
      console.error('Failed to clear localStorage', e);
    }
  };

  const handleSelectFromHistory = (item: GeneratedEmailResponse) => {
    setResult(item);
    setRawText(item.rawText);
    setTone(item.tone);
    setRecipient(item.recipient);
    showToast('기록에서 메일 초안을 불러왔습니다.');
  };

  const handleQuickPreset = (index: number) => {
    const sample = PRESET_SAMPLES[index];
    if (sample) {
      setRawText(sample.rawText);
      setTone(sample.tone);
      setRecipient(sample.recipient);
      if (sample.recipientName) setRecipientName(sample.recipientName);
      if (sample.senderName) setSenderName(sample.senderName);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-200">
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-800 text-xs">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{error}</p>
              <p className="text-rose-600 mt-1">잠시 후 다시 시도하시거나 문장을 다듬어 입력해 보세요.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input form */}
          <div className="lg:col-span-6 space-y-4">
            <EmailInputForm
              rawText={rawText}
              onChangeRawText={setRawText}
              tone={tone}
              onChangeTone={setTone}
              recipient={recipient}
              onChangeRecipient={setRecipient}
              senderName={senderName}
              onChangeSenderName={setSenderName}
              recipientName={recipientName}
              onChangeRecipientName={setRecipientName}
              organization={organization}
              onChangeOrganization={setOrganization}
              additionalContext={additionalContext}
              onChangeAdditionalContext={setAdditionalContext}
              onSubmit={handleGenerate}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column: Output result card or empty guide */}
          <div className="lg:col-span-6">
            {result ? (
              <EmailResultCard
                result={result}
                onRegenerate={handleGenerate}
                isLoading={isLoading}
                onToast={showToast}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 text-center space-y-6 shadow-xs flex flex-col justify-center min-h-[460px]">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                  <Mail className="w-7 h-7" />
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-base font-bold text-stone-900">
                    메일 내용을 입력하고 버튼을 눌러보세요
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    단문 메모, 다소 직설적이거나 거친 표현, 바쁜 업무 중 급하게 쓴 글도 상황과 대상에 꼭 맞는 정중하고 예의 바른 비즈니스 이메일로 완성해 드립니다.
                  </p>
                </div>

                {/* Quick preview recommendations */}
                <div className="pt-4 border-t border-stone-100 text-left space-y-2.5">
                  <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block">
                    추천 템플릿으로 바로 시작하기
                  </span>
                  <div className="space-y-1.5">
                    {PRESET_SAMPLES.slice(0, 3).map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuickPreset(idx)}
                        className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all flex items-center justify-between text-xs group"
                      >
                        <div>
                          <span className="font-semibold text-stone-800 group-hover:text-amber-900 block">
                            {sample.title}
                          </span>
                          <span className="text-[11px] text-stone-600 line-clamp-1 mt-0.5">
                            "{sample.rawText}"
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-600 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-2 text-stone-600 text-[11px]">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Gemini 생성형 AI 모델 기반 비즈니스 매너 엔진</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleSelectFromHistory}
        onClearHistory={handleClearHistory}
        onToast={showToast}
      />

      {/* Etiquette Guide Modal */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* Toast notifications */}
      <Toast message={toastMessage} />
    </div>
  );
}

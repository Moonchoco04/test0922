import { EmailTone, EmailRecipient } from '../types';
import { ShieldCheck, Smile, Zap, HeartHandshake, Building2, UserCheck, Handshake, Users } from 'lucide-react';

interface ToneSelectorProps {
  tone: EmailTone;
  onSelectTone: (tone: EmailTone) => void;
  recipient: EmailRecipient;
  onSelectRecipient: (recipient: EmailRecipient) => void;
}

export default function ToneSelector({
  tone,
  onSelectTone,
  recipient,
  onSelectRecipient,
}: ToneSelectorProps) {
  const tones: { id: EmailTone; label: string; desc: string; icon: typeof ShieldCheck }[] = [
    {
      id: 'polite',
      label: '부드러운 비즈니스',
      desc: '협업 및 업무 소통에 가장 널리 쓰이는 정중한 표준체',
      icon: Smile,
    },
    {
      id: 'formal',
      label: '극존칭 / 격식체',
      desc: '사외 고객사, 고위 임원, 중요 공문서에 알맞은 격식체',
      icon: ShieldCheck,
    },
    {
      id: 'concise',
      label: '간결하고 명확하게',
      desc: '핵심 용건 위주로 군더더기를 뺀 스마트한 비즈니스체',
      icon: Zap,
    },
    {
      id: 'apologetic',
      label: '양해 / 거절 / 사과',
      desc: '일정 변경, 제안 거절, 협상 시 상대방을 배려하는 완곡체',
      icon: HeartHandshake,
    },
  ];

  const recipients: { id: EmailRecipient; label: string; icon: typeof Building2 }[] = [
    { id: 'client', label: '고객사 / 외부', icon: Building2 },
    { id: 'boss', label: '상사 / 팀장', icon: UserCheck },
    { id: 'partner', label: '협력사 / 외주', icon: Handshake },
    { id: 'colleague', label: '사내 동료', icon: Users },
  ];

  return (
    <div className="space-y-4">
      {/* Recipient selection */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
          수신인 관계
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {recipients.map((item) => {
            const Icon = item.icon;
            const isSelected = recipient === item.id;
            return (
              <button
                key={item.id}
                type="button"
                id={`recipient-btn-${item.id}`}
                onClick={() => onSelectRecipient(item.id)}
                className={`flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                  isSelected
                    ? 'bg-stone-900 border-stone-900 text-white shadow-xs'
                    : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-stone-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tone selection */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
          어조 / 격식 수준
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {tones.map((t) => {
            const Icon = t.icon;
            const isSelected = tone === t.id;
            return (
              <button
                key={t.id}
                type="button"
                id={`tone-btn-${t.id}`}
                onClick={() => onSelectTone(t.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-50/70 border-amber-500 ring-1 ring-amber-500 text-stone-900 shadow-xs'
                    : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-xs text-stone-900">{t.label}</span>
                </div>
                <p className="mt-1.5 text-[11px] text-stone-500 leading-relaxed">{t.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

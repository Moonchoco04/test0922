import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '1mb' }));

// Lazy initialization of Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured');
    }
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Email generation endpoint
app.post('/api/generate-email', async (req, res) => {
  try {
    const {
      rawText,
      tone = 'polite',
      recipient = 'client',
      senderName = '',
      recipientName = '',
      organization = '',
      additionalContext = '',
    } = req.body;

    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
      return res.status(400).json({ error: '변환할 메일 내용을 입력해 주세요.' });
    }

    const toneDescriptions: Record<string, string> = {
      formal: '격식체 및 극존칭 (사외 고객사, 고위 임원, 중요 거래처, 공문서 수준의 가장 정중하고 예의 바른 어조)',
      polite: '부드럽고 세련된 비즈니스체 (일반 업무 파트너, 타 부서 상사, 협력사와의 원활한 협업을 위한 정중한 어조)',
      concise: '명확하고 간결한 비즈니스체 (용건을 한눈에 파악할 수 있도록 군더더기를 줄인 스마트한 어조)',
      apologetic: '정중한 양해/거절/사과체 (상대방의 기분을 상하게 하지 않고 거절하거나 일정을 연기할 때 쓰는 완곡하고 배려 깊은 어조)',
    };

    const recipientDescriptions: Record<string, string> = {
      client: '외부 고객사 또는 클라이언트 (최대의 예우와 신뢰감을 주는 표현 필요)',
      boss: '직속 상사, 부서장, 임원 (보고 및 결재 승인 격식 준수)',
      partner: '외부 협력사, 외주 파트너사 (상호 존중과 명확한 업무 진행 강조)',
      colleague: '사내 동료 또는 타 팀원 (친절하고 협력적이며 명확한 소통)',
    };

    const userPrompt = `
[원문/작성 메모]
${rawText.trim()}

[설정 정보]
- 목표 어조: ${toneDescriptions[tone] || toneDescriptions.polite}
- 수신인 유형: ${recipientDescriptions[recipient] || recipientDescriptions.client}
${recipientName ? `- 수신인 성함/호칭: ${recipientName}` : '- 수신인 성함: 지정되지 않음 (적절한 기본 비즈니스 호칭 사용)'}
${senderName ? `- 발신자 성함/직책: ${senderName}` : '- 발신자 성함: 지정되지 않음 (발신자 표시 틀 제공)'}
${organization ? `- 소속 회사/부서: ${organization}` : ''}
${additionalContext ? `- 추가 고려사항: ${additionalContext}` : ''}

위 내용을 바탕으로 실제 비즈니스 환경에서 바로 발송할 수 있는 완성도 높은 정중한 이메일 초안과 대안 버전을 생성해주세요.
`;

    const ai = getGenAI();
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let lastError: any = null;
    let response: any = null;

    for (const modelName of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: userPrompt,
          config: {
            systemInstruction: `당신은 대한민국 비즈니스 매너 및 비즈니스 이메일 작성 최고 전문가입니다.
사용자가 입력한 거칠거나 다소 직접적인 메모/원문을 분석하여, 수신자와의 관계 및 선택된 어조에 꼭 맞는 세련되고 정중한 비즈니스 이메일 초안을 작성하십시오.

작성 가이드라인:
1. 제목(subject): 수신자가 메일 목록에서 용건을 즉각 파악할 수 있도록 [요청], [안내], [일정 조율], [회신], [공유], [양해] 등의 비즈니스 태그와 함께 명확하고 정중하게 작성하십시오.
2. 메일 본문(body):
   - 정중한 첫인사 및 수신인 호칭 (예: OOO 팀장님 안녕하십니까.)
   - 발신자 소속 및 성명 소개
   - 자연스러운 안부 및 메일 발신 배경
   - 본론: 원문의 핵심 메시지를 정확히 담되, 단정적이거나 거친 표현을 세련된 완곡 어법(~해 주시면 감사하겠습니다, ~부탁드리고자 합니다 등)으로 정중화
   - 일정, 요청 기한, 첨부 파일 등이 있다면 가독성 좋게 줄바꿈 및 글머리 기호 활용
   - 정중한 맺음말 및 감사 인사
   - 하단 서명란 (회사, 부서, 직급, 성명, 연락처 서식)
3. 간결 버전(conciseBody): 본론과 요청 사항을 간결한 개조식 또는 3~4문장으로 압축한 핵심 요약형 정중 이메일
4. highlights: 원문의 거칠거나 애매했던 표현이 어떻게 정중하고 프로페셔널하게 개선되었는지 설명하는 2~3가지 핵심 포인트
5. etiquetteTip: 해당 상황의 이메일을 발송할 때 유용한 실무 비즈니스 에티켓 팁 1가지`,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                subject: {
                  type: Type.STRING,
                  description: '정중하고 명확한 비즈니스 메일 제목',
                },
                body: {
                  type: Type.STRING,
                  description: '완성된 정중한 비즈니스 메일 본문 전문',
                },
                conciseBody: {
                  type: Type.STRING,
                  description: '핵심 위주의 간결하고 정중한 대안 메일 본문',
                },
                highlights: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '원문 대비 개선된 표현 및 정중화 포인트 목록 (2-3개)',
                },
                etiquetteTip: {
                  type: Type.STRING,
                  description: '해당 비즈니스 상황에 적용 가능한 실무 에티켓 팁',
                },
              },
              required: ['subject', 'body', 'conciseBody', 'highlights', 'etiquetteTip'],
            },
          },
        });
        if (response && response.text) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next fallback:`, err.message || err);
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error('AI 모델 응답을 생성하지 못했습니다.');
    }

    const textOutput = response.text?.trim() || '{}';
    const parsedData = JSON.parse(textOutput);

    return res.json({
      id: 'email-' + Date.now(),
      createdAt: new Date().toISOString(),
      subject: parsedData.subject || '[안내] 업무 관련 문의의 건',
      body: parsedData.body || '',
      conciseBody: parsedData.conciseBody || '',
      highlights: Array.isArray(parsedData.highlights) ? parsedData.highlights : [],
      etiquetteTip: parsedData.etiquetteTip || '메일 발송 전 수신인 성함과 직함을 한 번 더 확인해보세요.',
      rawText,
      tone,
      recipient,
    });
  } catch (error: any) {
    console.error('Email generation error:', error);
    return res.status(500).json({
      error: error.message || '이메일 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

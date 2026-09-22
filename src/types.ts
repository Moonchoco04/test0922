export type EmailTone = 'formal' | 'polite' | 'concise' | 'apologetic';

export type EmailRecipient = 'client' | 'boss' | 'partner' | 'colleague';

export interface EmailOptions {
  tone: EmailTone;
  recipient: EmailRecipient;
  senderName?: string;
  recipientName?: string;
  organization?: string;
  additionalContext?: string;
}

export interface GenerateEmailRequest extends EmailOptions {
  rawText: string;
}

export interface GeneratedEmailResponse {
  id: string;
  createdAt: string;
  subject: string;
  body: string;
  conciseBody: string;
  highlights: string[];
  etiquetteTip: string;
  rawText: string;
  tone: EmailTone;
  recipient: EmailRecipient;
}

export interface PresetSample {
  title: string;
  category: string;
  rawText: string;
  tone: EmailTone;
  recipient: EmailRecipient;
  recipientName?: string;
  senderName?: string;
}

export type LeadSource = 'contact' | 'consultation';

export interface LeadInput {
  source: LeadSource;
  name: string;
  contact: string;
  company?: string;
  businessType?: string;
  message?: string;
}

export interface LeadResult {
  leadNo: string;
  status: string;
  createdAt: string;
  duplicated: boolean;
}

interface LeadErrorBody {
  error?: {
    code?: string;
    message?: string;
    details?: string[];
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

const FALLBACK_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: '填写内容有误，请检查后重试',
  RATE_LIMITED: '提交过于频繁，请稍后再试',
  INTERNAL_ERROR: '服务暂时不可用，请稍后重试',
};

export class LeadSubmitError extends Error {
  readonly code: string | undefined;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'LeadSubmitError';
    this.code = code;
  }
}

/**
 * 提交线索到 m9ai-server。
 *
 * 站点为静态导出（`output: 'export'`），不存在服务端运行时，
 * 因此表单必须直接调用统一后端，不能依赖 Next 的 Route Handler。
 */
export async function submitLead(input: LeadInput): Promise<LeadResult> {
  if (!API_BASE_URL) {
    throw new LeadSubmitError('未配置 NEXT_PUBLIC_API_BASE_URL，无法提交');
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, ...collectContext() }),
  });

  const payload = (await response
    .json()
    .catch(() => ({}))) as LeadResult & LeadErrorBody;

  if (!response.ok) {
    const { code, message, details } = payload.error ?? {};
    throw new LeadSubmitError(
      details?.[0] ?? message ?? FALLBACK_MESSAGES[code ?? ''] ?? '提交失败，请稍后重试',
      code,
    );
  }

  return payload;
}

/** 采集来源页、语言与 UTM，便于后端归因 */
function collectContext(): Record<string, string | undefined> {
  if (typeof window === 'undefined') {
    return {};
  }

  const params = new URLSearchParams(window.location.search);

  return {
    locale: document.documentElement.lang || undefined,
    pageUrl: window.location.href,
    utmSource: params.get('utm_source') ?? undefined,
    utmMedium: params.get('utm_medium') ?? undefined,
    utmCampaign: params.get('utm_campaign') ?? undefined,
  };
}

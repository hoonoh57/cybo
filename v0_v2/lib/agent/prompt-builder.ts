import { CYBO_SYSTEM_PROMPT } from './system-prompt';

export type AgentMode = 'create' | 'improve' | 'reference';

interface BuildOptions {
  mode: AgentMode;
  userPrompt: string;
  existingCode?: string;
  componentName?: string;
  referenceDescription?: string;
}

export function buildFullPrompt(options: BuildOptions): string {
  const parts: string[] = [];

  parts.push('=== SYSTEM INSTRUCTIONS (반드시 따르세요) ===');
  parts.push(CYBO_SYSTEM_PROMPT);
  parts.push('');

  if (options.mode === 'improve' && options.existingCode) {
    parts.push('=== 현재 코드 (이 코드를 기반으로 개선) ===');
    parts.push('```tsx');
    parts.push(options.existingCode);
    parts.push('```');
    parts.push('');
  }

  if (options.mode === 'reference' && options.referenceDescription) {
    parts.push('=== 참조 설명 ===');
    parts.push(options.referenceDescription);
    parts.push('');
  }

  parts.push('=== 사용자 요청 ===');
  parts.push(options.userPrompt);
  parts.push('');
  parts.push('위 CYBO 표준을 준수하여 JSON 형식으로만 응답하세요.');

  return parts.join('\n');
}

export function buildFixPrompt(
  originalPrompt: string,
  code: string,
  errors: string[]
): string {
  const parts: string[] = [];

  parts.push('=== SYSTEM INSTRUCTIONS ===');
  parts.push(CYBO_SYSTEM_PROMPT);
  parts.push('');
  parts.push('=== 이전 생성 코드 (검증 실패) ===');
  parts.push('```tsx');
  parts.push(code);
  parts.push('```');
  parts.push('');
  parts.push('=== 검증 실패 항목 ===');
  errors.forEach((e) => parts.push(`- ${e}`));
  parts.push('');
  parts.push('위 오류를 수정하여 다시 JSON 형식으로 응답하세요.');

  return parts.join('\n');
}

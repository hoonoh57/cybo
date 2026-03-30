export interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  score: number;
}

export interface ParsedComponent {
  componentName: string;
  category: string;
  fileName: string;
  code: string;
  description: string;
  changelog: string;
}

export function parseAgentResponse(raw: string): ParsedComponent | null {
  try {
    let jsonStr = raw;
    const jsonMatch = raw.match(/```json?\s*\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    } else if (raw.includes('{')) {
      jsonStr = raw.substring(raw.indexOf('{'), raw.lastIndexOf('}') + 1);
    }
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

export function validateComponent(parsed: ParsedComponent): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;
  const code = parsed.code || '';

  // ── 필수 규칙 ──

  if (!code.includes("'use client'") && !code.includes('"use client"')) {
    errors.push("RULE_001: 'use client' 선언 누락");
    score -= 20;
  }

  const returnMatch = code.match(
    /return\s*\(\s*<(\w+)\s+className="([^"]+)"/
  );
  if (returnMatch) {
    const rootClasses = returnMatch[2];
    if (/w-\[\d+px\]/.test(rootClasses) || /w-\[\d+rem\]/.test(rootClasses)) {
      errors.push('RULE_002: 최외곽에 고정 너비 사용');
      score -= 20;
    }
    if (!/w-full/.test(rootClasses)) {
      errors.push('RULE_003: 최외곽에 w-full 누락');
      score -= 15;
    }
    if (!/h-full/.test(rootClasses)) {
      errors.push('RULE_004: 최외곽에 h-full 누락');
      score -= 15;
    }
  }

  if (!code.includes('export interface') && !code.includes('export type')) {
    errors.push('RULE_005: Props 인터페이스 미export');
    score -= 10;
  }

  if (
    !code.includes('export function') &&
    !code.includes('export default function')
  ) {
    errors.push('RULE_006: 컴포넌트 미export');
    score -= 20;
  }

  if (/style=\{/.test(code)) {
    errors.push('RULE_007: 인라인 style 사용');
    score -= 10;
  }

  if (/<svg[\s>]/.test(code) && !code.includes('lucide')) {
    errors.push('RULE_008: 인라인 SVG (lucide-react 사용)');
    score -= 10;
  }

  // ── 권장 규칙 ──

  const anyCount = (code.match(/:\s*any\b/g) || []).length;
  if (anyCount > 0) {
    warnings.push(`WARN_001: any 타입 ${anyCount}회`);
    score -= anyCount * 3;
  }

  const validCategories = ['atom', 'molecule', 'organism', 'page', 'overlay'];
  if (!parsed.componentName) {
    errors.push('META_001: componentName 누락');
    score -= 5;
  }
  if (!parsed.category || !validCategories.includes(parsed.category)) {
    errors.push('META_002: category 잘못됨');
    score -= 5;
  }
  if (!parsed.fileName || !parsed.fileName.endsWith('.tsx')) {
    errors.push('META_003: fileName 누락 또는 .tsx 아님');
    score -= 5;
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, score),
  };
}

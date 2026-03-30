'use client';

import { useState, useCallback } from 'react';
import {
  Sparkles,
  Copy,
  ClipboardPaste,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStudioStore, useSelectedNode } from '@/lib/studio-store';
import {
  buildFullPrompt,
  buildFixPrompt,
  type AgentMode,
} from '@/lib/agent/prompt-builder';
import {
  parseAgentResponse,
  validateComponent,
  type ValidationResult,
  type ParsedComponent,
} from '@/lib/agent/validator';
import { cn } from '@/lib/utils';

type Step =
  | 'input'
  | 'prompt-ready'
  | 'paste-result'
  | 'success'
  | 'failed';

export function AiPanel() {
  const selectedNode = useSelectedNode();
  const { updateNodeCode } = useStudioStore();

  const [mode, setMode] = useState<AgentMode>('create');
  const [userPrompt, setUserPrompt] = useState('');
  const [referenceDesc, setReferenceDesc] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [pastedResult, setPastedResult] = useState('');
  const [step, setStep] = useState<Step>('input');
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [parsed, setParsed] = useState<ParsedComponent | null>(null);
  const [fixPrompt, setFixPrompt] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  /* ① 프롬프트 조립 */
  const handleBuildPrompt = useCallback(() => {
    if (!userPrompt.trim()) return;
    const full = buildFullPrompt({
      mode,
      userPrompt: userPrompt.trim(),
      existingCode:
        mode === 'improve' && selectedNode?.code
          ? selectedNode.code
          : undefined,
      componentName: selectedNode?.name,
      referenceDescription: mode === 'reference' ? referenceDesc : undefined,
    });
    setGeneratedPrompt(full);
    setStep('prompt-ready');
  }, [mode, userPrompt, referenceDesc, selectedNode]);

  /* ② 클립보드 복사 */
  const handleCopyPrompt = useCallback(async () => {
    await navigator.clipboard.writeText(generatedPrompt);
    setStep('paste-result');
  }, [generatedPrompt]);

  /* ③ 검증 */
  const handleValidate = useCallback(() => {
    const component = parseAgentResponse(pastedResult);
    if (!component) {
      setValidation({
        passed: false,
        errors: ['JSON 파싱 실패. AI 응답이 올바른 JSON인지 확인하세요.'],
        warnings: [],
        score: 0,
      });
      setStep('failed');
      return;
    }
    setParsed(component);
    const result = validateComponent(component);
    setValidation(result);

    if (result.passed) {
      setStep('success');
    } else {
      const fix = buildFixPrompt(userPrompt, component.code, result.errors);
      setFixPrompt(fix);
      setStep('failed');
    }
  }, [pastedResult, userPrompt]);

  /* ④ 저장 */
  const handleSave = useCallback(async () => {
    if (!parsed) return;
    setIsSaving(true);
    try {
      const filePath = `components/cybo/${parsed.fileName}`;
      const res = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: filePath, content: parsed.code }),
      });
      const data = await res.json();
      if (data.saved && selectedNode && mode === 'improve') {
        updateNodeCode(selectedNode.id, parsed.code);
      }
      if (data.saved) {
        setStep('input');
        setUserPrompt('');
        setPastedResult('');
      }
    } finally {
      setIsSaving(false);
    }
  }, [parsed, selectedNode, mode, updateNodeCode]);

  /* 수정 프롬프트 복사 */
  const handleCopyFix = useCallback(async () => {
    await navigator.clipboard.writeText(fixPrompt);
    setPastedResult('');
    setStep('paste-result');
  }, [fixPrompt]);

  /* 리셋 */
  const handleReset = () => {
    setStep('input');
    setUserPrompt('');
    setPastedResult('');
    setGeneratedPrompt('');
    setValidation(null);
    setParsed(null);
    setFixPrompt('');
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a1a] text-[#e0e0f0]">
      {/* 헤더 */}
      <div className="flex items-center gap-2 px-3 h-10 border-b border-[#1a1a30] shrink-0">
        <Sparkles className="w-4 h-4 text-[#6c63ff]" />
        <span className="text-[12px] font-medium">AI Agent</span>
        <span className="text-[10px] text-[#505070] ml-1">(Human Relay)</span>
        {step !== 'input' && (
          <button
            onClick={handleReset}
            className="ml-auto text-[10px] text-[#505070] hover:text-[#808098] flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {/* 현재 대상 */}
          {selectedNode && (
            <div className="text-[11px] px-2 py-1.5 rounded bg-[#111128] border border-[#1a1a30]">
              Target:{' '}
              <span className="text-[#6c63ff] font-medium">
                {selectedNode.name}
              </span>
              <span className="text-[#505070] ml-2">
                ({selectedNode.status})
              </span>
            </div>
          )}

          {/* 모드 선택 */}
          <div className="flex gap-1">
            {(['create', 'improve', 'reference'] as AgentMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  'px-2 py-1 text-[11px] rounded transition-all',
                  mode === m
                    ? 'bg-[#6c63ff] text-white'
                    : 'bg-[#111128] text-[#505070] hover:text-[#808098]'
                )}
              >
                {m === 'create'
                  ? '새 생성'
                  : m === 'improve'
                  ? '개선'
                  : '참조 생성'}
              </button>
            ))}
          </div>

          {/* ── STEP: input ── */}
          {step === 'input' && (
            <>
              {mode === 'reference' && (
                <Textarea
                  value={referenceDesc}
                  onChange={(e) => setReferenceDesc(e.target.value)}
                  placeholder="참조 UI 설명 (예: CapCut 멀티트랙 타임라인)"
                  className="min-h-[60px] text-[12px] bg-[#08081a] border-[#1a1a30] resize-none"
                />
              )}
              <Textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder={
                  mode === 'create'
                    ? '생성할 컴포넌트 설명...'
                    : mode === 'improve'
                    ? '개선 내용...'
                    : '참조 기반 요청...'
                }
                className="min-h-[100px] text-[12px] bg-[#08081a] border-[#1a1a30] resize-none"
              />
              <Button
                onClick={handleBuildPrompt}
                disabled={!userPrompt.trim()}
                className="w-full bg-[#6c63ff] hover:bg-[#5a52e0] text-[12px] h-8"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                프롬프트 조립
              </Button>
            </>
          )}

          {/* ── STEP: prompt-ready ── */}
          {step === 'prompt-ready' && (
            <>
              <div className="text-[11px] text-[#00c853] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                프롬프트 조립 완료 ({generatedPrompt.length}자)
              </div>
              <div className="max-h-[120px] overflow-auto p-2 rounded bg-[#08081a] border border-[#1a1a30]">
                <pre className="text-[10px] text-[#505070] whitespace-pre-wrap">
                  {generatedPrompt.slice(0, 500)}...
                </pre>
              </div>
              <Button
                onClick={handleCopyPrompt}
                className="w-full bg-[#6c63ff] hover:bg-[#5a52e0] text-[12px] h-8"
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                복사 → Claude/v0에 붙여넣기
              </Button>
            </>
          )}

          {/* ── STEP: paste-result ── */}
          {step === 'paste-result' && (
            <>
              <div className="text-[11px] text-[#ff9800] flex items-center gap-1">
                <ClipboardPaste className="w-3.5 h-3.5" />
                AI 응답을 아래에 붙여넣으세요
              </div>
              <Textarea
                value={pastedResult}
                onChange={(e) => setPastedResult(e.target.value)}
                placeholder="AI 응답 JSON 붙여넣기..."
                className="min-h-[200px] text-[11px] bg-[#08081a] border-[#1a1a30] resize-none font-mono"
              />
              <Button
                onClick={handleValidate}
                disabled={!pastedResult.trim()}
                className="w-full bg-[#ff9800] hover:bg-[#e68a00] text-black text-[12px] h-8"
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                표준 검증 실행
              </Button>
            </>
          )}

          {/* ── STEP: success ── */}
          {step === 'success' && validation && parsed && (
            <>
              <div className="p-2 rounded bg-[#0a2010] border border-[#00c853]/30">
                <div className="text-[12px] text-[#00c853] flex items-center gap-1 font-medium">
                  <CheckCircle className="w-4 h-4" />
                  검증 통과 (Score: {validation.score}/100)
                </div>
              </div>
              {validation.warnings.length > 0 && (
                <div className="space-y-1">
                  {validation.warnings.map((w, i) => (
                    <div
                      key={i}
                      className="text-[10px] text-[#ff9800] flex items-start gap-1"
                    >
                      <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                      {w}
                    </div>
                  ))}
                </div>
              )}
              <div className="p-2 rounded bg-[#111128] border border-[#1a1a30] space-y-1 text-[11px]">
                <div>
                  <span className="text-[#505070]">컴포넌트:</span>{' '}
                  {parsed.componentName}
                </div>
                <div>
                  <span className="text-[#505070]">카테고리:</span>{' '}
                  {parsed.category}
                </div>
                <div>
                  <span className="text-[#505070]">파일명:</span>{' '}
                  {parsed.fileName}
                </div>
                <div>
                  <span className="text-[#505070]">설명:</span>{' '}
                  {parsed.description}
                </div>
              </div>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-[#00c853] hover:bg-[#00a844] text-black text-[12px] h-8"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                {isSaving ? '저장 중...' : `${parsed.fileName} 저장`}
              </Button>
            </>
          )}

          {/* ── STEP: failed ── */}
          {step === 'failed' && validation && (
            <>
              <div className="p-2 rounded bg-[#200a0a] border border-[#ff5252]/30">
                <div className="text-[12px] text-[#ff5252] flex items-center gap-1 font-medium">
                  <XCircle className="w-4 h-4" />
                  검증 실패 (Score: {validation.score}/100)
                </div>
              </div>
              <div className="space-y-1">
                {validation.errors.map((e, i) => (
                  <div
                    key={i}
                    className="text-[10px] text-[#ff5252] flex items-start gap-1"
                  >
                    <XCircle className="w-3 h-3 shrink-0 mt-0.5" />
                    {e}
                  </div>
                ))}
              </div>
              {fixPrompt && (
                <Button
                  onClick={handleCopyFix}
                  className="w-full bg-[#ff9800] hover:bg-[#e68a00] text-black text-[12px] h-8"
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  수정 프롬프트 복사 → 다시 Claude에
                </Button>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

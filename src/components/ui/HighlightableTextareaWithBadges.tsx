"use client";

import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";

type TooltipState = {
  text: string;
  left: number;
  top: number;
  placement: "above" | "below";
};

type HighlightableTextareaWithBadgesProps = {
  value: string;
  onChange: (value: string) => void;
  highlights: string[];
  onAddHighlight: (value: string) => void;
  onRemoveHighlight: (value: string) => void;
  manualValue: string;
  onManualValueChange: (value: string) => void;
  onManualAdd: () => void;
  placeholder?: string;
  rows?: number;
  error?: string;
  textareaClassName?: string;
  inputClassName?: string;
  addButtonClassName?: string;
  removeButtonClassName?: string;
};

const normalizeSelectionText = (value: string) => value.replace(/\s+/g, " ").trim();

const getSelectionRangeRect = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  if (rect.width || rect.height) return rect;
  const fallback = range.getClientRects()[0];
  return fallback || null;
};

export default function HighlightableTextareaWithBadges({
  value,
  onChange,
  highlights,
  onAddHighlight,
  onRemoveHighlight,
  manualValue,
  onManualValueChange,
  onManualAdd,
  placeholder,
  rows = 5,
  error,
  textareaClassName = "",
  inputClassName = "",
  addButtonClassName = "",
  removeButtonClassName = "",
}: HighlightableTextareaWithBadgesProps) {
  const fieldId = useId();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const hideTooltip = useCallback(() => {
    setTooltip(null);
  }, []);

  const syncEditorText = useCallback(
    (nextValue: string) => {
      const editor = editorRef.current;
      if (!editor) return;
      if (editor.innerText !== nextValue) {
        editor.innerText = nextValue;
      }
    },
    []
  );

  useLayoutEffect(() => {
    syncEditorText(value);
  }, [syncEditorText, value]);

  const updateTooltipFromSelection = useCallback(() => {
    const editor = editorRef.current;
    const wrapper = wrapperRef.current;
    if (!editor || !wrapper) {
      hideTooltip();
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      hideTooltip();
      return;
    }

    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) {
      hideTooltip();
      return;
    }

    const rawText = selection.toString();
    const text = normalizeSelectionText(rawText);
    if (!text) {
      hideTooltip();
      return;
    }

    const rect = getSelectionRangeRect();
    if (!rect) {
      hideTooltip();
      return;
    }

    const wrapperRect = wrapper.getBoundingClientRect();
    const tooltipWidthEstimate = 120;
    const centerX = rect.left + rect.width / 2 - wrapperRect.left;
    const aboveTop = rect.top - wrapperRect.top - 4;
    const belowTop = rect.bottom - wrapperRect.top + 4;
    const placeAbove = aboveTop >= 8;
    const top = placeAbove ? aboveTop : belowTop;
    const left = Math.min(
      Math.max(centerX, tooltipWidthEstimate / 2 + 8),
      wrapperRect.width - tooltipWidthEstimate / 2 - 8
    );

    setTooltip({
      text,
      left,
      top,
      placement: placeAbove ? "above" : "below",
    });
  }, [hideTooltip]);

  const handleHighlightClick = () => {
    if (!tooltip?.text) return;
    onAddHighlight(tooltip.text);
    hideTooltip();
    const editor = editorRef.current;
    editor?.focus();
  };

  useEffect(() => {
    const handleDocumentMouseDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        hideTooltip();
      }
    };

    const handleSelectionChange = () => {
      const editor = editorRef.current;
      if (!editor) return;
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && editor.contains(selection.anchorNode)) {
        updateTooltipFromSelection();
      } else {
        hideTooltip();
      }
    };

    document.addEventListener("mousedown", handleDocumentMouseDown);
    document.addEventListener("selectionchange", handleSelectionChange);
    window.addEventListener("resize", hideTooltip);
    window.addEventListener("scroll", hideTooltip, true);

    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
      document.removeEventListener("selectionchange", handleSelectionChange);
      window.removeEventListener("resize", hideTooltip);
      window.removeEventListener("scroll", hideTooltip, true);
    };
  }, [hideTooltip, updateTooltipFromSelection]);

  return (
    <div ref={wrapperRef} className="flex flex-col gap-3">
      <div className="relative">
        {tooltip ? (
          <div
            className={`pointer-events-none absolute z-20 -translate-x-1/2 ${tooltip.placement === "above" ? "-translate-y-full" : "translate-y-0"}`}
            style={{ top: tooltip.top, left: tooltip.left }}
          >
            <div className="pointer-events-auto inline-flex items-center rounded-xl border border-emerald-500/20 bg-[#151821] px-2 py-1 shadow-[0_12px_35px_-18px_rgba(16,185,129,0.75)]">
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={handleHighlightClick}
                className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black text-emerald-400 transition-colors hover:bg-emerald-500/20"
              >
                هایلایت
              </button>
            </div>
          </div>
        ) : null}

        <div
          id={fieldId}
          ref={editorRef}
          role="textbox"
          aria-multiline="true"
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          onInput={(event) => {
            const nextValue = (event.currentTarget.textContent || "").replace(/\u00a0/g, " ");
            onChange(nextValue);
          }}
          onMouseUp={updateTooltipFromSelection}
          onKeyUp={updateTooltipFromSelection}
          onTouchEnd={updateTooltipFromSelection}
          onBlur={() => {
            window.setTimeout(() => {
              if (!wrapperRef.current?.contains(document.activeElement)) {
                hideTooltip();
              }
            }, 0);
          }}
          className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-right text-xs font-medium leading-7 outline-none transition-all focus:border-primary dark:bg-[#1a1c23] ${textareaClassName}`}
          style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", minHeight: `${rows * 1.5}rem` }}
        />
      </div>

      {error ? <span className="text-[10px] font-bold text-red-500">{error}</span> : null}

      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-[#171a22]">
        <label htmlFor={`${fieldId}-highlight-input`} className="text-xs font-bold text-gray-600 dark:text-gray-300">
          عبارت‌های هایلایت شده داخل متن (Badge)
        </label>
        <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[1fr_auto]">
          <input
            id={`${fieldId}-highlight-input`}
            type="text"
            placeholder="مثال: طرز تفکر مهندسی"
            value={manualValue}
            onChange={(event) => onManualValueChange(event.target.value)}
            className={inputClassName}
          />
          <button type="button" onClick={onManualAdd} className={addButtonClassName}>
            <Plus className="h-4 w-4" />
            <span className="text-[10px] font-black sm:hidden">افزودن</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {highlights.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black text-emerald-500"
            >
              {item}
              <button type="button" onClick={() => onRemoveHighlight(item)} className={removeButtonClassName}>
                <X className="h-3.5 w-3.5 text-red-500" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

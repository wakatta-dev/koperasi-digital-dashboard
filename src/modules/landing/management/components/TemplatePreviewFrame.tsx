/** @format */

"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type TemplatePreviewFrameProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  resetKey?: string;
};

const HEAD_STYLE_SELECTOR = "style, link[rel='stylesheet']";
const HEAD_CLONE_MARKER = "data-template-preview-clone";
const PREVIEW_FRAME_SRC_DOC = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body { height: 100%; }
      body { margin: 0; overflow: auto; }
    </style>
  </head>
  <body></body>
</html>`;

function syncHeadStyles(targetDocument: Document) {
  targetDocument.head
    .querySelectorAll(`[${HEAD_CLONE_MARKER}='true']`)
    .forEach((node) => node.remove());

  const nodes = document.head.querySelectorAll(HEAD_STYLE_SELECTOR);
  nodes.forEach((node) => {
    const clone = node.cloneNode(true) as HTMLElement;
    clone.setAttribute(HEAD_CLONE_MARKER, "true");
    targetDocument.head.appendChild(clone);
  });
}

export function TemplatePreviewFrame({
  children,
  className,
  title = "Template Preview",
  resetKey,
}: TemplatePreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const observersRef = useRef<{
    classObserver: MutationObserver;
    headObserver: MutationObserver;
  } | null>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  const cleanupObservers = useCallback(() => {
    observersRef.current?.classObserver.disconnect();
    observersRef.current?.headObserver.disconnect();
    observersRef.current = null;
  }, []);

  const initializeFrame = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDocument = iframe.contentDocument;
    if (!iframeDocument) return;

    iframeDocument.documentElement.lang = document.documentElement.lang || "en";
    iframeDocument.documentElement.className =
      document.documentElement.className;

    syncHeadStyles(iframeDocument);

    cleanupObservers();

    const classObserver = new MutationObserver(() => {
      iframeDocument.documentElement.className =
        document.documentElement.className;
    });
    classObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const headObserver = new MutationObserver(() => {
      syncHeadStyles(iframeDocument);
    });
    headObserver.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    observersRef.current = { classObserver, headObserver };

    // mount langsung ke body
    setMountNode(iframeDocument.body as unknown as HTMLElement);
  }, [cleanupObservers]);

  const resetScrollPosition = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const iframeWindow = iframe.contentWindow;
    if (!iframeWindow) return;
    iframeWindow.scrollTo(0, 0);
  };

  useEffect(() => {
    initializeFrame();
    return () => {
      cleanupObservers();
    };
  }, [cleanupObservers, initializeFrame]);

  useEffect(() => {
    if (!mountNode) return;

    resetScrollPosition();
    const timeoutId = window.setTimeout(() => {
      resetScrollPosition();
      requestAnimationFrame(() => {
        resetScrollPosition();
      });
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [mountNode, resetKey]);

  return (
    <>
      <iframe
        ref={iframeRef}
        title={title}
        srcDoc={PREVIEW_FRAME_SRC_DOC}
        onLoad={initializeFrame}
        className={`block h-full w-full ${className ?? ""}`}
        style={{ border: 0 }}
      />
      {mountNode ? createPortal(children, mountNode) : null}
    </>
  );
}

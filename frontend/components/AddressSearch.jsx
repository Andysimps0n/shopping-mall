"use client";

import { useEffect, useRef, useState } from "react";

const SCRIPT_SRC =
  "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

function loadPostcodeScript() {
  if (window.daum?.Postcode) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("postcode_script")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("postcode_script"));
    document.head.appendChild(script);
  });
}

/**
 * 카카오 우편번호 검색.
 * 모바일에서 window.open 팝업은 화면 밖으로 잘리므로, 페이지 안 레이어에 embed 한다.
 */
export default function AddressSearch({ onComplete, onClose }) {
  const frameRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  const [scriptError, setScriptError] = useState(false);

  onCompleteRef.current = onComplete;

  useEffect(() => {
    let cancelled = false;

    loadPostcodeScript()
      .then(() => {
        if (cancelled || !frameRef.current || !window.daum?.Postcode) return;
        frameRef.current.replaceChildren();
        new window.daum.Postcode({
          oncomplete(data) {
            onCompleteRef.current({
              postalCode: data.zonecode || "",
              address1: data.roadAddress || data.address || "",
            });
          },
          width: "100%",
          height: "100%",
        }).embed(frameRef.current);
      })
      .catch(() => {
        if (!cancelled) setScriptError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="postcode-layer" role="dialog" aria-modal="true" aria-label="주소 검색">
      <div className="postcode-layer-bar">
        <strong>주소 검색</strong>
        <button type="button" className="button button--secondary" onClick={onClose}>
          닫기
        </button>
      </div>
      {scriptError ? (
        <p className="postcode-layer-error">
          주소 검색을 열지 못했습니다. 닫은 뒤 우편번호와 주소를 직접 입력해 주세요.
        </p>
      ) : (
        <div ref={frameRef} className="postcode-layer-frame" />
      )}
    </div>
  );
}

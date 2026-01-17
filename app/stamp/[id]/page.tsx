"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStampMeta } from "../../../lib/stampMeta";
import { loadState, markDone, saveState } from "../../../lib/storage";

export default function StampScanPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = useMemo(() => Number(params?.id), [params]);
  const meta = useMemo(() => (Number.isFinite(id) ? getStampMeta(id) : null), [id]);

  const [status, setStatus] = useState<string>("카메라를 불러오는 중…");
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    if (!meta) {
      setStatus("유효하지 않은 스탬프 번호입니다. 메인으로 이동합니다.");
      const t = setTimeout(() => router.replace("/main"), 900);
      return () => clearTimeout(t);
    }
    setReady(true);
  }, [meta, router]);

  useEffect(() => {
    if (!ready || !meta) return;

    let cleanup: (() => void) | null = null;
    let cancelled = false;

    (async () => {
      try {
        const mod = await import("html5-qrcode");
        if (cancelled) return;

        const { Html5Qrcode } = mod;
        const qrRegionId = "qr-reader";

        const html5QrCode = new Html5Qrcode(qrRegionId);

        setStatus("QR을 화면 중앙에 맞춰 스캔하세요.");

        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (_decodedText) => {
            // ✅ 스캔 성공 → 스탬프 완료 처리
            const prev = loadState();
            const next = markDone(prev, meta.id);
            saveState(next);

            setStatus("스탬프 완료! 메인으로 이동합니다.");
            try {
              await html5QrCode.stop();
            } catch {}
            router.replace("/main");
          },
          () => {
            // scan error callback (조용히 무시)
          }
        );

        cleanup = () => {
          html5QrCode.stop().catch(() => {}).finally(() => {
            html5QrCode.clear().catch(() => {});
          });
        };
      } catch (e) {
        setStatus("카메라 접근에 실패했습니다. 브라우저 권한을 확인해주세요.");
      }
    })();

    return () => {
      cancelled = true;
      if (cleanup) cleanup();
    };
  }, [ready, meta, router]);

  return (
    <div className="scanWrap">
      <div className="container">
        <div className="card">
          <div className="cardInner">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <div style={{ fontWeight: 900, letterSpacing: "-.2px" }}>
                QR SCAN {meta ? `#${meta.id}` : ""}
              </div>
              <button className="btn" type="button" onClick={() => router.replace("/main")}>
                메인으로 돌아가기
              </button>
            </div>

            {meta && (
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
                <img src={meta.iconPath} alt="" width={28} height={28} />
                <div style={{ fontWeight: 800 }}>{meta.label}</div>
              </div>
            )}

            <div className="scanBox">
              <div className="scanHint">{status}</div>
              <div id="qr-reader" style={{ width: "100%", marginTop: 12 }} />
              <div className="small" style={{ marginTop: 12 }}>
                · iOS는 Safari/Chrome에서 카메라 권한을 허용해야 합니다.<br/>
                · 현장 Wi-Fi가 불안정해도 스캔 자체는 기기에서 동작합니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

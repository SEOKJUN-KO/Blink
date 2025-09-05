'use client';

import VisualAlert from '@/app/components/VisualAlert';
import React, {
	useRef,
	useCallback,
	useEffect,
	useState,
	forwardRef,
	useImperativeHandle,
} from 'react';
import { createPortal } from 'react-dom';

type PipWindow = Window & { __pipMounted__?: boolean };

export interface CustomPiPHandle {
	open: () => Promise<void>;
	close: () => void;
}

interface CustomPiPProps {
	isRunning: boolean;
	pipFlick: boolean;
	threshold: number;
}

function Widget({ time, pipFlick }: { time: number; pipFlick: boolean; }) {
	return (
		<div className={`w-[240px] h-[136px] flex flex-col items-center justify-center shadow-xl border border-gray-200 p-4 select-none bg-white`}>
			<VisualAlert isActive={pipFlick} />
		</div>
	);
}

export const CustomPiP = forwardRef<CustomPiPHandle, CustomPiPProps>(function CustomPiP({ isRunning, pipFlick, threshold }, ref)
{
	const measureRef = useRef<HTMLDivElement>(null); // 오프스크린 측정용
	const pipWinRef = useRef<PipWindow | null>(null);
	const [pipDoc, setPipDoc] = useState<Document | null>(null); // ★ 포털 타깃 문서

	const isDocPiPSupported =
		typeof window !== 'undefined' && 'documentPictureInPicture' in window;

	// 오프스크린 배치(보이지 않게 + 크기 측정 가능)
	const applyOffscreen = (el: HTMLElement | null) => {
		if (!el) return;
		Object.assign(el.style, {
			position: 'fixed',
			top: '-10000px',
			left: '-10000px',
			width: '320px',
		} as CSSStyleDeclaration);
	};

	// 스타일 복사(임베디드 <style>과 외부 <link>)
	const copyStyles = (targetDoc: Document) => {
		Array.from(document.styleSheets).forEach((ss: any) => {
			try {
				const css = Array.from(ss.cssRules).map((r: any) => r.cssText).join('');
				const style = targetDoc.createElement('style');
				style.textContent = css;
				targetDoc.head.appendChild(style);
			} catch {
				if (ss.href) {
					const link = targetDoc.createElement('link');
					link.rel = 'stylesheet';
					link.href = ss.href;
					targetDoc.head.appendChild(link);
				}
			}
		});
	};

	const openPiP = useCallback(async () => {
		if (!isDocPiPSupported) {
			return 
		}
		// @ts-ignore
		const api = (window as any).documentPictureInPicture;

		const rect = measureRef.current?.getBoundingClientRect();
		const width = Math.max(260, Math.round(rect?.width || 320));
		const height = Math.max(160, Math.round(rect?.height || 200));

		const pipWindow: PipWindow = await api.requestWindow?.({
			width,
			height,
			disallowReturnToOpener: true,
			preferInitialWindowPlacement: true,
		});

		pipWinRef.current = pipWindow;

		// PiP 문서 초기화
		copyStyles(pipWindow.document);
		pipWindow.document.body.className = 'bg-white';
		pipWindow.document.body.style.margin = '0';
		pipWindow.document.body.style.display = 'grid';
		pipWindow.document.body.style.placeItems = 'center';
		pipWindow.document.title = 'Mini Panel';

		// ★ 포털 타깃 설정: 이후 createPortal로 렌더
		setPipDoc(pipWindow.document);

		// 닫힘 감지
		const handleClose = () => {
			setPipDoc(null);
			pipWinRef.current = null;
		};
		pipWindow.addEventListener('pagehide', handleClose, { once: true });
	}, [isDocPiPSupported]);

	const closePiP = useCallback(() => {
		pipWinRef.current?.close();
	}, []);

	useImperativeHandle(ref, () => ({ open: openPiP, close: closePiP }), [openPiP, closePiP]);

	// 상태 동기화(예시)
	useEffect(() => {
		const ch = new BroadcastChannel('custom-pip');
		ch.onmessage = (ev) => { if (ev.data?.type === 'INC') setCount((c) => c + 1); };
		return () => ch.close();
	}, []);

	// isRunning 변화에 따른 자동 관리
	useEffect(() => {
		if (!('documentPictureInPicture' in window)) return;
		if (isRunning) {
			openPiP().catch(() => {}); // 최초엔 제스처 필요 → 실패해도 무시
		} else {
			closePiP();
		}
	}, [isRunning, openPiP, closePiP]);

	// 오프스크린 프리뷰 준비 & 정리
	useEffect(() => {
		applyOffscreen(measureRef.current);
		return () => closePiP();
	}, [closePiP]);

	return (
		<>
			{/* 오프스크린 측정용 프리뷰 (페이지엔 보이지 않음) */}
			<div ref={measureRef}>
				<Widget time={threshold} pipFlick={pipFlick} />
			</div>

			{/* PiP 윈도우에 포털로 렌더 */}
			{pipDoc && createPortal(
				<Widget time={threshold} pipFlick={pipFlick} />,
				pipDoc.body
			)}
		</>
	);
});

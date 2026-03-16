import { createElement, useRef, useCallback, useEffect, useState, ReactElement } from "react";
import {
    minutesToPercent,
    minutesToTimeString,
    positionToMinutes,
    clamp,
    generateHourLabels
} from "./timeUtils";

export interface TimelineTrackProps {
    startMinutes: number;
    endMinutes: number;
    rangeStart: number;
    rangeEnd: number;
    snapInterval: number;
    readOnly: boolean;
    onStartChange: (minutes: number) => void;
    onEndChange: (minutes: number) => void;
    onRangeShift: (deltaMinutes: number) => void;
}

type DragTarget = "start" | "end" | "range" | null;

export function TimelineTrack({
    startMinutes,
    endMinutes,
    rangeStart,
    rangeEnd,
    snapInterval,
    readOnly,
    onStartChange,
    onEndChange,
    onRangeShift
}: TimelineTrackProps): ReactElement {
    const trackRef = useRef<HTMLDivElement>(null);
    const [dragTarget, setDragTarget] = useState<DragTarget>(null);
    const dragOrigin = useRef<number>(0);
    const dragStartVal = useRef<number>(0);

    const getTrackRect = useCallback((): DOMRect | null => {
        return trackRef.current?.getBoundingClientRect() ?? null;
    }, []);

    // --- Pointer handlers ---
    const handlePointerDown = useCallback(
        (target: DragTarget, e: React.PointerEvent) => {
            if (readOnly) return;
            e.preventDefault();
            e.stopPropagation();
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            setDragTarget(target);
            dragOrigin.current = e.clientX;

            if (target === "range") {
                dragStartVal.current = startMinutes;
            }
        },
        [readOnly, startMinutes]
    );

    const handlePointerMove = useCallback(
        (e: PointerEvent) => {
            if (!dragTarget) return;
            const rect = getTrackRect();
            if (!rect) return;

            if (dragTarget === "start") {
                const mins = positionToMinutes(e.clientX, rect, rangeStart, rangeEnd, snapInterval);
                const clamped = clamp(mins, rangeStart, endMinutes - snapInterval);
                onStartChange(clamped);
            } else if (dragTarget === "end") {
                const mins = positionToMinutes(e.clientX, rect, rangeStart, rangeEnd, snapInterval);
                const clamped = clamp(mins, startMinutes + snapInterval, rangeEnd);
                onEndChange(clamped);
            } else if (dragTarget === "range") {
                const pxDelta = e.clientX - dragOrigin.current;
                const pxPerMinute = rect.width / (rangeEnd - rangeStart);
                const rawDelta = pxDelta / pxPerMinute;
                const snappedDelta = Math.round(rawDelta / snapInterval) * snapInterval;
                onRangeShift(snappedDelta);
            }
        },
        [dragTarget, getTrackRect, rangeStart, rangeEnd, snapInterval, startMinutes, endMinutes, onStartChange, onEndChange, onRangeShift]
    );

    const handlePointerUp = useCallback(() => {
        setDragTarget(null);
    }, []);

    useEffect(() => {
        if (dragTarget) {
            window.addEventListener("pointermove", handlePointerMove);
            window.addEventListener("pointerup", handlePointerUp);
            return () => {
                window.removeEventListener("pointermove", handlePointerMove);
                window.removeEventListener("pointerup", handlePointerUp);
            };
        }
    }, [dragTarget, handlePointerMove, handlePointerUp]);

    // --- Computed positions ---
    const startPercent = minutesToPercent(startMinutes, rangeStart, rangeEnd);
    const endPercent = minutesToPercent(endMinutes, rangeStart, rangeEnd);
    const hourLabels = generateHourLabels(rangeStart, rangeEnd);

    const showStartTooltip = dragTarget === "start" || dragTarget === "range";
    const showEndTooltip = dragTarget === "end" || dragTarget === "range";

    return (
        <div className="timeline-track-wrapper">
            <div
                ref={trackRef}
                className={`timeline-track${readOnly ? " timeline-track--readonly" : ""}`}
            >
                {/* Range fill (draggable middle) */}
                <div
                    className={`timeline-range-fill${readOnly ? " timeline-range-fill--readonly" : ""}`}
                    style={{
                        left: `${startPercent}%`,
                        width: `${endPercent - startPercent}%`
                    }}
                    onPointerDown={(e) => handlePointerDown("range", e)}
                />

                {/* Start handle */}
                <div
                    className={`timeline-handle timeline-handle--start${readOnly ? " timeline-handle--readonly" : ""}`}
                    style={{ left: `${startPercent}%` }}
                    onPointerDown={(e) => handlePointerDown("start", e)}
                    role="slider"
                    aria-label="Start time"
                    aria-valuemin={rangeStart}
                    aria-valuemax={rangeEnd}
                    aria-valuenow={startMinutes}
                    aria-valuetext={minutesToTimeString(startMinutes)}
                    tabIndex={readOnly ? -1 : 0}
                >
                    <span
                        className={`timeline-tooltip${showStartTooltip ? " timeline-tooltip--visible" : ""}`}
                    >
                        {minutesToTimeString(startMinutes)}
                    </span>
                </div>

                {/* End handle */}
                <div
                    className={`timeline-handle timeline-handle--end${readOnly ? " timeline-handle--readonly" : ""}`}
                    style={{ left: `${endPercent}%` }}
                    onPointerDown={(e) => handlePointerDown("end", e)}
                    role="slider"
                    aria-label="End time"
                    aria-valuemin={rangeStart}
                    aria-valuemax={rangeEnd}
                    aria-valuenow={endMinutes}
                    aria-valuetext={minutesToTimeString(endMinutes)}
                    tabIndex={readOnly ? -1 : 0}
                >
                    <span
                        className={`timeline-tooltip${showEndTooltip ? " timeline-tooltip--visible" : ""}`}
                    >
                        {minutesToTimeString(endMinutes)}
                    </span>
                </div>
            </div>

            {/* Hour tick marks */}
            <div className="timeline-ticks">
                {hourLabels.map((tick) => (
                    <div
                        key={tick.minutes}
                        className="timeline-tick"
                        style={{ left: `${tick.percent}%` }}
                    >
                        <div className="timeline-tick__line" />
                        <span className="timeline-tick__label">{tick.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

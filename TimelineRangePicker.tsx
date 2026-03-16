import { createElement, ReactElement, useCallback, useRef } from "react";
import { ValueStatus } from "mendix";
import Big from "big.js";

import { TimelineRangePickerContainerProps } from "../typings/TimelineRangePickerProps";
import { TimelineTrack } from "./components/TimelineTrack";
import { TimeBadges } from "./components/TimeBadges";
import {
    dateToMinutes,
    minutesToDate,
    calcDuration,
    clamp,
    getSnapValue,
    snapToInterval,
} from "./utils/timeUtils";

import "./ui/TimelineRangePicker.css";

export default function TimelineRangePicker(props: TimelineRangePickerContainerProps): ReactElement {
    const {
        name,
        class: className,
        style,
        tabIndex,
        startTime,
        endTime,
        duration,
        rangeStart,
        rangeEnd,
        snapMinutes,
    } = props;

    const snapInterval = getSnapValue(snapMinutes);

    // --- Determine readOnly state ---
    const isReadOnly =
        startTime.readOnly ||
        endTime.readOnly ||
        startTime.status !== ValueStatus.Available ||
        endTime.status !== ValueStatus.Available;

    // --- Read current values (with safe defaults) ---
    const now = new Date();
    const startDate = startTime.value ?? now;
    const endDate = endTime.value ?? now;
    const startMins = dateToMinutes(startDate);
    const endMins = dateToMinutes(endDate);

    // Keep a ref to the original start for range-shift delta calculations
    const rangeShiftOrigin = useRef<{ start: number; end: number }>({ start: startMins, end: endMins });

    // --- Write helpers ---
    const commitValues = useCallback(
        (newStart: number, newEnd: number) => {
            const baseDate = startTime.value ?? new Date();

            if (startTime.status === ValueStatus.Available && !startTime.readOnly) {
                startTime.setValue(minutesToDate(baseDate, newStart));
            }
            if (endTime.status === ValueStatus.Available && !endTime.readOnly) {
                endTime.setValue(minutesToDate(baseDate, newEnd));
            }
            if (duration.status === ValueStatus.Available && !duration.readOnly) {
                duration.setValue(new Big(calcDuration(newStart, newEnd)));
            }
        },
        [startTime, endTime, duration]
    );

    // --- Handle callbacks ---
    const handleStartChange = useCallback(
        (newStartMins: number) => {
            commitValues(newStartMins, endMins);
        },
        [commitValues, endMins]
    );

    const handleEndChange = useCallback(
        (newEndMins: number) => {
            commitValues(startMins, newEndMins);
        },
        [commitValues, startMins]
    );

    const handleRangeShift = useCallback(
        (deltaMinutes: number) => {
            const dur = endMins - startMins;
            let newStart = snapToInterval(
                clamp(rangeShiftOrigin.current.start + deltaMinutes, rangeStart, rangeEnd - dur),
                snapInterval
            );
            let newEnd = newStart + dur;

            // Safeguard: keep within bounds
            if (newEnd > rangeEnd) {
                newEnd = snapToInterval(rangeEnd, snapInterval);
                newStart = newEnd - dur;
            }
            if (newStart < rangeStart) {
                newStart = snapToInterval(rangeStart, snapInterval);
                newEnd = newStart + dur;
            }

            commitValues(newStart, newEnd);
        },
        [commitValues, startMins, endMins, rangeStart, rangeEnd, snapInterval]
    );

    // Update range-shift origin when not actively dragging
    // (this is re-captured on pointerdown in the track component)
    rangeShiftOrigin.current = { start: startMins, end: endMins };

    const durationMins = calcDuration(startMins, endMins);

    // --- Loading state ---
    if (startTime.status === ValueStatus.Loading || endTime.status === ValueStatus.Loading) {
        return <div className={`timeline-range-picker ${className}`} style={style} />;
    }

    return (
        <div
            className={`timeline-range-picker ${className}`}
            style={style}
            tabIndex={tabIndex}
            data-mendix-widget={name}
        >
            <TimelineTrack
                startMinutes={startMins}
                endMinutes={endMins}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                snapInterval={snapInterval}
                readOnly={isReadOnly}
                onStartChange={handleStartChange}
                onEndChange={handleEndChange}
                onRangeShift={handleRangeShift}
            />
            <TimeBadges
                startMinutes={startMins}
                endMinutes={endMins}
                durationMinutes={durationMins}
            />
        </div>
    );
}

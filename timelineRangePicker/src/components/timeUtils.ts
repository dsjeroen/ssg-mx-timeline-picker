import { SnapMinutesEnum } from "../../typings/TimelineRangePickerProps";

/** Map enum keys to numeric snap values */
const SNAP_MAP: Record<SnapMinutesEnum, number> = {
    one: 1,
    five: 5,
    fifteen: 15,
    thirty: 30
};

/** Resolve snap enum to numeric minutes */
export function getSnapValue(snap: SnapMinutesEnum): number {
    return SNAP_MAP[snap];
}

/** Snap a minute value to the nearest interval */
export function snapToInterval(minutes: number, interval: number): number {
    return Math.round(minutes / interval) * interval;
}

/** Clamp a value between min and max (inclusive) */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/** Convert total minutes from midnight to "HH:mm" string (24h format) */
export function minutesToTimeString(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Extract total minutes from midnight from a Date object */
export function dateToMinutes(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
}

/** Apply a minutes-from-midnight value to an existing Date, preserving the date portion */
export function minutesToDate(baseDate: Date, totalMinutes: number): Date {
    const result = new Date(baseDate);
    result.setHours(Math.floor(totalMinutes / 60), totalMinutes % 60, 0, 0);
    return result;
}

/** Calculate duration in minutes between two minute values */
export function calcDuration(startMinutes: number, endMinutes: number): number {
    return Math.max(0, endMinutes - startMinutes);
}

/** Convert a pixel position on the track to minutes */
export function positionToMinutes(
    clientX: number,
    trackRect: DOMRect,
    rangeStart: number,
    rangeEnd: number,
    snapInterval: number
): number {
    const ratio = clamp((clientX - trackRect.left) / trackRect.width, 0, 1);
    const raw = rangeStart + ratio * (rangeEnd - rangeStart);
    return snapToInterval(raw, snapInterval);
}

/** Convert minutes to a percentage position within the range */
export function minutesToPercent(minutes: number, rangeStart: number, rangeEnd: number): number {
    const span = rangeEnd - rangeStart;
    if (span <= 0) return 0;
    return clamp(((minutes - rangeStart) / span) * 100, 0, 100);
}

/** Generate hour labels for the timeline tick marks */
export function generateHourLabels(
    rangeStart: number,
    rangeEnd: number
): Array<{ minutes: number; label: string; percent: number }> {
    const labels: Array<{ minutes: number; label: string; percent: number }> = [];
    const firstHour = Math.ceil(rangeStart / 60) * 60;
    for (let m = firstHour; m <= rangeEnd; m += 60) {
        labels.push({
            minutes: m,
            label: minutesToTimeString(m),
            percent: minutesToPercent(m, rangeStart, rangeEnd)
        });
    }
    return labels;
}

/** Format duration as "Xh Ym" */
export function formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
}

import { ReactElement } from "react";
import { minutesToTimeString, formatDuration } from "../components/timeUtils";

export interface TimeBadgesProps {
    startMinutes: number;
    endMinutes: number;
    durationMinutes: number;
}

export function TimeBadges({ startMinutes, endMinutes, durationMinutes }: TimeBadgesProps): ReactElement {
    return (
        <div className="timeline-badges">
            <div className="timeline-badge">
                <span className="timeline-badge__label">Van</span>
                <span className="timeline-badge__value timeline-badge__value--start">
                    {minutesToTimeString(startMinutes)}
                </span>
            </div>
            <div className="timeline-badge">
                <span className="timeline-badge__label">Tot</span>
                <span className="timeline-badge__value timeline-badge__value--end">
                    {minutesToTimeString(endMinutes)}
                </span>
            </div>
            <div className="timeline-badge">
                <span className="timeline-badge__label">Duur</span>
                <span className="timeline-badge__value timeline-badge__value--duration">
                    {formatDuration(durationMinutes)}
                </span>
            </div>
        </div>
    );
}

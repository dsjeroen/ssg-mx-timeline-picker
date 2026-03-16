/**
 * This file was generated from TimelineRangePicker.xml
 * WARNING: All changes to this file will be overwritten on next build.
 * @author Mendix Widgets Framework
 */
import { EditableValue } from "mendix";
import Big from "big.js";

export type SnapMinutesEnum = "one" | "five" | "fifteen" | "thirty";

export interface TimelineRangePickerContainerProps {
    name: string;
    class: string;
    style?: React.CSSProperties;
    tabIndex?: number;
    startTime: EditableValue<Date>;
    endTime: EditableValue<Date>;
    duration: EditableValue<Big>;
    rangeStart: number;
    rangeEnd: number;
    snapMinutes: SnapMinutesEnum;
}

export interface TimelineRangePickerPreviewProps {
    className: string;
    style: string;
    styleObject?: React.CSSProperties;
    readOnly: boolean;
    startTime: string;
    endTime: string;
    duration: string;
    rangeStart: number | null;
    rangeEnd: number | null;
    snapMinutes: SnapMinutesEnum;
}

/**
 * This file was generated from TimelineRangePicker.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { EditableValue } from "mendix";
import { Big } from "big.js";

export type SnapMinutesEnum = "one" | "five" | "fifteen" | "thirty";

export interface TimelineRangePickerContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    startTime: EditableValue<Date>;
    endTime: EditableValue<Date>;
    duration: EditableValue<Big>;
    rangeStart: number;
    rangeEnd: number;
    snapMinutes: SnapMinutesEnum;
}

export interface TimelineRangePickerPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    startTime: string;
    endTime: string;
    duration: string;
    rangeStart: number | null;
    rangeEnd: number | null;
    snapMinutes: SnapMinutesEnum;
}

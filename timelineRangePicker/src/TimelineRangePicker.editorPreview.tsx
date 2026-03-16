import { ReactElement } from "react";
import { HelloWorldSample } from "./components/HelloWorldSample";
import { TimelineRangePickerPreviewProps } from "../typings/TimelineRangePickerProps";

export function preview({ sampleText }: TimelineRangePickerPreviewProps): ReactElement {
    return <HelloWorldSample sampleText={sampleText} />;
}

export function getPreviewCss(): string {
    return require("./ui/TimelineRangePicker.css");
}

import { createElement, ReactElement } from "react";
import { TimelineRangePickerPreviewProps } from "../typings/TimelineRangePickerProps";

export function preview(_props: TimelineRangePickerPreviewProps): ReactElement {
    return (
        <div
            style={{
                width: "100%",
                padding: "16px",
                background: "#1e293b",
                borderRadius: "8px",
                fontFamily: "inherit"
            }}
        >
            {/* Track preview */}
            <div
                style={{
                    position: "relative",
                    height: "8px",
                    background: "#334155",
                    borderRadius: "4px",
                    marginBottom: "24px"
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        left: "25%",
                        width: "25%",
                        height: "100%",
                        borderRadius: "4px",
                        background: "linear-gradient(90deg, rgba(34,211,238,0.35), rgba(244,63,94,0.35))"
                    }}
                />
            </div>
            {/* Badge preview */}
            <div style={{ display: "flex", gap: "12px" }}>
                <span style={{ color: "#22d3ee", fontSize: "12px", fontWeight: 600 }}>Van 09:00</span>
                <span style={{ color: "#f43f5e", fontSize: "12px", fontWeight: 600 }}>Tot 12:00</span>
                <span style={{ color: "#f1f5f9", fontSize: "12px", fontWeight: 600 }}>Duur 3h</span>
            </div>
        </div>
    );
}

export function getPreviewCss(): string {
    return "";
}

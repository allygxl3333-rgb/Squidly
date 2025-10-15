"use client";
import React from "react";

export default function LinkControls() {
    const [enabled, setEnabled] = React.useState(false);

    React.useEffect(() => {
        const on = localStorage.getItem("acc:emphasize-links") === "1";
        setEnabled(on);
    }, []);
    React.useEffect(() => {
        localStorage.setItem("acc:emphasize-links", enabled ? "1" : "0");
        const ev = new CustomEvent("acc:emphasize-links", { detail: { enabled } });
        window.dispatchEvent(ev);
    }, [enabled]);

    return (
        <div className="acc-card">{/* ← 只有这一层卡片，不再嵌套 */}
            <div className="acc-row">
                <div className="acc-title">Emphasize links</div>
                <button
                    role="switch"
                    aria-checked={enabled}
                    data-on={enabled ? "1" : "0"}
                    className="acc-switch"
                    onClick={() => setEnabled(v => !v)}
                />
            </div>
            <div className="acc-sub">Underline + highlight links together for easier scanning.</div>
        </div>
    );
}

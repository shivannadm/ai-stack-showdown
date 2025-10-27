"use client";
import React, { useState } from "react";

export default function ChatClient() {
    const [prompt, setPrompt] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e?: React.FormEvent) {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);
        setAnswer("");

        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) {
                const err = await res.text();
                throw new Error(err || `HTTP ${res.status}`);
            }

            const data = await res.json();
            setAnswer(data.text ?? data.response ?? "");
            setPrompt("");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h3 style={{ marginBottom: '16px' }}>Ask the model</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Type a prompt..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <button type="submit" disabled={loading || !prompt.trim()}>
                        {loading ? "Thinking..." : "Send"}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setPrompt("");
                            setAnswer("");
                            setError(null);
                        }}
                    >
                        Clear
                    </button>
                </div>
            </form>

            <div style={{ marginTop: 20 }}>
                <h4 style={{ marginBottom: '12px' }}>Response</h4>
                {answer && (
                    <pre style={{ 
                        whiteSpace: "pre-wrap", 
                        background: 'rgba(0, 0, 0, 0.2)',
                        padding: '12px',
                        borderRadius: '6px',
                        minHeight: '40px'
                    }}>
                        {answer}
                    </pre>
                )}
                {!answer && !error && (
                    <div style={{ color: 'var(--muted)', fontSize: '14px' }}>
                        No response yet
                    </div>
                )}
                {error && <div style={{ color: "salmon", marginTop: '12px' }}>{error}</div>}
            </div>
        </div>
    );
}

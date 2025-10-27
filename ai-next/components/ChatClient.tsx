// components/ChatClient.tsx
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
            // optional: after send, you may revalidate history by fetching /api/history
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h3>Ask the model</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Type a prompt..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
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

            <div style={{ marginTop: 12 }}>
                <h4>Response</h4>
                <pre style={{ whiteSpace: "pre-wrap", minHeight: 40 }}>{answer}</pre>
                {error && <div style={{ color: "salmon" }}>{error}</div>}
            </div>
        </div>
    );
}

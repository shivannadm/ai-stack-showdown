// components/History.tsx
"use client";
import React, { useEffect, useState } from "react";
import { MessageRecord } from "../lib/types";

export default function History() {
    const [rows, setRows] = useState<MessageRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    async function fetchHistory() {
        setLoading(true);
        try {
            const res = await fetch("/api/history");
            if (!res.ok) throw new Error("Failed to load history");
            const data = await res.json();
            setRows(data);
        } catch (err) {
            console.error(err);
            setRows([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="small">Most recent first</div>
                <button onClick={fetchHistory}>Refresh</button>
            </div>

            <div className="history-list" style={{ marginTop: 12 }}>
                {loading && <div className="small">Loading...</div>}
                {!loading && rows.length === 0 && <div className="small">No history yet.</div>}
                {rows.map((r) => (
                    <div key={String(r._id ?? r.createdAt)} className="history-item">
                        <div className="small">{new Date(r.createdAt).toLocaleString()}</div>
                        <strong>Prompt:</strong>
                        <div>{r.prompt}</div>
                        <strong>Response:</strong>
                        <div style={{ whiteSpace: "pre-wrap" }}>{r.response}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

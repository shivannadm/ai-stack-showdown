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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>History</h3>
                <button onClick={fetchHistory} style={{ padding: '8px 16px' }}>
                    Refresh
                </button>
            </div>

            <div className="small" style={{ marginBottom: '12px' }}>
                Most recent first
            </div>

            <div className="history-list">
                {loading && <div className="small">Loading...</div>}
                {!loading && rows.length === 0 && <div className="small">No history yet.</div>}
                {rows.map((r) => (
                    <div key={String(r._id ?? r.createdAt)} className="history-item">
                        <div className="small" style={{ marginBottom: '8px' }}>
                            {new Date(r.createdAt).toLocaleString()}
                        </div>
                        <strong>Prompt:</strong>
                        <div style={{ marginBottom: '8px' }}>{r.prompt}</div>
                        <strong>Response:</strong>
                        <div style={{ whiteSpace: "pre-wrap" }}>{r.response}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

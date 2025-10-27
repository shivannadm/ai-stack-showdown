// app/page.tsx
"use client";
import React from "react";
import ChatClient from "../components/ChatClient";
import History from "../components/History";

export default function Page() {
    return (
        <main>
            <div className="card">
                <ChatClient />
            </div>

            <div style={{ height: 18 }} />

            <div className="card">
                <h3>History</h3>
                <History />
            </div>
        </main>
    );
}

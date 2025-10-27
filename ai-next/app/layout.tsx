// app/layout.tsx
import './globals.css';
import React from 'react';

export const metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME || "AI Next Demo",
    description: "Simple Next.js + OpenAI + MongoDB scaffold",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <div className="container">
                    <header style={{ marginBottom: 18 }}>
                        <h1 style={{ margin: 0 }}>{process.env.NEXT_PUBLIC_APP_NAME || "AI Next Demo"}</h1>
                        <p className="small">Prompt → OpenAI → MongoDB (history)</p>
                    </header>
                    {children}
                </div>
            </body>
        </html>
    );
}

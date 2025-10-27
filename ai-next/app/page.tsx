import ChatClient from "@/components/ChatClient";
import History from "@/components/History";

export default function Home() {
  return (
    <main className="container">
      <h1 style={{ 
        marginBottom: '8px', 
        fontSize: '48px', 
        fontWeight: 'bold',
        letterSpacing: '-0.02em'
      }}>
        AI Next App
      </h1>
      
      <p style={{ 
        marginBottom: '32px', 
        color: 'var(--muted)',
        fontSize: '16px'
      }}>
        Prompt → OpenAI → MongoDB (history)
      </p>
      
      <div className="card">
        <ChatClient />
      </div>

      <div className="card">
        <History />
      </div>
    </main>
  );
}

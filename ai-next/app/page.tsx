import ChatClient from "@/components/ChatClient";
import History from "@/components/History";

export default function Home() {
  return (
    <main className="container">
      <h1 style={{ marginBottom: '32px', fontSize: '32px', fontWeight: 'bold' }}>
        AI Stack Showdown
      </h1>
      
      <div className="card">
        <ChatClient />
      </div>

      <div className="card">
        <h3>Conversation History</h3>
        <History />
      </div>
    </main>
  );
}

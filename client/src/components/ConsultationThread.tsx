import { Send } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

export type ThreadMessage = {
  id: number;
  sender: "client" | "admin";
  content: string;
  createdAt: Date;
};

type ConsultationThreadProps = {
  messages: ThreadMessage[];
  viewer: "client" | "admin";
  onSend: (content: string) => void;
  sending?: boolean;
  placeholder?: string;
};

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }).format(new Date(date));
}

export function ConsultationThread({ messages, viewer, onSend, sending = false, placeholder = "Mesajınızı yazın..." }: ConsultationThreadProps) {
  const [content, setContent] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages.length]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextContent = content.trim();
    if (!nextContent || sending) return;
    onSend(nextContent);
    setContent("");
  };

  return <div className="consultation-thread">
    <div className="thread-scroll" aria-live="polite">
      {messages.length === 0 && <div className="thread-empty">Görüşmeniz için ayrılan alan hazır. Dilerseniz ilk mesajınızı bırakabilirsiniz.</div>}
      {messages.map(message => <div key={message.id} className={`thread-message ${message.sender === viewer ? "mine" : "theirs"}`}>
        <div className="thread-message-meta"><span>{message.sender === viewer ? "Siz" : "DermaMatch"}</span><time>{formatTime(message.createdAt)}</time></div>
        <p>{message.content}</p>
      </div>)}
      <div ref={endRef} />
    </div>
    <form className="thread-compose" onSubmit={submit}>
      <textarea value={content} onChange={event => setContent(event.target.value)} placeholder={placeholder} rows={1} maxLength={1600} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} />
      <button type="submit" aria-label="Mesaj gönder" disabled={!content.trim() || sending}><Send size={17} /></button>
    </form>
  </div>;
}

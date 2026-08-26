import { ArrowLeft, Clock3, Loader2, ShieldCheck } from "lucide-react";
import { Link, useRoute } from "wouter";
import { ConsultationThread } from "@/components/ConsultationThread";
import { trpc } from "@/lib/trpc";

function formatExpiry(value: Date) {
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function ConversationPage() {
  const [, params] = useRoute("/gorusme/:token");
  const token = params?.token ?? "";
  const utils = trpc.useUtils();
  const conversation = trpc.consultation.session.get.useQuery({ token }, { enabled: Boolean(token), refetchInterval: 7000, retry: false });
  const sendMessage = trpc.consultation.session.sendMessage.useMutation({ onSuccess: () => utils.consultation.session.get.invalidate({ token }) });

  if (conversation.isLoading) return <main className="secure-room loading-room"><Loader2 className="spin" size={27} /><p>Güvenli görüşme alanı hazırlanıyor…</p></main>;
  if (conversation.error || !conversation.data) return <main className="secure-room invalid-room"><div className="room-card"><ShieldCheck size={28} /><p className="room-eyebrow">DERMAMATCH · GÜVENLİ GÖRÜŞME</p><h1>Bu bağlantı artık açık değil.</h1><p>Bağlantı süresi dolmuş, iptal edilmiş veya geçersiz olabilir. Yeni bir görüşme talebi için ana sayfaya dönebilirsiniz.</p><Link href="/#randevu" className="room-link"><ArrowLeft size={16} /> Ana sayfaya dön</Link></div></main>;

  return <main className="secure-room"><div className="secure-room-shell"><header className="secure-room-header"><Link href="/" className="room-brand">DERMAMATCH <span>GÜVENLİ GÖRÜŞME</span></Link><div className="room-expiry"><Clock3 size={15} /> <span>Bağlantı {formatExpiry(conversation.data.session.expiresAt)} tarihine kadar açık</span></div></header><section className="room-intro"><p className="room-eyebrow">{conversation.data.session.consultationType.toUpperCase()}</p><h1>Merhaba {conversation.data.session.firstName},<br /><em>buradayız.</em></h1><p>Bu alan, genel bakım yaklaşımınızı konuşmak içindir. Tıbbi tanı, tedavi, reçete veya acil sağlık hizmeti sunmaz.</p></section><ConsultationThread messages={conversation.data.messages} viewer="client" sending={sendMessage.isPending} onSend={content => sendMessage.mutate({ token, content })} placeholder="Görüşmeniz için bir not bırakın..." />{sendMessage.error && <p className="thread-error">Mesaj gönderilemedi. Lütfen yeniden deneyin.</p>}</div></main>;
}

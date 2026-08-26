import { Check, Clock3, LockKeyhole, LogOut, MessageCircle, Send, ShieldAlert, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link } from "wouter";
import { ConsultationThread } from "@/components/ConsultationThread";
import { trpc } from "@/lib/trpc";

type StatusFilter = "all" | "pending" | "approved" | "rejected" | "closed";

const labels: Record<StatusFilter, string> = { all: "Tümü", pending: "Bekleyen", approved: "Açık görüşmeler", rejected: "Reddedilen", closed: "Kapatılan" };
function formatDate(value: Date) { return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }

function AdminLogin({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [password, setPassword] = useState("");
  const login = trpc.consultation.admin.login.useMutation({ onSuccess: onAuthenticated });
  const submit = (event: FormEvent) => { event.preventDefault(); login.mutate({ password }); };
  return <main className="admin-login"><Link href="/" className="admin-login-brand">DERMAMATCH <span>YÖNETİM</span></Link><form onSubmit={submit} className="admin-login-card"><div className="admin-login-icon"><LockKeyhole size={22} /></div><p className="room-eyebrow">ÖZEL ALAN</p><h1>Görüşmeleri sakinlikle yönetin.</h1><p>Başvurulara, aktif görüşmelere ve konuşma geçmişine yalnızca yetkili erişim sağlanır.</p><label>Yönetici parolası<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required /></label>{login.error && <span className="admin-error">Parola doğrulanamadı.</span>}<button disabled={login.isPending} type="submit">{login.isPending ? "Doğrulanıyor…" : "Yönetim alanına gir"}</button></form></main>;
}

function AdminWorkspace() {
  const utils = trpc.useUtils();
  const [status, setStatus] = useState<StatusFilter>("pending");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const entries = trpc.consultation.admin.list.useQuery({ status });
  const selected = trpc.consultation.admin.get.useQuery({ applicationId: selectedId ?? 0 }, { enabled: selectedId !== null });
  const refresh = () => { utils.consultation.admin.list.invalidate(); if (selectedId) utils.consultation.admin.get.invalidate({ applicationId: selectedId }); };
  const approve = trpc.consultation.admin.approve.useMutation({ onSuccess: result => { setNotice(result.emailSent ? "Görüşme açıldı ve kabul e-postası gönderildi." : `Görüşme açıldı; e-posta gönderilemedi: ${result.emailError ?? "bilinmeyen hata"}`); refresh(); } });
  const reject = trpc.consultation.admin.reject.useMutation({ onSuccess: () => { setNotice("Başvuru reddedildi."); refresh(); } });
  const revoke = trpc.consultation.admin.revoke.useMutation({ onSuccess: () => { setNotice("Görüşme bağlantısı kapatıldı."); refresh(); } });
  const sendMessage = trpc.consultation.admin.sendMessage.useMutation({ onSuccess: refresh });

  useEffect(() => { if (entries.data?.[0] && !selectedId) setSelectedId(entries.data[0].application.id); }, [entries.data, selectedId]);
  const detail = selected.data;
  const application = detail?.application;
  const session = detail?.session;

  return <main className="admin-shell"><aside className="admin-sidebar"><Link href="/" className="admin-brand">DERMAMATCH <span>YÖNETİM</span></Link><p>Danışan alanlarını dikkatle değerlendirin; yalnız gerekli veriyi görün.</p><nav>{(Object.keys(labels) as StatusFilter[]).map(filter => <button key={filter} className={status === filter ? "active" : ""} onClick={() => { setStatus(filter); setSelectedId(null); }}>{labels[filter]}</button>)}</nav><div className="admin-sidebar-foot"><ShieldAlert size={15} /> Sağlık tanısı veya tedavi önerisi oluşturmayın.</div></aside><section className="admin-list-panel"><header><div><p className="room-eyebrow">BAŞVURULAR</p><h1>{labels[status]}</h1></div><span>{entries.data?.length ?? 0}</span></header>{entries.isLoading && <p className="admin-muted">Yükleniyor…</p>}{entries.data?.map(({ application: row, session: rowSession }) => <button key={row.id} className={`application-row ${selectedId === row.id ? "selected" : ""}`} onClick={() => setSelectedId(row.id)}><span className="application-row-top"><strong>{row.fullName}</strong><em className={`status-${row.status}`}>{row.status}</em></span><span>{row.consultationType}</span><small>{formatDate(row.submittedAt)} {rowSession?.notificationStatus === "failed" ? "· e-posta hatalı" : ""}</small></button>)}{!entries.isLoading && !entries.data?.length && <p className="admin-muted">Bu görünümde başvuru yok.</p>}</section><section className="admin-detail-panel">{!application || selected.isLoading ? <div className="admin-empty">İncelemek için bir başvuru seçin.</div> : <><header className="admin-detail-header"><div><p className="room-eyebrow">{application.consultationType.toUpperCase()}</p><h2>{application.fullName}</h2><a href={`mailto:${application.email}`}>{application.email}</a></div><span className={`status-pill status-${application.status}`}>{application.status}</span></header>{notice && <p className="admin-notice">{notice}</p>}<article className="application-summary"><span>GENEL NOT</span><p>{application.inquirySummary}</p><small>Başvuru: {formatDate(application.submittedAt)} · Onam sürümü: {application.consentVersion}</small></article>{application.status === "pending" && <div className="admin-actions"><button className="approve" onClick={() => approve.mutate({ applicationId: application.id })} disabled={approve.isPending}><Check size={16} /> Kabul et</button><button className="reject" onClick={() => reject.mutate({ applicationId: application.id })} disabled={reject.isPending}><X size={16} /> Reddet</button></div>}{session && <section className="admin-chat"><div className="admin-chat-top"><div><MessageCircle size={17} /><span>Görüşme alanı</span><small><Clock3 size={13} /> {formatDate(session.expiresAt)} tarihine kadar açık</small></div>{!session.revokedAt && <button onClick={() => revoke.mutate({ sessionId: session.id })}>Bağlantıyı kapat</button>}</div><ConsultationThread messages={detail?.messages ?? []} viewer="admin" sending={sendMessage.isPending} onSend={content => sendMessage.mutate({ sessionId: session.id, content })} placeholder="Danışana bir not yazın…" /></section>}</>}</section></main>;
}

export default function AdminPage() {
  const utils = trpc.useUtils();
  const status = trpc.consultation.admin.status.useQuery(undefined, { retry: false });
  const logout = trpc.consultation.admin.logout.useMutation({ onSuccess: () => utils.consultation.admin.status.invalidate() });
  if (status.isLoading) return <main className="admin-loading">Yönetim oturumu doğrulanıyor…</main>;
  if (!status.data?.authenticated) return <AdminLogin onAuthenticated={() => utils.consultation.admin.status.invalidate()} />;
  return <><button className="admin-logout" onClick={() => logout.mutate()}><LogOut size={15} /> Çıkış</button><AdminWorkspace /></>;
}

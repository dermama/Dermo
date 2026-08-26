import { Resend } from "resend";

type ApprovalEmailParams = {
  recipientEmail: string;
  recipientName: string;
  sessionId: number;
  rawToken: string;
  expiresAt: Date;
  appUrl: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

export async function sendConsultationApprovalEmail(params: ApprovalEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return { sent: false as const, error: "E-posta gönderimi henüz yapılandırılmadı." };

  const appUrl = params.appUrl.replace(/\/$/, "");
  const conversationUrl = `${appUrl}/gorusme/${params.rawToken}`;
  const expiresAt = new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "long", timeStyle: "short", timeZone: "Europe/Istanbul",
  }).format(params.expiresAt);
  const recipientName = escapeHtml(params.recipientName);
  const socialLinks = [
    process.env.INSTAGRAM_URL ? `<a href="${process.env.INSTAGRAM_URL}" style="color:#8d4f6d">Instagram</a>` : null,
    process.env.THREADS_URL ? `<a href="${process.env.THREADS_URL}" style="color:#8d4f6d">Threads</a>` : null,
  ].filter(Boolean).join(" · ");
  const optionalSocialLine = socialLinks ? `<p style="font-size:13px;color:#6e5b63">İsterseniz diğer kanallarımızdan da bize ulaşabilirsiniz: ${socialLinks}</p>` : "";

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to: [params.recipientEmail],
    subject: "DermaMatch görüşme alanınız hazır",
    html: `<div style="font-family:Arial,sans-serif;color:#302126;line-height:1.6;max-width:600px;margin:0 auto;padding:32px 24px;background:#fffaf7"><p style="font-size:12px;letter-spacing:1.6px;color:#a05b76;margin:0 0 24px">DERMAMATCH · GÜZELLİK BİLİNCİ</p><h1 style="font-size:28px;font-weight:500;margin:0 0 18px">Merhaba ${recipientName},</h1><p>Görüşme talebiniz kabul edildi. Size özel, güvenli görüşme alanınıza aşağıdaki bağlantıdan erişebilirsiniz.</p><p style="margin:28px 0"><a href="${conversationUrl}" style="display:inline-block;background:#57243d;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:700">Görüşme alanına git</a></p><p style="font-size:14px;color:#6e5b63">Bu bağlantı <strong>${expiresAt}</strong> tarihine kadar geçerlidir. Bağlantı tamamlanan görüşmelerden sonra yönetim tarafından iptal edilebilir.</p>${optionalSocialLine}<hr style="border:0;border-top:1px solid #eadfe2;margin:28px 0" /><p style="font-size:12px;color:#817078">DermaMatch, tıbbi tanı, tedavi, reçete veya acil sağlık hizmeti sunmaz. Görüşme yalnızca genel bakım ve estetik önerisi çerçevesindedir.</p></div>`,
    text: `Merhaba ${params.recipientName},\n\nGörüşme talebiniz kabul edildi. Güvenli görüşme alanınıza buradan erişebilirsiniz: ${conversationUrl}\n\nBu bağlantı ${expiresAt} tarihine kadar geçerlidir. DermaMatch tıbbi tanı, tedavi, reçete veya acil sağlık hizmeti sunmaz.`,
    headers: { "Idempotency-Key": `consultation-approval/${params.sessionId}` },
  });

  if (error) return { sent: false as const, error: error.message };
  return { sent: true as const, deliveryId: data?.id ?? null };
}

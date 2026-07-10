import type { Transaction } from "@/app/panel/transactions/data";

const statusLabels: Record<Transaction["status"], string> = {
  success: "پرداخت موفق",
  failed: "پرداخت ناموفق",
  pending: "در انتظار پرداخت",
  refunded: "بازگشت وجه",
};

const FONT_WEIGHTS = [
  { file: "Regular.woff2", weight: 400 },
  { file: "Medium.woff2", weight: 500 },
  { file: "Bold.woff2", weight: 700 },
  { file: "Black.woff2", weight: 900 },
] as const;

let cachedFontCss: string | null = null;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

async function loadIranYekanFontCss(): Promise<string> {
  if (cachedFontCss) return cachedFontCss;

  const faces = await Promise.all(
    FONT_WEIGHTS.map(async ({ file, weight }) => {
      const response = await fetch(`/fonts/${file}`);
      if (!response.ok) {
        throw new Error(`Font load failed: ${file}`);
      }
      const base64 = arrayBufferToBase64(await response.arrayBuffer());
      return `@font-face {
  font-family: "Iran Yekan";
  src: url("data:font/woff2;base64,${base64}") format("woff2");
  font-weight: ${weight};
  font-style: normal;
  font-display: swap;
}`;
    })
  );

  cachedFontCss = faces.join("\n");
  return cachedFontCss;
}

function buildReceiptHtml(transaction: Transaction, fontCss: string): string {
  const statusLabel = statusLabels[transaction.status];
  const amountLabel = `${transaction.amount.toLocaleString("fa-IR")} تومان`;

  const rows = [
    ["شناسه تراکنش", transaction.id],
    ["تاریخ و ساعت", `${transaction.date} - ${transaction.time}`],
    ["وضعیت", statusLabel],
    ["شرح تراکنش", transaction.description],
    ["نام محصول", transaction.productTitle],
    ["روش پرداخت", transaction.paymentMethod],
    ["شماره پیگیری", transaction.trackingCode],
    ["مبلغ", amountLabel],
  ];

  const tableRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td class="label">${escapeHtml(label)}</td>
          <td class="value">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>رسید پرداخت ${escapeHtml(transaction.id)}</title>
  <style>
    ${fontCss}
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 32px 16px;
      font-family: "Iran Yekan", ui-sans-serif, system-ui, sans-serif;
      background: #f4f6f8;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .receipt {
      max-width: 720px;
      margin: 0 auto;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 20px 60px -24px rgba(15, 23, 42, 0.18);
    }
    .header {
      padding: 32px;
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      color: #fff;
    }
    .brand {
      font-size: 24px;
      font-weight: 900;
      margin: 0 0 8px;
      letter-spacing: -0.02em;
    }
    .subtitle {
      margin: 0;
      opacity: 0.94;
      font-size: 14px;
      font-weight: 500;
    }
    .body { padding: 28px 32px 32px; }
    .title {
      margin: 0 0 20px;
      font-size: 18px;
      font-weight: 900;
      color: #1e293b;
    }
    table { width: 100%; border-collapse: collapse; }
    tr + tr td { border-top: 1px solid #f1f5f9; }
    td { padding: 14px 0; vertical-align: top; }
    .label {
      width: 34%;
      color: #64748b;
      font-size: 13px;
      font-weight: 700;
      padding-left: 16px;
    }
    .value {
      font-size: 14px;
      font-weight: 800;
      color: #1e293b;
      word-break: break-word;
    }
    .amount {
      margin-top: 24px;
      padding: 20px 22px;
      border-radius: 20px;
      background: rgba(34, 197, 94, 0.08);
      border: 1px solid rgba(34, 197, 94, 0.22);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .amount-label { color: #166534; font-weight: 800; font-size: 14px; }
    .amount-value { color: #14532d; font-size: 24px; font-weight: 900; }
    .footer {
      margin-top: 24px;
      padding-top: 18px;
      border-top: 1px dashed #e2e8f0;
      color: #94a3b8;
      font-size: 12px;
      font-weight: 500;
      line-height: 1.9;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .receipt { box-shadow: none; border: none; border-radius: 0; }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1 class="brand">آکادمی اسپاتی‌کد</h1>
      <p class="subtitle">رسید پرداخت الکترونیکی</p>
    </div>
    <div class="body">
      <h2 class="title">جزئیات فاکتور</h2>
      <table>${tableRows}</table>
      <div class="amount">
        <span class="amount-label">مبلغ قابل پرداخت</span>
        <span class="amount-value">${escapeHtml(amountLabel)}</span>
      </div>
      <div class="footer">
        این رسید به‌صورت خودکار صادر شده و فاقد مهر و امضای فیزیکی است.
        <br />
        تاریخ صدور: ${escapeHtml(new Date().toLocaleString("fa-IR"))}
      </div>
    </div>
  </div>
</body>
</html>`;
}

export async function downloadTransactionReceipt(transaction: Transaction): Promise<void> {
  let fontCss = "";
  try {
    fontCss = await loadIranYekanFontCss();
  } catch {
    // If fonts fail to load, fall back to system sans — receipt still downloads.
    fontCss = "";
  }

  const html = buildReceiptHtml(transaction, fontCss);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `receipt-${transaction.id}.html`;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

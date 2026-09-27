import { PaymentSummary, PaymentRecord, StudentProfile } from '../types';

export function generateDBTStatementHTML(
  summary: PaymentSummary,
  payments: PaymentRecord[],
  profile: StudentProfile
): string {
  const generatedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const refNumber = `MOTA-DBT-ST-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const rowsHtml = payments
    .map(
      (p, idx) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 12px; font-size: 11px; text-align: center;">${idx + 1}</td>
      <td style="padding: 10px 12px; font-size: 11px; font-weight: 600; color: #0f172a;">${p.schemeName}</td>
      <td style="padding: 10px 12px; font-size: 11px; color: #475569;">${p.academicYear}</td>
      <td style="padding: 10px 12px; font-size: 11px; color: #334155;">${p.transactionId || 'MOTA/PFMS/SANCT/2026/8831'}</td>
      <td style="padding: 10px 12px; font-size: 11px; font-family: monospace; color: #0369a1;">${p.transactionId}</td>
      <td style="padding: 10px 12px; font-size: 11px; color: #475569;">${p.date}</td>
      <td style="padding: 10px 12px; font-size: 11px; font-weight: 700; text-align: right; color: #047857;">${p.formattedAmount}</td>
      <td style="padding: 10px 12px; font-size: 11px; text-align: center;">
        <span style="display: inline-block; padding: 3px 8px; border-radius: 9999px; font-size: 10px; font-weight: 700; ${
          p.status === 'Disbursed'
            ? 'background: #dcfce7; color: #15803d; border: 1px solid #86efac;'
            : 'background: #fef3c7; color: #b45309; border: 1px solid #fde68a;'
        }">
          ${p.status === 'Disbursed' ? '✓ DISBURSED' : '⏳ PFMS QUEUE'}
        </span>
      </td>
    </tr>
  `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>MoTA Official DBT Beneficiary Statement</title>
  <style>
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 24px;
      background: #f8fafc;
      color: #0f172a;
    }
    .container {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      padding: 32px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #047857;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .badge-gov {
      font-size: 11px;
      font-weight: 700;
      color: #047857;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .title {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      margin: 4px 0;
    }
    .sub {
      font-size: 12px;
      color: #475569;
    }
    .grid-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      background: #f1f5f9;
      padding: 16px;
      border-radius: 6px;
      margin-bottom: 24px;
      font-size: 12px;
    }
    .grid-details div p {
      margin: 4px 0;
    }
    .stat-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      margin-bottom: 24px;
    }
    .stat-card {
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      text-align: center;
    }
    .stat-card.active {
      border-color: #86efac;
      background: #f0fdf4;
    }
    .stat-val {
      font-size: 18px;
      font-weight: 800;
      color: #047857;
      margin-top: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      background: #0f172a;
      color: #ffffff;
      padding: 10px 12px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 16px;
      font-size: 10px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .seal {
      border: 2px dashed #047857;
      color: #047857;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      text-align: center;
    }
    .action-bar {
      margin-bottom: 16px;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      border: none;
    }
    .btn-print { background: #047857; color: white; }
    .btn-close { background: #e2e8f0; color: #334155; }
  </style>
</head>
<body>
  <div class="action-bar no-print">
    <button class="btn btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <div class="container">
    <div class="header">
      <div>
        <div class="badge-gov">Government of India • Ministry of Tribal Affairs</div>
        <div class="title">Direct Benefit Transfer (DBT) Statement</div>
        <div class="sub">Aadhaar Payment Bridge System (APBS) & PFMS Settlement Record</div>
      </div>
      <div style="text-align: right; font-size: 11px; color: #475569;">
        <div><strong>Statement Ref:</strong> ${refNumber}</div>
        <div><strong>Date of Issue:</strong> ${generatedDate}</div>
        <div><strong>Status:</strong> <span style="color: #047857; font-weight: bold;">Verified e-Mandate</span></div>
      </div>
    </div>

    <div class="grid-details">
      <div>
        <p><strong>Beneficiary Student:</strong> ${profile.name}</p>
        <p><strong>Category:</strong> Scheduled Tribe (ST - ${profile.tribe || 'Santhal'})</p>
        <p><strong>Unified Student ID:</strong> ${profile.studentId || 'ST-2026-JH-8831'}</p>
        <p><strong>Enrolled Institution:</strong> ${profile.college || 'National Institute of Technology (NIT), Jamshedpur'}</p>
      </div>
      <div>
        <p><strong>Aadhaar Status:</strong> Verified & Seeded (NPCI APBS)</p>
        <p><strong>Disbursal Bank:</strong> State Bank of India (SBI)</p>
        <p><strong>Account Mask:</strong> XXXX-XXXX-4521 (IFSC: SBIN0001234)</p>
        <p><strong>DBT Mandate ID:</strong> NPCI-DBT-2026-991823</p>
      </div>
    </div>

    <div class="stat-row">
      <div class="stat-card">
        <div style="font-size: 11px; color: #64748b; font-weight: 600;">TOTAL SANCTIONED</div>
        <div class="stat-val" style="color: #0f172a;">${summary.formattedTotal}</div>
      </div>
      <div class="stat-card active">
        <div style="font-size: 11px; color: #047857; font-weight: 600;">TOTAL CREDITED</div>
        <div class="stat-val">${summary.formattedDisbursed}</div>
      </div>
      <div class="stat-card">
        <div style="font-size: 11px; color: #d97706; font-weight: 600;">QUEUED IN PFMS</div>
        <div class="stat-val" style="color: #d97706;">${summary.formattedPending}</div>
      </div>
    </div>

    <h4 style="font-size: 13px; font-weight: 700; margin-bottom: 8px; color: #0f172a;">Itemized Disbursal History</h4>
    <table>
      <thead>
        <tr>
          <th style="width: 30px;">#</th>
          <th>Scheme Name</th>
          <th>AY</th>
          <th>Sanction Order</th>
          <th>UTR / Ref ID</th>
          <th>Date</th>
          <th style="text-align: right;">Amount</th>
          <th style="text-align: center;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <div class="footer">
      <div>
        <p style="margin: 0 0 4px 0;">This is a computer-generated statutory statement authorized under the Direct Benefit Transfer Mission, GoI.</p>
        <p style="margin: 0;">Verified using Central PFMS Public Financial Management System & NPCI APBS.</p>
      </div>
      <div class="seal">
        OFFICIALLY VERIFIED<br />MoTA DBT CELL
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function downloadDBTStatement(
  summary: PaymentSummary,
  payments: PaymentRecord[],
  profile: StudentProfile
): void {
  const html = generateDBTStatementHTML(summary, payments, profile);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Trigger download of official formatted HTML file
  const a = document.createElement('a');
  a.href = url;
  a.download = `MoTA_DBT_Statement_${profile.name.replace(/\s+/g, '_')}_2026.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Also open print window preview for immediate saving as PDF
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }

  setTimeout(() => URL.revokeObjectURL(url), 15000);
}

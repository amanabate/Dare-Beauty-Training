/**
 * Utility functions for exporting Institute Admin data to CSV and formatted PDF reports
 */

export interface ExportColumn {
  header: string;
  key: string;
}

export function exportToCSV(filename: string, headers: string[], rows: (string | number | boolean)[][]) {
  const escapeCsvCell = (cell: string | number | boolean) => {
    if (cell === null || cell === undefined) return '""';
    const str = String(cell).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map(row => row.map(escapeCsvCell).join(','))
  ].join('\n');

  // Add UTF-8 BOM so Excel opens Ethiopian characters and UTF-8 properly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generatePDFReport(title: string, subtitle: string, headers: string[], rows: (string | number)[][], summaryStats?: { label: string; value: string }[]) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to export PDF reports.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - Dare Beauty & Hair Dressing Institute</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
          
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #111;
            margin: 0;
            padding: 40px;
            background: #fff;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #E9C349;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }
          
          .brand {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .logo-badge {
            background: #111;
            color: #E9C349;
            width: 46px;
            height: 46px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Cinzel', serif;
            font-size: 22px;
            font-weight: bold;
          }
          
          .brand-title {
            font-family: 'Cinzel', serif;
            font-size: 20px;
            font-weight: 700;
            margin: 0;
            color: #111;
            letter-spacing: 0.5px;
          }
          
          .brand-sub {
            font-size: 11px;
            color: #666;
            margin-top: 2px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .report-meta {
            text-align: right;
            font-size: 11px;
            color: #555;
          }
          
          .report-meta strong {
            color: #111;
          }

          .title-section {
            margin-bottom: 25px;
          }

          h1 {
            font-family: 'Cinzel', serif;
            font-size: 24px;
            margin: 0 0 6px 0;
            color: #111;
          }

          .subtitle {
            font-size: 13px;
            color: #555;
            margin: 0;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 12px;
            margin-bottom: 25px;
          }

          .stat-card {
            background: #FAF8F5;
            border: 1px solid #E5E0D8;
            border-radius: 8px;
            padding: 10px 14px;
          }

          .stat-label {
            font-size: 10px;
            color: #777;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }

          .stat-value {
            font-size: 16px;
            font-weight: 700;
            color: #111;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 11px;
          }

          th {
            background: #111;
            color: #E9C349;
            text-align: left;
            padding: 10px 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-size: 10px;
          }

          td {
            padding: 10px 12px;
            border-bottom: 1px solid #eee;
            color: #333;
          }

          tr:nth-child(even) td {
            background-color: #FAFAFA;
          }

          .footer {
            margin-top: 40px;
            padding-top: 15px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #888;
          }

          .stamp {
            border: 1.5px dashed #D4AF37;
            padding: 6px 14px;
            border-radius: 6px;
            color: #997510;
            font-weight: bold;
            font-size: 10px;
            text-transform: uppercase;
          }

          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">
            <div class="logo-badge">D</div>
            <div>
              <div class="brand-title">DARE BEAUTY INSTITUTE</div>
              <div class="brand-sub">Official Administrative Report</div>
            </div>
          </div>
          <div class="report-meta">
            <div>Generated: <strong>${currentDate}</strong></div>
            <div>Author: <strong>Institute Admin System</strong></div>
            <div>Status: <span style="color: green; font-weight: bold;">VERIFIED</span></div>
          </div>
        </div>

        <div class="title-section">
          <h1>${title}</h1>
          <p class="subtitle">${subtitle}</p>
        </div>

        ${summaryStats && summaryStats.length > 0 ? `
          <div class="stats-grid">
            ${summaryStats.map(s => `
              <div class="stat-card">
                <div class="stat-label">${s.label}</div>
                <div class="stat-value">${s.value}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <table>
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr>
                ${row.map(cell => `<td>${cell}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <div>Dare Hair Dressing & Beauty Training Institute • Addis Ababa, Ethiopia</div>
          <div class="stamp">OFFICIAL EXPORT</div>
          <div>Page 1 of 1</div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

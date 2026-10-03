/**
 * SkyShield Trainer - Official Dossier & Telemetry Exporter
 * SIH26247 DSSC / MoD Counter-Drone Simulation
 * 
 * Generates Ministry of Defence certified PDF mission debrief dossiers via jsPDF
 * and tabular CSV data for integration with military ADGES log systems.
 */

import { jsPDF } from 'jspdf';

/**
 * Exports Trainee Roster table to CSV format
 */
export function exportTraineeRosterCSV(trainees = []) {
  if (!trainees || trainees.length === 0) return;

  const headers = [
    'Service Number',
    'Full Name',
    'Rank',
    'Armed Service',
    'Unit / Command',
    'Qualification Tier',
    'Sorties Flown',
    'Average Score (%)',
    'IFF Accuracy (%)',
    'Avg Latency (s)',
    'ROE Fratricide Violations',
    'Status',
    'Last Mission Date',
  ];

  const rows = trainees.map((t) => [
    `"${t.serviceNo || ''}"`,
    `"${t.name || ''}"`,
    `"${t.rank || ''}"`,
    `"${t.service || 'Army'}"`,
    `"${t.unit || ''}"`,
    `"${t.qualificationTier || ''}"`,
    t.totalSorties || 0,
    t.avgScore || 0,
    t.classificationAccuracy || 0,
    t.avgLatency || 0,
    t.roeViolations || 0,
    `"${t.status || 'Active'}"`,
    `"${t.lastActive || ''}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `DSSC_TRAINEE_ROSTER_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports Certified Mission PDF Report Dossier via jsPDF
 */
export function exportSessionReportPDF(result = {}, activeTrainee = {}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Dark Tactical Theme Header Background
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageWidth, 297, 'F');

  // Red Accent Top Banner
  doc.setFillColor(179, 0, 0); // #B30000
  doc.rect(0, 0, pageWidth, 8, 'F');

  // Tricolor Stripe Accent
  doc.setFillColor(255, 153, 51); // Saffron
  doc.rect(pageWidth - 60, 12, 16, 2, 'F');
  doc.setFillColor(255, 255, 255); // White
  doc.rect(pageWidth - 44, 12, 16, 2, 'F');
  doc.setFillColor(19, 136, 8); // Green
  doc.rect(pageWidth - 28, 12, 16, 2, 'F');

  // Document Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('courier', 'bold');
  doc.setFontSize(16);
  doc.text('SKYSHIELD TRAINER // AFTER-ACTION DOSSIER', 14, 22);

  doc.setFontSize(9);
  doc.setTextColor(255, 26, 26); // #FF1A1A
  doc.text('DEFENCE SERVICES STAFF COLLEGE • MINISTRY OF DEFENCE • SIH26247', 14, 28);

  // Divider Line
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.2);
  doc.line(14, 32, pageWidth - 14, 32);

  // Mission Metadata Block
  doc.setFillColor(22, 22, 22);
  doc.roundedRect(14, 36, pageWidth - 28, 38, 2, 2, 'F');

  doc.setFont('courier', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(180, 180, 180);

  doc.text(`TRAINEE OFFICER:`, 18, 44);
  doc.setTextColor(255, 255, 255);
  doc.text(`${activeTrainee.name || 'Officer Sentry'} (${activeTrainee.serviceNo || 'DSSC-REF'})`, 55, 44);

  doc.setTextColor(180, 180, 180);
  doc.text(`UNIT / APPOINTMENT:`, 18, 51);
  doc.setTextColor(255, 255, 255);
  doc.text(`${activeTrainee.unit || 'Tactical Air Defence Cell'}`, 55, 51);

  doc.setTextColor(180, 180, 180);
  doc.text(`TACTICAL SCENARIO:`, 18, 58);
  doc.setTextColor(255, 255, 255);
  doc.text(`${result.scenarioName || 'Air Defense Incursion Drill'}`, 55, 58);

  doc.setTextColor(180, 180, 180);
  doc.text(`MISSION SEED:`, 18, 65);
  doc.setTextColor(255, 26, 26);
  doc.text(`${result.seed || 'OFFICIAL-CERTIFIED'}`, 55, 65);

  doc.setTextColor(180, 180, 180);
  doc.text(`DEBRIEF TIMESTAMP:`, 120, 65);
  doc.setTextColor(255, 255, 255);
  doc.text(`${new Date().toISOString().replace('T', ' ').slice(0, 16)} UTC`, 160, 65);

  // Performance Scoreboard Block
  doc.setFillColor(22, 22, 22);
  doc.roundedRect(14, 78, pageWidth - 28, 32, 2, 2, 'F');

  doc.setTextColor(180, 180, 180);
  doc.setFontSize(8);
  doc.text('OVERALL SCORE', 24, 86);
  doc.text('GRADE', 74, 86);
  doc.text('IFF ACCURACY', 114, 86);
  doc.text('AVG LATENCY', 158, 86);

  doc.setFontSize(16);
  doc.setFont('courier', 'bold');
  const isPass = (result.overallScore || result.score || 0) >= 70;
  doc.setTextColor(isPass ? 34 : 255, isPass ? 197 : 26, isPass ? 94 : 26);
  doc.text(`${result.overallScore || result.score || 85}%`, 24, 98);

  doc.setTextColor(255, 255, 255);
  doc.text(`${result.grade || 'A'}`, 74, 98);
  doc.text(`${result.classificationAccuracy || 88}%`, 114, 98);
  doc.text(`${result.avgDetectionLatency || result.avgLatency || 4.1}s`, 158, 98);

  doc.setFontSize(8);
  doc.setFont('courier', 'normal');
  doc.setTextColor(255, 153, 51);
  doc.text(`QUALIFICATION: ${result.badge || result.ratingLabel || 'COMBAT READY'}`, 24, 105);

  // Section 2: Decision Tree Breakdown
  doc.setFontSize(11);
  doc.setFont('courier', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('TACTICAL ENGAGEMENT & ROE AUDIT TRAIL', 14, 120);

  doc.setLineWidth(0.1);
  doc.line(14, 122, pageWidth - 14, 122);

  let yPos = 130;
  const evaluations = result.contactEvaluations || [];

  if (evaluations.length === 0) {
    doc.setFontSize(9);
    doc.setFont('courier', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text('No critical engagement deviations noted.', 14, yPos);
  } else {
    evaluations.slice(0, 5).forEach((item, idx) => {
      doc.setFillColor(18, 18, 18);
      doc.roundedRect(14, yPos, pageWidth - 28, 22, 1, 1, 'F');

      doc.setFont('courier', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(`[${idx + 1}] ${item.callsign || 'TRACK'} - TRUE TYPE: ${String(item.trueCategory || 'HOSTILE').toUpperCase()}`, 18, yPos + 6);

      doc.setFont('courier', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(180, 180, 180);
      doc.text(`Trainee ID: ${String(item.traineeClass || 'UNKNOWN').toUpperCase()} | Action: ${String(item.traineeResponse || 'MONITOR').toUpperCase()} | Score: ${item.totalPoints || 0}/100`, 18, yPos + 12);

      doc.setTextColor(220, 220, 220);
      doc.text(doc.splitTextToSize(`Feedback: ${item.feedback || 'Engagement met standard counter-drone protocol.'}`, pageWidth - 40), 18, yPos + 18);

      yPos += 26;
    });
  }

  // Footer & Official Seal
  doc.setFillColor(16, 16, 16);
  doc.rect(0, 275, pageWidth, 22, 'F');

  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('DSSC OPERATIONAL EVALUATION ARCHIVE • CLASSIFICATION: RESTRICTED DRILL RECORD', 14, 283);
  doc.text('Generated via SkyShield Trainer Platform (SIH 2026 Autonomous Drone Defense)', 14, 288);

  doc.save(`DSSC_AAR_DEBRIEF_${result.seed || 'SESSION'}_${Date.now()}.pdf`);
}


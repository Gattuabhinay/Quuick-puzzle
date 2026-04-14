export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const {
    college,
    fullName,
    rollNumber,
    department,
    year,
    mobile,
    email,
    member2Name,
    member2Roll,
    transactionId
  } = req.body;

  const coordinatorNumber = '918309030400';

  const acceptMsg = `✅ *ACCEPTED - QUICK PUZZLE*%0A%0AName: ${encodeURIComponent(fullName)}%0ACollege: ${encodeURIComponent(college)}%0ARoll No: ${encodeURIComponent(rollNumber)}%0ADept: ${encodeURIComponent(department)}%0AYear: ${encodeURIComponent(year)}%0AMobile: ${encodeURIComponent(mobile)}%0ATransaction ID: ${encodeURIComponent(transactionId)}%0A%0A✅ Payment verified. Please send the group invite link to this participant.`;

  const rejectMsg = `❌ *REJECTED - QUICK PUZZLE*%0A%0AName: ${encodeURIComponent(fullName)}%0ARoll No: ${encodeURIComponent(rollNumber)}%0ATransaction ID: ${encodeURIComponent(transactionId)}%0A%0A❌ Invalid or fake UPI Transaction ID. Registration rejected.`;

  const sheetLink = `https://script.google.com/macros/s/AKfycbwY9Aomy1CLZWxJSdJD40EoJ9KdmZSVAt7eOQXBlu29AJjmxW5kCfeNjS61NXplV_2i/exec?college=${encodeURIComponent(college)}&name=${encodeURIComponent(fullName)}&rollNo=${encodeURIComponent(rollNumber)}&department=${encodeURIComponent(department)}&year=${encodeURIComponent(year)}&mobile=${encodeURIComponent(mobile)}&email=${encodeURIComponent(email || 'Not provided')}&member2Name=${encodeURIComponent(member2Name || 'N/A')}&member2Roll=${encodeURIComponent(member2Roll || 'N/A')}&transactionId=${encodeURIComponent(transactionId)}`;

  const emailHtml = `
  <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;border:1px solid #ddd;border-radius:12px;overflow:hidden">
    <div style="background:#0D1B2A;padding:24px;text-align:center">
      <h2 style="color:#F59E0B;margin:0;font-size:22px;letter-spacing:2px">⚡ QUICK PUZZLE</h2>
      <p style="color:#9CA3AF;margin:6px 0 0;font-size:13px">NNRG Tech Fest 2027 — New Registration Alert</p>
    </div>

    <div style="padding:28px;background:#fff">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr style="background:#F9FAFB">
          <td style="padding:10px 14px;font-weight:bold;color:#374151;width:38%">Full Name</td>
          <td style="padding:10px 14px;color:#111827">${fullName}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-weight:bold;color:#374151">College</td>
          <td style="padding:10px 14px;color:#111827">${college}</td>
        </tr>
        <tr style="background:#F9FAFB">
          <td style="padding:10px 14px;font-weight:bold;color:#374151">Roll Number</td>
          <td style="padding:10px 14px;color:#111827">${rollNumber}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-weight:bold;color:#374151">Department</td>
          <td style="padding:10px 14px;color:#111827">${department}</td>
        </tr>
        <tr style="background:#F9FAFB">
          <td style="padding:10px 14px;font-weight:bold;color:#374151">Year</td>
          <td style="padding:10px 14px;color:#111827">${year}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-weight:bold;color:#374151">Mobile</td>
          <td style="padding:10px 14px;color:#111827">${mobile}</td>
        </tr>
        <tr style="background:#F9FAFB">
          <td style="padding:10px 14px;font-weight:bold;color:#374151">Email</td>
          <td style="padding:10px 14px;color:#111827">${email || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-weight:bold;color:#374151">Member 2</td>
          <td style="padding:10px 14px;color:#111827">${member2Name ? `${member2Name} (${member2Roll})` : 'Solo Registration'}</td>
        </tr>
        <tr style="background:#FFF8E7">
          <td style="padding:14px;font-weight:bold;color:#B45309;font-size:15px;border-top:2px solid #F59E0B">
            💰 Transaction ID
          </td>
          <td style="padding:14px;font-weight:bold;color:#B45309;font-size:18px;border-top:2px solid #F59E0B">
            ${transactionId}
          </td>
        </tr>
      </table>

      <div style="background:#FFF8E7;border-left:4px solid #F59E0B;padding:14px 16px;margin:24px 0;border-radius:4px">
        <p style="margin:0;color:#92400E;font-size:13px;font-weight:bold">
          ⚠️ VERIFY THIS TRANSACTION ID in your UPI app (PhonePe / GPay / Paytm) before clicking Accept.
        </p>
      </div>

      <p style="color:#6B7280;font-size:13px;margin-bottom:16px;font-weight:bold">Choose an action:</p>

      <table style="width:100%;border-collapse:separate;border-spacing:8px">
        <tr>
          <td style="width:33%">
            <a href="https://wa.me/${coordinatorNumber}?text=${acceptMsg}"
               style="display:block;background:#16A34A;color:#fff;padding:16px 8px;text-decoration:none;border-radius:10px;font-weight:bold;font-size:14px;text-align:center;line-height:1.4">
              ✅ Accept<br>
              <span style="font-size:11px;font-weight:normal;opacity:0.9">Send Group Invite</span>
            </a>
          </td>
          <td style="width:33%">
            <a href="https://wa.me/${coordinatorNumber}?text=${rejectMsg}"
               style="display:block;background:#DC2626;color:#fff;padding:16px 8px;text-decoration:none;border-radius:10px;font-weight:bold;font-size:14px;text-align:center;line-height:1.4">
              ❌ Reject<br>
              <span style="font-size:11px;font-weight:normal;opacity:0.9">Fake Transaction</span>
            </a>
          </td>
          <td style="width:33%">
            <a href="${sheetLink}"
               style="display:block;background:#1D4ED8;color:#fff;padding:16px 8px;text-decoration:none;border-radius:10px;font-weight:bold;font-size:14px;text-align:center;line-height:1.4">
              📊 Spreadsheet<br>
              <span style="font-size:11px;font-weight:normal;opacity:0.9">Auto Fill Sheet</span>
            </a>
          </td>
        </tr>
      </table>
    </div>

    <div style="background:#F3F4F6;padding:14px;text-align:center;border-top:1px solid #E5E7EB">
      <p style="color:#9CA3AF;font-size:11px;margin:0">
        Auto-generated • NNRG TechFest Registration System • Do not reply to this email
      </p>
    </div>
  </div>`;

  try {
    const sgMail = (await import('@sendgrid/mail')).default;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    await sgMail.send({
      to: 'speaksphere333@gmail.com',
      from: 'speaksphere333@gmail.com',
      subject: `🧩 [Quick Puzzle] New Registration — ${fullName} | TXN: ${transactionId}`,
      html: emailHtml,
    });

    console.log('Email sent successfully to coordinator');
  } catch (err) {
    console.error('SendGrid error:', err);
    return res.status(500).json({ error: 'Email failed to send' });
  }

  res.status(200).json({ success: true });
}

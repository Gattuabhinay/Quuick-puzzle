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

  const coord = '918309030400';

  const acceptMsg = encodeURIComponent(
    `✅ ACCEPTED - QUICK PUZZLE\n\nName: ${fullName}\nCollege: ${college}\nRoll No: ${rollNumber}\nDept: ${department}\nYear: ${year}\nMobile: ${mobile}\nTransaction ID: ${transactionId}\n\n✅ Payment verified. Please send the group invite link to this participant.`
  );

  const rejectMsg = encodeURIComponent(
    `❌ REJECTED - QUICK PUZZLE\n\nName: ${fullName}\nRoll No: ${rollNumber}\nTransaction ID: ${transactionId}\n\n❌ Invalid or fake UPI Transaction ID. Registration rejected.`
  );

  const sheetLink = `https://script.google.com/macros/s/AKfycbwY9Aomy1CLZWxJSdJD40EoJ9KdmZSVAt7eOQXBlu29AJjmxW5kCfeNjS61NXplV_2i/exec?college=${encodeURIComponent(college)}&name=${encodeURIComponent(fullName)}&rollNo=${encodeURIComponent(rollNumber)}&department=${encodeURIComponent(department)}&year=${encodeURIComponent(year)}&mobile=${encodeURIComponent(mobile)}&email=${encodeURIComponent(email || 'Not provided')}&member2Name=${encodeURIComponent(member2Name || 'N/A')}&member2Roll=${encodeURIComponent(member2Roll || 'N/A')}&transactionId=${encodeURIComponent(transactionId)}`;

  const emailHtml = `
  <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;border:1px solid #ddd;border-radius:12px;overflow:hidden">
    <div style="background:#0D1B2A;padding:24px;text-align:center">
      <h2 style="color:#F59E0B;margin:0;font-size:22px;letter-spacing:2px">🧩 QUICK PUZZLE</h2>
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
          <td style="padding:10px 14px;color:#111827">${member2Name ? `${member2Name} (${member2Roll})` : 'Solo'}</td>
        </tr>
        <tr style="background:#FFF8E7">
          <td style="padding:14px;font-weight:bold;color:#B45309;font-size:15px;border-top:2px solid #F59E0B">💰 Transaction ID</td>
          <td style="padding:14px;font-weight:bold;color:#B45309;font-size:18px;border-top:2px solid #F59E0B">${transactionId}</td>
        </tr>
      </table>

      <div style="background:#FFF8E7;border-left:4px solid #F59E0B;padding:14px;margin:20px 0;border-radius:4px">
        <p style="margin:0;color:#92400E;font-size:13px;font-weight:bold">⚠️ VERIFY this Transaction ID in your UPI app before clicking Accept!</p>
      </div>

      <table style="width:100%;border-collapse:separate;border-spacing:8px">
        <tr>
          <td style="width:33%">
            <a href="https://wa.me/${coord}?text=${acceptMsg}"
               style="display:block;background:#16A34A;color:#fff;padding:16px 8px;text-decoration:none;border-radius:10px;font-weight:bold;font-size:14px;text-align:center;line-height:1.6">
              ✅ Accept<br><span style="font-size:11px;font-weight:normal">Send Group Invite</span>
            </a>
          </td>
          <td style="width:33%">
            <a href="https://wa.me/${coord}?text=${rejectMsg}"
               style="display:block;background:#DC2626;color:#fff;padding:16px 8px;text-decoration:none;border-radius:10px;font-weight:bold;font-size:14px;text-align:center;line-height:1.6">
              ❌ Reject<br><span style="font-size:11px;font-weight:normal">Fake Transaction</span>
            </a>
          </td>
          <td style="width:33%">
            <a href="${sheetLink}"
               style="display:block;background:#1D4ED8;color:#fff;padding:16px 8px;text-decoration:none;border-radius:10px;font-weight:bold;font-size:14px;text-align:center;line-height:1.6">
              📊 Sheet<br><span style="font-size:11px;font-weight:normal">Auto Fill Data</span>
            </a>
          </td>
        </tr>
      </table>
    </div>
    <div style="background:#F3F4F6;padding:12px;text-align:center;border-top:1px solid #E5E7EB">
      <p style="color:#9CA3AF;font-size:11px;margin:0">Auto-generated • NNRG TechFest System • Do not reply</p>
    </div>
  </div>`;

  try {
    const sgMail = (await import('@sendgrid/mail')).default;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send({
      to: 'speaksphere333@gmail.com',
      from: 'speaksphere333@gmail.com',
      subject: `🧩 [Quick Puzzle] ${fullName} | TXN: ${transactionId}`,
      html: emailHtml,
    });
  } catch (err) {
    console.error('SendGrid error:', err);
    return res.status(500).json({ error: 'Email failed' });
  }

  res.status(200).json({ success: true });
}


import sgMail from '@sendgrid/mail';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    college,
    fullName,
    rollNumber,
    department,
    year,
    mobile,
    email,
    preferredDomain,
    transactionId
  } = req.body;

  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const adminEmail = 'speaksphere333@gmail.com';
  const fromEmail = 'speaksphere333@gmail.com';

  const studentMsg = {
    to: email,
    from: fromEmail,
    subject: 'Registration Confirmation - QUICK PUZZLE 2027',
    text: `Hello ${fullName},\n\nThank you for registering for QUICK PUZZLE at NNRG Tech Fest 2027.\n\nRegistration Details:\nCollege: ${college}\nRoll Number: ${rollNumber}\nDepartment: ${department}\nYear: ${year}\nTransaction ID: ${transactionId}\n\nWe have received your registration and payment details. Our team will verify the transaction and confirm your slot soon.\n\nRegards,\nTeam Quick Puzzle`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #F59E0B;">Registration Received! 🧩</h2>
        <p>Hello <strong>${fullName}</strong>,</p>
        <p>Thank you for registering for <strong>QUICK PUZZLE</strong> at NNRG Tech Fest 2027.</p>
        <hr style="border: none; border-top: 1px solid #eee;" />
        <p><strong>Registration Details:</strong></p>
        <ul>
          <li><strong>College:</strong> ${college}</li>
          <li><strong>Roll Number:</strong> ${rollNumber}</li>
          <li><strong>Department:</strong> ${department}</li>
          <li><strong>Year:</strong> ${year}</li>
          <li><strong>Transaction ID:</strong> ${transactionId}</li>
        </ul>
        <p>We have received your registration and payment details. Our team will verify the transaction and confirm your slot soon.</p>
        <p>Regards,<br/><strong>Team Quick Puzzle</strong></p>
      </div>
    `,
  };

  const notificationMsg = {
    to: adminEmail,
    from: fromEmail,
    subject: `New Registration: ${fullName} - QUICK PUZZLE`,
    text: `New registration received for QUICK PUZZLE.\n\nDetails:\nName: ${fullName}\nCollege: ${college}\nRoll No: ${rollNumber}\nDept: ${department}\nYear: ${year}\nMobile: ${mobile}\nEmail: ${email}\nDomain: ${preferredDomain}\nTransaction ID: ${transactionId}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #F59E0B;">New Registration Alert 🧩</h2>
        <p>A new participant has registered for QUICK PUZZLE.</p>
        <hr style="border: none; border-top: 1px solid #eee;" />
        <p><strong>Participant Details:</strong></p>
        <ul>
          <li><strong>Name:</strong> ${fullName}</li>
          <li><strong>College:</strong> ${college}</li>
          <li><strong>Roll No:</strong> ${rollNumber}</li>
          <li><strong>Dept:</strong> ${department}</li>
          <li><strong>Year:</strong> ${year}</li>
          <li><strong>Mobile:</strong> ${mobile}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Domain:</strong> ${preferredDomain}</li>
          <li><strong>Transaction ID:</strong> ${transactionId}</li>
        </ul>
      </div>
    `,
  };

  try {
    // Send both emails
    await Promise.all([
      sgMail.send(studentMsg),
      sgMail.send(notificationMsg)
    ]);
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('SendGrid Error:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    return res.status(500).json({ error: 'Failed to send emails' });
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const {
    college, name, rollNo, department,
    year, mobile, email, member2Name,
    member2Roll, transactionId
  } = req.body;

  const coordinatorNumber = '918309030400';

  const acceptMsg = `✅ *ACCEPTED - QUICK PUZZLE*%0A%0AName: ${encodeURIComponent(name)}%0ACollege: ${encodeURIComponent(college)}%0ARoll No: ${encodeURIComponent(rollNo)}%0ADept: ${encodeURIComponent(department)}%0AYear: ${encodeURIComponent(year)}%0AMobile: ${encodeURIComponent(mobile)}%0ATransaction ID: ${encodeURIComponent(transactionId)}%0A%0A✅ Payment verified. Please send the group invite link to this participant.`;

  const rejectMsg = `❌ *REJECTED - QUICK PUZZLE*%0A%0AName: ${encodeURIComponent(name)}%0ARoll No: ${encodeURIComponent(rollNo)}%0ATransaction ID: ${encodeURIComponent(transactionId)}%0A%0A❌ Invalid/fake UPI Transaction ID. Registration rejected.`;

  const acceptLink = `https://wa.me/${coordinatorNumber}?text=${acceptMsg}`;
  const rejectLink = `https://wa.me/${coordinatorNumber}?text=${rejectMsg}`;
  const sheetLink = `https://script.google.com/macros/s/AKfycbwY9Aomy1CLZWxJSdJD40EoJ9KdmZSVAt7eOQXBlu29AJjmxW5kCfeNjS61NXplV_2i/exec?college=${encodeURIComponent(college)}&name=${encodeURIComponent(name)}&rollNo=${encodeURIComponent(rollNo)}&department=${encodeURIComponent(department)}&year=${encodeURIComponent(year)}&mobile=${encodeURIComponent(mobile)}&email=${encodeURIComponent(email || 'Not provided')}&member2Name=${encodeURIComponent(member2Name || 'N/A')}&member2Roll=${encodeURIComponent(member2Roll || 'N/A')}&transactionId=${encodeURIComponent(transactionId)}`;

  const emailHtml = `
  <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;border:1px solid #ddd;border-radius:12px;overflow:hidden">
    <div style="background:#0D1B2A;padding:24px;text-align:center">
      <h2 style="color:#F59E0B;margin:0;font-size:22px;letter-spacing:2px">QUICK PUZZLE</h2>
      <p style="color:#9CA3AF;margin:6px 0 0;font-size:13px">NNRG Tech Fest 2027 — New Registration</p>
    </div>
    <div style="padding:28px;background:#fff">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr style="background:#F9FAFB">
          <td style="padding:10px 14px;font-weight:bold;color:#374151;width:38%">Full Name</td>
          <td style="padding:10px 14px;color:#111827">${name}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-weight:bold;color:#374151">College</td>
          <td style="padding:10px 14px;color:#111827">${college}</td>
        </tr>
        <tr style="background:#F9FAFB">
          <td style="padding:10px 14px;font-weight:bold;color:#374151">Roll Number</td>
          <td style="padding:10px 14px;color:#111827">${rollNo}</td>
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
        <tr style="background:#FFF8E7;border:2px solid #F59E0B">
          <td style="padding:12px 14px;font-weight:bold;color:#B45309;font-size:15px">Transaction ID</td>
          <td style="padding:12px 14px;font-weight:bold;color:#B45309;font-size:16px">${transactionId}</td>
        </tr>
      </table>

      <div style="background:#FFF8E7;border-left:4px solid #F59E0B;padding:12px 16px;margin:20px 0;border-radius:4px">
        <p style="margin:0;color:#92400E;font-size:13px">⚠️ <strong>Please verify this Transaction ID in your UPI app (PhonePe / GPay / Paytm) before clicking Accept.</strong></p>
      </div>

      <table style="width:100%;border-collapse:separate;border-spacing:8px;margin-top:8px">
        <tr>
          <td style="width:33%">
            <a href="${acceptLink}" style="display:block;background:#16A34A;color:#fff;padding:14px 8px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:14px;text-align:center">✅ Accept<br><span style="font-size:11px;font-weight:normal">Send Group Invite</span></a>
          </td>
          <td style="width:33%">
            <a href="${rejectLink}" style="display:block;background:#DC2626;color:#fff;padding:14px 8px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:14px;text-align:center">❌ Reject<br><span style="font-size:11px;font-weight:normal">Fake Transaction</span></a>
          </td>
          <td style="width:33%">
            <a href="${sheetLink}" style="display:block;background:#1D4ED8;color:#fff;padding:14px 8px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:14px;text-align:center">📊 Spreadsheet<br><span style="font-size:11px;font-weight:normal">Auto Fill Sheet</span></a>
          </td>
        </tr>
      </table>
    </div>
    <div style="background:#F3F4F6;padding:12px;text-align:center">
      <p style="color:#9CA3AF;font-size:11px;margin:0">Auto-generated by NNRG TechFest Registration System · Do not reply</p>
    </div>
  </div>`;

  try {
    const sgMail = (await import('@sendgrid/mail')).default;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    await sgMail.send({
      to: 'speaksphere333@gmail.com',
      from: 'speaksphere333@gmail.com',
      subject: `[Quick Puzzle] New Registration — ${name} | TXN: ${transactionId}`,
      html: emailHtml,
    });
  } catch (err) {
    console.error('SendGrid error:', err);
    return res.status(500).json({ error: 'Email failed to send' });
  }

  const participantMsg = `Hello! I have registered for *QUICK PUZZLE* event at NNRG Tech Fest 2027.%0A%0A*Registration Details:*%0ACollege: ${encodeURIComponent(college)}%0AName: ${encodeURIComponent(name)}%0ARoll No: ${encodeURIComponent(rollNo)}%0ADepartment: ${encodeURIComponent(department)}%0AYear: ${encodeURIComponent(year)}%0AMobile: ${encodeURIComponent(mobile)}%0AEmail: ${encodeURIComponent(email || 'Not provided')}%0A${member2Name ? `Member 2: ${encodeURIComponent(member2Name)} (${encodeURIComponent(member2Roll)})%0A` : ''}%0A*Payment Details:*%0AAmount Paid: ₹100%0ATransaction ID: ${encodeURIComponent(transactionId)}%0A%0APlease verify my payment and confirm my registration. Thank you! 🙏`;

  res.status(200).json({
    whatsappUrl: `https://wa.me/${coordinatorNumber}?text=${participantMsg}`
  });
}


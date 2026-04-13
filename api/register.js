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

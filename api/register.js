export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    college,
    fullName: full_name,
    rollNumber: roll_number,
    department,
    year,
    mobile,
    email,
    transactionId: transaction_id
  } = req.body;

  const registrationId = `QP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const acceptUrl = 'https://quick-puzzle.nnrg.edu.in/accept'; 
  const rejectUrl = 'https://quick-puzzle.nnrg.edu.in/reject';
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/your-id';

  try {
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        templateId: Number(process.env.BREVO_TEMPLATE_ID || 5),
        to: [{ email: "gattu.abhinay333@gmail.com" }],
        params: {
          registration_id: registrationId,
          full_name: full_name,
          roll_number: roll_number,
          department: department,
          year: year,
          mobile: mobile,
          participant_email: email,
          college: college,
          transaction_id: transaction_id,
          accept_url: acceptUrl,
          reject_url: rejectUrl,
          sheet_url: sheetUrl
        }
      })
    });

    const brevoResult = await brevoResponse.json();
    console.log('Brevo response:', JSON.stringify(brevoResult));

    if (!brevoResponse.ok) {
      console.error('Brevo error:', brevoResult);
      return res.status(brevoResponse.status).json(brevoResult);
    }

    return res.status(200).json({ success: true, result: brevoResult });

  } catch (error) {
    console.error('SERVERLESS_FUNCTION_CRASH:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal Server Error',
      details: error.message 
    });
  }
}

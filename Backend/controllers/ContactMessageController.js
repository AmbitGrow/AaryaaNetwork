const { sendContactEmail } = require("../utils/sendContactEmail");
const dns = require("dns");
function isValidDomain(email) {
  return new Promise((resolve) => {
    const domain = email.split("@")[1];
    if (!domain) return resolve(false);

    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        return resolve(false);
      }
      resolve(true);
    });
  });
}
exports.handleContactForm = async (req, res) => {
  const { firstName, lastName, email, phone, address, message, selectedPlan } =
    req.body;
  const name = `${firstName} ${lastName}`;
  if (!firstName || !lastName || !email || !phone || !address || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const domainValid = await isValidDomain(email);
  if (!domainValid) {
    return res.status(400).json({ message: "Invalid or non-existent domain." });
  }

  try {
    const subject = "📬 New Contact Form Submission";

    let planDetailsHtml = "";
    if (selectedPlan) {
      planDetailsHtml = `
      <h3 style="margin-top: 24px; color: #a71d2a;">Selected Plan Details</h3>
      <table cellpadding="7" cellspacing="0" border="0" style="background: #fafaff; border-radius: 7px; width: 100%; max-width: 600px; border: 1px solid #ddd;">
        <tr><td style="font-weight: bold; width: 120px;">Speed:</td><td>${
          selectedPlan.speed
        }</td></tr>
        <tr><td style="font-weight: bold;">Duration:</td><td>${
          selectedPlan.duration
        }</td></tr>
        <tr><td style="font-weight: bold;">Provider:</td><td>${
          selectedPlan.provider
        }</td></tr>
        <tr><td style="font-weight: bold;">Type:</td><td>${
          selectedPlan.planType
        }</td></tr>
        <tr><td style="font-weight: bold;">Price:</td><td>₹${
          selectedPlan.price
        }</td></tr>
        ${
          selectedPlan.ottTier && selectedPlan.ottTier !== "None"
            ? `<tr><td style="font-weight: bold;">OTT:</td><td>${selectedPlan.ottTier}</td></tr>`
            : ""
        }
        ${
          selectedPlan.tvChannels && selectedPlan.tvChannels !== "None"
            ? `<tr><td style="font-weight: bold;">TV:</td><td>${selectedPlan.tvChannels}</td></tr>`
            : ""
        }
        ${
          selectedPlan.router && selectedPlan.router !== "None"
            ? `<tr><td style="font-weight: bold;">Router:</td><td>${selectedPlan.router}</td></tr>`
            : ""
        }
        ${
          selectedPlan.androidBox
            ? `<tr><td style="font-weight: bold;">Android Box:</td><td>Included</td></tr>`
            : ""
        }
      </table>
      `;
    }

    const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
    <h2 style="color: #651E1E;">📬 New Contact Form Submission</h2>
    
    <table cellpadding="8" cellspacing="0" border="0" style="width: 100%; max-width: 600px; background: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
      <tr>
        <td style="font-weight: bold; width: 120px;">Name:</td>
        <td>${name}</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">Email:</td>
        <td>${email}</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">Phone:</td>
        <td>${phone}</td>
      </tr>
      <tr>
        <td style="font-weight: bold;">Address:</td>
        <td>${address}</td>
      </tr>
      <tr>
        <td style="font-weight: bold; vertical-align: top;">Message:</td>
        <td style="white-space: pre-line;">${message}</td>
      </tr>
    </table>

    ${planDetailsHtml}

    <p style="margin-top: 20px; font-size: 13px; color: #888;">
      This message was sent from the contact page of your website.
    </p>
  </div>
`;

    await sendContactEmail(subject, html); // new named function

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ message: "Failed to send message." });
  }
};

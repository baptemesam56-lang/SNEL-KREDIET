import express, { type Request, type Response } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Allow cross-origin requests cleanly for /api routes (e.g., if frontend & backend are separated)
app.use('/api', (req: Request, res: Response, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  return next();
});

// Configure Hostinger SMTP Transporter
const smtpConfig = {
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: process.env.SMTP_SECURE !== 'false', // true for 465 (SSL)
  auth: {
    user: process.env.SMTP_USER || 'contact@snelkrediet.eu',
    pass: process.env.SMTP_PASS || 'Mario61153225@@@',
  },
  tls: {
    rejectUnauthorized: true,
  },
  connectionTimeout: 15000,
};

const transporter = nodemailer.createTransport(smtpConfig);

// Verify transporter on startup
transporter.verify((error) => {
  if (error) {
    console.error('❌ Hostinger SMTP verification error:', error.message);
  } else {
    console.log('✅ Hostinger SMTP server is ready to send messages via', smtpConfig.auth.user);
  }
});

const SENDER_EMAIL = process.env.SMTP_FROM || 'Snel Krediet <contact@snelkrediet.eu>';
const NOTIFICATION_DESTINATION = process.env.NOTIFICATION_EMAIL || 'contact@snelkrediet.eu';

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    emailConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
    notificationEmail: NOTIFICATION_DESTINATION,
  });
});

// Helper for currency formatting in emails
function formatEuro(num: number): string {
  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(num);
}

// Helper to safely escape user input inside HTML email templates
function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---------------------------------------------------------------------
// 1. POST /api/contact - Handle Contact Form Inquiries
// ---------------------------------------------------------------------
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, country, countryCode, subject, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Gelieve uw naam, een geldig e-mailadres en een bericht in te vullen.',
      });
    }

    const contactDate = new Date().toLocaleString('nl-BE', {
      timeZone: 'Europe/Brussels',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const safeName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || 'Niet opgegeven');
    const safeCountry = escapeHtml(
      country ? `${country}${countryCode ? ` (${String(countryCode).toUpperCase()})` : ''}` : 'België / Belgique (BE)'
    );
    const safeSubject = escapeHtml(subject || 'Algemene vraag');
    const safeMessage = escapeHtml(message);

    // 1. Email to Snel Krediet Admin (notification)
    const adminMailOptions = {
      from: SENDER_EMAIL,
      to: NOTIFICATION_DESTINATION,
      replyTo: String(email),
      subject: `[Nieuw Contactbericht] ${subject || 'Algemene vraag'} - ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
          <div style="background-color: #0F4C81; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; color: white;">
            <h2 style="margin: 0; font-size: 22px;">Nieuw Contactformulier Bericht</h2>
            <p style="margin: 5px 0 0; font-size: 13px; color: #93c5fd;">Ontvangen via www.snelkrediet.eu</p>
          </div>
          <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; background: #ffffff;">
            <p style="font-size: 14px; margin-top: 0;"><strong>Tijdstip:</strong> ${contactDate}</p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 140px;"><strong>Naam:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0F4C81;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Land:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600;">${safeCountry}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>E-mailadres:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${safeEmail}" style="color: #0F4C81; text-decoration: none;">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Telefoon:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${safePhone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Onderwerp:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-weight: 600;">${safeSubject}</td>
              </tr>
            </table>

            <div style="background-color: #f8fafc; border-left: 4px solid #0F4C81; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <h4 style="margin: 0 0 8px; color: #0F4C81; font-size: 14px;">Bericht van bezoeker:</h4>
              <p style="margin: 0; white-space: pre-line; font-size: 14px; color: #334155;">${safeMessage}</p>
            </div>

            <div style="text-align: center; margin-top: 25px;">
              <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(String(subject || 'Algemene vraag'))}" style="background-color: #0F4C81; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: bold; display: inline-block;">
                Direct beantwoorden aan ${safeName}
              </a>
            </div>
          </div>
        </div>
      `,
    };

    // 2. Confirmation email to the customer
    const customerMailOptions = {
      from: SENDER_EMAIL,
      to: email,
      subject: `Ontvangstbevestiging: Uw vraag aan Snel Krediet`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6; background-color: #f8fafc; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <!-- Header -->
            <div style="background-color: #0F4C81; padding: 24px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">SNEL KREDIET</h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #bfdbfe;">Erkend Kredietbemiddelaar in België · FSMA 109482 A-B</p>
            </div>

            <!-- Body -->
            <div style="padding: 24px 28px;">
              <h2 style="color: #0F4C81; font-size: 18px; margin-top: 0;">Beste ${safeName},</h2>
              <p style="font-size: 14px; color: #334155;">
                Wij hebben uw bericht met betrekking tot <strong>"${safeSubject}"</strong> goed ontvangen via onze website.
              </p>
              <p style="font-size: 14px; color: #334155;">
                Onze kredietdeskundigen in Brussel bekijken uw vraag zo snel mogelijk. U ontvangt uiterlijk binnen <strong>24 werkuren</strong> een persoonlijk en deskundig antwoord per e-mail of telefoon.
              </p>

              <!-- Summary Card -->
              <div style="background-color: #f1f5f9; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px;">
                <p style="margin: 0 0 6px; font-weight: bold; color: #0F4C81;">Overzicht van uw ingezonden vraag:</p>
                <p style="margin: 0 0 4px; color: #64748b;"><strong>Land:</strong> ${safeCountry}</p>
                ${phone ? `<p style="margin: 0 0 4px; color: #64748b;"><strong>Telefoon:</strong> ${safePhone}</p>` : ''}
                <p style="margin: 0 0 4px; color: #64748b;"><strong>Onderwerp:</strong> ${safeSubject}</p>
                <p style="margin: 6px 0 0; color: #334155; white-space: pre-line;">"${safeMessage}"</p>
              </div>

              <!-- Contact & Help Box -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 18px; margin-top: 20px;">
                <h4 style="margin: 0 0 8px; font-size: 14px; color: #0F4C81;">Dringende vraag?</h4>
                <p style="margin: 0; font-size: 13px; color: #475569;">
                  U kunt onze adviseurs ook rechtstreeks telefonisch bereiken tijdens kantooruren:
                  <br>
                  📞 <strong><a href="tel:+3197010280754" style="color: #0F4C81; text-decoration: none;">+31 97010280754</a></strong> (Ma. - Vr. 08:30 – 18:30)
                  <br>
                  ✉️ <strong><a href="mailto:contact@snelkrediet.eu" style="color: #0F4C81; text-decoration: none;">contact@snelkrediet.eu</a></strong>
                  <br>
                  📍 <strong>Wetstraat 145, 1000 Brussel</strong>
                </p>
              </div>

              <!-- Belgian Statutory Warning -->
              <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 6px; padding: 12px; margin-top: 24px; text-align: center;">
                <strong style="color: #92400e; font-size: 12px; display: block;">LET OP, GELD LENEN KOST OOK GELD.</strong>
                <span style="font-size: 11px; color: #78350f;">Kredietvorm: Lening op afbetaling onderworpen aan Boek VII van het Belgisch Wetboek van economisch recht.</span>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
              © ${new Date().getFullYear()} Snel Krediet BV · Wetstraat 145, 1000 Brussel · KBO BE 0842.193.518 · FSMA 109482 A-B
            </div>
          </div>
        </div>
      `,
    };

    // Send admin notification
    await transporter.sendMail(adminMailOptions);
    console.log(`[Email] Admin notification sent for contact inquiry from ${email}`);

    // Send customer confirmation
    let customerConfirmationSent = false;
    try {
      await transporter.sendMail(customerMailOptions);
      customerConfirmationSent = true;
      console.log(`[Email] Confirmation email successfully sent to customer ${email}`);
    } catch (custErr: any) {
      console.error(`[Email Warning] Could not send confirmation to customer ${email}:`, custErr.message);
    }

    return res.json({
      success: true,
      customerConfirmationSent,
      message: 'Uw bericht is succesvol verzonden. U ontvangt een bevestiging per e-mail.',
    });
  } catch (error: any) {
    console.error('Error handling contact form:', error);
    return res.status(500).json({
      success: false,
      error: 'Er is een fout opgetreden bij het verzenden. Gelieve later opnieuw te proberen of direct te bellen.',
    });
  }
});

// ---------------------------------------------------------------------
// 2. POST /api/loan-application - Handle Credit Application Submissions
// ---------------------------------------------------------------------
app.post('/api/loan-application', async (req: Request, res: Response) => {
  try {
    const {
      amount,
      duration,
      purpose,
      monthlyPayment,
      jkp,
      totalRepayment,
      totalInterest,
      fullName,
      email,
      phone,
      country,
      countryCode,
      monthlyIncome,
      housingStatus,
      employmentType,
      additionalNotes,
    } = req.body;

    if (!fullName || !email || !phone || !amount || !duration) {
      return res.status(400).json({
        success: false,
        error: 'Gelieve alle verplichte velden van uw aanvraag in te vullen.',
      });
    }

    const cleanCountryCode =
      typeof countryCode === 'string' && /^[A-Za-z]{2}$/.test(countryCode.trim())
        ? countryCode.trim().toUpperCase()
        : 'BE';
    const referenceCode = `SK-${cleanCountryCode}-${Math.floor(100000 + Math.random() * 900000)}`;
    const submissionDate = new Date().toLocaleString('nl-BE', {
      timeZone: 'Europe/Brussels',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const purposeLabels: Record<string, string> = {
      persoonlijk: 'Persoonlijke Lening',
      auto: 'Autolening & Mobiliteit',
      verbouwing: 'Renovatielening & Energie',
      hergroepering: 'Kredietsamenvoeging / Hergroepering',
    };

    const purposeTitle = purposeLabels[purpose] || 'Consumentenkrediet';
    const safeName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeCountry = escapeHtml(
      country ? `${country} (${cleanCountryCode})` : `België / Belgique (${cleanCountryCode})`
    );
    const safeHousing = escapeHtml(housingStatus || 'Niet gespecificeerd');
    const safeEmployment = escapeHtml(employmentType || 'Niet gespecificeerd');
    const safeNotes = additionalNotes ? escapeHtml(additionalNotes) : '';

    // 1. Send complete dossier to Snel Krediet Team (contact@snelkrediet.eu)
    const adminLoanMail = {
      from: SENDER_EMAIL,
      to: NOTIFICATION_DESTINATION,
      replyTo: String(email),
      subject: `🚨 [Nieuwe Kredietaanvraag ${referenceCode}] ${formatEuro(amount)} - ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
          <div style="background-color: #0F4C81; padding: 22px; border-radius: 8px 8px 0 0; text-align: center; color: white;">
            <span style="background-color: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; letter-spacing: 0.5px;">DOSSIERNUMMER ${referenceCode}</span>
            <h2 style="margin: 8px 0 0; font-size: 22px;">Nieuwe Online Kredietaanvraag</h2>
            <p style="margin: 4px 0 0; font-size: 13px; color: #93c5fd;">Ontvangen op ${submissionDate}</p>
          </div>

          <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; background: #ffffff;">
            <!-- Credit Financials -->
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px; color: #166534; font-size: 16px;">Financiële Parameters</h3>
              <table style="width: 100%; font-size: 13px;">
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Gevraagd Leenbedrag:</td>
                  <td style="padding: 4px 0; font-weight: bold; font-size: 16px; color: #0F4C81;">${formatEuro(amount)}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Looptijd:</td>
                  <td style="padding: 4px 0; font-weight: bold;">${duration} maanden (${(duration / 12).toFixed(1)} jaar)</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Type Krediet:</td>
                  <td style="padding: 4px 0; font-weight: 600;">${purposeTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Indicatief JKP:</td>
                  <td style="padding: 4px 0; font-weight: bold; color: #0284c7;">${jkp || 6.49}%</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Geschatte Maandlast:</td>
                  <td style="padding: 4px 0; font-weight: bold; color: #0F4C81;">${formatEuro(monthlyPayment || 0)}/maand</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Totale Terugbetaling:</td>
                  <td style="padding: 4px 0;">${formatEuro(totalRepayment || 0)} (waarvan intrest: ${formatEuro(totalInterest || 0)})</td>
                </tr>
              </table>
            </div>

            <!-- Applicant Personal & Financial Data -->
            <h3 style="margin: 18px 0 10px; color: #0F4C81; font-size: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">Kredietnemer Gegevens</h3>
            <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 160px;"><strong>Volledige Naam:</strong></td>
                <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Land van verblijf:</strong></td>
                <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0F4C81;">${safeCountry}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>E-mailadres:</strong></td>
                <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${safeEmail}" style="color: #0F4C81;">${safeEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Telefoonnummer:</strong></td>
                <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;"><a href="tel:${safePhone}">${safePhone}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Netto Maandinkomen:</strong></td>
                <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #166534;">${monthlyIncome ? formatEuro(Number(monthlyIncome)) : 'Niet opgegeven'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Woonsituatie:</strong></td>
                <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">${safeHousing}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Beroepssituatie:</strong></td>
                <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">${safeEmployment}</td>
              </tr>
              ${safeNotes ? `
              <tr>
                <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;"><strong>Toelichting:</strong></td>
                <td style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">${safeNotes}</td>
              </tr>
              ` : ''}
            </table>

            <div style="margin-top: 25px; text-align: center;">
              <a href="mailto:${safeEmail}?subject=Uw%20Kredietaanvraag%20${referenceCode}%20-%20Snel%20Krediet" style="background-color: #0F4C81; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: bold; display: inline-block;">
                Beantwoord Kredietnemer (${safeEmail})
              </a>
            </div>
          </div>
        </div>
      `,
    };

    // 2. Send official confirmation receipt to the Applicant
    const applicantConfirmationMail = {
      from: SENDER_EMAIL,
      to: email,
      subject: `Bevestiging van uw kredietaanvraag (${referenceCode}) – Snel Krediet`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6; background-color: #f8fafc; padding: 20px;">
          <div style="background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <!-- Header -->
            <div style="background-color: #0F4C81; padding: 26px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">SNEL KREDIET</h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #bfdbfe;">Erkend Kredietbemiddelaar in België · FSMA 109482 A-B</p>
              <div style="margin-top: 12px; display: inline-block; background-color: rgba(255, 255, 255, 0.18); border: 1px solid rgba(255,255,255,0.3); padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                Referentienummer: ${referenceCode}
              </div>
            </div>

            <!-- Body Content -->
            <div style="padding: 24px 28px;">
              <h2 style="color: #0F4C81; font-size: 18px; margin-top: 0;">Beste ${safeName},</h2>
              <p style="font-size: 14px; color: #334155;">
                Hartelijk dank voor uw aanvraag bij <strong>Snel Krediet</strong>. Wij bevestigen de goede ontvangst van uw vrijblijvende kredietaanvraag.
              </p>

              <!-- Loan Summary Box -->
              <div style="background-color: #f0f7ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 18px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px; font-size: 15px; color: #0F4C81;">Overzicht van uw kredietaanvraag</h3>
                <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 4px 0; color: #64748b;">Leenbedrag:</td>
                    <td style="padding: 4px 0; font-weight: bold; color: #0F4C81; text-align: right;">${formatEuro(amount)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #64748b;">Looptijd:</td>
                    <td style="padding: 4px 0; font-weight: bold; text-align: right;">${duration} maanden</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #64748b;">Type krediet:</td>
                    <td style="padding: 4px 0; font-weight: 600; text-align: right;">${purposeTitle}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #64748b;">Geschatte maandlast:</td>
                    <td style="padding: 4px 0; font-weight: bold; color: #0F4C81; text-align: right;">${formatEuro(monthlyPayment || 0)} / maand</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #64748b;">Vast JKP:</td>
                    <td style="padding: 4px 0; font-weight: bold; color: #0284c7; text-align: right;">${jkp || 6.49}%</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #64748b;">Land van verblijf:</td>
                    <td style="padding: 4px 0; font-weight: 600; text-align: right;">${safeCountry}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #64748b;">Telefoonnummer:</td>
                    <td style="padding: 4px 0; font-weight: 600; text-align: right;">${safePhone}</td>
                  </tr>
                </table>
              </div>

              <!-- Next Steps Timeline -->
              <h4 style="color: #0F4C81; font-size: 14px; margin: 22px 0 10px;">Wat gebeurt er nu?</h4>
              <ol style="padding-left: 20px; font-size: 13px; color: #334155; margin: 0 0 20px;">
                <li style="margin-bottom: 8px;">
                  <strong>Dossieranalyse:</strong> Een erkende kredietadviseur van ons kantoor in Brussel analyseert uw aanvraag vertrouwelijk en volgens de geldende kredietnormen.
                </li>
                <li style="margin-bottom: 8px;">
                  <strong>Reactie binnen 24 uur:</strong> Wij nemen binnen 24 werkuren contact met u op (telefonisch op ${safePhone} of per e-mail) met een voorlopig besluit of een concreet kredietvoorstel.
                </li>
                <li style="margin-bottom: 8px;">
                  <strong>100% Vrijblijvend:</strong> U bent tot niets verplicht. Pas na ondertekening van een bindend kredietaanbod en wederzijds akkoord wordt uw krediet definitief.
                </li>
              </ol>

              <!-- Advisor Contact Box -->
              <div style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 14px; margin-top: 20px; font-size: 12px;">
                <strong style="color: #0F4C81; display: block; margin-bottom: 4px;">Vragen over uw dossier?</strong>
                <span>Heeft u intussen een vraag of wenst u bijkomende documenten te bezorgen? Vermeld dan steeds referentie <strong>${referenceCode}</strong>.</span>
                <div style="margin-top: 8px; color: #475569;">
                  📞 <strong><a href="tel:+3197010280754" style="color: #0F4C81; text-decoration: none;">+31 97010280754</a></strong> &nbsp;|&nbsp;
                  ✉️ <strong><a href="mailto:contact@snelkrediet.eu" style="color: #0F4C81; text-decoration: none;">contact@snelkrediet.eu</a></strong>
                </div>
              </div>

              <!-- Belgian Statutory Warning -->
              <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 6px; padding: 12px; margin-top: 24px; text-align: center;">
                <strong style="color: #92400e; font-size: 12px; display: block;">LET OP, GELD LENEN KOST OOK GELD.</strong>
                <span style="font-size: 11px; color: #78350f;">
                  Kredietvorm: Lening op afbetaling. Onder voorbehoud van aanvaarding van uw dossier door de kredietgever conform Boek VII van het Wetboek van economisch recht.
                </span>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
              Snel Krediet BV · Wetstraat 145, 1000 Brussel, België<br>
              Erkend Kredietmakelaar FSMA 109482 A-B · KBO BE 0842.193.518
            </div>
          </div>
        </div>
      `,
    };

    // Send admin notification
    await transporter.sendMail(adminLoanMail);
    console.log(`[Email] Admin notification sent for loan application ${referenceCode} (${email})`);

    // Send applicant confirmation
    let applicantConfirmationSent = false;
    try {
      await transporter.sendMail(applicantConfirmationMail);
      applicantConfirmationSent = true;
      console.log(`[Email] Confirmation email sent to applicant ${email} for application ${referenceCode}`);
    } catch (applErr: any) {
      console.error(`[Email Warning] Could not send confirmation to applicant ${email}:`, applErr.message);
    }

    return res.json({
      success: true,
      reference: referenceCode,
      applicantConfirmationSent,
      message: 'Uw kredietaanvraag is succesvol ontvangen. U ontvangt een bevestiging per e-mail.',
    });
  } catch (error: any) {
    console.error('Error handling loan application:', error);
    return res.status(500).json({
      success: false,
      error: 'Er is een fout opgetreden bij het indienen van uw aanvraag. Gelieve later opnieuw te proberen of direct contact op te nemen.',
    });
  }
});

// ---------------------------------------------------------------------
// 3. Vite Middleware (Dev) or Static Files (Prod)
// ---------------------------------------------------------------------
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const distIndex = path.resolve(distPath, 'index.html');
  const isProdMode =
    process.env.NODE_ENV === 'production' ||
    process.env.npm_lifecycle_event === 'start';

  if (isProdMode && fs.existsSync(distIndex)) {
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(distIndex);
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Snel Krediet full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

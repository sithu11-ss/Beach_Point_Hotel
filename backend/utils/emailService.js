const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // For development/testing, you can use Gmail or other SMTP services
  // For production, consider using services like Brevo, SendGrid, Mailgun, or AWS SES
  
  // Option 1: Brevo (formerly Sendinblue) - Recommended for production
  if (process.env.EMAIL_SERVICE === 'brevo') {
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;
    
    if (!emailUser || !emailPassword) {
      console.error('❌ Brevo email configuration missing: EMAIL_USER and EMAIL_PASSWORD are required');
      throw new Error('Email configuration missing');
    }
    
    console.log('📧 Configuring Brevo SMTP...');
    console.log('   Host: smtp-relay.brevo.com');
    console.log('   Port:', process.env.EMAIL_PORT || '587');
    console.log('   User:', emailUser);
    console.log('   Password:', emailPassword ? `${emailPassword.substring(0, 10)}...` : 'NOT SET');
    
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
      auth: {
        user: emailUser.trim(), // Your Brevo login email
        pass: emailPassword.trim() // Your Brevo SMTP key (not your account password)
      },
      tls: {
        rejectUnauthorized: false // For development, can be set to true in production
      }
    });
  }
  
  // Option 2: Gmail (requires app-specific password)
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // App-specific password, not regular password
      }
    });
  }
  
  // Option 3: Custom SMTP (works with most email providers)
  if (process.env.EMAIL_HOST) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports//
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  
  // Option 4: Development - Ethereal Email (for testing, no real emails sent)
  // This creates a test account automatically
  return nodemailer.createTransporter({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'ethereal.user@ethereal.email',
      pass: 'ethereal.pass'
    }
  });
};

// Send booking confirmation email
const sendBookingConfirmation = async (bookingData) => {
  try {
    const transporter = createTransporter();
    
    const {
      guestInfo,
      room,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      bookingReference
    } = bookingData;
    
    const checkInDate = new Date(checkIn).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const checkOutDate = new Date(checkOut).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    
    const mailOptions = {
      from: `"Beach Point Luxe Resort" <${process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@beachpointluxe.com'}>`,
      to: guestInfo.email,
      subject: 'Booking Confirmation - Beach Point Luxe Resort',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #021F2D 0%, #0A4D68 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #021F2D; }
            .total { font-size: 24px; font-weight: bold; color: #0A4D68; text-align: center; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .button { display: inline-block; padding: 12px 30px; background: #0A4D68; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Beach Point Luxe Resort</h1>
              <p>Booking Confirmation</p>
            </div>
            <div class="content">
              <h2>Dear ${guestInfo.firstName} ${guestInfo.lastName},</h2>
              <p>Thank you for choosing Beach Point Luxe Resort! We're delighted to confirm your reservation.</p>
              
              <div class="booking-details">
                <h3 style="color: #021F2D; margin-top: 0;">Booking Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Booking Reference:</span>
                  <span>${bookingReference}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Room:</span>
                  <span>${room.name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Check-in:</span>
                  <span>${checkInDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Check-out:</span>
                  <span>${checkOutDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Number of Nights:</span>
                  <span>${nights}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Guests:</span>
                  <span>${guests}</span>
                </div>
                ${guestInfo.specialRequests ? `
                <div class="detail-row">
                  <span class="detail-label">Special Requests:</span>
                  <span>${guestInfo.specialRequests}</span>
                </div>
                ` : ''}
                <div class="total">
                  Total Amount: $${totalPrice.toFixed(2)}
                </div>
              </div>
              
              <p>We look forward to welcoming you to Beach Point Luxe Resort. If you have any questions or need to modify your reservation, please contact us at your earliest convenience.</p>
              
              <div style="text-align: center;">
                <a href="mailto:info@beachpointluxe.com" class="button">Contact Us</a>
              </div>
              
              <div class="footer">
                <p><strong>Beach Point Luxe Resort</strong></p>
                <p>Experience luxury like never before at our pristine beachfront resort.</p>
                <p>© ${new Date().getFullYear()} Beach Point Luxe Resort. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Beach Point Luxe Resort - Booking Confirmation
        
        Dear ${guestInfo.firstName} ${guestInfo.lastName},
        
        Thank you for choosing Beach Point Luxe Resort! We're delighted to confirm your reservation.
        
        Booking Details:
        - Booking Reference: ${bookingReference}
        - Room: ${room.name}
        - Check-in: ${checkInDate}
        - Check-out: ${checkOutDate}
        - Number of Nights: ${nights}
        - Guests: ${guests}
        ${guestInfo.specialRequests ? `- Special Requests: ${guestInfo.specialRequests}` : ''}
        - Total Amount: $${totalPrice.toFixed(2)}
        
        We look forward to welcoming you to Beach Point Luxe Resort.
        
        Beach Point Luxe Resort
        © ${new Date().getFullYear()} All rights reserved.
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Booking confirmation email sent:', info.messageId);
    console.log('   To:', guestInfo.email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending booking confirmation email:', error.message);
    if (error.code === 'EAUTH') {
      console.error('   ⚠️  Authentication failed! Please check:');
      console.error('   1. EMAIL_USER is your Brevo login email');
      console.error('   2. EMAIL_PASSWORD is your SMTP key (starts with xsmtpib-)');
      console.error('   3. SMTP key is copied correctly (no extra spaces)');
      console.error('   4. Sender email is verified in Brevo dashboard');
    }
    // Don't throw error - booking should still succeed even if email fails
    return { success: false, error: error.message };
  }
};

// Send restaurant reservation confirmation email
const sendReservationConfirmation = async (reservationData) => {
  try {
    const transporter = createTransporter();
    
    const {
      name,
      email,
      phone,
      date,
      time,
      guests
    } = reservationData;
    
    const reservationDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const mailOptions = {
      from: `"Beach Point Luxe Resort" <${process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@beachpointluxe.com'}>`,
      to: email,
      subject: 'Table Reservation Confirmation - Beach Point Luxe Resort',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #021F2D 0%, #0A4D68 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .reservation-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #021F2D; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .button { display: inline-block; padding: 12px 30px; background: #0A4D68; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Beach Point Luxe Resort</h1>
              <p>Table Reservation Confirmation</p>
            </div>
            <div class="content">
              <h2>Dear ${name},</h2>
              <p>Thank you for making a reservation at our fine dining restaurant! We're excited to serve you.</p>
              
              <div class="reservation-details">
                <h3 style="color: #021F2D; margin-top: 0;">Reservation Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span>${reservationDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span>
                  <span>${time}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Number of Guests:</span>
                  <span>${guests}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Contact:</span>
                  <span>${phone}</span>
                </div>
              </div>
              
              <p>We look forward to providing you with an exceptional dining experience. If you need to modify or cancel your reservation, please contact us at least 24 hours in advance.</p>
              
              <div style="text-align: center;">
                <a href="mailto:restaurant@beachpointluxe.com" class="button">Contact Restaurant</a>
              </div>
              
              <div class="footer">
                <p><strong>Beach Point Luxe Resort - Fine Dining</strong></p>
                <p>Savor exquisite cuisine with breathtaking ocean views.</p>
                <p>© ${new Date().getFullYear()} Beach Point Luxe Resort. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Beach Point Luxe Resort - Table Reservation Confirmation
        
        Dear ${name},
        
        Thank you for making a reservation at our fine dining restaurant!
        
        Reservation Details:
        - Date: ${reservationDate}
        - Time: ${time}
        - Number of Guests: ${guests}
        - Contact: ${phone}
        
        We look forward to providing you with an exceptional dining experience.
        
        Beach Point Luxe Resort - Fine Dining
        © ${new Date().getFullYear()} All rights reserved.
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Reservation confirmation email sent:', info.messageId);
    console.log('   To:', email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending reservation confirmation email:', error.message);
    if (error.code === 'EAUTH') {
      console.error('   ⚠️  Authentication failed! Please check your Brevo credentials in .env');
    }
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmation,
  sendReservationConfirmation
};

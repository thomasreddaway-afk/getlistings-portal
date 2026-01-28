import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { package: packageName, price, jobTitle, location, salaryBudget, email } = body;

    // Validate required fields
    if (!packageName || !price || !jobTitle || !location || !salaryBudget || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Log the order (this will show in server console/logs)
    console.log('='.repeat(50));
    console.log('🎯 NEW RECRUITMENT ORDER');
    console.log('='.repeat(50));
    console.log(`Package: ${packageName} (${price})`);
    console.log(`Client Email: ${email}`);
    console.log(`Role: ${jobTitle}`);
    console.log(`Location: ${location}`);
    console.log(`Salary Budget: ${salaryBudget}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('='.repeat(50));

    // Send email notification via Resend (if API key is configured)
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'Get Listings <notifications@getlistings.com.au>',
            to: ['tom@getlistings.com.au'],
            subject: `🎯 NEW ORDER: ${packageName} Package (${price})`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); padding: 24px; border-radius: 12px 12px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">🎯 New Recruitment Order</h1>
                </div>
                
                <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                  <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 16px; border: 1px solid #e5e7eb;">
                    <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 18px;">Order Details</h2>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; width: 140px;">Package:</td>
                        <td style="padding: 8px 0; color: #111827; font-weight: 600;">${packageName} (${price})</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280;">Client Email:</td>
                        <td style="padding: 8px 0; color: #111827;">${email}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280;">Job Title:</td>
                        <td style="padding: 8px 0; color: #111827;">${jobTitle}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280;">Location:</td>
                        <td style="padding: 8px 0; color: #111827;">${location}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280;">Salary Budget:</td>
                        <td style="padding: 8px 0; color: #111827;">${salaryBudget}</td>
                      </tr>
                    </table>
                  </div>
                  
                  <div style="background: #fef3c7; border-radius: 8px; padding: 16px; border: 1px solid #fcd34d;">
                    <p style="margin: 0; color: #92400e; font-size: 14px;">
                      <strong>Action Required:</strong> Send invoice to ${email} for ${price}
                    </p>
                  </div>
                  
                  <p style="margin: 16px 0 0 0; color: #9ca3af; font-size: 12px;">
                    Submitted at: ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })} AEST
                  </p>
                </div>
              </div>
            `,
          }),
        });
        console.log('✅ Email sent successfully via Resend');
      } catch (emailError) {
        console.error('Failed to send email via Resend:', emailError);
      }
    } else {
      console.log('⚠️ RESEND_API_KEY not configured - email not sent');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Order received successfully' 
    });

  } catch (error) {
    console.error('Order processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    );
  }
}

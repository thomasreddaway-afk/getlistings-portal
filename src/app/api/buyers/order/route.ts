import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { package: packageName, price, propertyAddress, propertyType, priceRange, buyerCount, email, notes } = body;

    console.log('🎯 NEW BUYER DEMAND ORDER');
    console.log('Package:', packageName, '-', price);
    console.log('Property:', propertyAddress);
    console.log('Type:', propertyType);
    console.log('Price Range:', priceRange);
    console.log('Buyers Requested:', buyerCount);
    console.log('Email:', email);
    console.log('Notes:', notes);

    // Send email notification via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'Get Listings <noreply@getlistings.com.au>',
          to: ['buyers@getlistings.com.au', 'admin@getlistings.com.au'],
          subject: `🏠 New Buyer Demand Order - ${packageName} - ${propertyAddress}`,
          html: `
            <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #2563eb, #0891b2); padding: 24px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🏠 New Buyer Demand Order</h1>
              </div>
              <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
                  <h2 style="margin: 0 0 16px 0; color: #1e293b;">Package Details</h2>
                  <p style="margin: 8px 0; color: #475569;"><strong>Package:</strong> ${packageName}</p>
                  <p style="margin: 8px 0; color: #475569;"><strong>Price:</strong> ${price}</p>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
                  <h2 style="margin: 0 0 16px 0; color: #1e293b;">Property Details</h2>
                  <p style="margin: 8px 0; color: #475569;"><strong>Address:</strong> ${propertyAddress}</p>
                  <p style="margin: 8px 0; color: #475569;"><strong>Type:</strong> ${propertyType}</p>
                  <p style="margin: 8px 0; color: #475569;"><strong>Price Range:</strong> ${priceRange}</p>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 16px;">
                  <h2 style="margin: 0 0 16px 0; color: #1e293b;">Buyer Request</h2>
                  <p style="margin: 8px 0; color: #475569;"><strong>Buyers Needed:</strong> ${buyerCount}</p>
                  ${notes ? `<p style="margin: 8px 0; color: #475569;"><strong>Notes:</strong> ${notes}</p>` : ''}
                </div>
                
                <div style="background: #dbeafe; padding: 20px; border-radius: 8px; border: 1px solid #93c5fd;">
                  <h2 style="margin: 0 0 8px 0; color: #1e40af;">Contact Agent</h2>
                  <p style="margin: 0; color: #1e40af; font-size: 18px;"><strong>${email}</strong></p>
                </div>
                
                <p style="margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">
                  This order was submitted from Get Listings Portal
                </p>
              </div>
            </div>
          `,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to process buyer order:', error);
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 });
  }
}

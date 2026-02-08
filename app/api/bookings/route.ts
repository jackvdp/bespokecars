import { writeClient } from '@/sanity/lib/writeClient'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Create Sanity document
    await writeClient.create({
      _type: 'booking',
      car: { _type: 'reference', _ref: body.carId },
      carName: body.carName,
      startDate: body.startDate,
      endDate: body.endDate,
      service: body.service,
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      indicativePrice: body.indicativePrice || null,
      status: 'pending',
      createdAt: new Date().toISOString(),
    })

    // Send email via Formspree
    await fetch('https://formspree.io/f/mjggbqnq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        form_type: 'booking_request',
        car: body.carName,
        start_date: body.startDate,
        end_date: body.endDate,
        service: body.service,
        name: body.name,
        email: body.email,
        phone: body.phone,
        indicative_price: body.indicativePrice ? `£${body.indicativePrice.toLocaleString()}` : 'N/A',
      }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Booking submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit booking' },
      { status: 500 },
    )
  }
}

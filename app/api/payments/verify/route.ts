import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
import { verifyRazorpaySignature } from '@/lib/auth';
import { sendShippedNotification, sendDeliveredNotification } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    // Verify Razorpay signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET!
    );

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // Get order
    const { data: order, error: orderError } = await supabaseServer
      .from('orders')
      .select('*')
      .eq('razorpay_order_id', razorpay_order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order with payment details
    const { error: updateError } = await supabaseServer
      .from('orders')
      .update({
        razorpay_payment_id,
        payment_status: 'completed',
      })
      .eq('id', order.id);

    if (updateError) {
      throw updateError;
    }

    // Add to order status history
    await supabaseServer
      .from('order_status_history')
      .insert([
        {
          order_id: order.id,
          status: 'placed',
          notes: 'Payment completed',
        },
      ]);

    return NextResponse.json(
      {
        message: 'Payment verified successfully',
        orderId: order.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

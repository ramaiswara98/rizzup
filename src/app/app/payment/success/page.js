// app/payment/success/page.js
import { Suspense } from 'react';
import PaymentSuccessClient from './PaymentSuccessClient';

export const dynamic = 'force-dynamic'; // optional, but ensures no static prerendering

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PaymentSuccessClient />
    </Suspense>
  );
}

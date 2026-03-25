# MarketPulse Analyzer

## Current State
MarketPulse is a forex/metals/indices market analyzer with trade signals, TradingView charts, Internet Identity login, and a subscription gate (currently free via activateSubscription). Backend has subscriber map, dental bookings, clothing catalog. No payment capture exists.

## Requested Changes (Diff)

### Add
- CryptoPayment type in backend: { id, principal, txId, coin, amount, status (#pending | #approved | #rejected), createdAt }
- submitCryptoPayment(txId, coin) backend function -- user submits transaction ID after sending crypto
- getCryptoPendingPayments() -- admin only, returns all payments
- approveCryptoPayment(id) -- admin approves, activates subscription for that principal
- rejectCryptoPayment(id) -- admin rejects
- Crypto payment page in frontend (route: "payment") showing BTC wallet address + QR code, amount (1 USDT equivalent), transaction ID input, submit button
- Admin dashboard crypto tab showing pending payments with approve/reject buttons

### Modify
- MarketDashboard subscribe gate: instead of just showing "Subscribe Now" button linking to landing, show button linking to "payment" route
- MarketLanding subscribe button: navigate to "payment" route instead of calling activateSubscription directly
- App.tsx: add "payment" route

### Remove
- Direct activateSubscription call from landing page (replaced by payment flow)
- Incomplete free trial code added in previous session

## Implementation Plan
1. Add CryptoPayment type and 4 new backend functions to main.mo
2. Regenerate backend bindings
3. Add CryptoPaymentPage component (route: payment)
4. Update MarketLanding and MarketDashboard to route to payment page
5. Add crypto pending payments tab to MarketAdmin dashboard
6. Add "payment" route to App.tsx

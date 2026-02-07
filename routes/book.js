const express = require('express');
const router = express.Router();
const Parking = require('../models/parking');
const Booking = require('../models/booking');
const { requireRole } = require('../middleware/auth');

// GET booking page for a parking lot
router.get('/', requireRole('user'), async (req, res) => {
  const { parkingId } = req.query;
  if (!parkingId) return res.status(400).send('Parking ID required');
  try {
    const parking = await Parking.findById(parkingId).populate('owner');
    if (!parking) return res.status(404).send('Parking not found');
    res.render('book', { parking });
  } catch (err) {
    res.status(500).send('Server error');
  }
});


// PayU integration (Commented out for direct booking)
/*
const crypto = require('crypto');
const payuConfig = require('../config/payu');

router.post('/', requireRole('user'), async (req, res) => {
  const { parkingId, slots, date, time } = req.body;
  if (!parkingId || !slots || !date || !time) return res.status(400).send('Missing booking details');
  try {
    const parking = await Parking.findById(parkingId);
    if (!parking) return res.status(404).send('Parking not found');

    // Calculate amount (for demo, assume 50 per slot)
    const amount = parseInt(slots) * parking.pricing.hourly;

    const txnid = 'txn' + Date.now();
    const productinfo = String(parking.name || 'Parking Slot').trim();
    const firstname = (req.user.username || 'User').split(' ')[0];
    const email = req.user.email || 'test@example.com';
    const phone = req.user.phoneNumber || '9999999999';

    // Store booking details in UDFs to retrieve them in the success callback
    const udf1 = parkingId;
    const udf2 = slots;
    const udf3 = date;
    const udf4 = time;
    const udf5 = req.user.id;
    const udf6 = '';
    const udf7 = '';
    const udf8 = '';
    const udf9 = '';
    const udf10 = '';

    // Hash string: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|salt
    const hashString = [
      payuConfig.key,
      txnid,
      String(amount),
      productinfo,
      firstname,
      email,
      udf1, udf2, udf3, udf4, udf5, udf6, udf7, udf8, udf9, udf10,
      payuConfig.salt
    ].map(x => (x === undefined || x === null ? '' : String(x))).join('|');
    const hash = crypto.createHash('sha512').update(hashString, 'utf-8').digest('hex');

    // Construct absolute URLs for PayU
    const protocol = req.protocol;
    const host = req.get('host');
    const surl = `${protocol}://${host}${payuConfig.success_url}`;
    const furl = `${protocol}://${host}${payuConfig.failure_url}`;

    // Render PayU payment form (auto-submit)
    res.send(`
      <html><body>
      <form id="payuForm" action="${payuConfig.base_url}" method="post">
        <input type="hidden" name="key" value="${payuConfig.key}" />
        <input type="hidden" name="txnid" value="${txnid}" />
        <input type="hidden" name="amount" value="${amount}" />
        <input type="hidden" name="productinfo" value="${productinfo}" />
        <input type="hidden" name="firstname" value="${firstname}" />
        <input type="hidden" name="email" value="${email}" />
        <input type="hidden" name="phone" value="${phone}" />
        <input type="hidden" name="surl" value="${surl}" />
        <input type="hidden" name="furl" value="${furl}" />
        <input type="hidden" name="hash" value="${hash}" />
        <input type="hidden" name="udf1" value="${udf1}" />
        <input type="hidden" name="udf2" value="${udf2}" />
        <input type="hidden" name="udf3" value="${udf3}" />
        <input type="hidden" name="udf4" value="${udf4}" />
        <input type="hidden" name="udf5" value="${udf5}" />
        <input type="hidden" name="udf6" value="${udf6}" />
        <input type="hidden" name="udf7" value="${udf7}" />
        <input type="hidden" name="udf8" value="${udf8}" />
        <input type="hidden" name="udf9" value="${udf9}" />
        <input type="hidden" name="udf10" value="${udf10}" />
      </form>
      <script>document.getElementById('payuForm').submit();</script>
      </body></html>
    `);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
*/

// Direct booking bypass for testing/free slots
router.post('/', requireRole('user'), async (req, res) => {
  const { parkingId, slots, date, time } = req.body;
  if (!parkingId || !slots || !date || !time) return res.status(400).send('Missing booking details');

  try {
    const parking = await Parking.findById(parkingId);
    if (!parking) return res.status(404).send('Parking not found');

    const amount = parseInt(slots) * parking.pricing.hourly;

    const booking = new Booking({
      parkingId: parkingId,
      slots: parseInt(slots) || 1,
      date: date,
      time: time,
      user: req.user.id,
      amount: amount,
      paymentId: 'DIRECT-' + Date.now(),
      paymentStatus: 'pending',
      status: 'pending'
    });

    await booking.save();

    // Update available slots
    await Parking.findByIdAndUpdate(parkingId, { $inc: { availableSlots: -parseInt(slots) } });

    // Render themed booking success page
    return res.render('booking-submitted', { booking });
  } catch (err) {
    console.error("Booking save error:", err);
    res.status(500).send('Server error');
  }
});

// Save booking after payment success (Unused in direct mode)
router.post('/success', async (req, res) => {
  /* ... existing success logic ... */
});

// PayU payment failure (Unused in direct mode)
router.post('/failure', (req, res) => {
  res.send('<h2>Payment Failed</h2><p>Your payment was not successful. Please try again.</p>');
});


module.exports = router;

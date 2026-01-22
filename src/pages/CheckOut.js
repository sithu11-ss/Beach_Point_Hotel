import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiFileText, FiDownload } from 'react-icons/fi';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

const CheckOut = () => {
  const [bookingRef, setBookingRef] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [billGenerated, setBillGenerated] = useState(false);
  const [billData, setBillData] = useState(null);

  const handleCheckOut = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setBillData({
        bookingRef: bookingRef || 'BP-2024-001',
        checkIn: '2024-01-15',
        checkOut: '2024-01-18',
        nights: 3,
        room: 'Ocean View Suite',
        roomRate: 350,
        roomTotal: 1050,
        services: [
          { name: 'Room Service', amount: 45 },
          { name: 'Spa Treatment', amount: 120 },
          { name: 'Mini Bar', amount: 85 }
        ],
        subtotal: 1300,
        tax: 130,
        total: 1430
      });
      setBillGenerated(true);
      setIsProcessing(false);
    }, 2000);
  };

  if (billGenerated && billData) {
    const servicesTotal = billData.services.reduce((sum, s) => sum + s.amount, 0);

    return (
      <div className="min-h-screen pt-20 pb-20 bg-sand-beige">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-ocean-blue mb-2">
              Check-Out Complete
            </h1>
            <p className="text-charcoal/70">Your final bill has been generated</p>
          </motion.div>

          <Card className="p-8">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-heading font-bold text-ocean-blue">
                  Final Bill
                </h2>
                <p className="text-charcoal/60">Booking Reference: {billData.bookingRef}</p>
              </div>
              <Button variant="outline" size="sm">
                <FiDownload className="inline mr-2" />
                Download PDF
              </Button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-charcoal/60">Check-In</p>
                  <p className="font-semibold">{billData.checkIn}</p>
                </div>
                <div>
                  <p className="text-sm text-charcoal/60">Check-Out</p>
                  <p className="font-semibold">{billData.checkOut}</p>
                </div>
              </div>

              <div className="bg-sand-beige p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">{billData.room}</span>
                  <span className="font-semibold">${billData.roomRate}/night</span>
                </div>
                <div className="flex justify-between text-sm text-charcoal/70">
                  <span>{billData.nights} nights</span>
                  <span>${billData.roomTotal}</span>
                </div>
              </div>

              {billData.services.length > 0 && (
                <div>
                  <h3 className="font-semibold text-ocean-blue mb-2">Additional Services</h3>
                  <div className="space-y-2">
                    {billData.services.map((service, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-charcoal/70">{service.name}</span>
                        <span className="font-medium">${service.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-charcoal/70">Subtotal</span>
                  <span className="font-semibold">${billData.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/70">Tax (10%)</span>
                  <span className="font-semibold">${billData.tax}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-ocean-blue pt-2 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span>${billData.total}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                <strong>Payment Status:</strong> Payment processed successfully. 
                A receipt has been sent to your email.
              </p>
            </div>

            <div className="flex gap-4">
              <Button variant="primary" className="flex-1" to="/">
                Return to Home
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                <FiFileText className="inline mr-2" />
                Print Bill
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20 bg-sand-beige">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-heading font-bold text-ocean-blue mb-8 text-center"
        >
          Digital Check-Out
        </motion.h1>

        <Card className="p-8">
          <p className="text-charcoal/70 mb-6 text-center">
            Enter your booking reference to proceed with check-out and generate your final bill.
          </p>

          <form onSubmit={handleCheckOut}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal mb-2">
                Booking Reference Number *
              </label>
              <input
                type="text"
                required
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value)}
                placeholder="Enter your booking reference"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Generate Final Bill'}
            </Button>
          </form>

          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-center"
            >
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-blue"></div>
              <p className="text-charcoal/70 mt-2">Processing your check-out...</p>
            </motion.div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CheckOut;


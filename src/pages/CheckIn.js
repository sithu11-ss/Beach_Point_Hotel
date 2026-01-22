import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiCheckCircle, FiFileText } from 'react-icons/fi';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

const CheckIn = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    bookingReference: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idNumber: '',
    idFile: null
  });
  const [isComplete, setIsComplete] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, idFile: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      setIsComplete(true);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-sand-beige">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-white p-12 rounded-2xl shadow-xl max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mb-6"
          >
            <FiCheckCircle className="text-6xl text-green-500 mx-auto" />
          </motion.div>
          <h2 className="text-3xl font-heading font-bold text-ocean-blue mb-4">
            Check-In Complete!
          </h2>
          <p className="text-charcoal/70 mb-6">
            Your digital check-in has been processed. You will receive your room details via email.
          </p>
          <Button to="/">Back to Home</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20 bg-sand-beige">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-heading font-bold text-ocean-blue mb-8 text-center"
        >
          Digital Check-In
        </motion.h1>

        <Card className="p-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= s
                        ? 'bg-ocean-blue text-white'
                        : 'bg-gray-200 text-charcoal/50'
                    }`}
                  >
                    {s}
                  </div>
                  <span className={`ml-2 font-medium ${step >= s ? 'text-ocean-blue' : 'text-charcoal/50'}`}>
                    {s === 1 ? 'Booking Info' : 'ID Verification'}
                  </span>
                </div>
                {s < 2 && (
                  <div className={`flex-1 h-1 mx-4 ${step > s ? 'bg-ocean-blue' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Booking Reference Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.bookingReference}
                      onChange={(e) => setFormData({ ...formData, bookingReference: e.target.value })}
                      placeholder="Enter your booking reference"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      ID Number / Passport Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.idNumber}
                      onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                      placeholder="Enter your ID or passport number"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Upload ID Document *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-ocean-blue transition-colors">
                      <input
                        type="file"
                        id="id-upload"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        required
                      />
                      <label htmlFor="id-upload" className="cursor-pointer">
                        {formData.idFile ? (
                          <div className="flex flex-col items-center">
                            <FiFileText className="text-4xl text-ocean-blue mb-2" />
                            <p className="text-ocean-blue font-medium">{formData.idFile.name}</p>
                            <p className="text-sm text-charcoal/60 mt-1">Click to change</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <FiUpload className="text-4xl text-charcoal/40 mb-2" />
                            <p className="text-charcoal/70 font-medium">Click to upload ID</p>
                            <p className="text-sm text-charcoal/60 mt-1">PNG, JPG, PDF up to 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="bg-sand-beige p-4 rounded-lg">
                    <p className="text-sm text-charcoal/70">
                      <strong>Note:</strong> Your ID document will be securely processed and verified. 
                      Please ensure the document is clear and readable.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </Button>
              )}
              <Button type="submit" variant="primary" className="flex-1">
                {step === 1 ? 'Continue' : 'Complete Check-In'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CheckIn;


import React, { useMemo } from 'react';

function onlyDigits(value) {
  return (value || '').replace(/[^\d]/g, '');
}

function formatCardNumber(value) {
  const digits = onlyDigits(value).slice(0, 19);
  // group by 4, keep last group shorter if needed
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value) {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function luhnCheck(cardNumber) {
  const digits = onlyDigits(cardNumber);
  if (digits.length < 12) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i]);
    if (Number.isNaN(digit)) return false;
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function isValidExpiry(exp) {
  const digits = onlyDigits(exp);
  if (digits.length !== 4) return false;
  const mm = Number(digits.slice(0, 2));
  const yy = Number(digits.slice(2));
  if (mm < 1 || mm > 12) return false;

  // interpret YY as 20YY (reasonable for a demo UI)
  const now = new Date();
  const currentYY = Number(String(now.getFullYear()).slice(2));
  const currentMM = now.getMonth() + 1;

  if (yy < currentYY) return false;
  if (yy === currentYY && mm < currentMM) return false;
  return true;
}

export function validateCardDetails({ nameOnCard, cardNumber, expiry, cvc }) {
  const errs = {};
  if (!nameOnCard || nameOnCard.trim().length < 2) errs.nameOnCard = 'Enter the name on card.';
  if (!luhnCheck(cardNumber)) errs.cardNumber = 'Enter a valid card number.';
  if (!isValidExpiry(expiry)) errs.expiry = 'Enter a valid expiry (MM/YY).';
  const cvcDigits = onlyDigits(cvc);
  if (cvcDigits.length < 3 || cvcDigits.length > 4) errs.cvc = 'Enter a valid CVC.';
  return errs;
}

export default function CardPaymentForm({ value, onChange, errors = {} }) {
  const helperText = useMemo(
    () => 'Payments are simulated (frontend-only). No card data is sent to any server.',
    []
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-lg font-heading font-bold text-ocean-blue">Card Details</h4>
          <p className="mt-1 text-sm text-charcoal/70">{helperText}</p>
        </div>
        <div className="text-xs tracking-[0.25em] uppercase text-soft-gold font-semibold">
          Secure UI
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Name on card *</label>
          <input
            type="text"
            autoComplete="cc-name"
            value={value.nameOnCard}
            onChange={(e) => onChange({ ...value, nameOnCard: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue ${
              errors.nameOnCard ? 'border-red-400' : 'border-gray-200'
            }`}
            placeholder="e.g., Amelia Carter"
          />
          {errors.nameOnCard && (
            <p className="mt-2 text-sm text-red-600">{errors.nameOnCard}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Card number *</label>
          <input
            inputMode="numeric"
            autoComplete="cc-number"
            value={value.cardNumber}
            onChange={(e) => onChange({ ...value, cardNumber: formatCardNumber(e.target.value) })}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue ${
              errors.cardNumber ? 'border-red-400' : 'border-gray-200'
            }`}
            placeholder="1234 5678 9012 3456"
          />
          {errors.cardNumber && (
            <p className="mt-2 text-sm text-red-600">{errors.cardNumber}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Expiry (MM/YY) *</label>
            <input
              inputMode="numeric"
              autoComplete="cc-exp"
              value={value.expiry}
              onChange={(e) => onChange({ ...value, expiry: formatExpiry(e.target.value) })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue ${
                errors.expiry ? 'border-red-400' : 'border-gray-200'
              }`}
              placeholder="MM/YY"
            />
            {errors.expiry && <p className="mt-2 text-sm text-red-600">{errors.expiry}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">CVC *</label>
            <input
              inputMode="numeric"
              autoComplete="cc-csc"
              value={value.cvc}
              onChange={(e) => onChange({ ...value, cvc: onlyDigits(e.target.value).slice(0, 4) })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-blue ${
                errors.cvc ? 'border-red-400' : 'border-gray-200'
              }`}
              placeholder="123"
            />
            {errors.cvc && <p className="mt-2 text-sm text-red-600">{errors.cvc}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}



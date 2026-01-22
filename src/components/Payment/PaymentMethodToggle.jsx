import React from 'react';

export default function PaymentMethodToggle({
  value,
  onChange,
  options = [
    {
      value: 'pay_later',
      title: 'Pay at Resort',
      description: 'Reserve now and pay on arrival.'
    },
    {
      value: 'card',
      title: 'Pay by Card',
      description: 'Enter your card details to pay now.'
    }
  ]
}) {
  return (
    <div className="space-y-3">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`w-full text-left rounded-2xl border p-4 transition-all ${
              active
                ? 'border-ocean-blue bg-ocean-blue/5 shadow-[0_18px_45px_rgba(2,31,45,0.08)]'
                : 'border-gray-200 bg-white hover:border-ocean-blue/40'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-ocean-blue">{opt.title}</div>
                <div className="mt-1 text-sm text-charcoal/70">{opt.description}</div>
              </div>
              <div
                className={`mt-1 h-5 w-5 rounded-full border flex items-center justify-center ${
                  active ? 'border-ocean-blue' : 'border-gray-300'
                }`}
              >
                {active && <div className="h-2.5 w-2.5 rounded-full bg-ocean-blue" />}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}



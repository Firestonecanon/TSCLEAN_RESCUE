import React from 'react';
import { Clock } from 'lucide-react';
import { BUSINESS_HOURS } from '../data/contact';

export default function BusinessHours() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Clock className="h-5 w-5 mr-2 text-blue-600" />
        Horaires
      </h2>
      <div className="space-y-2">
        {Object.entries(BUSINESS_HOURS).map(([day, hours]) => (
          <p key={day}>
            <span className="font-semibold">{day}:</span> {hours}
          </p>
        ))}
      </div>
    </div>
  );
}
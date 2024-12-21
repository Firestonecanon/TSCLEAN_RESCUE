import React from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '../data/contact';

export default function OrderSection() {
  return (
    <div className="bg-blue-50 rounded-lg p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Nous Contacter</h2>
      <p className="text-gray-600 mb-6">
        Pour commander nos produits d'entretien professionnels, vous pouvez nous contacter :
      </p>
      <div className="space-y-4">
        <a
          href={`mailto:${CONTACT_INFO.email}`}
          className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <Mail className="h-6 w-6 text-blue-600" />
          <div>
            <p className="font-semibold">Par email</p>
            <p className="text-gray-600">{CONTACT_INFO.email}</p>
          </div>
        </a>
        <a
          href={CONTACT_INFO.messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <MessageCircle className="h-6 w-6 text-blue-600" />
          <div>
            <p className="font-semibold">Via Messenger</p>
            <p className="text-gray-600">Message instantané sur Facebook</p>
          </div>
        </a>
      </div>
    </div>
  );
}
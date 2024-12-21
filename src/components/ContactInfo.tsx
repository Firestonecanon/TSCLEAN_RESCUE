import React from 'react';
import { Phone, Mail, MapPin, Facebook, MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '../data/contact';

export default function ContactInfo() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Informations</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-blue-600" />
          <span>{CONTACT_INFO.address}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Mail className="h-5 w-5 text-blue-600" />
          <a 
            href={`mailto:${CONTACT_INFO.email}`}
            className="text-blue-600 hover:text-blue-800"
          >
            {CONTACT_INFO.email}
          </a>
        </div>
        <div className="flex items-center space-x-3">
          <Facebook className="h-5 w-5 text-blue-600" />
          <a 
            href="https://www.facebook.com/people/Laveries-TS/100075557962009/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            Laveries TS
          </a>
        </div>
        <div className="flex items-center space-x-3">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          <a 
            href="https://www.facebook.com/messages/t/109399668166437"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            Nous contacter sur Messenger
          </a>
        </div>
      </div>
    </div>
  );
}
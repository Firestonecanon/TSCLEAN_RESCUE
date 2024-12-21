import React from 'react';
import ContactInfo from '../components/ContactInfo';
import BusinessHours from '../components/BusinessHours';
import OrderSection from '../components/OrderSection';

export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Contact</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <ContactInfo />
          <BusinessHours />
        </div>
      </div>

      <OrderSection />
    </div>
  );
}
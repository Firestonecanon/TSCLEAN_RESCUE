import React from 'react';
import LocationCard from '../components/LocationCard';
import { locations } from '../data/locations';

export default function Locations() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Nos Laveries</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {locations.map(location => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
    </div>
  );
}
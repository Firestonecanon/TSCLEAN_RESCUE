import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { Location } from '../types';

interface LocationCardProps {
  location: Location;
}

export default function LocationCard({ location }: LocationCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start space-x-4">
        <MapPin className="h-6 w-6 text-blue-600 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold">{location.address}</h3>
          <div className="mt-4 space-y-2">
            <a
              href={location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Itinéraire
            </a>
            <a
              href={location.googleBusinessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:text-blue-800"
            >
              Voir sur Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
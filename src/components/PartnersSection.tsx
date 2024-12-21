import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function PartnersSection() {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Nos Partenaires</h2>
        <div className="max-w-2xl mx-auto">
          <a 
            href="https://www.pizzas-ts.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img 
                src="https://images.unsplash.com/photo-1542834369-f10ebf06d3e0?auto=format&fit=crop&q=80"
                alt="Four à bois traditionnel"
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Pizzas TS</h3>
                  <p className="text-gray-600 mt-2">
                    Découvrez nos délicieuses pizzas artisanales cuites au feu de bois
                  </p>
                </div>
                <ExternalLink className="h-6 w-6 text-blue-600 flex-shrink-0" />
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { ShoppingCart, MapPin, Facebook, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO } from '../data/contact';
import PartnersSection from '../components/PartnersSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section avec image d'arrière-plan */}
      <div 
        className="relative bg-blue-600 text-white py-32"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=2000&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-900/70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              TS Clean
              <span className="block text-2xl font-normal mt-2">
                Vos produits d'entretien professionnels à Audincourt
              </span>
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Découvrez notre gamme complète de produits d'entretien de qualité professionnelle pour vos besoins en laverie
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="w-full sm:w-auto bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 text-center text-lg transition-colors duration-200"
              >
                Découvrir nos produits
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 text-center text-lg transition-all duration-200"
              >
                Nous Contacter
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <ShoppingCart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Produits Professionnels</h2>
            <p className="text-gray-600">Large gamme de produits d'entretien de qualité</p>
          </div>
          <div className="text-center">
            <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">2 Laveries</h2>
            <p className="text-gray-600">Situées au centre d'Audincourt</p>
          </div>
          <div className="text-center">
            <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Contact Simple</h2>
            <p className="text-gray-600">Par email ou Messenger</p>
          </div>
          <div className="text-center">
            <Facebook className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Suivez-nous</h2>
            <p className="text-gray-600">Retrouvez-nous sur Facebook</p>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <PartnersSection />

      {/* Company Info */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">TS Clean</h2>
            <p className="text-gray-600 mb-2">{CONTACT_INFO.address}</p>
            <p className="text-gray-600">SIRET: {CONTACT_INFO.siret}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
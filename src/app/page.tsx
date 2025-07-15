'use client';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from '../components/Navbar';
import StatsSection from '../components/StatsSection';
import GameBoard from '../components/GameBoard';

import { eventsData } from '../data/eventsData';
import EventCard from '../components/EventCard';
export default function HomePage() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <header className="hero-bg pt-20 min-h-screen flex items-center justify-center text-center relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div data-aos="fade-up">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight">
              <span className="text-white">Benvenuti da </span>
              <span className="brand-blue">Comix</span>
              <span className="brand-yellow">&amp;</span>
              <span className="text-white">More</span>!
            </h1>
            <p className="mt-6 text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">
              Il tuo angolo preferito a Taranto dove il gusto incontra il
              divertimento. Birre artigianali, cocktail, snack e centinaia di
              giochi da tavolo ti aspettano!
            </p>
            <div className="mt-10">
              <a
                href="/giochi"
                className="inline-block bg-brand-yellow text-gray-900 font-semibold py-3 px-8 rounded-lg text-lg hover:bg-yellow-400 transition-colors duration-300 shadow-lg transform hover:scale-105"
              >
                Scopri i Giochi
              </a>
              <a
                href="#contatti"
                className="ml-4 inline-block bg-brand-blue text-white font-semibold py-3 px-8 rounded-lg text-lg hover:bg-blue-500 transition-colors duration-300 shadow-lg transform hover:scale-105"
              >
                Vieni a Trovarci
              </a>
            </div>
          </div>
          <div
            className="absolute bottom-10 sm:bottom-12 left-1/2 transform -translate-x-1/2 z-10"
            data-aos="fade-up"
            data-aos-delay="800"
            data-aos-offset="0"
          >
            <a
              href="#chi-siamo"
              aria-label="Scorri verso il basso"
              className="text-gray-400 hover:text-white transition-colors duration-300 animate-bounce block p-2"
            >
              <i className="fas fa-chevron-down fa-2x sm:fa-3x" />
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Chi Siamo */}
        <section id="chi-siamo" className="py-20 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="section-title"
              data-aos="zoom-in-up"
              data-aos-delay="100"
            >
              La Nostra <span className="brand-blue">Passione</span>
            </h2>
            <p
              className="section-subtitle"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Un posto unico dove rilassarsi e sfidare gli amici.
            </p>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div data-aos="fade-right" data-aos-delay="300">
                <img
                  src="https://via.placeholder.com/600x400/3B82F6/FFFFFF?text=Gruppo+di+amici+che+gioca"
                  alt="Amici che giocano"
                  className="rounded-lg shadow-xl w-full"
                />
              </div>
              <div data-aos="fade-left" data-aos-delay="400">
                <p className="text-lg text-gray-300 mb-4 leading-relaxed">
                  Comix&More nasce dalla voglia di creare un ambiente
                  accogliente e stimolante, dove la buona compagnia si fonde con
                  l'emozione dei giochi da tavolo. Siamo più di un semplice bar:
                  siamo una community di appassionati.
                </p>
                <p className="text-lg text-gray-300 mb-4 leading-relaxed">
                  Da noi puoi gustare ottimi drink e stuzzichini mentre esplori
                  la nostra vasta collezione di giochi. Che tu sia un neofita o
                  un esperto, troverai sicuramente qualcosa che fa per te.
                </p>
                <a
                  href="#contatti"
                  className="inline-block mt-4 bg-brand-blue text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-500 transition-colors duration-300 transform hover:scale-105"
                >
                  Scopri la Location
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* I Nostri Giochi */}
        <section id="giochi" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="section-title"
              data-aos="zoom-in-up"
              data-aos-delay="100"
            >
              Un Universo di <span className="brand-blue">Giochi</span>
            </h2>
            <p
              className="section-subtitle"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Dai classici intramontabili alle ultime novità. Noleggiali al
              tavolo!
            </p>
            
            {/* Interactive Game Board */}
            <div className="max-w-6xl mx-auto" data-aos="fade-up" data-aos-delay="300">
              <GameBoard />
            </div>

            <div
              className="text-center mt-12"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <a
                href="/giochi"
                className="inline-block bg-brand-yellow text-gray-900 font-semibold py-3 px-8 rounded-lg text-lg hover:bg-yellow-400 transition-colors duration-300 shadow-lg transform hover:scale-105"
              >
                Esplora il Catalogo Completo <i className="fas fa-arrow-right ml-2" />
              </a>
            </div>
          </div>
        </section>

        <StatsSection />

        {/* Il Nostro Bar */}
        <section id="bar" className="py-20 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="section-title"
              data-aos="zoom-in-up"
              data-aos-delay="100"
            >
              Gusto & <span className="brand-blue">Relax</span>
            </h2>
            <p
              className="section-subtitle"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Accompagna le tue partite con le nostre specialità.
            </p>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div data-aos="fade-right" data-aos-delay="300">
                <h3 className="text-3xl font-semibold text-white mb-4">
                  Cosa Offriamo:
                </h3>
                <ul className="space-y-3 text-lg text-gray-300">
                  {[
                    { icon: 'fa-beer-mug-empty', text: 'Birre Artigianali Selezionate' },
                    { icon: 'fa-martini-glass-citrus', text: 'Cocktail Classici e Signature' },
                    { icon: 'fa-wine-bottle', text: 'Vini e Bevande Analcoliche' },
                    { icon: 'fa-hamburger', text: 'Panini, Stuzzichini e Dolci' },
                    { icon: 'fa-mug-hot', text: 'Caffetteria di Qualità' },
                  ].map((item) => (
                    <li key={item.text} className="flex items-center">
                      <i className={`fas ${item.icon} brand-yellow mr-3`} />
                      {item.text}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-gray-400">
                  Il nostro menu è pensato per soddisfare ogni palato, con
                  ingredienti freschi e proposte per ogni momento della giornata.
                </p>
                <div className="mt-8">
                  <a
                    href="/menu"
                    className="inline-block bg-brand-yellow text-gray-900 font-semibold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors duration-300 shadow-lg transform hover:scale-105"
                  >
                    <i className="fas fa-book-open mr-2"></i>
                    Esplora Menu
                  </a>
                </div>
              </div>
              <div data-aos="fade-left" data-aos-delay="400">
                <img
                  src="https://via.placeholder.com/600x400/F59E0B/1A202C?text=Delizie+del+Bar"
                  alt="Prodotti del bar"
                  className="rounded-lg shadow-xl w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Eventi */}
        <section id="eventi" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="section-title"
              data-aos="zoom-in-up"
              data-aos-delay="100"
            >
              <span className="brand-blue">Eventi</span> da Non Perdere
            </h2>
            <p
              className="section-subtitle"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Tornei, serate a tema e molto altro!
            </p>

            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {eventsData.map((event, i) => (
                <div
                  key={event.id}
                  data-aos="zoom-in"
                  data-aos-delay={300 + i * 100}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>

            <p
              className="text-center mt-12 text-lg text-gray-400"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              Seguici sui social per rimanere aggiornato su tutti i nostri eventi e le promozioni!
            </p>
          </div>
        </section>

        {/* Contatti / Dove Siamo */}
        <section id="contatti" className="py-20 bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="section-title"
              data-aos="zoom-in-up"
              data-aos-delay="100"
            >
              Vieni a <span className="brand-blue">Trovarci</span>
            </h2>
            <p
              className="section-subtitle"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Siamo pronti ad accoglierti!
            </p>
            <div className="grid md:grid-cols-2 gap-12">
              <div data-aos="fade-right" data-aos-delay="300">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Comix&More
                </h3>
                <p className="text-lg text-gray-300 mb-2">
                  <i className="fas fa-map-marker-alt brand-yellow mr-2" />
                  Via Roma, 4, Taranto, Italy 74123
                </p>
                <p className="text-lg text-gray-300 mb-2">
                  <i className="fas fa-phone brand-yellow mr-2" />
                  <a
                    href="tel:+390000000000"
                    className="hover:text-brand-blue transition-colors"
                  >
                    +39 000 000000
                  </a>{' '}
                  (Numero fittizio)
                </p>
                <p className="text-lg text-gray-300 mb-2">
                  <i className="fas fa-envelope brand-yellow mr-2" />
                  <a
                    href="mailto:info@comixandmore.it"
                    className="hover:text-brand-blue transition-colors"
                  >
                    info@comixandmore.it
                  </a>{' '}
                  (Email fittizia)
                </p>

                <h4 className="text-xl font-semibold text-white mt-6 mb-3">
                  Orari di Apertura:
                </h4>
                <ul className="text-gray-300 space-y-1">
                  <li>Lunedì: Chiuso</li>
                  <li>Martedì - Giovedì: 17:00 - 00:00</li>
                  <li>Venerdì - Sabato: 17:00 - 02:00</li>
                  <li>Domenica: 16:00 - 23:00</li>
                </ul>

                <div className="mt-8">
                  <h4 className="text-xl font-semibold text-white mb-3">
                    Seguici:
                  </h4>
                  <a
                    href="https://instagram.com/comixemore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-brand-blue text-3xl mr-4 transition-colors"
                  >
                    <i className="fab fa-instagram" />
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-brand-blue text-3xl mr-4 transition-colors"
                  >
                    <i className="fab fa-facebook-f" />
                  </a>
                </div>
              </div>
              <div data-aos="fade-left" data-aos-delay="400">
                <div className="aspect-w-16 aspect-h-9 bg-gray-700 rounded-lg shadow-xl overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.252899087001!2d17.24039631540697!3d40.4769589793582!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1346c365b8b91d6b%3A0x3767e4971f3c3179!2sVia%20Roma%2C%204%2C%2074123%20Taranto%20TA!5e0!3m2!1sit!2sit!4v1678886655443!5m2!1sit!2sit"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Comix&More. Tutti i diritti riservati.</p>
          <p className="text-sm">
            Realizzato con <i className="fas fa-heart text-red-500" /> e{' '}
            <i className="fas fa-mug-hot text-yellow-500" />.
          </p>
          <p className="text-xs mt-2">
            <a href="#" className="hover:text-brand-blue transition-colors">
              Privacy Policy
            </a>{' '}
            |{' '}
            <a href="#" className="hover:text-brand-blue transition-colors">
              Cookie Policy
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}

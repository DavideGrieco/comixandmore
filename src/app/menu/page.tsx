'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from '../../components/Navbar';

interface MenuItem {
  name: string;
  description?: string;
  price: string;
}

interface MenuCategory {
  title: string;
  icon: string;
  items: MenuItem[];
}

const menuData: MenuCategory[] = [
  {
    title: 'Birre Artigianali',
    icon: 'fa-beer-mug-empty',
    items: [
      { name: 'IPA Locale', description: 'Birra artigianale luppolata del territorio', price: '€6.50' },
      { name: 'Weiss Bavarese', description: 'Birra di frumento tradizionale', price: '€5.80' },
      { name: 'Stout Cremosa', description: 'Birra scura con note di caffè', price: '€6.00' },
      { name: 'Lager Premium', description: 'Birra chiara e rinfrescante', price: '€5.50' },
      { name: 'Amber Ale', description: 'Birra ambrata dal sapore equilibrato', price: '€6.20' },
    ]
  },
  {
    title: 'Cocktail Signature',
    icon: 'fa-martini-glass-citrus',
    items: [
      { name: 'Negroni Sbagliato', description: 'Con prosecco invece del gin', price: '€8.00' },
      { name: 'Aperol Spritz', description: 'Il classico aperitivo italiano', price: '€7.50' },
      { name: 'Moscow Mule', description: 'Vodka, lime e ginger beer', price: '€8.50' },
      { name: 'Old Fashioned', description: 'Whiskey, zucchero e bitter', price: '€9.00' },
      { name: 'Mojito Cubano', description: 'Rum, menta fresca e lime', price: '€8.00' },
    ]
  },
  {
    title: 'Vini & Bollicine',
    icon: 'fa-wine-bottle',
    items: [
      { name: 'Prosecco DOCG', description: 'Valdobbiadene superiore', price: '€25.00' },
      { name: 'Chianti Classico', description: 'Sangiovese toscano', price: '€22.00' },
      { name: 'Pinot Grigio', description: 'Fresco e minerale', price: '€18.00' },
      { name: 'Primitivo di Manduria', description: 'Rosso corposo pugliese', price: '€20.00' },
      { name: 'Falanghina', description: 'Bianco aromatico campano', price: '€16.00' },
    ]
  },
  {
    title: 'Panini Gourmet',
    icon: 'fa-hamburger',
    items: [
      { name: 'Il Nerd Burger', description: 'Manzo, bacon, cheddar e salsa BBQ', price: '€12.00' },
      { name: 'Veggie Delight', description: 'Verdure grigliate e hummus', price: '€9.50' },
      { name: 'Chicken Crispy', description: 'Pollo impanato, lattuga e mayo', price: '€10.50' },
      { name: 'Pulled Pork', description: 'Maiale sfilacciato e coleslaw', price: '€11.50' },
      { name: 'Caprese Gourmet', description: 'Mozzarella di bufala, pomodori e basilico', price: '€9.00' },
    ]
  },
  {
    title: 'Stuzzichini & Antipasti',
    icon: 'fa-cheese',
    items: [
      { name: 'Tagliere Misto', description: 'Salumi, formaggi e marmellate', price: '€15.00' },
      { name: 'Bruschette Assortite', description: 'Pomodoro, olive e ricotta', price: '€8.00' },
      { name: 'Olive Ascolane', description: 'Fritte e croccanti (6 pz)', price: '€6.50' },
      { name: 'Patatine Gourmet', description: 'Con rosmarino e parmigiano', price: '€5.50' },
      { name: 'Nachos Supreme', description: 'Con guacamole e salsa piccante', price: '€7.50' },
    ]
  },
  {
    title: 'Dolci & Caffetteria',
    icon: 'fa-mug-hot',
    items: [
      { name: 'Tiramisù della Casa', description: 'Ricetta tradizionale', price: '€6.00' },
      { name: 'Cheesecake ai Frutti', description: 'Con coulis di frutti rossi', price: '€5.50' },
      { name: 'Caffè Espresso', description: 'Miscela arabica premium', price: '€1.50' },
      { name: 'Cappuccino', description: 'Con latte schiumato', price: '€2.50' },
      { name: 'Affogato al Caffè', description: 'Gelato alla vaniglia e espresso', price: '€4.50' },
    ]
  }
];

export default function MenuPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);

  const totalPages = menuData.length;

  const nextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const goToPage = (pageIndex: number) => {
    if (pageIndex !== currentPage && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(pageIndex);
        setIsFlipping(false);
      }, 300);
    }
  };

  const currentCategory = menuData[currentPage];

  return (
    <>
      <Navbar />
      
      <main className="pt-28 pb-16 bg-gradient-to-br from-amber-50 to-orange-100 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav 
            aria-label="Breadcrumb" 
            className="text-sm text-gray-600 mb-6"
            data-aos="fade-up"
          >
            <Link href="/" className="hover:text-amber-700 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-amber-800 font-medium">Menu</span>
          </nav>

          {/* Titolo */}
          <div className="text-center mb-12" data-aos="fade-down">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
              Il Nostro Menu
            </h1>
            <p className="text-lg text-amber-700 max-w-2xl mx-auto">
              Scopri le nostre specialità sfogliando il menu come un vero libro
            </p>
          </div>

          {/* Libro Menu */}
          <div className="max-w-6xl mx-auto">
            <div 
              className="relative bg-amber-900 rounded-lg shadow-2xl p-8 book-container"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              {/* Copertina del libro */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-800 to-amber-900 rounded-lg shadow-inner"></div>
              
              {/* Pagina del menu */}
              <div className={`relative bg-cream rounded-md shadow-lg min-h-[600px] transition-all duration-300 ${isFlipping ? 'transform rotateY-180' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 rounded-md"></div>
                
                {/* Contenuto della pagina */}
                <div className="relative p-8 md:p-12 h-full">
                  {/* Header della categoria */}
                  <div className="text-center mb-8 border-b-2 border-amber-300 pb-6">
                    <div className="text-5xl text-amber-700 mb-4">
                      <i className={`fas ${currentCategory.icon}`}></i>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-amber-900 font-serif">
                      {currentCategory.title}
                    </h2>
                  </div>

                  {/* Lista items */}
                  <div className="space-y-6">
                    {currentCategory.items.map((item, index) => (
                      <div 
                        key={item.name}
                        className="flex justify-between items-start border-b border-dotted border-amber-300 pb-4 hover:bg-amber-50/50 rounded-lg p-3 transition-colors"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                      >
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-amber-900 mb-1 font-serif">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-amber-700 text-sm italic">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <span className="text-xl font-bold text-amber-800">
                            {item.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Controlli di navigazione */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="bg-amber-700 hover:bg-amber-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-3 rounded-full shadow-lg transition-colors"
                  aria-label="Pagina precedente"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                {/* Indicatori pagina */}
                <div className="flex space-x-2">
                  {menuData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToPage(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentPage 
                          ? 'bg-amber-700' 
                          : 'bg-amber-300 hover:bg-amber-500'
                      }`}
                      aria-label={`Vai alla pagina ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                  className="bg-amber-700 hover:bg-amber-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-3 rounded-full shadow-lg transition-colors"
                  aria-label="Pagina successiva"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>

              {/* Numero pagina */}
              <div className="absolute bottom-4 right-8 text-amber-700 font-serif">
                {currentPage + 1} / {totalPages}
              </div>
            </div>
          </div>

          {/* Informazioni aggiuntive */}
          <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="400">
            <p className="text-amber-700 mb-4">
              <i className="fas fa-info-circle mr-2"></i>
              I prezzi possono variare senza preavviso
            </p>
            <Link 
              href="/#contatti"
              className="inline-block bg-amber-700 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg"
            >
              <i className="fas fa-phone mr-2"></i>
              Prenota il tuo tavolo
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Heart, Scissors, Users } from 'lucide-react';
import Button from '../components/ui/Button';

const AboutUs: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1590402494587-44b67d99b33e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.6)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10" />
        <div className="relative z-20 h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              About Kenya Bespoke
              <br />
              <span className="text-gold-500">Crafting Timeless Elegance</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl mx-auto">
              Discover our passion for creating bespoke suits that celebrate Kenyan craftsmanship.
            </p>
            <Button
              size="lg"
              onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
            >
              Our Story <ChevronRight className="ml-2" size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-white mb-4">Our Story</h2>
              <p className="text-gray-300 mb-4">
                Founded in 2015 in Nairobi, Kenya Bespoke Suits was born from a vision to redefine luxury tailoring. Our founder, James Mwangi, saw an opportunity to blend traditional Kenyan craftsmanship with modern design, creating suits that tell a story of elegance and pride.
              </p>
              <p className="text-gray-300">
                Today, we’re a team of skilled artisans dedicated to crafting bespoke suits that fit perfectly and reflect your unique style. Every stitch is a testament to our commitment to quality and heritage.
              </p>
            </div>
            <div className="lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Tailoring Workshop"
                className="w-full h-auto rounded-lg shadow-xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Meet Our Team
          </h2>
          <p className="text-gray-300 mb-12 text-center max-w-2xl mx-auto">
            Our artisans and designers bring decades of experience to every suit, ensuring unparalleled quality.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                alt="James Mwangi"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                loading="lazy"
              />
              <h3 className="text-xl font-semibold text-white">James Mwangi</h3>
              <p className="text-gray-400">Founder & Master Tailor</p>
            </div>
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                alt="Sarah Odhiambo"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                loading="lazy"
              />
              <h3 className="text-xl font-semibold text-white">Sarah Odhiambo</h3>
              <p className="text-gray-400">Lead Designer</p>
            </div>
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1571868094976-6af3b50b43bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                alt="Michael Njoroge"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                loading="lazy"
              />
              <h3 className="text-xl font-semibold text-white">Michael Njoroge</h3>
              <p className="text-gray-400">Customer Experience Manager</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Our Mission & Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Heart className="text-gold-500 mx-auto mb-4" size={40} />
              <h3 className="text-xl font-semibold text-white mb-2">Craftsmanship</h3>
              <p className="text-gray-300">
                Every suit is handcrafted with precision, honoring Kenya’s rich tailoring heritage.
              </p>
            </div>
            <div className="text-center">
              <Scissors className="text-gold-500 mx-auto mb-4" size={40} />
              <h3 className="text-xl font-semibold text-white mb-2">Quality</h3>
              <p className="text-gray-300">
                We use only the finest fabrics to ensure durability and elegance.
              </p>
            </div>
            <div className="text-center">
              <Users className="text-gold-500 mx-auto mb-4" size={40} />
              <h3 className="text-xl font-semibold text-white mb-2">Customer Focus</h3>
              <p className="text-gray-300">
                Your satisfaction is our priority, from design to delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Experience Bespoke Luxury
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Join us in celebrating style and craftsmanship. Design your perfect suit today.
          </p>
          <Link to="/custom-tailoring">
            <Button size="lg">
              Start Your Journey <ChevronRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
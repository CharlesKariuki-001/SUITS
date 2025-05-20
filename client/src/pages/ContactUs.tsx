import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, Phone, MapPin, Send } from 'lucide-react';
import Button from '../components/ui/Button';
import axios from 'axios';

const ContactUs: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    isTailoringRequest: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/contact', form);
      setSuccess(true);
      setForm({ name: '', email: '', message: '', isTailoringRequest: false });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to send message. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.6)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10" />
        <div className="relative z-20 h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Get in Touch
              <br />
              <span className="text-gold-500">We’re Here to Help</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl mx-auto">
              Have questions or ready to start your bespoke journey? Contact us today.
            </p>
            <Button
              size="lg"
              onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
            >
              Reach Out <ChevronRight className="ml-2" size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Form & Details Section */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Send Us a Message</h2>
              <p className="text-gray-300 mb-8">
                Fill out the form below, and our team will get back to you within 24 hours.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Message</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    placeholder="Your message or inquiry"
                    rows={5}
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center text-gray-300">
                    <input
                      type="checkbox"
                      checked={form.isTailoringRequest}
                      onChange={e => setForm({ ...form, isTailoringRequest: e.target.checked })}
                      className="mr-2"
                    />
                    This is a custom tailoring request
                  </label>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'} <Send className="ml-2" size={16} />
                </Button>
                {success && (
                  <div className="text-center">
                    <p className="text-green-500">Message sent successfully!</p>
                    {form.isTailoringRequest && (
                      <div className="mt-4">
                        <Link to="/custom-tailoring">
                          <Button size="lg" variant="outline">Continue Custom Tailoring</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>
            {/* Contact Details */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Contact Information</h2>
              <p className="text-gray-300 mb-8">
                We’re ready to assist you with your tailoring needs. Reach out via phone, email, or visit us.
              </p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="text-gold-500 mr-4 mt-1" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Email</h3>
                    <p className="text-gray-300">
                      <a href="mailto:info@kenyabespoke.com">info@kenyabespoke.com</a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="text-gold-500 mr-4 mt-1" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Phone</h3>
                    <p className="text-gray-300">
                      <a href="tel:+254700123456">+254 700 123 456</a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="text-gold-500 mr-4 mt-1" size={24} />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Visit Us</h3>
                    <p className="text-gray-300">
                      Westlands Road, Nairobi, Kenya<br />
                      Mon - Fri: 9 AM - 6 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Find Us</h2>
          <div className="relative h-96 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.809050801342!2d36.81532971434414!3d-1.2756143990000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17ec9b765d6d%3A0x8f66d7e7f8a6462a!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1715097600000!5m2!1sen!2ske"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Bespoke Journey?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Design a suit that reflects your unique style with our expert tailors.
          </p>
          <Link to="/custom-tailoring">
            <Button size="lg">
              Book a Fitting <ChevronRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
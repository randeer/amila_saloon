import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-brand-dark text-brand-accent py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-white mb-4">Get in Touch</h2>
            <p className="max-w-2xl mx-auto text-brand-accent/80">
                Ready for your transformation? Contact us to book your appointment or ask any questions.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="text-center md:text-left">
                <h3 className="text-2xl font-serif text-white mb-4">Contact Details</h3>
                <div className="space-y-4 text-brand-accent/90">
                    <p className="flex items-center justify-center md:justify-start">
                        <i data-lucide="map-pin" className="w-5 h-5 mr-3 text-brand-secondary"></i>
                        <span>Unit 9, 465 Portrush road,<br/>Glenside South Australia. 5065<br/>Australia</span>
                    </p>
                    <p className="flex items-center justify-center md:justify-start">
                        <i data-lucide="phone" className="w-5 h-5 mr-3 text-brand-secondary"></i>
                        <a href="tel:+61412345678" className="hover:text-white">+61 412 345 678</a>
                    </p>
                    <p className="flex items-center justify-center md:justify-start">
                        <i data-lucide="mail" className="w-5 h-5 mr-3 text-brand-secondary"></i>
                        <a href="mailto:contact@amilasaloon.com" className="hover:text-white">contact@amilasaloon.com</a>
                    </p>
                </div>
            </div>

            {/* Contact Form */}
            <div>
                <form action="#" method="POST" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="sr-only">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                autoComplete="name"
                                placeholder="Your Name"
                                required
                                className="w-full bg-brand-dark/50 border border-brand-accent/30 rounded-md py-3 px-4 text-white placeholder:text-brand-accent/60 focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition-colors"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="email"
                                placeholder="Your Email"
                                required
                                className="w-full bg-brand-dark/50 border border-brand-accent/30 rounded-md py-3 px-4 text-white placeholder:text-brand-accent/60 focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition-colors"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="sr-only">Message</label>
                            <textarea
                                name="message"
                                id="message"
                                rows={4}
                                placeholder="Your Message"
                                required
                                className="w-full bg-brand-dark/50 border border-brand-accent/30 rounded-md py-3 px-4 text-white placeholder:text-brand-accent/60 focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition-colors"
                            ></textarea>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-brand-secondary text-brand-dark font-bold py-3 px-6 rounded-md shadow-lg hover:brightness-95 transition-all duration-300 transform hover:scale-105"
                            >
                                Send Message
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-brand-accent/20 text-center">
            <div className="flex justify-center space-x-6 mb-6">
              <a href="#" aria-label="Instagram" className="text-brand-accent hover:text-white transition-colors"><i data-lucide="instagram" className="w-7 h-7"></i></a>
              <a href="#" aria-label="Facebook" className="text-brand-accent hover:text-white transition-colors"><i data-lucide="facebook" className="w-7 h-7"></i></a>
              <a href="#" aria-label="Twitter" className="text-brand-accent hover:text-white transition-colors"><i data-lucide="twitter" className="w-7 h-7"></i></a>
            </div>
            <div className="text-sm text-brand-accent/70">
              &copy; {new Date().getFullYear()} Amila Saloon. All Rights Reserved.
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
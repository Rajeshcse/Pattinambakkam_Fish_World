import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { LogoIcon } from './icons/LogoIcon';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  showNavbar?: boolean;
  fullWidth?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  className = '',
  showNavbar = true,
  fullWidth = false,
}) => {
  return (
    <div className='min-h-screen bg-white'>
      {showNavbar && <Navbar />}
      <main className={`${fullWidth ? '' : ''} ${className}`}>{children}</main>

      {/* Footer */}
      <footer className='bg-slate-900 text-white py-12'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
            {/* Brand */}
            <div className='md:col-span-2'>
              <div className='flex items-center gap-3 mb-4'>
                <LogoIcon size={48} />
                <div>
                  <h3 className='text-xl font-bold'>
                    Pattinambakkam Fish World
                  </h3>
                  <p className='text-sm text-gray-400'>
                    Fresh catch, daily delivery
                  </p>
                </div>
              </div>
              <p className='text-gray-400 text-sm leading-relaxed max-w-md'>
                Connecting you directly with local fishermen in Pattinambakkam
                for the freshest seafood. Quality you can trust, convenience you
                deserve.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className='font-semibold text-lg mb-4'>Quick Links</h4>
              <ul className='space-y-2 text-gray-400 text-sm'>
                <li>
                  <a href='/' className='hover:text-cyan-400 transition-colors'>
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href='/products'
                    className='hover:text-cyan-400 transition-colors'
                  >
                    Products
                  </a>
                </li>
                <li>
                  <a
                    href='/login'
                    className='hover:text-cyan-400 transition-colors'
                  >
                    Login
                  </a>
                </li>
                <li>
                  <a
                    href='/register'
                    className='hover:text-cyan-400 transition-colors'
                  >
                    Register
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className='font-semibold text-lg mb-4'>Contact Us</h4>
              <ul className='space-y-2 text-gray-400 text-sm'>
                <li className='flex items-center gap-2'>
                  <span>📍</span> Pattinambakkam, Chennai
                </li>
                <li className='flex items-center gap-2'>
                  <span>💬</span> WhatsApp Order
                </li>
                <li className='flex items-center gap-2'>
                  <span>💳</span> GPay Accepted
                </li>
                <li className='flex items-center gap-2'>
                  <span>🏍️</span> Rapido Delivery
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className='pt-8 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-gray-400 text-sm'>
              © 2024 Pattinambakkam Fish World. All rights reserved.
            </p>
            <div className='flex items-center gap-6'>
              <span className='text-gray-400 text-sm'>
                Made with ❤️ in Chennai
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

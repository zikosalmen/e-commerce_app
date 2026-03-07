'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { ThemeToggle } from './ui/ThemeToggle';
import { useCart } from '@/lib/context/CartContext';
import { useSession } from 'next-auth/react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { data: session, status } = useSession();

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Boutique', href: '/boutique' },
    { name: 'Catégories', href: '/categories' },
    { name: 'Promotions', href: '/promotions' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 relative bg-white rounded-full p-1.5 shadow-sm border border-gray-100 dark:border-gray-800 transition-transform group-hover:scale-105">
              <Image 
                src="/logo.png" 
                alt="First Shop Logo" 
                fill
                className="object-contain p-1"
              />
            </div>
            <span className="font-bold text-2xl text-gray-900 dark:text-white tracking-tight">
              First Shop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Search Icon */}
            <button className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <FiSearch className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link href="/panier">
              <button className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <FiShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                    {totalItems}
                  </span>
                )}
              </button>
            </Link>

            {/* User/Login */}
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse hidden sm:block" />
            ) : session ? (
              <Link href="/profil">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-xs font-bold">
                    {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                    {session.user?.name || 'Profil'}
                  </span>
                </div>
              </Link>
            ) : (
              <Link href="/login">
                <Button size="sm" className="hidden sm:inline-flex gap-2">
                  <FiUser className="w-4 h-4" />
                  Connexion
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-gray-700 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-800"
            >
              <nav className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Thème</span>
                  <ThemeToggle />
                </div>
                <div className="px-4 pt-2">
                  {session ? (
                    <Link href="/profil" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full gap-2">
                        <FiUser className="w-4 h-4" />
                        Mon Profil
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full gap-2">
                        <FiUser className="w-4 h-4" />
                        Connexion
                      </Button>
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

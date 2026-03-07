import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">First Shop</h3>
            <p className="text-sm">
              Votre boutique e-commerce moderne pour les meilleurs produits tech et lifestyle.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <FiMail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4">Boutique</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/boutique" className="hover:text-primary-400 transition-colors">Tous les produits</Link></li>
              <li><Link href="/categories" className="hover:text-primary-400 transition-colors">Catégories</Link></li>
              <li><Link href="/nouveautes" className="hover:text-primary-400 transition-colors">Nouveautés</Link></li>
              <li><Link href="/promotions" className="hover:text-primary-400 transition-colors">Promotions</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-primary-400 transition-colors">FAQ</Link></li>
              <li><Link href="/livraison" className="hover:text-primary-400 transition-colors">Livraison</Link></li>
              <li><Link href="/retours" className="hover:text-primary-400 transition-colors">Retours</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/cgv" className="hover:text-primary-400 transition-colors">CGV</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-primary-400 transition-colors">Mentions légales</Link></li>
              <li><Link href="/confidentialite" className="hover:text-primary-400 transition-colors">Confidentialité</Link></li>
              <li><Link href="/cookies" className="hover:text-primary-400 transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} First Shop. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

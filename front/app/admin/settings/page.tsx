'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FiSettings, FiSave, FiShield, FiGlobe, FiMail, FiBell } from 'react-icons/fi';

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    siteName: 'First Shop',
    siteDescription: 'Votre boutique e-commerce de confiance',
    currency: 'TND',
    contactEmail: 'contact@firstshop.tn',
    freeShippingThreshold: '50',
    enableNotifications: true,
    enableNewsletter: true,
    maintenanceMode: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Paramètres
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Configurez les paramètres de votre boutique.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FiGlobe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Paramètres généraux
              </h2>
              <p className="text-sm text-gray-500">Informations de base de votre boutique</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nom du site"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
            />
            <Input
              label="Description"
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleChange}
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Devise
              </label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="TND">Dinar Tunisien (TND)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="USD">Dollar US (USD)</option>
              </select>
            </div>
            <Input
              label="Seuil livraison gratuite"
              name="freeShippingThreshold"
              type="number"
              value={settings.freeShippingThreshold}
              onChange={handleChange}
            />
          </div>
        </Card>

        {/* Contact Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FiMail className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contact & Notifications
              </h2>
              <p className="text-sm text-gray-500">Gérez les communications</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Email de contact"
              name="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={handleChange}
            />

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="enableNotifications"
                  checked={settings.enableNotifications}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notifications par email
                  </span>
                  <p className="text-xs text-gray-500">
                    Recevoir un email lors de nouvelles commandes
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="enableNewsletter"
                  checked={settings.enableNewsletter}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Newsletter
                  </span>
                  <p className="text-xs text-gray-500">
                    Activer le formulaire de newsletter sur le site
                  </p>
                </div>
              </label>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <FiShield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sécurité & Maintenance
              </h2>
              <p className="text-sm text-gray-500">Paramètres avancés</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mode maintenance
                </span>
                <p className="text-xs text-gray-500">
                  Afficher une page de maintenance aux visiteurs
                </p>
              </div>
            </label>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Changer le mot de passe administrateur
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nouveau mot de passe"
                  name="newPassword"
                  type="password"
                  placeholder="••••••••"
                />
                <Input
                  label="Confirmer le mot de passe"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <Button type="submit" size="lg" className="gap-2" disabled={saving}>
            <FiSave className="w-5 h-5" />
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
          {saved && (
            <span className="text-green-600 dark:text-green-400 font-medium text-sm animate-pulse">
              ✓ Paramètres sauvegardés
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

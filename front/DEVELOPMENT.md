# Guide de Développement - E-Commerce Next.js

## 🚀 Démarrage rapide

### Commandes essentielles

```bash
# Développement
npm run dev                 # Lancer le serveur (localhost:3000)

# Base de données
npm run db:push             # Synchroniser le schéma Prisma
npm run db:seed             # Peupler avec des données d'exemple
npm run db:studio           # Interface graphique de la DB

# Production
npm run build               # Build pour production
npm start                   # Lancer en production
```

### Compte admin de test
- Email: `admin@ecommerce.com`
- Password: `admin123`

---

## 📦 Ajouter un nouveau composant UI

1. Créer le fichier dans `components/ui/NomComposant.tsx`
2. Utiliser les utilities `cn()` pour les classes Tailwind
3. Supporter le dark mode avec `dark:` classes
4. Ajouter TypeScript props avec `interface`

Exemple:
```tsx
import { cn } from '@/lib/utils';

interface MonComposantProps {
  children: React.ReactNode;
  className?: string;
}

export function MonComposant({ children, className }: MonComposantProps) {
  return (
    <div className={cn('base-classes', className)}>
      {children}
    </div>
  );
}
```

---

## 🗄️ Modifier le schéma de base de données

1. Editer `prisma/schema.prisma`
2. Appliquer les changements:
```bash
npx prisma db push
npx prisma generate
```

3. Mettre à jour le seed si nécessaire:
```bash
npm run db:seed
```

---

## 🎨 Personnaliser le design

### Couleurs

Dans `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    500: '#yourcolor',
    600: '#yourcolor',
    // ...
  }
}
```

### Police

Dans `app/layout.tsx`:
```typescript
import { VotrePolice } from 'next/font/google';

const votrePolice = VotrePolice({ 
  subsets: ['latin'],
  variable: '--font-custom',
});
```

---

## 🔧 Configurer les services externes

### Google OAuth

1. Aller sur https://console.cloud.google.com
2. Créer un nouveau projet
3. Activer Google+ API
4. Créer des identifiants OAuth 2.0
5. Ajouter `http://localhost:3000/api/auth/callback/google` dans les URIs autorisées
6. Copier Client ID et Secret dans `.env.local`

### Supabase Storage

1. Créer un compte sur https://supabase.com
2. Créer un nouveau projet
3. Aller dans Storage > Create bucket > "products" (public)
4. Copier l'URL et les clés dans `.env.local`

### Stripe

1. Créer un compte sur https://stripe.com
2. Aller dans "Developers" > "API keys"
3. Copier les clés de test dans `.env.local`
4. Pour les webhooks: 
   - En local: installer Stripe CLI
   - En production: configurer dans le dashboard

---

## 📝 Créer une nouvelle page

### Page statique

```tsx
// app/(shop)/ma-page/page.tsx
export default function MaPage() {
  return <div>Contenu</div>;
}
```

### Page dynamique

```tsx
// app/(shop)/produit/[slug]/page.tsx
import { prisma } from '@/lib/prisma';

export default async function ProduitPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug }
  });

  return <div>{product?.name}</div>;
}
```

---

## 🔌 Créer une API Route

```typescript
// app/api/mon-endpoint/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Votre logique
  return NextResponse.json({ data: 'success' });
}

export async function POST(request: Request) {
  const body = await request.json();
  // Votre logique
  return NextResponse.json({ success: true });
}
```

---

## 🔐 Protéger une page (authentification)

```tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  return <div>Page protégée</div>;
}
```

---

## 🎯 Prochaines fonctionnalités à implémenter

### 1. Page Boutique avec filtres
- Créer `app/(shop)/boutique/page.tsx`
- Ajouter composant Filters
- Implémenter recherche et tri
- Pagination ou infinite scroll

### 2. Page Produit détaillée
- Créer `app/(shop)/produit/[slug]/page.tsx`
- Galerie d'images avec zoom
- Sélecteur de quantité
- Reviews (optionnel)

### 3. Panier persistant
- Créer Context `contexts/CartContext.tsx`
- Stocker dans localStorage
- Synchroniser avec DB si connecté
- Sidebar animé

### 4. Checkout Stripe
- Créer `app/(shop)/checkout/page.tsx`
- Formulaire adresse de livraison
- API route pour Stripe Checkout Session
- Page de succès

### 5. Dashboard Admin
- Middleware pour protection admin
- CRUD produits avec upload images
- Gestion commandes
- Statistiques (CA, nb commandes...)

---

## 🐛 Debug

### Prisma Studio
```bash
npm run db:studio
```
Ouvre une interface graphique pour voir/éditer la DB.

### Console logs
Les `console.log()` dans les Server Components apparaissent dans le terminal, pas dans le navigateur.

### React DevTools
Installer l'extension Chrome/Firefox pour inspecter les composants.

---

## 📚 Ressources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [Stripe Docs](https://stripe.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

---

**Bon développement ! 🚀**

# 💬 Interface de Chat - Documentation

Une interface de chat moderne et professionnelle construite avec Next.js 14+, TypeScript, Tailwind CSS et shadcn/ui.

## ✨ Fonctionnalités

- 🎨 **Design moderne** - Interface SaaS premium avec animations fluides
- 🌓 **Dark/Light Mode** - Bascule automatique avec `next-themes`
- 📱 **Responsive** - Mobile-first, optimisé pour tous les écrans
- ⚡ **Rate Limiting** - 10 messages max par minute (protection anti-spam)
- 💾 **Persistance** - Messages sauvegardés en localStorage
- 🔄 **Auto-scroll** - Scroll automatique vers les nouveaux messages
- ⌨️ **Raccourcis clavier** - `Enter` pour envoyer, `Shift+Enter` pour nouvelle ligne
- 🔒 **Sécurisé** - Webhook n8n jamais exposé côté client

## 🚀 Utilisation

### 1. Configuration du Webhook n8n

Modifiez `.env.local` et remplacez l'URL du webhook :

```bash
N8N_WEBHOOK_URL="https://votre-instance-n8n.com/webhook/chat"
```

### 2. Format de la réponse n8n

Votre workflow n8n doit retourner un JSON avec la structure :

```json
{
  "reply": "Voici ma réponse"
}
```

Ou simplement :

```json
{
  "message": "Voici ma réponse"
}
```

### 3. Accéder au chat

Naviguez vers : `http://localhost:3000/chat`

## 📁 Structure des fichiers

```
app/
├── api/
│   └── chat/
│       └── route.ts              # API route avec rate limiting
├── chat/
│   └── page.tsx                  # Page principale du chat
└── globals.css                   # Animations et variables CSS

components/
├── chat/
│   ├── ChatWindow.tsx            # Composant principal
│   ├── MessageBubble.tsx         # Bulles de messages
│   ├── ChatInput.tsx             # Zone de saisie
│   └── TypingIndicator.tsx       # Indicateur de frappe
└── ui/
    └── button.tsx                # Composant Button shadcn/ui

lib/
├── rate-limiter.ts               # Utilitaire rate limiting
└── utils.ts                      # Utilitaires (cn, etc.)
```

## 🛡️ Sécurité

### Rate Limiting

- **Limite** : 10 messages par minute par IP
- **Type** : En mémoire (simple Map)
- **Pour production** : Utiliser `@upstash/ratelimit` avec Redis

### Protection Webhook

- L'URL du webhook n8n est stockée dans `.env.local`
- Jamais exposée côté client
- Requêtes passent par l'API route sécurisée

## 🎨 Personnalisation

### Modifier les couleurs

Éditez `app/globals.css` :

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --background: 0 0% 100%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  /* ... */
}
```

### Changer la limite de messages

Dans `app/api/chat/route.ts` :

```typescript
if (!checkRateLimit(ip, 20, 60000)) { // 20 messages par minute
  // ...
}
```

### Modifier le placeholder

Dans `components/chat/ChatWindow.tsx` :

```tsx
<ChatInput 
  onSendMessage={handleSendMessage} 
  disabled={isLoading}
  placeholder="Votre message personnalisé..."
/>
```

## 🧪 Tests

### Test du Rate Limiting

```bash
# Envoyez rapidement 15 requêtes
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"message":"Test"}' &
done
```

Les 5 dernières devraient retourner une erreur 429.

### Test Dark/Light Mode

1. Ouvrez `http://localhost:3000/chat`
2. Cliquez sur le bouton de thème (si configuré dans votre layout)
3. Vérifiez que les couleurs changent correctement

### Test Responsive

1. Ouvrez DevTools (`F12`)
2. Toggle device toolbar (`Ctrl+Shift+M`)
3. Testez : Mobile (375px), Tablet (768px), Desktop (1024px+)

## 📊 Données stockées

Les messages sont sauvegardés dans `localStorage` :

```javascript
// Clé : "chat-messages"
// Format : Array<Message>
// Limite navigateur : ~5MB
```

### Réinitialiser l'historique

```javascript
// Dans la console du navigateur
localStorage.removeItem('chat-messages');
```

## 🔧 Troubleshooting

### Erreur "N8N_WEBHOOK_URL not configured"

✅ Vérifiez que `.env.local` contient `N8N_WEBHOOK_URL`
✅ Redémarrez le serveur : `npm run dev`

### Messages ne s'affichent pas

✅ Vérifiez la console navigateur (F12)
✅ Vérifiez que le webhook n8n répond correctement
✅ Testez l'API directement : `curl -X POST http://localhost:3000/api/chat -d '{"message":"test"}'`

### Rate limit trop strict

✅ Modifiez la limite dans `app/api/chat/route.ts`
✅ Effacez le cache : redémarrez le serveur

## 📝 Notes

- **localStorage** : Les messages persistent entre les sessions
- **Scroll** : Auto-scroll uniquement pour les nouveaux messages
- **Animations** : Fade-in de 300ms pour chaque message
- **Mobile** : Input sticky en bas, max 85% largeur pour les bulles

## 🚀 Prochaines étapes

- [ ] Ajouter authentification utilisateur
- [ ] Support des fichiers/images
- [ ] Markdown rendering dans les messages
- [ ] Historique des conversations
- [ ] Export des conversations
- [ ] Support multi-langue (i18n)

---

**Développé avec** ❤️ **et Next.js**

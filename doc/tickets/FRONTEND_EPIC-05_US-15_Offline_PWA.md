# FRONTEND_EPIC-05_US-15 : Mode hors ligne / PWA

**Epic**: FRONTEND EPIC-05 Fonctionnalités Avancées  
**Story Points**: 15  
**Sprint**: 9-10  
**Assigné**: Frontend Dev  

## User Story

En tant qu'**utilisateur terrain PME**, je veux utiliser l'application même sans connexion internet pour continuer à travailler (consulter stock, créer brouillons) et synchroniser automatiquement quand la connexion revient.

## Critères d'Acceptation

**GIVEN** je perds ma connexion internet sur le terrain  
**WHEN** j'utilise l'application  
**THEN** je vois un indicateur "Mode hors ligne" discret  
**AND** je peux consulter les données mises en cache  

**GIVEN** je suis hors ligne  
**WHEN** je crée un nouveau bon en brouillon  
**THEN** les données sont sauvegardées localement  
**AND** une icône "sync en attente" s'affiche  

**GIVEN** ma connexion revient  
**WHEN** l'application détecte la connectivité  
**THEN** la synchronisation démarre automatiquement  
**AND** je vois le progrès de sync des données  

**GIVEN** l'application est installée comme PWA  
**WHEN** je clique sur l'icône du bureau/écran d'accueil  
**THEN** l'app s'ouvre en mode natif sans navigateur visible  

## Spécifications UI/UX

### Indicateur État Connectivité
```
┌─────────────────────────────────────────────────────────────┐
│ 🏠 Dashboard                      📶 En ligne | 🔄 Sync     │
│                                                             │
│ OU                                                          │
│                                                             │
│ 🏠 Dashboard                     📴 Hors ligne | ⏸️ 3 en attente │
└─────────────────────────────────────────────────────────────┘
```

### Mode Hors Ligne - Consultation
```
┌─────────────────────────────────────────────────────────────┐
│ 📦 Articles                                   📴 Hors ligne │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ⚠️ Données affichées depuis le cache local                  │
│ Dernière synchronisation: Il y a 2 heures                  │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Code    │ Nom              │ Stock │ ⏰ Dernière MAJ    │ │
│ ├─────────┼──────────────────┼───────┼───────────────────┤ │
│ │ USB001  │ Clé USB 32GB     │  45   │ Il y a 1h        │ │
│ │ USB002  │ Clé USB 64GB     │   3   │ Il y a 2h        │ │
│ │ KEY001  │ Clavier Wireless │  12   │ Il y a 30min     │ │
│ └─────────┴──────────────────┴───────┴───────────────────┘ │
│                                                             │
│ 📱 Recherche limitée aux données locales                   │
└─────────────────────────────────────────────────────────────┘
```

### Création Hors Ligne - Brouillons
```
┌─────────────────────────────────────────────────────────────┐
│ 📋 Nouveau Bon                    📴 Mode hors ligne        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ⚠️ Hors ligne - Sauvegarde locale uniquement                │
│                                                             │
│ [Formulaire création bon...]                               │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 💾 Brouillons en attente de synchronisation             │ │
│ │ ─────────────────────────────────────────────────────── │ │
│ │ 📝 BON-LOCAL-001 • Bon d'entrée • Il y a 15min         │ │
│ │ 📝 BON-LOCAL-002 • Bon de sortie • Il y a 1h           │ │
│ │                                           [Voir] [🗑️]   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [Enregistrer Localement] [Annuler]                         │
└─────────────────────────────────────────────────────────────┘
```

### Synchronisation en cours
```
┌─────────────────────────────────────────────────────────────┐
│ 🔄 Synchronisation en cours...                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ████████████████████▓▓▓▓▓▓▓▓ 67%                          │
│                                                             │
│ ✅ Articles synchronisés (156/156)                         │
│ ✅ Mouvements de stock synchronisés (23/23)                │
│ 🔄 Bons en cours... (2/5)                                  │
│ ⏳ Notifications en attente... (0/12)                       │
│                                                             │
│ Temps estimé restant: 30 secondes                          │
│                                                             │
│ [Arrêter la synchronisation]                               │
└─────────────────────────────────────────────────────────────┘
```

## Tâches Techniques (Definition of Done)

- [ ] Service Worker Configuration :
  - Installation et activation automatique
  - Stratégies de cache par type de ressource
  - Cache API pour données statiques (articles, catégories)
  - IndexedDB pour données dynamiques (brouillons, modifications)
- [ ] Détection Connectivité :
  - Listener navigator.onLine + ping server périodique
  - Indicateur visuel état connexion (online/offline)
  - Queue des actions en attente de synchronisation
  - Retry automatique avec backoff exponentiel
- [ ] Cache Strategy :
  - Stale-While-Revalidate pour données fréquentes
  - Cache-First pour assets statiques
  - Network-First pour données critiques
  - TTL et invalidation intelligente du cache
- [ ] Synchronisation Background :
  - Background Sync API pour actions différées
  - Conflict resolution (server wins par défaut)
  - Progress tracking et UI feedback
  - Gestion des erreurs de sync avec retry
- [ ] PWA Configuration :
  - Web App Manifest complet avec icônes
  - Mode standalone sans UI navigateur
  - Theme color et splash screen personnalisés
  - Start URL optimisée pour usage mobile
- [ ] Stockage Local :
  - IndexedDB pour gros volumes de données
  - localStorage pour préférences utilisateur
  - Nettoyage automatique données expirées
  - Encryption des données sensibles locales
- [ ] UI/UX Offline-First :
  - Loading skeletons pour données en cache
  - States visuels pour actions en attente sync
  - Messages d'erreur contextuels hors ligne
  - Onboarding installation PWA

## Configuration Technique

### Service Worker Setup
```typescript
// sw.js - Service Worker principal
const CACHE_NAME = 'erp-pme-v1';
const OFFLINE_URL = '/offline';

const CACHE_STRATEGIES = {
  // Assets statiques - Cache First
  static: [
    '/assets/',
    '/icons/',
    '/_next/static/',
  ],
  
  // API données - Stale While Revalidate
  api: [
    '/api/v1/items',
    '/api/v1/categories',
    '/api/v1/stock',
  ],
  
  // API critiques - Network First
  critical: [
    '/api/v1/auth',
    '/api/v1/vouchers/validate',
  ]
};

// Installation et mise à jour du cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll([
        '/',
        '/offline',
        '/manifest.json',
        // Assets critiques pour fonctionnement hors ligne
      ]))
  );
});

// Stratégies de cache par route
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // API calls
  if (url.pathname.startsWith('/api/')) {
    if (isCriticalAPI(url.pathname)) {
      event.respondWith(networkFirst(request));
    } else {
      event.respondWith(staleWhileRevalidate(request));
    }
  }
  // Static assets
  else if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
  }
  // Pages
  else {
    event.respondWith(networkFirst(request));
  }
});
```

### Background Sync pour Actions
```typescript
// lib/offline/sync-manager.ts
class SyncManager {
  private queue: SyncAction[] = [];
  
  async queueAction(action: SyncAction) {
    this.queue.push({
      ...action,
      id: generateId(),
      timestamp: Date.now(),
      retries: 0
    });
    
    // Sauvegarder dans IndexedDB
    await this.persistQueue();
    
    // Tenter sync si en ligne
    if (navigator.onLine) {
      this.processSyncQueue();
    }
  }
  
  async processSyncQueue() {
    const actions = await this.getQueuedActions();
    
    for (const action of actions) {
      try {
        await this.executeAction(action);
        await this.removeFromQueue(action.id);
      } catch (error) {
        await this.handleSyncError(action, error);
      }
    }
  }
  
  private async executeAction(action: SyncAction) {
    switch (action.type) {
      case 'CREATE_VOUCHER':
        return await api.vouchers.create(action.data);
      case 'UPDATE_ITEM':
        return await api.items.update(action.data.id, action.data);
      case 'MARK_NOTIFICATION_READ':
        return await api.notifications.markAsRead(action.data.id);
    }
  }
}
```

### IndexedDB pour Données Offline
```typescript
// lib/offline/storage.ts
class OfflineStorage {
  private db: IDBDatabase;
  
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('erp-offline', 1);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Store pour articles en cache
        const itemsStore = db.createObjectStore('items', { keyPath: 'id' });
        itemsStore.createIndex('code', 'code', { unique: true });
        itemsStore.createIndex('category', 'categoryId');
        
        // Store pour brouillons locaux
        const draftsStore = db.createObjectStore('drafts', { keyPath: 'id' });
        draftsStore.createIndex('type', 'type');
        draftsStore.createIndex('created', 'createdAt');
        
        // Store pour sync queue
        const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
        syncStore.createIndex('timestamp', 'timestamp');
      };
    });
  }
  
  async cacheItems(items: Item[]) {
    const tx = this.db.transaction(['items'], 'readwrite');
    const store = tx.objectStore('items');
    
    for (const item of items) {
      await store.put({
        ...item,
        cachedAt: Date.now(),
        ttl: Date.now() + (24 * 60 * 60 * 1000) // 24h TTL
      });
    }
  }
  
  async getCachedItems(): Promise<Item[]> {
    const tx = this.db.transaction(['items'], 'readonly');
    const store = tx.objectStore('items');
    const items = await store.getAll();
    
    // Filtrer les items expirés
    const now = Date.now();
    return items.filter(item => item.ttl > now);
  }
}
```

## Web App Manifest

### `public/manifest.json`
```json
{
  "name": "ERP PME - Gestion Stock",
  "short_name": "ERP PME",
  "description": "Gestion de stock et bons pour PME",
  "start_url": "/dashboard",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#2563eb",
  "background_color": "#f8fafc",
  "categories": ["business", "productivity"],
  "screenshots": [
    {
      "src": "/screenshots/dashboard.png",
      "sizes": "540x720",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "shortcuts": [
    {
      "name": "Nouveau bon",
      "short_name": "Nouveau bon",
      "description": "Créer un nouveau bon rapidement",
      "url": "/dashboard/bons/nouveau",
      "icons": [{ "src": "/icons/shortcut-voucher.png", "sizes": "96x96" }]
    },
    {
      "name": "Stock bas",
      "short_name": "Alertes",
      "description": "Voir les alertes de stock bas",
      "url": "/dashboard/stock?filter=low",
      "icons": [{ "src": "/icons/shortcut-alert.png", "sizes": "96x96" }]
    }
  ]
}
```

## Tests d'Acceptation

- [ ] Service Worker s'installe et fonctionne
- [ ] Données mises en cache accessibles hors ligne
- [ ] Création de brouillons hors ligne fonctionne
- [ ] Synchronisation automatique au retour en ligne
- [ ] PWA s'installe depuis le navigateur
- [ ] Mode standalone sans barre d'adresse
- [ ] Indicateurs visuels connectivité corrects
- [ ] Gestion gracieuse des conflits de données
- [ ] Performance acceptable avec gros cache (>1000 items)
- [ ] Nettoyage automatique des données expirées

## Fichiers à Créer

- `public/sw.js` (Service Worker principal)
- `public/manifest.json` (Web App Manifest)
- `public/offline.html` (Page hors ligne)
- `frontend/lib/offline/sync-manager.ts`
- `frontend/lib/offline/storage.ts`
- `frontend/lib/offline/connectivity.ts`
- `frontend/components/offline/offline-indicator.tsx`
- `frontend/components/offline/sync-status.tsx`
- `frontend/components/offline/install-prompt.tsx`
- `frontend/hooks/use-online-status.ts`
- `frontend/hooks/use-sync-queue.ts`
- `frontend/store/offline.ts`

## Dépendances

- **Service Worker API** : Cache, Background Sync
- **IndexedDB** : Stockage local structuré
- **PWA** : Web App Manifest, Installation
- **Libraries** : workbox (optionnel), idb pour IndexedDB
- **Backend** : APIs idempotentes, timestamps pour sync
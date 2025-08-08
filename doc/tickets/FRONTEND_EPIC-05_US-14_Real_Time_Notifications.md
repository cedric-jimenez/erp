# FRONTEND_EPIC-05_US-14 : Notifications temps réel

**Epic**: FRONTEND EPIC-05 Fonctionnalités Avancées  
**Story Points**: 13  
**Sprint**: 8-9  
**Assigné**: Frontend Dev + Backend Dev  

## User Story

En tant qu'**utilisateur PME**, je veux recevoir des notifications temps réel sur les événements critiques (stock bas, validation de bons, erreurs) pour réagir rapidement aux situations urgentes.

## Critères d'Acceptation

**GIVEN** mon stock d'un article passe en dessous du seuil minimum  
**WHEN** une sortie de stock est validée  
**THEN** je reçois une notification instantanée "Stock bas: USB001 (3 restants)"  
**AND** la notification apparaît dans l'interface et sur desktop  

**GIVEN** je suis connecté sur plusieurs onglets/appareils  
**WHEN** un autre utilisateur valide un bon que je consultais  
**THEN** je reçois une notification de mise à jour en temps réel  
**AND** les données se rafraîchissent automatiquement  

**GIVEN** j'ai des notifications non lues  
**WHEN** j'ouvre l'application  
**THEN** je vois le compteur de notifications non lues  
**AND** je peux consulter l'historique des notifications récentes  

## Spécifications UI/UX

### Composant Notifications
```
┌─────────────────────────────────────────────────────────────┐
│ 🏠 Dashboard                                    🔔 [3]       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔔 Notifications                          [Tout marquer] │ │
│ │ ─────────────────────────────────────────────────────── │ │
│ │                                                         │ │
│ │ 🔴 Stock critique • USB001 - Clé USB 32GB              │ │
│ │    Stock: 0 pièces • Il y a 2 minutes                  │ │
│ │                                                         │ │
│ │ ⚠️  Stock bas • KEY123 - Clavier Wireless               │ │
│ │    Stock: 3 pièces (seuil: 10) • Il y a 15 minutes    │ │
│ │                                                         │ │
│ │ ✅ Bon validé • BON-2024-001 par Marie Dupont          │ │
│ │    +50 articles ajoutés • Il y a 1 heure               │ │
│ │                                                         │ │
│ │ 📊 Rapport hebdomadaire • Mouvements de stock          │ │
│ │    125 mouvements cette semaine • Il y a 1 jour       │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Toast Notifications Temps Réel
```
                                        ┌─────────────────────┐
                                        │ 🔴 Stock critique   │
                                        │ USB001 - Clé USB    │
                                        │ 0 pièces restantes  │
                                        │           [Voir] [×]│
                                        └─────────────────────┘
                                        
                                        ┌─────────────────────┐
                                        │ ✅ Bon validé       │
                                        │ BON-2024-001        │
                                        │ par Marie Dupont    │
                                        │           [Voir] [×]│
                                        └─────────────────────┘
```

### Types de Notifications

#### Critiques (Rouge)
- Stock à 0 (rupture complète)
- Erreurs système bloquantes
- Violations de sécurité

#### Avertissements (Orange)  
- Stock en dessous du seuil minimum
- Bons en attente de validation >24h
- Échecs de synchronisation

#### Informations (Bleu)
- Bons validés avec succès
- Import/export terminé
- Nouveaux utilisateurs connectés

#### Succès (Vert)
- Réapprovisionnement effectué
- Sauvegarde automatique réussie
- Synchronisation complète

## Tâches Techniques (Definition of Done)

- [ ] Configuration WebSocket/SSE :
  - Client WebSocket avec reconnexion automatique
  - Gestion des événements par type (stock, vouchers, system)
  - Heartbeat et détection de déconnexion
  - Fallback polling si WebSocket indisponible
- [ ] Composant Notifications :
  - Bell icon avec compteur de non-lues
  - Dropdown avec liste des notifications récentes
  - Marquage lu/non-lu individuel et en masse
  - Filtrage par type et importance
- [ ] Toast System :
  - Notifications push temps réel
  - Auto-dismiss selon importance (3s info, 10s warning, manuel critical)
  - Stacking et limite (max 5 simultanées)
  - Animation fluide (slide-in/out)
- [ ] Persistence et Historique :
  - Stockage local des notifications récentes
  - Pagination de l'historique complet
  - Nettoyage automatique (30 jours)
  - Synchronisation multi-onglets/appareils
- [ ] Permission et Préférences :
  - Demande permission navigateur pour desktop notifications
  - Paramètres utilisateur (types activés, sons, fréquence)
  - Mode silencieux/pause temporaire
  - Personnalisation par rôle utilisateur
- [ ] Intégration Desktop :
  - Notifications système natives (quand onglet inactif)
  - Badge sur favicon avec compteur
  - Titre dynamique avec alertes urgentes
  - Service Worker pour notifications hors ligne

## Intégration Backend

### WebSocket Events
```typescript
// Types d'événements
interface NotificationEvent {
  id: string;
  type: 'stock' | 'voucher' | 'system' | 'user';
  severity: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  data?: any; // Données contextuelles
  userId: string;
  timestamp: string;
  read: boolean;
}

// Client WebSocket
const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL);
    
    ws.onmessage = (event) => {
      const notification: NotificationEvent = JSON.parse(event.data);
      
      // Ajouter à la liste
      setNotifications(prev => [notification, ...prev].slice(0, 100));
      
      // Incrémenter compteur non-lues
      if (!notification.read) {
        setUnreadCount(prev => prev + 1);
      }
      
      // Afficher toast
      showToast(notification);
      
      // Notification desktop si permission
      if (Notification.permission === 'granted' && document.hidden) {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/icons/notification.png',
          tag: notification.id
        });
      }
    };
    
    return () => ws.close();
  }, []);
  
  return { notifications, unreadCount, markAsRead, markAllAsRead };
};
```

### API Endpoints Backend
```
GET /api/v1/notifications?page=1&limit=20&type=stock&unread=true
POST /api/v1/notifications/:id/read
POST /api/v1/notifications/read-all
GET /api/v1/notifications/settings
PUT /api/v1/notifications/settings

WebSocket: /api/v1/ws/notifications
```

## Tests d'Acceptation

- [ ] WebSocket se connecte et reçoit les événements
- [ ] Notifications s'affichent en temps réel (toast + liste)
- [ ] Compteur non-lues se met à jour correctement
- [ ] Notifications desktop fonctionnent (si permission)
- [ ] Reconnexion automatique après déconnexion
- [ ] Historique paginé charge correctement
- [ ] Préférences utilisateur sauvegardées
- [ ] Performance stable avec 100+ notifications
- [ ] Multi-onglets synchronisés
- [ ] Mode hors ligne graceful (pas d'erreurs)

## Fichiers à Créer

- `frontend/components/notifications/notifications-provider.tsx`
- `frontend/components/notifications/notifications-bell.tsx`
- `frontend/components/notifications/notifications-dropdown.tsx`
- `frontend/components/notifications/notification-item.tsx`
- `frontend/components/notifications/toast-container.tsx`
- `frontend/components/notifications/toast-notification.tsx`
- `frontend/hooks/use-notifications.ts`
- `frontend/hooks/use-websocket.ts`
- `frontend/lib/notifications/notification-service.ts`
- `frontend/lib/notifications/toast-service.ts`
- `frontend/store/notifications.ts`
- `frontend/types/notifications.ts`

## Dépendances

- **Backend** : WebSocket/SSE endpoints, événements stock/voucher
- **Permissions** : Notification API browser
- **Service Worker** : Pour notifications hors ligne
- **Libraries** : react-hot-toast, @websocket/client ou socket.io-client
# Architecture Frontend - Détails Techniques

## State Management avec Zustand + React Query

### Architecture Globale
```
┌─────────────────────────────────────────────────────────┐
│ FRONTEND STATE ARCHITECTURE                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   ZUSTAND   │    │ REACT QUERY │    │ LOCAL STATE │  │
│  │   STORES    │    │    CACHE    │    │ (useState)  │  │
│  │             │    │             │    │             │  │
│  │ • Auth      │    │ • Items     │    │ • Forms     │  │
│  │ • Settings  │    │ • Vouchers  │    │ • UI State  │  │
│  │ • UI Global │    │ • Stock     │    │ • Modals    │  │
│  └─────────────┘    └─────────────┘    └─────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Stores Zustand Modulaires

#### `store/auth.ts`
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  permissions: Permission[];
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  checkPermission: (permission: string) => boolean;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      permissions: [],
      
      login: async (credentials) => {
        // Login logic with API call
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        queryClient.clear(); // Clear React Query cache
      },
      
      checkPermission: (permission) => {
        return get().permissions.some(p => p.name === permission);
      }
    }),
    { name: 'auth-storage' }
  )
);
```

#### `store/settings.ts`
```typescript
interface SettingsState {
  theme: 'light' | 'dark';
  language: 'fr' | 'en';
  itemsPerPage: number;
  defaultWarehouse: string | null;
  
  // Actions
  updateTheme: (theme: 'light' | 'dark') => void;
  updateLanguage: (lang: 'fr' | 'en') => void;
  updateItemsPerPage: (count: number) => void;
}
```

### React Query Configuration

#### `lib/api/client.ts`
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error.status === 401) return false; // Don't retry auth errors
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        // Global error handling
        toast.error(error.message);
      }
    }
  }
});

// Custom hooks par domaine
export const useItems = (params: ItemsQueryParams) => {
  return useQuery({
    queryKey: ['items', params],
    queryFn: () => itemsApi.getItems(params),
    keepPreviousData: true, // Pour pagination fluide
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: itemsApi.createItem,
    onSuccess: () => {
      // Invalidate et refetch items
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Article créé avec succès');
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    }
  });
};
```

## Stratégie Tests Frontend

### Configuration Jest + Testing Library

#### `__tests__/setup.ts`
```typescript
import '@testing-library/jest-dom';
import { server } from './__mocks__/server';

// MSW server setup
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock React Query client pour les tests
jest.mock('../lib/api/client', () => ({
  queryClient: new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  }),
}));

// Mock Zustand stores
jest.mock('../store/auth', () => ({
  useAuthStore: () => ({
    user: { id: '1', name: 'Test User' },
    isAuthenticated: true,
    checkPermission: () => true,
  }),
}));
```

#### `__tests__/utils/test-utils.tsx`
```typescript
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={testQueryClient}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const customRender = (ui: ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Types de Tests par Composant

#### Tests Unitaires Composants
```typescript
// __tests__/components/items/item-form.test.tsx
describe('ItemForm', () => {
  it('should validate required fields', async () => {
    render(<ItemForm />);
    
    const submitButton = screen.getByRole('button', { name: /enregistrer/i });
    fireEvent.click(submitButton);
    
    expect(await screen.findByText(/code obligatoire/i)).toBeInTheDocument();
    expect(await screen.findByText(/nom obligatoire/i)).toBeInTheDocument();
  });

  it('should check code uniqueness on blur', async () => {
    render(<ItemForm />);
    
    const codeInput = screen.getByLabelText(/code article/i);
    fireEvent.change(codeInput, { target: { value: 'USB001' } });
    fireEvent.blur(codeInput);
    
    await waitFor(() => {
      expect(screen.getByText(/code déjà utilisé/i)).toBeInTheDocument();
    });
  });
});
```

#### Tests d'Intégration avec API
```typescript
// __tests__/pages/items/create.test.tsx
describe('Create Item Page', () => {
  it('should create item successfully', async () => {
    const user = userEvent.setup();
    render(<CreateItemPage />);
    
    await user.type(screen.getByLabelText(/code/i), 'TEST001');
    await user.type(screen.getByLabelText(/nom/i), 'Test Item');
    await user.selectOptions(screen.getByLabelText(/catégorie/i), 'electronics');
    
    await user.click(screen.getByRole('button', { name: /enregistrer/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/article créé avec succès/i)).toBeInTheDocument();
    });
  });
});
```

### Mocks API avec MSW

#### `__tests__/__mocks__/handlers.ts`
```typescript
export const handlers = [
  rest.get('/api/v1/items', (req, res, ctx) => {
    const search = req.url.searchParams.get('search');
    const page = req.url.searchParams.get('page') || '1';
    
    const filteredItems = mockItems.filter(item =>
      !search || item.name.toLowerCase().includes(search.toLowerCase())
    );
    
    return res(
      ctx.json({
        items: filteredItems.slice((+page - 1) * 20, +page * 20),
        pagination: {
          page: +page,
          total: filteredItems.length,
          totalPages: Math.ceil(filteredItems.length / 20),
        }
      })
    );
  }),

  rest.post('/api/v1/items/check-code', (req, res, ctx) => {
    const { code } = req.body as { code: string };
    const exists = mockItems.some(item => item.code === code);
    
    return res(
      ctx.json({ available: !exists })
    );
  }),
];
```

## Performance et Error Handling

### Error Boundaries par Module

#### `error-boundaries/app-error-boundary.tsx`
```typescript
class AppErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log à Sentry ou service de monitoring
    console.error('App Error:', error, errorInfo);
    
    // Notifier l'utilisateur
    toast.error('Une erreur inattendue s\'est produite');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Oops! Quelque chose s'est mal passé</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Performance Monitoring

#### `lib/performance.ts`
```typescript
// Web Vitals tracking
export const trackWebVitals = (metric: Metric) => {
  switch (metric.name) {
    case 'CLS':
    case 'FID':
    case 'FCP':
    case 'LCP':
    case 'TTFB':
      // Send to analytics
      analytics.track('web-vital', {
        name: metric.name,
        value: metric.value,
        page: window.location.pathname,
      });
      break;
  }
};

// Performance budgets
export const PERFORMANCE_BUDGETS = {
  BUNDLE_SIZE: 250 * 1024, // 250KB
  TIME_TO_INTERACTIVE: 3.5 * 1000, // 3.5s
  FIRST_CONTENTFUL_PAINT: 1.5 * 1000, // 1.5s
  LARGEST_CONTENTFUL_PAINT: 2.5 * 1000, // 2.5s
};
```

### Lazy Loading Strategy

#### `app/dashboard/layout.tsx`
```typescript
// Lazy loading des modules
const ItemsModule = dynamic(() => import('../items'), {
  loading: () => <ModuleLoadingSkeleton />,
  ssr: false
});

const VouchersModule = dynamic(() => import('../vouchers'), {
  loading: () => <ModuleLoadingSkeleton />,
  ssr: false
});

const StockModule = dynamic(() => import('../stock'), {
  loading: () => <ModuleLoadingSkeleton />,
  ssr: false
});
```

## Seuils Qualité

### Coverage Requirements
- **Composants UI** : 85% minimum
- **Business Logic** : 90% minimum
- **API Integrations** : 80% minimum
- **Error Boundaries** : 100% (critique)

### Performance Thresholds
- **Bundle size** : <250KB initial
- **Time to Interactive** : <3.5s
- **First Contentful Paint** : <1.5s
- **Lighthouse Score** : >90 (Performance, A11y, Best Practices)

Cette architecture garantit une base solide pour le développement frontend avec une séparation claire des responsabilités et une stratégie de tests complète.
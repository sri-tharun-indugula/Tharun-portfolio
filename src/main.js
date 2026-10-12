import './style.css';
import { 
  createIcons, 
  Database, 
  LayoutGrid, 
  FileText, 
  RefreshCw, 
  Table, 
  HardDrive, 
  Mail, 
  Presentation, 
  MapPin, 
  Flame, 
  ExternalLink, 
  BarChart2, 
  FileCheck, 
  Download, 
  Eye, 
  Send, 
  Clock, 
  Settings, 
  ShieldCheck, 
  X, 
  Save, 
  Sparkles, 
  Layers, 
  Code,
  Home,
  Briefcase,
  Cpu,
  Code2,
  Palette,
  Server,
  Cloud,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  CheckCircle2,
  BookOpen,
  Terminal,
  Zap,
  Copy,
  Check,
  Menu
} from 'lucide';
import confetti from 'canvas-confetti';

// ============================================================================
// DEFAULT / SHOWCASE DATA (FALLBACK WHEN NO CUSTOM GOOGLE SHEET IS LINKED)
// ============================================================================
const DEMO_PROJECTS = [
  {
    id: 1,
    title: "Enterprise Banking Customer Portal",
    description: "High-security banking platform with customer dashboards, transaction workflows, and multi-factor auth. Built with Angular 18, NgRx state management, RESTful APIs, and automated Jenkins CI/CD pipeline deployment.",
    category: "Banking",
    tags: ["Angular 18", "RESTful APIs", "Jenkins CI/CD", "TypeScript", "NgRx"],
    demoUrl: "https://www.linkedin.com/in/indugula-veera-venkata-sri-tharun-4418b5217/",
    githubUrl: "https://github.com",
    featured: true,
    imageUrl: ""
  },
  {
    id: 2,
    title: "Healthcare EHR Portal & FastAPI Engine",
    description: "Comprehensive medical records and appointment scheduling system powered by a high-throughput Python FastAPI microservice backend and responsive React / Next.js frontend with automated Jenkins test pipelines.",
    category: "Healthcare",
    tags: ["React.js", "FastAPI", "Python", "RESTful APIs", "Jenkins"],
    demoUrl: "https://www.linkedin.com/in/indugula-veera-venkata-sri-tharun-4418b5217/",
    githubUrl: "https://github.com",
    featured: true,
    imageUrl: ""
  },
  {
    id: 3,
    title: "Scalable E-Commerce Storefront & Checkout",
    description: "Modern high-traffic digital retail experience built with React, Redux Toolkit, reactive shopping cart state, and robust RESTful API integration for payment gateways and order tracking.",
    category: "E-commerce",
    tags: ["React.js", "Redux Toolkit", "RESTful APIs", "Node.js", "SCSS"],
    demoUrl: "https://www.linkedin.com/in/indugula-veera-venkata-sri-tharun-4418b5217/",
    githubUrl: "https://github.com",
    featured: true,
    imageUrl: ""
  },
  {
    id: 4,
    title: "Enterprise HR & Payroll Automation Suite",
    description: "Workforce suite managing real-time employee onboarding, attendance, and payroll workflows. Implemented with Angular Material, Node.js RESTful services, and continuous integration via Jenkins.",
    category: "HR Management",
    tags: ["Angular", "RESTful APIs", "Jenkins", "MySQL", "Angular Material"],
    demoUrl: "https://www.linkedin.com/in/indugula-veera-venkata-sri-tharun-4418b5217/",
    githubUrl: "https://github.com",
    featured: false,
    imageUrl: ""
  },
  {
    id: 5,
    title: "Google Workspace Automated Headless CMS",
    description: "Zero-cost real-time content management pipeline connecting Google Sheets, Forms, and Gmail via Google Apps Script and lightweight REST APIs for instant updates.",
    category: "Cloud",
    tags: ["Google Sheets", "RESTful APIs", "Apps Script", "Automation"],
    demoUrl: "https://docs.google.com/document/d/1PKlC9Jyx7PAJTEhkinz6JC4uzeD2Piu9/edit?usp=sharing",
    githubUrl: "https://github.com",
    featured: true,
    imageUrl: ""
  },
  {
    id: 6,
    title: "Realtime Analytics & FastAPI Event Monitor",
    description: "Cloud-native live analytics monitor combining Python FastAPI WebSockets, Firebase Firestore, and React dashboard components for sub-second telemetry.",
    category: "Cloud",
    tags: ["FastAPI", "React.js", "Firebase", "WebSockets", "Jenkins CI/CD"],
    demoUrl: "https://www.linkedin.com/in/indugula-veera-venkata-sri-tharun-4418b5217/",
    githubUrl: "https://github.com",
    featured: false,
    imageUrl: ""
  }
];

// ============================================================================
// STATE MANAGEMENT
// ============================================================================
let currentProjects = [...DEMO_PROJECTS];
let activeFilter = 'all';
let isLiveSheet = false;

// ============================================================================
// INITIALIZATION & ICONS
// ============================================================================
function initIcons() {
  createIcons({
    icons: {
      Database,
      LayoutGrid,
      FileText,
      RefreshCw,
      Table,
      HardDrive,
      Mail,
      Presentation,
      MapPin,
      Flame,
      ExternalLink,
      BarChart2,
      FileCheck,
      Download,
      Eye,
      Send,
      Clock,
      Settings,
      ShieldCheck,
      X,
      Save,
      Sparkles,
      Layers,
      Code,
      Home,
      Briefcase,
      Cpu,
      Code2,
      Palette,
      Server,
      Cloud,
      ChevronLeft,
      ChevronRight,
      Play,
      Pause,
      Maximize2,
      Minimize2,
      CheckCircle2,
      BookOpen,
      Terminal,
      Zap,
      Copy,
      Check,
      Menu
    }
  });
}

// ============================================================================
// DATA FETCHING (GOOGLE SHEETS CMS / APPS SCRIPT)
// ============================================================================
async function fetchSheetData(url) {
  if (!url || !url.trim()) {
    isLiveSheet = false;
    currentProjects = [...DEMO_PROJECTS];
    updateSourceBadge(false);
    renderProjects();
    return;
  }

  const syncIcon = document.getElementById('sync-icon');
  const syncText = document.getElementById('sync-status-text');
  if (syncIcon) syncIcon.classList.add('spinning');
  if (syncText) syncText.textContent = 'Syncing...';

  try {
    // Check if URL is an Apps Script endpoint or CSV
    const response = await fetch(url.trim());
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const contentType = response.headers.get('content-type') || '';
    let projects = [];

    if (contentType.includes('application/json') || url.includes('macros/s/')) {
      const data = await response.json();
      projects = data.projects || (Array.isArray(data) ? data : []);
    } else {
      // Parse CSV if direct Google Sheet CSV export link was given
      const text = await response.text();
      projects = parseCSV(text);
    }

    if (projects && projects.length > 0) {
      currentProjects = projects.map((p, idx) => ({
        id: p.id || idx + 1,
        title: p.title || 'Untitled Project',
        description: p.description || 'No description provided.',
        category: p.category || 'Web',
        tags: Array.isArray(p.tags) ? p.tags : (p.tags ? String(p.tags).split(',').map(t => t.trim()) : ['Project']),
        demoUrl: p.demoUrl || p.demourl || '#',
        githubUrl: p.githubUrl || p.githuburl || '#',
        featured: p.featured === true || String(p.featured).toLowerCase() === 'true',
        imageUrl: p.imageUrl || p.imageurl || ''
      }));
      isLiveSheet = true;
      updateSourceBadge(true, `Synced with Google Sheet (${currentProjects.length} items)`);
      triggerConfetti();
    } else {
      throw new Error('No project rows found in sheet');
    }
  } catch (err) {
    console.warn('Could not fetch from custom Google Sheet URL, using fallback demo data:', err);
    currentProjects = [...DEMO_PROJECTS];
    isLiveSheet = false;
    updateSourceBadge(false, 'Using Demo Data (Check Sheet URL)');
  } finally {
    if (syncIcon) syncIcon.classList.remove('spinning');
    if (syncText) syncText.textContent = isLiveSheet ? 'Synced!' : 'Sync Sheet';
    renderProjects();
    setTimeout(() => {
      if (syncText) syncText.textContent = 'Sync Sheet';
    }, 2000);
  }
}

function parseCSV(csvText) {
  const normalized = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  const lines = normalized.split('\n');
  if (lines.length <= 1) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/["']/g, ''));
  return lines.slice(1).map((line, i) => {
    const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    let obj = { id: i + 1 };
    headers.forEach((h, idx) => {
      obj[h] = values[idx] || '';
    });
    return obj;
  });
}

function updateSourceBadge(isLive, customLabel) {
  const label = document.getElementById('data-source-label');
  const dot = document.querySelector('.pulse-indicator');
  const syncDot = document.querySelector('.sync-indicator');

  if (label) {
    label.textContent = customLabel || (isLive ? 'Live Sync Active (Google Sheets)' : 'Loaded from Demo Data (Connect your Sheet)');
  }
  if (dot) {
    dot.style.background = isLive ? 'var(--g-green)' : 'var(--g-yellow)';
    dot.style.boxShadow = isLive ? '0 0 8px var(--g-green)' : '0 0 8px var(--g-yellow)';
  }
  if (syncDot) {
    syncDot.className = `sync-indicator ${isLive ? 'online' : ''}`;
  }
}

// ============================================================================
// PROJECT RENDERING & FILTERING
// ============================================================================
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const filtered = activeFilter === 'all' 
    ? currentProjects 
    : currentProjects.filter(p => p.category.toLowerCase().includes(activeFilter.toLowerCase()));

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
        <p>No projects match this category yet. Add a row in your Google Sheet with category <strong>${activeFilter}</strong>!</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(project => `
    <article class="project-card">
      <div class="project-media">
        ${project.imageUrl 
          ? `<img src="${project.imageUrl}" alt="${project.title}" loading="lazy" />` 
          : `<div class="project-placeholder-pattern">
               <i data-lucide="layers" style="width: 48px; height: 48px; margin-bottom: 0.5rem;"></i>
               <span style="font-size: 0.8rem; font-weight: 600; text-transform: uppercase;">Google Cloud Solution</span>
             </div>`
        }
        <span class="project-category-badge">${project.category}</span>
      </div>

      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-desc">${project.description}</p>
        
        <div class="project-tags">
          ${project.tags.map(t => `<span class="tag-pill">${t}</span>`).join('')}
        </div>

        <div class="project-actions">
          ${project.demoUrl && project.demoUrl !== '#' 
            ? `<a href="${project.demoUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                 <i data-lucide="external-link"></i> Live Demo
               </a>` 
            : `<button class="btn btn-primary btn-sm" disabled style="opacity: 0.5;">
                 <i data-lucide="external-link"></i> In Production
               </button>`
          }
          ${project.githubUrl && project.githubUrl !== '#'
            ? `<a href="${project.githubUrl}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm" title="View Code">
                 <i data-lucide="code"></i> GitHub
               </a>`
            : ''
          }
        </div>
      </div>
    </article>
  `).join('');

  initIcons();
}

// ============================================================================
// INTERACTIVE SHOWCASE TABS (SLIDES, LOOKER, DRIVE)
// ============================================================================
function setupTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.add('active');
    });
  });
}

// ============================================================================
// MOBILE NAVIGATION DRAWER CONTROLLER
// ============================================================================
function setupMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('close-mobile-drawer-btn');
  const navLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-contact-btn');

  const openDrawer = () => {
    if (drawer) {
      drawer.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeDrawer = () => {
    if (drawer) {
      drawer.classList.add('hidden');
      document.body.style.overflow = '';
    }
  };

  if (menuBtn) menuBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  if (drawer) {
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) closeDrawer();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && !drawer.classList.contains('hidden')) {
      closeDrawer();
    }
  });
}

// ============================================================================
// ENTERPRISE ARCHITECTURE & DESIGN SYSTEMS SLIDE STUDY DATA (15 MODULES)
// Covers: Angular 18, FastAPI, React 19, Next.js App Router, Express.js & Node
// ============================================================================
const ARCHITECTURE_SLIDES = [
  // --- ANGULAR ENTERPRISE DECK (4 SLIDES) ---
  {
    id: 1,
    category: "angular",
    domain: "Angular 18 Enterprise",
    domainClass: "domain-angular",
    title: "Standalone & Feature-Sliced Architecture",
    subtitle: "Eliminating NgModule indirection with functional tree-shakable dependency injection",
    overview: "Modern enterprise Angular applications use standalone components, functional injection tokens, and feature-sliced boundaries to ensure strict domain isolation and optimal bundle sizes.",
    studyPoints: [
      { label: "Standalone Paradigm", desc: "Components, directives, and pipes declare dependencies directly in imports, removing module overhead." },
      { label: "Functional Injection", desc: "Replaced constructor injection with inject() function, enabling composable functional injection tokens and utilities." },
      { label: "Lazy Route Splitting", desc: "Route-level loadComponent() and loadChildren() chunking for sub-second First Contentful Paint (FCP)." },
      { label: "Enterprise Governance", desc: "Strict ESLint boundary rules preventing circular dependencies between domain feature slices." }
    ],
    codeTitle: "standalone-auth.component.ts",
    codeLanguage: "TypeScript",
    codeSnippet: `@Component({
  selector: 'app-enterprise-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  template: \`
    <form [formGroup]="loginForm" (ngSubmit)="handleLogin()">
      <mat-form-field appearance="outline">
        <mat-label>SSO Enterprise Email</mat-label>
        <input matInput formControlName="email" />
      </mat-form-field>
      <button mat-raised-button color="primary" [disabled]="loading()">
        {{ loading() ? 'Authenticating...' : 'Sign In via Okta' }}
      </button>
    </form>
  \`
})
export class EnterpriseAuthComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  loading = signal<boolean>(false);
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  async handleLogin() {
    this.loading.set(true);
    await this.authService.initiateSso(this.loginForm.value);
    this.loading.set(false);
  }
}`,
    metrics: [
      { label: "Initial JS", value: "-38% Bundle Size" },
      { label: "Lazy Chunks", value: "<120KB per Route" },
      { label: "FCP Speed", value: "0.6s on Edge" }
    ],
    takeaway: "Eliminating NgModules streamlined testing, accelerated Vite builds by 40%, and enabled direct functional injection."
  },
  {
    id: 2,
    category: "angular",
    domain: "Angular 18 Enterprise",
    domainClass: "domain-angular",
    title: "Fine-Grained Reactivity: Signals vs. RxJS Streams",
    subtitle: "Synchronous glitch-free state derivation combined with asynchronous event pipelines",
    overview: "Angular Signals provide fine-grained synchronous reactivity for UI state, while RxJS excels at handling complex asynchronous event streams, WebSockets, and debounced user input.",
    studyPoints: [
      { label: "Angular Signals", desc: "signal(), computed(), and effect() form an automatic dependency graph without Zone.js monkey-patching." },
      { label: "RxJS Interoperability", desc: "toSignal() and toObservable() bridges async event pipelines with synchronous template rendering." },
      { label: "SignalStore Pattern", desc: "Lightweight, type-safe state container replacing boilerplate-heavy NgModules for feature-level state." },
      { label: "Zoneless Change Detection", desc: "Enables experimental Zoneless mode, eliminating global dirty-checking passes for 60 FPS frame rates." }
    ],
    codeTitle: "customer-search.store.ts",
    codeLanguage: "TypeScript",
    codeSnippet: `export const CustomerStore = signalStore(
  { providedIn: 'root' },
  withState({
    query: '',
    customers: [] as Customer[],
    isLoading: false
  }),
  withComputed(({ query, customers }) => ({
    filteredCount: computed(() => customers().length),
    activeResults: computed(() => 
      customers().filter(c => c.name.toLowerCase().includes(query().toLowerCase()))
    )
  })),
  withMethods((store, http = inject(HttpClient)) => ({
    search: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, { isLoading: true })),
        switchMap(term => http.get<Customer[]>(\`/api/v1/customers?q=\${term}\`)),
        tap(results => patchState(store, { customers: results, isLoading: false }))
      )
    )
  }))
);`,
    metrics: [
      { label: "Reactivity Type", value: "Glitch-Free Signals" },
      { label: "Frame Budget", value: "60 FPS Solid" },
      { label: "Memory GC", value: "-25% Cycle Time" }
    ],
    takeaway: "Signals manage state values cleanly, while RxJS excels at async event handling over time."
  },
  {
    id: 3,
    category: "angular",
    domain: "Angular 18 Enterprise",
    domainClass: "domain-angular",
    title: "Enterprise Design Systems & Tokenized SCSS",
    subtitle: "Design tokens, WCAG 2.1 AA accessibility, and customized Angular Material / PrimeNG",
    overview: "An enterprise design system standardizes colors, typography, spacing, and accessibility across dozens of micro-apps using three-tier design tokens mapped to Angular Material and PrimeNG.",
    studyPoints: [
      { label: "Design Token Hierarchy", desc: "Global tokens (palette, spacing) -> Semantic tokens (surface, text) -> Component tokens (btn-padding)." },
      { label: "Component Customization", desc: "Deep-theming Angular Material (M3 specs) and PrimeNG without fragile ::ng-deep CSS leakage." },
      { label: "WCAG Accessibility", desc: "Strict ARIA role attributes, keyboard focus trap directives, screen reader live regions." },
      { label: "Dynamic Theming", desc: "Instant runtime dark/light theme switching via CSS custom property mutation without page reload." }
    ],
    codeTitle: "design-tokens.scss",
    codeLanguage: "SCSS",
    codeSnippet: `// 1. Primitive Tokens
$palette-blue-500: #4285f4;
$palette-slate-900: #0f172a;

// 2. Semantic Token Mapping (CSS Custom Properties)
:root[data-theme='dark'] {
  --sys-color-primary: #{$palette-blue-500};
  --sys-color-surface: #{$palette-slate-900};
  --sys-elevation-card: 0 4px 20px rgba(0, 0, 0, 0.45);
}

// 3. Angular Material Custom Theme Bridge
@use '@angular/material' as mat;
$custom-theme: mat.define-theme((
  color: (
    theme-type: dark,
    primary: mat.$azure-palette,
    tertiary: mat.$blue-palette
  ),
  typography: (
    plain-family: 'Inter, sans-serif',
    brand-family: 'Outfit, sans-serif'
  )
));

@include mat.all-component-themes($custom-theme);`,
    metrics: [
      { label: "WCAG Score", value: "100/100 AA Compliant" },
      { label: "Theme Switch", value: "0ms Re-render" },
      { label: "Component Reuse", value: "95% Core Tokens" }
    ],
    takeaway: "A centralized token system allows 20+ enterprise micro-apps to maintain unified brand aesthetics effortlessly."
  },
  {
    id: 4,
    category: "angular",
    domain: "Angular 18 Enterprise",
    domainClass: "domain-angular",
    title: "NgRx Enterprise Store & Micro-Frontend Module Federation",
    subtitle: "Global normalized state trees and decoupled multi-team deployments",
    overview: "For complex multi-pod enterprise banking applications, NgRx provides predictable global state management, while Webpack 5 Module Federation enables independent build and deployment cycles.",
    studyPoints: [
      { label: "NgRx Store & Effects", desc: "Unidirectional data flow with actions, reducers, and memoized createSelector functions." },
      { label: "Module Federation", desc: "Dynamic remotes loaded on demand into a host shell with shared Angular core singletons." },
      { label: "Cross-MFE Event Bus", desc: "Shared communication layer using CustomEvent dispatchers and reactive message channels." },
      { label: "Pod Autonomy", desc: "Independent CI/CD build and deploy cycles for separate feature engineering teams without locks." }
    ],
    codeTitle: "federation.config.js",
    codeLanguage: "JavaScript",
    codeSnippet: `const { withNativeFederation, shareAll } = require('@angular-architects/module-federation/config');

module.exports = withNativeFederation({
  name: 'banking-portal-remote',
  exposes: {
    './AccountModule': './src/app/features/account/account.routes.ts',
    './TransactionsWidget': './src/app/features/transactions/transactions.component.ts'
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' })
  },
  skip: ['rxjs/ajax', 'rxjs/webSocket']
});`,
    metrics: [
      { label: "Deploy Velocity", value: "Independent Pods" },
      { label: "Shared Singletons", value: "Zero Duplication" },
      { label: "State Rehydration", value: "<10ms Sync" }
    ],
    takeaway: "Module Federation decouples large monoliths while NgRx ensures absolute data predictability across features."
  },

  // --- FASTAPI HIGH-THROUGHPUT MICROSERVICES (3 SLIDES) ---
  {
    id: 5,
    category: "fastapi",
    domain: "FastAPI Microservices",
    domainClass: "domain-fastapi",
    title: "Async I/O, ASGI & High-Throughput Microservices",
    subtitle: "Non-blocking event loops, Uvicorn ASGI servers, and concurrent throughput rivaling Go",
    overview: "Python FastAPI operates on top of Starlette and the Asynchronous Server Gateway Interface (ASGI), enabling non-blocking concurrency capable of servicing over 10,000 requests per second.",
    studyPoints: [
      { label: "ASGI Concurrency", desc: "Uvicorn event loop running on uvloop handles thousands of persistent HTTP and WebSocket connections." },
      { label: "Non-Blocking Coroutines", desc: "async def endpoints yield execution during network I/O, preventing OS thread starvation." },
      { label: "Threadpool Offloading", desc: "CPU-heavy or legacy sync libraries safely dispatched to background threadpools via run_in_executor." },
      { label: "Microservice Footprint", desc: "Lightweight Docker containers (<80MB Alpine) orchestrating event-driven microservices." }
    ],
    codeTitle: "main_async_api.py",
    codeLanguage: "Python",
    codeSnippet: `from fastapi import FastAPI, BackgroundTasks, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import httpx

app = FastAPI(title="Enterprise Telemetry Service", version="2.0.0")

@app.get("/api/v1/telemetry/{device_id}")
async def get_telemetry(
    device_id: str,
    db: AsyncSession = Depends(get_async_db),
    bg_tasks: BackgroundTasks = None
):
    # Non-blocking async database query
    data = await db.execute(select(TelemetryRecord).where(TelemetryRecord.device_id == device_id))
    record = data.scalars().first()

    # Async external webhook dispatch in background
    bg_tasks.add_task(dispatch_audit_log, device_id=device_id, action="READ")
    return {"status": "success", "device_id": device_id, "metrics": record.metrics}`,
    metrics: [
      { label: "Throughput", value: "12,400 Req/Sec" },
      { label: "p95 Latency", value: "8.2ms per call" },
      { label: "Worker RAM", value: "65MB Alpine" }
    ],
    takeaway: "FastAPI delivers the developer ergonomics of Python with performance metrics rivaling Node.js and Go."
  },
  {
    id: 6,
    category: "fastapi",
    domain: "FastAPI Microservices",
    domainClass: "domain-fastapi",
    title: "Pydantic V2 Schemas & Rust-Powered Validation Pipelines",
    subtitle: "Strict type validation, zero schema drift, and automated OpenAPI 3.1 contracts",
    overview: "Pydantic v2's Rust core performs blazing-fast deserialization, data coercion, and contract enforcement, guaranteeing that no malformed payloads ever enter your business controllers.",
    studyPoints: [
      { label: "Rust Core Validation", desc: "Pydantic core compiled in Rust validates input payloads 5x to 15x faster than v1." },
      { label: "Automated Serialization", desc: "Model dump and JSON schema serialization matching strict enterprise data contracts." },
      { label: "Custom Field Validators", desc: "Granular regex, boundary checks, and custom validators rejecting malformed payloads at the edge." },
      { label: "OpenAPI 3.1 & Swagger", desc: "Automatically generated interactive Swagger UI and Redoc documentation on every route change." }
    ],
    codeTitle: "schemas_pydantic_v2.py",
    codeLanguage: "Python",
    codeSnippet: `from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime

class EnterpriseOrderCreate(BaseModel):
    order_id: str = Field(..., pattern=r"^ORD-[0-9]{8}$", description="Standard Enterprise Order Code")
    customer_email: EmailStr
    amount_cents: int = Field(gt=0, le=10_000_000, description="Amount in cents")
    currency: str = Field(default="USD", min_length=3, max_length=3)

    @field_validator("currency")
    @classmethod
    def validate_currency_allowed(cls, v: str) -> str:
        allowed = {"USD", "EUR", "GBP", "INR"}
        if v.upper() not in allowed:
            raise ValueError(f"Currency {v} is not supported by enterprise payment gateways.")
        return v.upper()

class EnterpriseOrderResponse(EnterpriseOrderCreate):
    status: str = "CONFIRMED"
    created_at: datetime = Field(default_factory=datetime.utcnow)`,
    metrics: [
      { label: "Validation Speed", value: "11x Faster (Rust)" },
      { label: "Schema Drift", value: "0% Guaranteed" },
      { label: "Swagger Docs", value: "100% Automated" }
    ],
    takeaway: "Type safety from runtime validation to documentation prevents API regressions before deployment."
  },
  {
    id: 7,
    category: "fastapi",
    domain: "FastAPI Microservices",
    domainClass: "domain-fastapi",
    title: "Inversion of Control: Dependency Injection & OAuth2/JWT",
    subtitle: "Composable dependencies, database session pooling, and granular RBAC security",
    overview: "FastAPI features an enterprise-grade Inversion of Control (IoC) dependency injection system that handles database session lifecycles, JWT token validation, and role-based access control.",
    studyPoints: [
      { label: "Hierarchical Depends()", desc: "Composable dependency chains (Request -> JWT Bearer -> User Record -> Permissions Check)." },
      { label: "Context Yield Cleanup", desc: "Yielding dependencies handle automatic connection pooling, commits, and rollbacks on exception." },
      { label: "OAuth2 with JWT", desc: "Cryptographic token issuance, RS256/HS256 signature verification, and expiration handling." },
      { label: "Role-Based Access (RBAC)", desc: "Parametrized security dependencies enforcing permission scopes directly on route handlers." }
    ],
    codeTitle: "security_deps.py",
    codeLanguage: "Python",
    codeSnippet: `from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return await fetch_user_by_id(user_id)

def require_role(allowed_roles: list[str]):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient privileges")
        return current_user
    return role_checker`,
    metrics: [
      { label: "Auth Latency", value: "<1.2ms per call" },
      { label: "Connection Leaks", value: "0% Yield Guarded" },
      { label: "Test Mockability", value: "100% Decoupled" }
    ],
    takeaway: "FastAPI's dependency injection eliminates boilerplate while making security and persistence effortlessly mockable."
  },

  // --- REACT CONCURRENCY & MICRO-FRONTENDS (2 SLIDES) ---
  {
    id: 8,
    category: "react",
    domain: "React 19 & Concurrency",
    domainClass: "domain-react",
    title: "React 18/19 Concurrency: Transitions, Suspense & Fiber Engine",
    subtitle: "Interruptible rendering, priority lanes, and smooth Interaction to Next Paint (INP)",
    overview: "Concurrent React allows rendering to be interrupted, resumed, or discarded based on user priority lanes, ensuring that UI inputs remain responsive during expensive rendering passes.",
    studyPoints: [
      { label: "Concurrent Fiber", desc: "React pauses or splits rendering work across frame slices without freezing the browser's main thread." },
      { label: "useTransition & useDeferredValue", desc: "Deprioritizes non-urgent state updates (e.g. search filtering) to keep keystrokes instantaneous." },
      { label: "Suspense Streaming", desc: "Declarative fallback boundaries streaming asynchronous UI chunks as promises resolve." },
      { label: "Automatic State Batching", desc: "Multiple setState calls in setTimeout or Promise handlers batched into a single render pass." }
    ],
    codeTitle: "concurrent-search.jsx",
    codeLanguage: "JavaScript / React",
    codeSnippet: `import { useState, useTransition, useDeferredValue, Suspense } from 'react';

export function EnterpriseSearchPortal({ rawRecords }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const deferredTerm = useDeferredValue(searchTerm);

  const handleInputChange = (e) => {
    // 1. High priority: User input updates instantly
    setSearchTerm(e.target.value);
  };

  return (
    <div className="search-container">
      <input type="text" value={searchTerm} onChange={handleInputChange} placeholder="Type to filter..." />
      {isPending && <span className="spinner">Filtering database records...</span>}

      <Suspense fallback={<TableSkeleton rows={10} />}>
        <AsyncRecordTable query={deferredTerm} records={rawRecords} />
      </Suspense>
    </div>
  );
}`,
    metrics: [
      { label: "INP Score", value: "<40ms (Excellent)" },
      { label: "Main Thread Block", value: "0ms Stalls" },
      { label: "Input Lag", value: "Zero Delay" }
    ],
    takeaway: "Concurrency ensures the UI never freezes even during massive state recalculations and table updates."
  },
  {
    id: 9,
    category: "react",
    domain: "React 19 & Concurrency",
    domainClass: "domain-react",
    title: "State Architectures: Redux Toolkit (RTK Query) vs Zustand",
    subtitle: "Selecting the optimal state paradigm for complex enterprise vs. lightweight apps",
    overview: "Enterprise applications combine RTK Query for normalized server caching and automatic cache invalidation, with Zustand for lightweight, boilerplate-free client state.",
    studyPoints: [
      { label: "RTK Query Engine", desc: "Automated caching, background refetching, optimistic UI updates, and tag invalidation." },
      { label: "Zustand Hook Store", desc: "Tiny (<1KB) hook-based store without boilerplate for modals, theme toggles, and ephemeral UI." },
      { label: "Context API Pitfalls", desc: "Avoids global Context provider trees that trigger catastrophic re-renders across all consumers." },
      { label: "createSelector Memoization", desc: "Reselect memoizes computed derivations, executing calculations only when exact input slices change." }
    ],
    codeTitle: "apiSlice_and_zustand.ts",
    codeLanguage: "TypeScript",
    codeSnippet: `// 1. RTK Query Server Cache with Tag Invalidation
export const enterpriseApi = createApi({
  reducerPath: 'enterpriseApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1' }),
  tagTypes: ['Invoices'],
  endpoints: (builder) => ({
    getInvoices: builder.query<Invoice[], void>({
      query: () => '/invoices',
      providesTags: ['Invoices']
    }),
    payInvoice: builder.mutation<void, string>({
      query: (id) => ({ url: \`/invoices/\${id}/pay\`, method: 'POST' }),
      invalidatesTags: ['Invoices'] // Auto-refetches getInvoices!
    })
  })
});

// 2. Zustand Minimalist UI Store
export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen }))
}));`,
    metrics: [
      { label: "Boilerplate", value: "-70% vs Legacy Redux" },
      { label: "Zustand Size", value: "1.1KB Minified" },
      { label: "Re-Render Overhead", value: "Strictly Isolated" }
    ],
    takeaway: "Use RTK Query for normalized server data and caching; use Zustand for fast, lightweight local state."
  },

  // --- NEXT.JS APP ROUTER & RSC (3 SLIDES) ---
  {
    id: 10,
    category: "nextjs",
    domain: "Next.js App Router",
    domainClass: "domain-nextjs",
    title: "App Router & React Server Components (RSC) Architecture",
    subtitle: "Zero-bundle client footprints, server-side data streaming, and hybrid client boundaries",
    overview: "Next.js App Router defaults to React Server Components (RSC), executing data queries and template rendering on the server without shipping unnecessary JavaScript bundles to client browsers.",
    studyPoints: [
      { label: "Server Components by Default", desc: "Components run strictly on the server; zero JavaScript bundle shipped to browser clients." },
      { label: "'use client' Boundaries", desc: "Explicitly declares the interactive leaves (event listeners, state hooks, window APIs)." },
      { label: "Streaming SSR with Suspense", desc: "Streams HTML chunks progressively over HTTP, rendering header and skeleton before data resolves." },
      { label: "Nested Layout Trees", desc: "Preserves navigation state, scroll positions, and interactive state across sub-route transitions." }
    ],
    codeTitle: "app/dashboard/page.tsx",
    codeLanguage: "TypeScript / Next.js",
    codeSnippet: `// 1. Server Component: Direct DB Query, 0 Client JS!
import { db } from '@/lib/db';
import { Suspense } from 'react';
import { MetricsChartClient } from './metrics-chart-client'; // 'use client'

export default async function DashboardPage() {
  // Executed on the server inside datacenter
  const financialSummary = await db.analytics.getQuarterlySummary();

  return (
    <main className="dashboard-shell">
      <h1>Enterprise Financial Overview</h1>
      <div className="stats-strip">
        <p>Total Revenue: \${financialSummary.totalRevenue.toLocaleString()}</p>
      </div>

      {/* Interactive Client Leaf Boundary */}
      <Suspense fallback={<p>Loading chart visualization...</p>}>
        <MetricsChartClient initialData={financialSummary.trendPoints} />
      </Suspense>
    </main>
  );
}`,
    metrics: [
      { label: "Client JS", value: "-62% Reduction" },
      { label: "TTFB", value: "<150ms on Edge" },
      { label: "Core Web Vitals", value: "99/100 Lighthouse" }
    ],
    takeaway: "RSC fundamentally solves frontend bloat by keeping data-fetching logic and heavy libraries strictly on the server."
  },
  {
    id: 11,
    category: "nextjs",
    domain: "Next.js App Router",
    domainClass: "domain-nextjs",
    title: "Multi-Tier Caching Pipeline & ISR (Revalidation)",
    subtitle: "Request memoization, Data Cache, Full Route Cache, and Router Cache mechanics",
    overview: "Next.js implements four distinct layers of caching that work together to deliver static CDN response speeds while maintaining programmatic revalidation on database writes.",
    studyPoints: [
      { label: "Request Memoization", desc: "Deduplicates identical fetch() calls within a single render cycle automatically." },
      { label: "Persistent Data Cache", desc: "Caches HTTP responses across requests and user sessions until explicitly invalidated." },
      { label: "On-Demand ISR Revalidation", desc: "revalidatePath() and revalidateTag() trigger background cache updates without redeployments." },
      { label: "Client Router Cache", desc: "Stores visited page route segments in the browser memory for instant back/forward navigation." }
    ],
    codeTitle: "data-fetching-cache.ts",
    codeLanguage: "TypeScript",
    codeSnippet: `// 1. Tag-Based Cached Fetch Pipeline
export async function getEnterpriseInventory() {
  const res = await fetch('https://api.enterprise.corp/v1/inventory', {
    next: { 
      tags: ['inventory-collection'],
      revalidate: 3600 // Background stale-while-revalidate every hour
    }
  });
  return res.json();
}

// 2. Server Action Triggering Instant Tag Invalidation
'use server';
import { revalidateTag } from 'next/cache';

export async function updateProductStock(productId: string, stock: number) {
  await api.stock.update(productId, stock);
  
  // Instantly invalidates Edge cache for all pages viewing this inventory!
  revalidateTag('inventory-collection');
}`,
    metrics: [
      { label: "Cache Hit Ratio", value: "98.4% at CDN" },
      { label: "Server Load", value: "-85% Origin Calls" },
      { label: "Freshness Lag", value: "0ms on Mutation" }
    ],
    takeaway: "Fine-grained cache control enables static CDN speed with the real-time freshness of dynamic applications."
  },
  {
    id: 12,
    category: "nextjs",
    domain: "Next.js App Router",
    domainClass: "domain-nextjs",
    title: "Edge Middleware, Geo-Routing & Server Actions",
    subtitle: "Sub-millisecond Edge request interception and type-safe server mutations",
    overview: "Edge Middleware runs on lightweight V8 isolates close to users for instant authentication verification, geo-redirection, and A/B canary testing before requests touch the origin server.",
    studyPoints: [
      { label: "Edge Middleware Runtime", desc: "Executes in sub-millisecond cold starts across global CDN point-of-presence nodes." },
      { label: "Geo-Routing & Feature Flags", desc: "Header-based routing, country-specific localization, and canary testing at the edge." },
      { label: "Server Actions ('use server')", desc: "Type-safe async RPC functions invoked directly from client forms without REST endpoint overhead." },
      { label: "Optimistic UI Updates", desc: "useOptimistic updates the client UI instantly before server confirmation completes." }
    ],
    codeTitle: "middleware.ts",
    codeLanguage: "TypeScript",
    codeSnippet: `import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('enterprise_sso_session')?.value;
  const { pathname } = request.nextUrl;

  // Sub-millisecond auth boundary at the Edge
  if (pathname.startsWith('/admin') && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Inject user country from Edge geo-headers
  const country = request.geo?.country || 'US';
  const response = NextResponse.next();
  response.headers.set('x-user-region', country);
  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*']
};`,
    metrics: [
      { label: "Edge Latency", value: "<15ms Global" },
      { label: "API Boilerplate", value: "0% Server Actions" },
      { label: "CSRF Guard", value: "Built-In Protection" }
    ],
    takeaway: "Edge Middleware and Server Actions unite the developer experience of a monolith with the performance of a CDN."
  },

  // --- EXPRESS.JS & NODE.JS MIDDLEWARE (2 SLIDES) ---
  {
    id: 13,
    category: "express",
    domain: "Express.js & Node",
    domainClass: "domain-express",
    title: "Event Loop Mastery & Middleware Pipelines",
    subtitle: "Libuv thread pool, non-blocking I/O phases, and composable onion-layered pipelines",
    overview: "Node.js pairs Google V8 with the libuv asynchronous event loop to service thousands of non-blocking I/O operations on a single thread, while Express chains composable middleware pipelines.",
    studyPoints: [
      { label: "Event Loop Phases", desc: "Timers -> Pending Callbacks -> Idle/Prepare -> Poll -> Check (setImmediate) -> Close." },
      { label: "Libuv Threadpool", desc: "Offloads file system, DNS, and cryptographic operations to OS worker threads without blocking V8." },
      { label: "Composable Middleware", desc: "Onion-layered pipeline chaining authentication, rate limiting, request tracing, and payload parsing." },
      { label: "Centralized Error Handling", desc: "Unified error-handling middleware intercepting domain exceptions and logging structured JSON." }
    ],
    codeTitle: "enterprise-express-pipeline.ts",
    codeLanguage: "TypeScript",
    codeSnippet: `import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

// 1. Correlation ID Tracing Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  req.headers['x-correlation-id'] = correlationId;
  res.setHeader('X-Correlation-Id', correlationId);
  next();
});

// 2. Controller with Async Wrapper
app.post('/api/v1/transfers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await TransferService.execute(req.body);
    res.status(200).json({ status: 'SUCCESS', transfer: result });
  } catch (err) {
    next(err); // Hands off to central error filter
  }
});

// 3. Centralized Enterprise Error Filter
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const correlationId = req.headers['x-correlation-id'];
  console.error(\`[Error \${correlationId}]: \${err.message}\`, err.stack);
  res.status(err.status || 500).json({
    error: err.name || 'InternalServerError',
    message: err.message,
    correlationId
  });
});`,
    metrics: [
      { label: "Event Loop", value: "Non-Blocking I/O" },
      { label: "Traceability", value: "100% Correlation IDs" },
      { label: "Error Capture", value: "Unified JSON Filter" }
    ],
    takeaway: "Understanding event loop phases allows engineers to build bulletproof, non-blocking Node.js enterprise microservices."
  },
  {
    id: 14,
    category: "express",
    domain: "Express.js & Node",
    domainClass: "domain-express",
    title: "Production Hardening: Security Headers, Rate Limiting & Clusters",
    subtitle: "Helmet security policies, Redis rate limiting, and multi-core process clustering",
    overview: "Enterprise Express services must be hardened against OWASP vulnerabilities with Helmet headers, protected against brute-force DDoS with Redis rate limits, and scaled across multi-core CPUs.",
    studyPoints: [
      { label: "Helmet Security Headers", desc: "Configures Content Security Policy (CSP), Strict-Transport-Security (HSTS), and X-Frame-Options." },
      { label: "Distributed Rate Limiting", desc: "express-rate-limit backed by Redis clusters preventing DDoS and brute-force attacks across pods." },
      { label: "Node Cluster Module", desc: "Forks worker processes for each CPU core, sharing server ports and maximizing hardware utilization." },
      { label: "Graceful Shutdown", desc: "Intercepts SIGTERM/SIGINT, closes DB connection pools cleanly, and finishes active requests before exit." }
    ],
    codeTitle: "production-server-cluster.ts",
    codeLanguage: "TypeScript",
    codeSnippet: `import cluster from 'node:cluster';
import os from 'node:os';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import express from 'express';

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(\`[Cluster Master] Spawning \${numCPUs} worker processes...\`);
  for (let i = 0; i < numCPUs; i++) cluster.fork();
  cluster.on('exit', (worker) => {
    console.warn(\`Worker \${worker.process.pid} died. Respawning...\`);
    cluster.fork();
  });
} else {
  const app = express();

  // 1. Security Hardening
  app.use(helmet({ contentSecurityPolicy: true, hsts: true }));

  // 2. Distributed Rate Limiter
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // 100 requests per 15 min per IP
    standardHeaders: true
  });
  app.use('/api/', limiter);

  app.listen(8080, () => console.log(\`Worker \${process.pid} listening on :8080\`));
}`,
    metrics: [
      { label: "CPU Scaling", value: "100% Core Utilization" },
      { label: "OWASP Hardening", value: "Helmet Enabled" },
      { label: "DDoS Defense", value: "Redis Rate Limited" }
    ],
    takeaway: "Hardened security configurations and process clustering transform Express into a resilient enterprise powerhouse."
  },

  // --- STACK SYNTHESIS (1 SLIDE) ---
  {
    id: 15,
    category: "synthesis",
    domain: "Stack Synthesis",
    domainClass: "domain-synthesis",
    title: "Architectural Synthesis: Contract-First Enterprise Monorepo",
    subtitle: "End-to-end type safety between Angular/React frontends and FastAPI/Express backends",
    overview: "Connecting modern frontend frameworks (Angular, React, Next.js) with microservice backends (FastAPI, Express) requires a unified contract-first methodology, OpenAPI SDK codegen, and Jenkins CI/CD.",
    studyPoints: [
      { label: "OpenAPI to TypeScript Codegen", desc: "Automated pipelines generate strongly-typed API client SDKs from FastAPI OpenAPI specs." },
      { label: "Enterprise Decision Matrix", desc: "Angular for governance and large teams; Next.js for high-speed public web; FastAPI for async computation; Express for gateways." },
      { label: "Continuous Delivery in Jenkins", desc: "Automated linting, unit testing (Jest/Pytest), Docker container building, and deployment to Google Cloud." },
      { label: "Architectural Symmetry", desc: "Shared principles across all frameworks: immutability, unidirectional data flow, and separation of concerns." }
    ],
    codeTitle: "enterprise-decision-matrix.json",
    codeLanguage: "JSON",
    codeSnippet: `{
  "enterprise_decision_matrix": {
    "angular_18": {
      "best_for": "Large-scale enterprise intranet, banking portals, strict design systems",
      "strengths": ["Built-in DI", "Standardized structure", "First-class Signals"]
    },
    "react_19_nextjs": {
      "best_for": "High-traffic web apps, consumer platforms, SEO-critical storefronts",
      "strengths": ["Server Components", "Streaming SSR", "Vast ecosystem"]
    },
    "fastapi_python": {
      "best_for": "High-throughput microservices, ML inference, data engineering APIs",
      "strengths": ["Pydantic v2 speed", "Automatic OpenAPI", "Async coroutines"]
    },
    "express_nodejs": {
      "best_for": "BFF (Backend for Frontend), API Gateways, real-time WebSockets",
      "strengths": ["JavaScript everywhere", "Massive npm ecosystem", "Event loop speed"]
    }
  }
}`,
    metrics: [
      { label: "Contract Drift", value: "0% Auto-Generated" },
      { label: "Release Velocity", value: "3x Faster via Jenkins" },
      { label: "Integration Bugs", value: "-75% End-to-End" }
    ],
    takeaway: "Contract-first development bridges frontend and backend teams, ensuring flawless production delivery."
  }
];

// ============================================================================
// INTERACTIVE SLIDE DECK PLAYER CONTROLLER
// ============================================================================
let activeSlideCategory = 'all';
let currentSlideIndex = 0;
let isSlideAutoPlaying = false;
let slideAutoPlayTimer = null;

function getFilteredSlides() {
  if (activeSlideCategory === 'all') {
    return ARCHITECTURE_SLIDES;
  }
  return ARCHITECTURE_SLIDES.filter(slide => slide.category === activeSlideCategory);
}


function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderCurrentSlide() {
  const filtered = getFilteredSlides();
  if (filtered.length === 0) return;

  if (currentSlideIndex >= filtered.length) {
    currentSlideIndex = 0;
  }
  if (currentSlideIndex < 0) {
    currentSlideIndex = filtered.length - 1;
  }

  const slide = filtered[currentSlideIndex];

  // Update Toolbar Badges
  const domainBadge = document.getElementById('slide-domain-badge');
  if (domainBadge) {
    domainBadge.textContent = slide.domain;
    domainBadge.className = `stage-domain-badge ${slide.domainClass || ''}`;
  }

  const counterBadge = document.getElementById('slide-counter-badge');
  if (counterBadge) {
    counterBadge.textContent = `Slide ${currentSlideIndex + 1} / ${filtered.length}`;
  }

  // Update Slide Viewport Content
  const viewport = document.getElementById('slide-viewport');
  if (viewport) {
    viewport.innerHTML = `
      <div class="active-slide-card animate-slide-fade">
        <div class="slide-card-header">
          <div class="slide-title-group">
            <span class="slide-mini-badge ${slide.domainClass}">${slide.category.toUpperCase()} • TOPIC ${currentSlideIndex + 1}</span>
            <h3 class="slide-card-title">${slide.title}</h3>
            <p class="slide-card-subtitle">${slide.subtitle}</p>
          </div>
        </div>

        <div class="slide-grid">
          <!-- Left Column: Architectural Analysis & Study Points -->
          <div class="slide-theory-col">
            <div class="slide-overview-box">
              <p><strong>Architecture Thesis:</strong> ${slide.overview}</p>
            </div>

            <div class="study-points-list">
              <h5 class="points-header"><i data-lucide="book-open"></i> Core Architectural Principles</h5>
              ${slide.studyPoints.map(point => `
                <div class="study-point-item">
                  <span class="point-tag">${point.label}</span>
                  <p class="point-desc">${point.desc}</p>
                </div>
              `).join('')}
            </div>

            <div class="slide-metrics-strip">
              <span class="metrics-label">Production Benchmarks:</span>
              <div class="metrics-badges">
                ${slide.metrics.map(m => `
                  <div class="metric-pill">
                    <span class="m-label">${m.label}:</span>
                    <span class="m-val">${m.value}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right Column: Code Blueprint & Architecture Contract -->
          <div class="slide-code-col">
            <div class="code-blueprint-window">
              <div class="window-bar">
                <div class="mac-dots">
                  <span class="dot dot-r"></span>
                  <span class="dot dot-y"></span>
                  <span class="dot dot-g"></span>
                </div>
                <span class="window-filename"><i data-lucide="terminal"></i> ${slide.codeTitle}</span>
                <button class="copy-code-btn" id="copy-slide-code-btn" title="Copy code snippet">
                  <i data-lucide="copy"></i> Copy
                </button>
              </div>
              <pre class="code-pre"><code>${escapeHtml(slide.codeSnippet)}</code></pre>
            </div>

            <div class="slide-takeaway-box">
              <div class="takeaway-head">
                <i data-lucide="zap"></i>
                <strong>Enterprise Key Takeaway</strong>
              </div>
              <p>${slide.takeaway}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach copy button listener
    const copyBtn = document.getElementById('copy-slide-code-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(slide.codeSnippet).then(() => {
          copyBtn.innerHTML = '<i data-lucide="check"></i> Copied!';
          initIcons();
          setTimeout(() => {
            copyBtn.innerHTML = '<i data-lucide="copy"></i> Copy';
            initIcons();
          }, 2000);
        });
      });
    }
  }

  // Update Dots
  const dotsContainer = document.getElementById('slide-dots-container');
  if (dotsContainer) {
    dotsContainer.innerHTML = filtered.map((_, i) => `
      <button class="slide-dot ${i === currentSlideIndex ? 'active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>
    `).join('');

    dotsContainer.querySelectorAll('.slide-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        currentSlideIndex = parseInt(dot.getAttribute('data-index'), 10);
        renderCurrentSlide();
      });
    });
  }

  // Update Thumbnail Active State
  const thumbs = document.querySelectorAll('.thumb-card');
  thumbs.forEach((thumb, i) => {
    if (i === currentSlideIndex) {
      thumb.classList.add('active');
      thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      thumb.classList.remove('active');
    }
  });

  initIcons();
}

function renderThumbnails() {
  const filtered = getFilteredSlides();
  const strip = document.getElementById('deck-thumbnails-strip');
  if (!strip) return;

  strip.innerHTML = filtered.map((slide, i) => `
    <div class="thumb-card ${i === currentSlideIndex ? 'active' : ''}" data-index="${i}">
      <div class="thumb-header">
        <span class="thumb-num">#${i + 1}</span>
        <span class="thumb-badge ${slide.domainClass}">${slide.category.toUpperCase()}</span>
      </div>
      <h6 class="thumb-title">${slide.title}</h6>
      <p class="thumb-sub">${slide.codeTitle}</p>
    </div>
  `).join('');

  strip.querySelectorAll('.thumb-card').forEach(thumb => {
    thumb.addEventListener('click', () => {
      currentSlideIndex = parseInt(thumb.getAttribute('data-index'), 10);
      renderCurrentSlide();
    });
  });
}

function setupDeckPlayer() {
  // Category Navigation Chips
  const chips = document.querySelectorAll('#deck-category-nav .deck-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeSlideCategory = chip.getAttribute('data-category') || 'all';
      currentSlideIndex = 0;
      renderThumbnails();
      renderCurrentSlide();
    });
  });

  // Previous & Next Slide Buttons
  const prevBtn = document.getElementById('slide-prev-btn');
  const nextBtn = document.getElementById('slide-next-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const filtered = getFilteredSlides();
      currentSlideIndex = (currentSlideIndex - 1 + filtered.length) % filtered.length;
      renderCurrentSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const filtered = getFilteredSlides();
      currentSlideIndex = (currentSlideIndex + 1) % filtered.length;
      renderCurrentSlide();
    });
  }

  // Auto-Play Toggle Button
  const autoPlayBtn = document.getElementById('btn-slide-autoplay');
  const autoPlayIcon = document.getElementById('autoplay-icon');
  const autoPlayText = document.getElementById('autoplay-text');

  if (autoPlayBtn) {
    autoPlayBtn.addEventListener('click', () => {
      isSlideAutoPlaying = !isSlideAutoPlaying;
      if (isSlideAutoPlaying) {
        autoPlayBtn.classList.add('playing');
        if (autoPlayText) autoPlayText.textContent = 'Pause';
        if (autoPlayIcon) autoPlayIcon.setAttribute('data-lucide', 'pause');
        slideAutoPlayTimer = setInterval(() => {
          const filtered = getFilteredSlides();
          currentSlideIndex = (currentSlideIndex + 1) % filtered.length;
          renderCurrentSlide();
        }, 5000);
      } else {
        autoPlayBtn.classList.remove('playing');
        if (autoPlayText) autoPlayText.textContent = 'Auto-Play';
        if (autoPlayIcon) autoPlayIcon.setAttribute('data-lucide', 'play');
        clearInterval(slideAutoPlayTimer);
      }
      initIcons();
    });
  }

  // Fullscreen Presentation Mode
  const fullscreenBtn = document.getElementById('btn-slide-fullscreen');
  const stage = document.getElementById('deck-player-stage');
  if (fullscreenBtn && stage) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        stage.requestFullscreen().catch(err => {
          console.warn('Fullscreen request denied:', err);
        });
      } else {
        document.exitFullscreen();
      }
    });
  }

  // View Mode Switcher: Interactive vs Web Embed
  const btnInteractive = document.getElementById('btn-view-interactive');
  const btnEmbed = document.getElementById('btn-view-embed');
  const interactiveView = document.getElementById('deck-interactive-view');
  const embedView = document.getElementById('deck-embed-view');

  if (btnInteractive && btnEmbed) {
    btnInteractive.addEventListener('click', () => {
      btnInteractive.classList.add('active');
      btnEmbed.classList.remove('active');
      if (interactiveView) interactiveView.classList.add('active');
      if (embedView) embedView.classList.remove('active');
    });

    btnEmbed.addEventListener('click', () => {
      btnEmbed.classList.add('active');
      btnInteractive.classList.remove('active');
      if (embedView) embedView.classList.add('active');
      if (interactiveView) interactiveView.classList.remove('active');
    });
  }

  // Keyboard Navigation (Left / Right Arrow)
  window.addEventListener('keydown', (e) => {
    // Only handle if not typing in form input
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
    
    // Check if Slides tab is active
    const slidesTab = document.getElementById('tab-slides');
    if (slidesTab && slidesTab.classList.contains('active')) {
      if (e.key === 'ArrowLeft') {
        const filtered = getFilteredSlides();
        currentSlideIndex = (currentSlideIndex - 1 + filtered.length) % filtered.length;
        renderCurrentSlide();
      } else if (e.key === 'ArrowRight') {
        const filtered = getFilteredSlides();
        currentSlideIndex = (currentSlideIndex + 1) % filtered.length;
        renderCurrentSlide();
      }
    }
  });

  // Initial Render
  renderThumbnails();
  renderCurrentSlide();
}

// ============================================================================
// MODAL CONTROLLERS
// ============================================================================
function setupModals() {
  // Google Sheets Config Modal
  const sheetModal = document.getElementById('sheet-modal');
  const openSheetBtn = document.getElementById('open-sheet-config-btn');
  const openFromContact = document.getElementById('open-config-from-contact');
  const closeSheetBtn = document.getElementById('close-sheet-modal-btn');
  const saveSheetBtn = document.getElementById('save-sheet-btn');
  const resetSheetBtn = document.getElementById('reset-sheet-btn');
  const sheetUrlInput = document.getElementById('sheet-url-input');

  const savedUrl = localStorage.getItem('google_sheet_portfolio_url') || '';
  if (sheetUrlInput) sheetUrlInput.value = savedUrl;

  const openModal = () => sheetModal && sheetModal.classList.remove('hidden');
  const closeModal = () => sheetModal && sheetModal.classList.add('hidden');

  if (openSheetBtn) openSheetBtn.addEventListener('click', openModal);
  if (openFromContact) openFromContact.addEventListener('click', openModal);
  if (closeSheetBtn) closeSheetBtn.addEventListener('click', closeModal);

  const mobileDrawerSheetBtn = document.getElementById('mobile-drawer-sheet-btn');
  if (mobileDrawerSheetBtn) {
    mobileDrawerSheetBtn.addEventListener('click', () => {
      const drawer = document.getElementById('mobile-drawer');
      if (drawer) {
        drawer.classList.add('hidden');
        document.body.style.overflow = '';
      }
      openModal();
    });
  }

  if (saveSheetBtn) {
    saveSheetBtn.addEventListener('click', () => {
      const url = sheetUrlInput.value.trim();
      localStorage.setItem('google_sheet_portfolio_url', url);
      closeModal();
      fetchSheetData(url);
    });
  }

  if (resetSheetBtn) {
    resetSheetBtn.addEventListener('click', () => {
      sheetUrlInput.value = '';
      localStorage.removeItem('google_sheet_portfolio_url');
      closeModal();
      fetchSheetData('');
    });
  }

  // Google Drive Resume Modal
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('view-resume-btn');
  const dockResumeBtn = document.getElementById('dock-resume-btn');
  const openDriveModalBtn = document.getElementById('open-drive-modal-btn');
  const closeResumeBtn = document.getElementById('close-resume-modal-btn');
  const downloadResumeBtn = document.getElementById('download-drive-resume-btn');
  const driveDirectDownload = document.getElementById('drive-direct-download');

  const openResume = () => resumeModal && resumeModal.classList.remove('hidden');
  const closeResume = () => resumeModal && resumeModal.classList.add('hidden');

  if (openResumeBtn) openResumeBtn.addEventListener('click', openResume);
  if (dockResumeBtn) dockResumeBtn.addEventListener('click', openResume);
  if (openDriveModalBtn) openDriveModalBtn.addEventListener('click', openResume);
  if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeResume);

  const handleDownload = (e) => {
    e.preventDefault();
    triggerConfetti();
    alert('📄 Pro Tip: Link your direct Google Drive PDF download link here in index.html!');
  };

  if (downloadResumeBtn) downloadResumeBtn.addEventListener('click', handleDownload);
  if (driveDirectDownload) driveDirectDownload.addEventListener('click', handleDownload);

  // Close modals on escape key or background click
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeResume();
    }
  });

  [sheetModal, resumeModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    }
  });
}

// ============================================================================
// CONTACT FORM SUBMISSION
// ============================================================================
function setupContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-contact-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      timestamp: new Date().toISOString()
    };

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i data-lucide="refresh-cw" class="spinning"></i> Sending...';
    initIcons();

    const scriptUrl = localStorage.getItem('google_sheet_portfolio_url');

    try {
      if (scriptUrl && scriptUrl.includes('macros/s/')) {
        // Send directly to Google Apps Script doPost endpoint
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      // Simulate instantaneous success / feedback
      triggerConfetti();
      form.reset();
      feedback.className = 'form-feedback success';
      feedback.innerHTML = `
        <strong>Message Received!</strong><br />
        Thank you, ${payload.name}! Your inquiry has been routed to the Google Sheets inbox.
      `;
    } catch (err) {
      feedback.className = 'form-feedback error';
      feedback.textContent = 'Oops! Could not send message. Please try again or reach out via email.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i data-lucide="send"></i> <span>Send Message</span>';
      initIcons();
      setTimeout(() => {
        if (feedback) feedback.className = 'form-feedback hidden';
      }, 7000);
    }
  });
}

// ============================================================================
// CELEBRATION CONFETTI
// ============================================================================
function triggerConfetti() {
  confetti({
    particleCount: 70,
    spread: 60,
    origin: { y: 0.8 },
    colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853']
  });
}

// ============================================================================
// MAIN BOOTSTRAP
// ============================================================================
function bootstrap() {
  initIcons();
  setupTabs();
  setupMobileNav();
  setupDeckPlayer();
  setupModals();
  setupContactForm();

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter') || 'all';
      renderProjects();
    });
  });

  // Quick Sync button
  const quickSyncBtn = document.getElementById('quick-sync-btn');
  if (quickSyncBtn) {
    quickSyncBtn.addEventListener('click', () => {
      const savedUrl = localStorage.getItem('google_sheet_portfolio_url') || '';
      fetchSheetData(savedUrl);
    });
  }

  // Load initial data (custom saved Google Sheet or Demo Data)
  const savedUrl = localStorage.getItem('google_sheet_portfolio_url') || '';
  fetchSheetData(savedUrl);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

# @dotos/dui

**Enterprise-grade Angular 22 UI library, built in production.**
With 95 modular entry points, 220+ components, runtime 3-state theming, and 12-language support — built for high-density enterprise dashboards.

`Angular 22` · `MIT Open Source` · `95+ Modular Entry Points` · `12 Languages` · `Bilingual API Docs` · `AI-Native llms.txt`

---

## Pure Angular, Native Material

dui is built for one purpose: **The most idiomatic enterprise component library in the Angular ecosystem.**

- **Built on Angular Material & CDK**: Not a custom design system. Buttons, forms, overlays, and dialogs utilize Material’s components and interactions. The theming service generates palettes in real-time — integrate it into your existing Material application, and it feels like a native part of the system.
- **Angular-Native**: No "write-once-run-everywhere" abstraction layers. Dependency injection, change detection, template syntax, and `NgModule`/standalone architectures are pure Angular. Your team builds using their existing expertise.
- **Aligned with Angular Versions**: 8.x is optimized for Angular 22, with CI gates ensuring no deprecated APIs are used, making Angular upgrades seamless.

## AI-Native: The Programming Contract for the LLM Era

dui is not just a UI library; it is an **engineering protocol base** optimized for AI Coding Agents.

- **LLM Semantic Map (`llms.txt`)**: The npm package includes a standardized `llms.txt`. AI Agents instantly establish global context: complete sub-entry paths, component selectors, and precise I/O signatures, eliminating API hallucination.
- **Bilingual Context Alignment (`@zh` JSDoc)**: 14,000+ API docs enforce bilingual JSDoc specifications. When Agent processes your requirements, it uses dual-language alignment to understand API design intent precisely, avoiding translation-induced semantic drift.
- **Verifiable Engineering Contracts**: Our CI gates act as a "feedback loop" for Agents. If Agent-generated code violates "any" restrictions, type contracts, or insecure evaluation rules, CI returns clear error directives, allowing the Agent to self-correct automatically.

---

## Why Choose dui

| | |
|---|---|
| **Production-Hardened** | dui powers 15+ DotOS platforms, including SmartField and Geo-BIM, with 3,000+ source files depending on it. You get the same code we run in production daily. |
| **Efficient** | Root barrel exports are empty; everything is imported from `@dotos/dui/<module>`. With `sideEffects: false`, bundlers achieve strict tree-shaking. |
| **Runtime Theming** | Switch between Light, Dark, and Industrial DarkBlue modes at runtime without page reloads. |
| **Global-Ready** | 12 languages supported, with CI ensuring complete key alignment. |

---

## Quickstart

### 1. Installation

```jsonc
// package.json
"dependencies": {
  "@dotos/dui": "npm:@dotos1/dui@8.0.0-next.6"
}
```

### 2. Initialization

```ts
import { ServiceLocator } from '@dotos/dui/core/services';
// ... other imports

@NgModule({
  // ...
  providers: [
    { provide: ThemeService, useFactory: () => ThemeService.getInstance() },
    // ...
  ],
})
export class AppModule {
  constructor(injector: Injector, translation: TranslationService) {
    ServiceLocator.injector = injector;
    translation.addTranslationFolder('public', 'i18n');
  }
}
```

---

## License

dui is open-sourced under the **MIT License**.
Need advanced Data Grids, Gantt charts, OLAP, or specialized editors? See **[@dotos/duix](../duix/README.md)**.

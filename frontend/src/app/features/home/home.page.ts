import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Brand, Category, ProductSummary, StyleEra } from '../../core/models/catalog.models';
import { CartService } from '../../core/services/cart.service';
import { CatalogService } from '../../core/services/catalog.service';
import { QuickViewService } from '../../core/services/quick-view.service';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { DocoProductCardComponent } from '../../shared/components/doco-product-card.component';
import { DocoSectionHeaderComponent } from '../../shared/components/doco-section-header.component';
import { DocoStateViewComponent } from '../../shared/components/doco-state-view.component';

@Component({
  selector: 'doco-home-page',
  standalone: true,
  imports: [
    RouterLink,
    DocoSectionHeaderComponent,
    DocoProductCardComponent,
    DocoStateViewComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- HERO SECTION WITH EDITORIAL ATMOSPHERE & CYBER HUD -->
    <section class="hero">
      <img
        src="/assets/editorial/hero-vault.jpg"
        alt="DOCO Flight Case Archival Streetwear Vault"
        class="hero__bg"
      />
      <div class="hero__scrim"></div>

      <!-- Cyber grid background pattern overlay -->
      <div class="hero__cyber-grid"></div>

      <div class="doco-container hero__layout">
        <div class="hero__content">
          <div class="hero__top-meta">
            <div class="live-status font-mono">
              <span class="live-pulse-dot"></span>
              <span class="live-status-text">DROP #01 // LIVE</span>
            </div>
            <span class="font-mono hero__coords">
              24.8091° N, 107.3940° W // CULIACÁN, SIN // {{ localTime() }} MST
            </span>
          </div>

          <h1 class="hero__title font-display">
            VINTAGE<br />
            STREETWEAR<br />
            <span class="hero__chrome">ARCHIVE Y2K</span>
          </h1>

          <p class="hero__subtitle">
            Curaduría de archivo seleccionada a mano: Carhartt Detroit, BAPE Shark, Southpole Deadstock y Ed Hardy. Piezas 1-of-1 verificadas con entrega local en Culiacán, Sinaloa.
          </p>

          <div class="hero__actions font-mono">
            <a routerLink="/catalog" class="btn-primary" (click)="soundFx.playClick()">
              <span>EXPLORAR DROP #01</span>
              <span class="btn-arrow">→</span>
            </a>
            <a
              [routerLink]="['/catalog']"
              [queryParams]="{ era: 'Y2K' }"
              class="btn-ghost"
              (click)="soundFx.playClick()"
            >
              VER ARCHIVO Y2K
            </a>
          </div>

          <!-- Mobile Compact Meta Strip -->
          <div class="mobile-meta-strip font-mono">
            <span class="meta-dot"></span>
            <span>CULIACÁN // ARCHIVE DROP #01 // SPEI & OXXO</span>
          </div>
        </div>

        <!-- Spec Flight Case Telemetry Card (Desktop) -->
        <aside class="hero__spec-card font-mono">
          <div class="spec-head">
            <img src="/assets/brand/doco-logo-light.png" alt="DOCO Seal" class="hero__seal" />
            <span class="spec-status-pill">BÓVEDA ABIERTA</span>
          </div>
          <div class="spec-row"><span>DROP</span><strong>#01 // VAULT</strong></div>
          <div class="spec-row"><span>UBICACIÓN</span><strong>CULIACÁN, SIN.</strong></div>
          <div class="spec-row"><span>ENTREGA</span><strong>LOCAL EN CULIACÁN</strong></div>
          <div class="spec-row"><span>AUTENTICIDAD</span><strong>100% VERIFICADA</strong></div>
          <div class="spec-row spec-row--highlight">
            <span>PAGOS ACTIVOS</span>
            <strong>SPEI DIRECTO & OXXO</strong>
          </div>
        </aside>
      </div>

      <!-- Interactive floating sticker badges -->
      <div class="floating-stickers font-mono">
        <div class="sticker sticker--1" (click)="soundFx.playVault()">
          <span>1-OF-1 ARCHIVE</span>
        </div>
        <div class="sticker sticker--2" (click)="soundFx.playChime()">
          <span>HEAVYWEIGHT DENIM</span>
        </div>
        <div class="sticker sticker--3" (click)="soundFx.playClick()">
          <span>CULIACÁN VAULT</span>
        </div>
      </div>
    </section>

    <!-- TRUST TELEMETRY RIBBON -->
    <section class="trust-ribbon">
      <div class="doco-container trust-ribbon__grid font-mono">
        <div class="trust-card">
          <span class="trust-card__num">01 //</span>
          <div class="trust-card__body">
            <strong>PIEZAS 1-OF-1</strong>
            <span>Curaduría de archivo sin lotes genéricos</span>
          </div>
        </div>
        <div class="trust-card">
          <span class="trust-card__num">02 //</span>
          <div class="trust-card__body">
            <strong>BÓVEDA LOCAL</strong>
            <span>Inspección física en Culiacán, Sin.</span>
          </div>
        </div>
        <div class="trust-card">
          <span class="trust-card__num">03 //</span>
          <div class="trust-card__body">
            <strong>ENTREGA PERSONAL</strong>
            <span>Entrega directa y segura en Culiacán</span>
          </div>
        </div>
        <div class="trust-card">
          <span class="trust-card__num">04 //</span>
          <div class="trust-card__body">
            <strong>PAGOS PROTEGIDOS</strong>
            <span>Transferencia SPEI y depósito OXXO</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 4-COLUMN CURATED CATEGORIES -->
    <section class="doco-container section-block">
      <doco-section-header
        eyebrow="CATEGORÍAS DE ARCHIVO"
        title="EXPLORA EL VAULT"
        ctaLabel="VER TODO EL CATÁLOGO"
        ctaLink="/catalog"
      />

      <div class="cat-grid">
        @for (cat of categories(); track cat.id) {
          <a
            class="cat-tile"
            [routerLink]="['/catalog']"
            [queryParams]="{ category: cat.slug }"
            (click)="soundFx.playClick()"
          >
            <span class="cat-tile__corner cat-tile__corner--tl font-mono">+</span>
            <span class="cat-tile__corner cat-tile__corner--br font-mono">+</span>
            <img [src]="cat.imageUrl" [alt]="cat.name" class="cat-tile__img" loading="lazy" />
            <div class="cat-tile__overlay">
              <span class="font-mono cat-tile__index">0{{ cat.displayOrder }} // CATEGORÍA</span>
              <h3 class="font-display cat-tile__name">{{ cat.name }}</h3>
              <span class="font-mono cat-tile__cta">
                <span>EXPLORAR PIEZAS</span>
                <span class="cta-mini-arrow">→</span>
              </span>
            </div>
          </a>
        }
      </div>
    </section>

    <!-- FEATURED DROP PIECES WITH INSTANT VIBE SWITCH -->
    <section class="doco-container section-block">
      <doco-section-header
        eyebrow="PIEZAS 1-OF-1 SELECCIONADAS"
        title="DROP #01 DESTACADOS"
        ctaLabel="VER TODO EL CATÁLOGO"
        ctaLink="/catalog"
      />

      <div class="era-pills font-mono" role="tablist" aria-label="Filtrar destacados por estilo">
        @for (tab of eraTabs; track tab.value) {
          <button
            type="button"
            class="era-pill"
            [class.is-active]="selectedHomeEra() === tab.value"
            (click)="selectTab(tab.value)"
          >
            {{ tab.label }}
          </button>
        }
      </div>

      @if (loading()) {
        <doco-state-view mode="loading" />
      } @else if (error()) {
        <doco-state-view mode="error" [message]="error()" (retry)="loadHomeData()" />
      } @else if (visibleProducts().length === 0) {
        <doco-state-view
          mode="empty"
          message="No hay piezas disponibles en esta era aún."
          actionLabel="VER TODAS LAS PIEZAS"
          (retry)="selectedHomeEra.set('ALL')"
        />
      } @else {
        <div class="product-grid">
          @for (piece of visibleProducts(); track piece.id) {
            <doco-product-card [product]="piece" (addToBag)="cart.addItem($event)" />
          }
        </div>
      }
    </section>

    <!-- INVERTED MARQUEE BANNER -->
    <div class="inverted-marquee font-mono">
      <div class="inverted-track">
        <span>DOCO CULIACÁN · VINTAGE STREETWEAR · Y2K GRAILS · HEAVYWEIGHT CARHARTT · BAPE SHARK · DEADSTOCK · ENTREGA LOCAL EN CULIACÁN, SINALOA ·&nbsp;</span>
        <span>DOCO CULIACÁN · VINTAGE STREETWEAR · Y2K GRAILS · HEAVYWEIGHT CARHARTT · BAPE SHARK · DEADSTOCK · ENTREGA LOCAL EN CULIACÁN, SINALOA ·&nbsp;</span>
      </div>
    </div>

    <!-- DUAL EDITORIAL LOOKBOOK + VAULT MANIFESTO -->
    <section class="doco-container section-block">
      <div class="editorial-split">
        <div class="editorial-gallery">
          <figure class="editorial-frame">
            <img
              src="/assets/editorial/lookbook-arch.jpg"
              alt="DOCO Lookbook Culiacán Streetwear"
              loading="lazy"
            />
            <div class="lookbook-hotspots font-mono">
              <button
                type="button"
                class="lookbook-tag"
                (click)="inspectLookPiece('DOCO-CRH-001')"
                aria-label="Inspeccionar Carhartt Detroit Jacket"
              >
                <span class="tag-crosshair">+</span>
                <span>CARHARTT DETROIT</span>
              </button>
              <button
                type="button"
                class="lookbook-tag"
                (click)="inspectLookPiece('DOCO-EDH-004')"
                aria-label="Inspeccionar Ed Hardy Baggy Jeans"
              >
                <span class="tag-crosshair">+</span>
                <span>ED HARDY DENIM</span>
              </button>
            </div>
            <figcaption class="font-mono">ARC-001 // LOOKBOOK NOCTURNO CULIACÁN</figcaption>
          </figure>
          <figure class="editorial-frame">
            <img
              src="/assets/products/drop-01-archival-bundle.jpg"
              alt="DOCO Drop 01 Curated Lot"
              loading="lazy"
            />
            <div class="lookbook-hotspots font-mono">
              <button
                type="button"
                class="lookbook-tag"
                (click)="inspectLookPiece('DOCO-BPE-002')"
                aria-label="Inspeccionar BAPE Shark Hoodie"
              >
                <span class="tag-crosshair">+</span>
                <span>BAPE SHARK HOODIE</span>
              </button>
              <button
                type="button"
                class="lookbook-tag"
                (click)="inspectLookPiece('DOCO-BUR-007')"
                aria-label="Inspeccionar Burberry Silver Frames"
              >
                <span class="tag-crosshair">+</span>
                <span>BURBERRY FRAMES</span>
              </button>
            </div>
            <figcaption class="font-mono">ARC-002 // SELECCIÓN DROP #01 VAULT</figcaption>
          </figure>
        </div>

        <div class="editorial-split__copy">
          <div class="editorial-eyebrow-row font-mono">
            <span class="live-pulse-dot"></span>
            <span class="editorial-eyebrow">STANDARD ARCHIVE // VERIFICADO 2026</span>
          </div>
          <h2 class="font-display editorial-title">CURADURÍA REAL.<br />APARTADO INMEDIATO.</h2>
          <p class="editorial-text">
            Cada prenda pasa por inspección física de etiquetas, costuras y medidas reales en Culiacán antes de entrar al catálogo. Ofrecemos trato directo y seguro para que compres con total confianza.
          </p>
          <ul class="manifesto-list font-mono">
            <li>
              <span class="m-index">01</span>
              <div>
                <strong>PIEZAS 1-OF-1 SELECCIONADAS A MANO</strong>
                <small>Curaduría individual sin pacas masivas ni piezas duplicadas</small>
              </div>
            </li>
            <li>
              <span class="m-index">02</span>
              <div>
                <strong>APARTADO ATÓMICO INMEDIATO</strong>
                <small>Reserva formal al generar tu pedido desde la bolsa de compras</small>
              </div>
            </li>
            <li>
              <span class="m-index">03</span>
              <div>
                <strong>TRANSFERENCIA SPEI / EFECTIVO / OXXO</strong>
                <small>Liquidación protegida sin cobro de comisiones sorpresa</small>
              </div>
            </li>
            <li>
              <span class="m-index">04</span>
              <div>
                <strong>ENTREGA LOCAL DIRECTA EN CULIACÁN, SIN</strong>
                <small>Puntos estratégicos y coordinación 1-a-1 en Culiacán</small>
              </div>
            </li>
          </ul>

          <div class="editorial-actions font-mono">
            <a routerLink="/catalog" class="btn-primary" (click)="soundFx.playClick()">
              <span>VER CATÁLOGO COMPLETO</span>
              <span class="btn-arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- BRAND STRIP -->
    <section class="doco-container section-block brand-section">
      <doco-section-header eyebrow="MARCAS EN ROTACIÓN" title="HERITAGE & STREETWEAR" />
      <div class="brand-strip font-display">
        @for (b of brands(); track b.id) {
          <a
            [routerLink]="['/catalog']"
            [queryParams]="{ brand: b.slug }"
            class="brand-chip"
            (click)="soundFx.playClick()"
          >
            <div class="brand-chip__content">
              <span class="brand-chip__name">{{ b.name }}</span>
              <small class="font-mono brand-chip__origin">{{ b.originCountry }}</small>
            </div>
            <span class="brand-chip__arrow font-mono">↗</span>
          </a>
        }
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      min-height: clamp(560px, 80vh, 790px);
      display: flex;
      align-items: flex-end;
      padding: 5rem 0 4.5rem;
      overflow: hidden;
      border-bottom: 1px solid var(--border-subtle);
      background: #09090b;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
    .hero__bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: contrast(1.1) brightness(0.5);
      transition: transform 10s ease-out;
    }
    .hero:hover .hero__bg {
      transform: scale(1.05);
    }
    .hero__scrim {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        rgba(9, 9, 11, 0.25) 0%,
        rgba(9, 9, 11, 0.6) 45%,
        rgba(9, 9, 11, 0.98) 100%
      );
    }
    .hero__cyber-grid {
      position: absolute;
      inset: 0;
      background-size: 36px 36px;
      background-image:
        linear-gradient(to right, rgba(255, 255, 255, 0.035) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
      pointer-events: none;
    }
    .hero__layout {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 2.5rem;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
    .hero__content {
      max-width: 780px;
      width: 100%;
      box-sizing: border-box;
      color: #f5f3ee;
    }
    .hero__top-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.85rem;
      margin-bottom: 1.3rem;
    }
    .live-status {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.75rem;
      background: rgba(225, 29, 72, 0.18);
      border: 1px solid rgba(225, 29, 72, 0.5);
      border-radius: var(--radius-sharp);
      font-size: 0.68rem;
      letter-spacing: 0.14em;
      font-weight: 700;
      color: #ffffff;
    }
    .live-pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #e11d48;
      box-shadow: 0 0 8px #e11d48;
      animation: doco-pulse-glow 2s infinite;
    }
    .live-status-text {
      color: #fff;
    }
    .hero__coords {
      font-size: 0.72rem;
      letter-spacing: 0.14em;
      color: #b4b4bf;
    }
    .hero__title {
      margin: 0 0 1.25rem;
      font-size: clamp(2.7rem, 7.8vw, 5.6rem);
      font-weight: 800;
      line-height: 0.92;
      text-transform: uppercase;
      letter-spacing: -0.025em;
    }
    .hero__chrome {
      background: linear-gradient(110deg, #ffffff 10%, #d4d4d8 25%, #ffffff 40%, #71717a 60%, #ffffff 85%);
      background-size: 240% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: doco-shimmer 8s ease-in-out infinite;
    }
    .hero__subtitle {
      margin: 0 0 2rem;
      max-width: 58ch;
      color: #d4d2cd;
      font-size: clamp(0.95rem, 1.35vw, 1.1rem);
      line-height: 1.55;
    }
    .hero__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.9rem;
      align-items: center;
    }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.95rem 1.75rem;
      background: var(--text-bone);
      color: var(--bg-void);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      border: 1px solid var(--text-bone);
      border-radius: var(--radius-sharp);
      transition: all 0.22s var(--ease-kinetic);
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4);
    }
    .btn-primary:hover {
      background: transparent;
      color: var(--text-bone);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
    }
    .btn-arrow {
      transition: transform 0.2s var(--ease-kinetic);
    }
    .btn-primary:hover .btn-arrow {
      transform: translateX(3px);
    }
    .btn-ghost {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.95rem 1.55rem;
      background: rgba(9, 9, 11, 0.75);
      border: 1px solid rgba(245, 243, 238, 0.32);
      color: #f5f3ee;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      border-radius: var(--radius-sharp);
      backdrop-filter: blur(8px);
      transition: all 0.22s var(--ease-kinetic);
    }
    .btn-ghost:hover {
      border-color: var(--text-bone);
      background: rgba(245, 243, 238, 0.08);
      transform: translateY(-2px);
    }
    .mobile-meta-strip {
      display: none;
      align-items: center;
      gap: 0.55rem;
      margin-top: 1.25rem;
      padding: 0.55rem 0.85rem;
      background: rgba(18, 18, 22, 0.88);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sharp);
      font-size: 0.68rem;
      color: var(--text-muted);
      letter-spacing: 0.1em;
    }
    .meta-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent-emerald);
      box-shadow: 0 0 6px var(--accent-emerald);
      flex-shrink: 0;
    }
    .hero__spec-card {
      width: 275px;
      flex-shrink: 0;
      padding: 1.4rem;
      background: rgba(12, 12, 16, 0.85);
      backdrop-filter: blur(14px);
      border: 1px solid rgba(245, 243, 238, 0.22);
      border-radius: var(--radius-card);
      color: #f5f3ee;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65);
    }
    .spec-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.85rem;
    }
    .hero__seal {
      height: 32px;
      width: auto;
    }
    .spec-status-pill {
      font-size: 0.64rem;
      color: #25d366;
      letter-spacing: 0.08em;
      font-weight: 700;
    }
    .spec-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.68rem;
      padding: 0.45rem 0;
      border-top: 1px solid rgba(245, 243, 238, 0.12);
    }
    .spec-row span {
      color: #9898a3;
    }
    .spec-row--highlight {
      color: #25d366;
    }
    .floating-stickers {
      position: absolute;
      top: 15%;
      right: 4%;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      z-index: 3;
      pointer-events: auto;
    }
    .sticker {
      cursor: pointer;
      padding: 0.45rem 0.85rem;
      background: #000;
      color: #f5f3ee;
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 999px;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
      transition: transform 0.2s var(--ease-kinetic);
    }
    .sticker:hover {
      transform: scale(1.08) rotate(-2deg);
    }
    .sticker--1 {
      transform: rotate(-3deg);
      border-color: #e11d48;
    }
    .sticker--2 {
      transform: rotate(2deg);
    }
    .sticker--3 {
      transform: rotate(-1deg);
      border-color: #25d366;
      color: #25d366;
    }
    .trust-ribbon {
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
    }
    .trust-ribbon__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      padding: 1.5rem 0;
    }
    .trust-card {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      padding: 0 1.25rem;
      border-right: 1px solid var(--border-subtle);
    }
    .trust-card:first-child {
      padding-left: 0;
    }
    .trust-card:last-child {
      border-right: none;
      padding-right: 0;
    }
    .trust-card__num {
      font-size: 0.74rem;
      color: var(--accent-crimson);
      font-weight: 700;
      letter-spacing: 0.1em;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .trust-card__body {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .trust-card__body strong {
      font-size: 0.78rem;
      letter-spacing: 0.06em;
      color: var(--text-bone);
    }
    .trust-card__body span {
      font-size: 0.68rem;
      color: var(--text-muted);
      line-height: 1.4;
    }
    .section-block {
      margin-top: 5rem;
    }
    .cat-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
    }
    .cat-tile {
      position: relative;
      aspect-ratio: 3 / 4;
      border-radius: var(--radius-card);
      overflow: hidden;
      border: 1px solid var(--border-subtle);
      transition: border-color 0.28s, box-shadow 0.28s, transform 0.28s var(--ease-kinetic);
    }
    .cat-tile:hover {
      border-color: var(--border-strong);
      box-shadow: var(--card-shadow-hover);
      transform: translateY(-4px);
    }
    .cat-tile__corner {
      position: absolute;
      font-size: 0.75rem;
      color: var(--text-muted);
      opacity: 0.6;
      z-index: 3;
      pointer-events: none;
    }
    .cat-tile__corner--tl {
      top: 0.6rem;
      left: 0.6rem;
    }
    .cat-tile__corner--br {
      bottom: 0.6rem;
      right: 0.6rem;
    }
    .cat-tile__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.7s var(--ease-kinetic);
    }
    .cat-tile:hover .cat-tile__img {
      transform: scale(1.09);
    }
    .cat-tile__overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 1.35rem;
      background: linear-gradient(180deg, transparent 30%, rgba(9, 9, 11, 0.95) 100%);
      color: #f5f3ee;
      z-index: 2;
    }
    .cat-tile__index {
      font-size: 0.68rem;
      color: var(--accent-crimson);
      margin-bottom: 0.3rem;
      letter-spacing: 0.12em;
      font-weight: 700;
    }
    .cat-tile__name {
      margin: 0 0 0.5rem;
      font-size: 1.22rem;
      text-transform: uppercase;
      font-weight: 800;
      letter-spacing: -0.01em;
    }
    .cat-tile__cta {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.72rem;
      color: #d4d4dc;
      letter-spacing: 0.1em;
      font-weight: 700;
      transition: color 0.18s;
    }
    .cta-mini-arrow {
      transition: transform 0.18s var(--ease-kinetic);
    }
    .cat-tile:hover .cta-mini-arrow {
      transform: translateX(4px);
    }
    .era-pills {
      display: flex;
      gap: 0.65rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
      margin-bottom: 1.8rem;
      scrollbar-width: none;
    }
    .era-pills::-webkit-scrollbar {
      display: none;
    }
    .era-pill {
      cursor: pointer;
      flex-shrink: 0;
      padding: 0.58rem 1.15rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sharp);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      transition: all 0.2s var(--ease-kinetic);
    }
    .era-pill.is-active,
    .era-pill:hover {
      background: var(--text-bone);
      color: var(--bg-void);
      border-color: var(--text-bone);
      transform: translateY(-1px);
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(265px, 1fr));
      gap: 1.4rem;
    }
    .inverted-marquee {
      margin-top: 5rem;
      background: #000;
      color: #fff;
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
      overflow: hidden;
      white-space: nowrap;
      padding: 0.85rem 0;
      transform: rotate(-0.4deg) scale(1.01);
    }
    .inverted-track {
      display: inline-flex;
      font-size: 0.82rem;
      font-weight: 800;
      letter-spacing: 0.14em;
      animation: doco-marquee 24s linear infinite;
    }
    .editorial-split {
      display: grid;
      grid-template-columns: 1.05fr 1fr;
      gap: 2.75rem;
      align-items: center;
      padding: 2.25rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-card);
      position: relative;
    }
    .editorial-gallery {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .editorial-frame {
      position: relative;
      margin: 0;
      overflow: hidden;
      border-radius: var(--radius-sharp);
      border: 1px solid var(--border-subtle);
      background: var(--bg-media);
    }
    .editorial-frame img {
      width: 100%;
      height: auto;
      max-height: 480px;
      object-fit: contain;
      background: var(--bg-media);
      transition: transform 0.65s var(--ease-kinetic);
    }
    .editorial-frame:hover img {
      transform: scale(1.08);
    }
    .lookbook-hotspots {
      position: absolute;
      bottom: 2.2rem;
      left: 0.65rem;
      right: 0.65rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      z-index: 3;
    }
    .lookbook-tag {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.32rem 0.55rem;
      background: rgba(9, 9, 11, 0.88);
      color: #f5f3ee;
      border: 1px solid rgba(245, 243, 238, 0.35);
      backdrop-filter: blur(8px);
      border-radius: var(--radius-sharp);
      font-size: 0.64rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      transition: all 0.2s var(--ease-kinetic);
    }
    .lookbook-tag:hover {
      background: #f5f3ee;
      color: #09090b;
      border-color: #f5f3ee;
      transform: translateY(-2px);
    }
    .tag-crosshair {
      color: var(--accent-crimson);
      font-weight: 900;
      font-size: 0.75rem;
      line-height: 1;
    }
    .editorial-frame figcaption {
      padding: 0.6rem 0.75rem;
      font-size: 0.66rem;
      color: var(--text-muted);
      border-top: 1px solid var(--border-subtle);
      letter-spacing: 0.08em;
    }
    .editorial-eyebrow-row {
      display: flex;
      align-items: center;
      gap: 0.55rem;
      margin-bottom: 0.5rem;
    }
    .editorial-eyebrow {
      font-size: 0.72rem;
      color: var(--accent-crimson);
      letter-spacing: 0.16em;
      font-weight: 700;
    }
    .editorial-title {
      margin: 0.6rem 0 1.15rem;
      font-size: clamp(1.75rem, 3.2vw, 2.5rem);
      line-height: 1.05;
      font-weight: 800;
      letter-spacing: -0.015em;
    }
    .editorial-text {
      color: var(--text-muted);
      margin-bottom: 1.5rem;
      line-height: 1.55;
      font-size: 0.92rem;
    }
    .manifesto-list {
      list-style: none;
      padding: 0;
      margin: 0 0 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .manifesto-list li {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
    }
    .m-index {
      font-size: 0.76rem;
      color: var(--accent-crimson);
      font-weight: 800;
      letter-spacing: 0.1em;
      margin-top: 2px;
      flex-shrink: 0;
    }
    .manifesto-list div {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .manifesto-list strong {
      font-size: 0.78rem;
      color: var(--text-bone);
      letter-spacing: 0.06em;
    }
    .manifesto-list small {
      font-size: 0.7rem;
      color: var(--text-muted);
    }
    .editorial-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.85rem;
    }
    .brand-section {
      margin-bottom: 5.5rem;
    }
    .brand-strip {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(185px, 1fr));
      gap: 0.95rem;
    }
    .brand-chip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.35rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sharp);
      transition: all 0.22s var(--ease-kinetic);
    }
    .brand-chip__content {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .brand-chip__name {
      font-size: 1.08rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .brand-chip__origin {
      font-size: 0.65rem;
      color: var(--text-muted);
      letter-spacing: 0.12em;
    }
    .brand-chip__arrow {
      font-size: 0.9rem;
      color: var(--text-dim);
      transition: color 0.2s, transform 0.2s var(--ease-kinetic);
    }
    .brand-chip:hover {
      border-color: var(--text-bone);
      transform: translateY(-2px);
    }
    .brand-chip:hover .brand-chip__arrow {
      color: var(--text-bone);
      transform: translate(2px, -2px);
    }
    @media (max-width: 980px) {
      .hero__spec-card,
      .floating-stickers {
        display: none;
      }
      .mobile-meta-strip {
        display: inline-flex;
      }
      .trust-ribbon__grid {
        grid-template-columns: 1fr 1fr;
        gap: 1.25rem;
      }
      .trust-card {
        border-right: none;
        padding: 0.5rem 0;
      }
      .cat-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .editorial-split {
        grid-template-columns: 1fr;
        padding: 1.5rem;
      }
      .lookbook-hotspots {
        position: static;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.45rem;
        padding: 0.65rem 0.75rem;
        background: var(--bg-surface);
        border-top: 1px solid var(--border-subtle);
      }
    }
    @media (max-width: 640px) {
      .hero {
        min-height: auto;
        padding: 2.25rem 0 1.75rem;
      }
      .hero__top-meta {
        margin-bottom: 0.75rem;
        gap: 0.5rem;
      }
      .hero__coords {
        font-size: 0.65rem;
      }
      .hero__title {
        font-size: clamp(2rem, 8.5vw, 2.5rem);
        margin-bottom: 0.65rem;
      }
      .hero__subtitle {
        font-size: 0.88rem;
        line-height: 1.45;
        margin-bottom: 1.25rem;
      }
      .hero__actions {
        flex-direction: column;
        align-items: stretch;
        gap: 0.65rem;
      }
      .hero__actions a {
        width: 100%;
        text-align: center;
        justify-content: center;
        padding: 0.75rem 1rem;
      }
      .section-block {
        margin-top: 3rem;
      }
      .trust-ribbon__grid {
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
        padding: 1rem 0;
      }
      .trust-card {
        padding: 0.35rem 0;
      }
      .cat-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
      }
      .cat-tile {
        aspect-ratio: 1 / 1;
      }
      .cat-tile__overlay {
        padding: 0.85rem;
      }
      .cat-tile__name {
        font-size: 0.95rem;
        margin-bottom: 0.25rem;
      }
      .product-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
      }
      .editorial-split {
        padding: 1rem;
      }
      .editorial-gallery {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }
      .brand-strip {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.5rem;
      }
      .brand-chip {
        padding: 0.75rem;
      }
      .brand-chip__name {
        font-size: 0.85rem;
      }
      .inverted-marquee {
        margin-top: 3rem;
        transform: none !important;
      }
    }
  `]
})
export class HomePageComponent implements OnInit, OnDestroy {
  private readonly catalogService = inject(CatalogService);
  protected readonly cart = inject(CartService);
  protected readonly soundFx = inject(SoundFxService);
  protected readonly whatsapp = inject(WhatsAppService);
  protected readonly quickView = inject(QuickViewService);

  protected readonly categories = signal<Category[]>([]);
  protected readonly brands = signal<Brand[]>([]);
  protected readonly allDropProducts = signal<ProductSummary[]>([]);
  protected readonly selectedHomeEra = signal<'ALL' | StyleEra>('ALL');
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly localTime = signal(this.getNowTime());

  private clockTimer: ReturnType<typeof setInterval> | null = null;

  protected readonly eraTabs: { value: 'ALL' | StyleEra; label: string }[] = [
    { value: 'ALL', label: 'TODO DROP #01' },
    { value: 'Y2K', label: 'Y2K' },
    { value: 'WORKWEAR', label: 'WORKWEAR' },
    { value: 'STREETWEAR', label: 'STREETWEAR' },
    { value: 'ARCHIVE', label: 'ARCHIVE' }
  ];

  protected readonly visibleProducts = computed(() => {
    const era = this.selectedHomeEra();
    const list = this.allDropProducts();
    return era === 'ALL' ? list : list.filter((p) => p.styleEra === era);
  });

  ngOnInit(): void {
    this.loadHomeData();
    if (typeof window !== 'undefined') {
      this.clockTimer = setInterval(() => {
        this.localTime.set(this.getNowTime());
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.clockTimer) clearInterval(this.clockTimer);
  }

  protected selectTab(value: 'ALL' | StyleEra): void {
    this.soundFx.playClick();
    this.selectedHomeEra.set(value);
  }

  protected inspectLookPiece(sku: string): void {
    const piece = this.allDropProducts().find((p) => p.sku === sku);
    if (piece) {
      this.quickView.open(piece);
    } else {
      this.soundFx.playClick();
    }
  }

  protected loadHomeData(): void {
    this.loading.set(true);
    this.error.set('');

    this.catalogService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats.slice(0, 4)),
      error: () => {}
    });

    this.catalogService.getBrands().subscribe({
      next: (brands) => this.brands.set(brands),
      error: () => {}
    });

    this.catalogService.searchProducts({ pageSize: 8, sort: 'featured' }).subscribe({
      next: (res) => {
        this.allDropProducts.set(res.items);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message || 'Error al cargar los drops.');
        this.loading.set(false);
      }
    });
  }

  private getNowTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('es-MX', { timeZone: 'America/Mazatlan', hour12: false });
  }
}

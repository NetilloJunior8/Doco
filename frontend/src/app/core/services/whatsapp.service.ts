import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CartItem } from '../models/catalog.models';
import { formatMxn } from '../utils/formatters';

export interface CustomerShippingInfo {
  name: string;
  phone: string;
  city: string;
  state: string;
  postalCode: string;
  address: string;
  notes?: string;
  orderNumber?: string;
}

@Injectable({ providedIn: 'root' })
export class WhatsAppService {
  readonly phoneNumber = environment.whatsappPhone || '526672033174';
  readonly displayPhone = '667 203 3174';
  readonly fullDisplayPhone = '+52 667 203 3174';

  /**
   * Generates a clean, high-conversion WhatsApp link for direct cart checkout or reservation.
   */
  generateCartCheckoutUrl(
    items: CartItem[],
    subtotal: number = 0,
    shipping: number = 0,
    total: number = 0,
    customer?: CustomerShippingInfo
  ): string {
    const lines: string[] = [];

    lines.push(`*CONSULTA DOCO ARCHIVE // CULIACÁN, SIN*`);
    lines.push('----------------------------------------');

    if (customer && customer.name.trim()) {
      lines.push('*DATOS DE ENTREGA (CULIACÁN):*');
      lines.push(`*Cliente:* ${customer.name.trim()}`);
      if (customer.phone.trim()) lines.push(`*Tel:* ${customer.phone.trim()}`);
      lines.push(`*Dirección:* ${customer.address.trim()}`);
      if (customer.notes?.trim()) lines.push(`*Notas:* ${customer.notes.trim()}`);
      lines.push('----------------------------------------');
    }

    lines.push('*PIEZAS SOLICITADAS:*');
    items.forEach((item, idx) => {
      lines.push(
        `${idx + 1}. *${item.product.title}* [${item.product.sku}]\n   Talla: ${item.product.sizeLabel} | Cant: ${item.quantity}`
      );
    });

    lines.push('----------------------------------------');
    lines.push(
      'Hola DOCO, me interesan estas piezas del archivo. ¿Cuál sería el precio y disponibilidad para apartar o entrega personal en Culiacán?'
    );

    const message = lines.join('\n');
    return this.buildUrl(message);
  }

  /**
   * Generates an instant inquiry link for an individual garment.
   */
  generatePieceInquiryUrl(pieceTitle: string, sku: string, size: string, priceMxn?: number): string {
    const text = `Hola DOCO! Me interesa la pieza *${pieceTitle}* [${sku}] (Talla ${size}) del catálogo. ¿Cuál es el precio y disponibilidad para entrega en Culiacán?`;
    return this.buildUrl(text);
  }

  /**
   * General inquiry / direct personal stylist chat.
   */
  generateGeneralInquiryUrl(): string {
    const text = 'Hola DOCO! Me gustaría consultar disponibilidad de piezas en el showroom / catálogo de Culiacán.';
    return this.buildUrl(text);
  }

  /**
   * Opens the formatted WhatsApp link in a new window/tab safely.
   */
  openUrl(url: string): void {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  private buildUrl(message: string): string {
    return `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(message)}`;
  }
}

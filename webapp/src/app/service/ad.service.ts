import { Injectable } from '@angular/core';
import { APP_CONFIG } from '../config/app-config';
import { environment } from '../environment/environment';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdService {
  private adConfig = {
    publisherId: APP_CONFIG.adsense.publisherId,
    enabled: APP_CONFIG.adsense.enabled,
    adUnits: {
      headerBanner: {
        format: 'auto',
        slot: APP_CONFIG.adsense.adUnits.headerBanner,
        responsive: true
      },
      sidebarTop: {
        format: '300x250',
        slot: APP_CONFIG.adsense.adUnits.sidebarTop,
        responsive: true
      },
      contentMiddle: {
        format: '300x250',
        slot: APP_CONFIG.adsense.adUnits.contentMiddle,
        responsive: true
      },
      footerBanner: {
        format: 'auto',
        slot: APP_CONFIG.adsense.adUnits.footerBanner,
        responsive: true
      },
      infeed: {
        format: 'fluid',
        slot: APP_CONFIG.adsense.adUnits.infeed,
        responsive: true,
        layoutKey: '-fb+5w+4e-db+86'
      }
    }
  };

  constructor() {
    this.initializeAdSense();
  }

  private hasValidAdSenseConfig(): boolean {
    const publisherId = this.adConfig.publisherId;
    if (!publisherId || !publisherId.startsWith('ca-pub-') || publisherId.includes('xxxxxxxx')) {
      return false;
    }

    // In local/dev we allow placeholder slot IDs to verify layout and ad component behavior.
    if (!environment.production) {
      return true;
    }

    const slots = Object.values(this.adConfig.adUnits).map(unit => unit.slot);
    return slots.every(slot => !!slot && !slot.startsWith('000000000'));
  }

  /**
   * Initialize Google AdSense
   */
  private initializeAdSense(): void {
    if (!this.adConfig.enabled || !this.hasValidAdSenseConfig()) {
      console.log('AdSense disabled or not configured with valid publisher/slot IDs');
      return;
    }

    // Script is loaded via index.html <script> tag for reliability.
    // Fallback: dynamically inject if not already present.
    const existingScript = document.querySelector(
      `script[src*="adsbygoogle.js?client=${this.adConfig.publisherId}"]`
    );
    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.adConfig.publisherId}`;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }

  /**
   * Push ad slots on page (call after template renders)
   */
  public pushAds(): void {
    if (!this.adConfig.enabled || !this.hasValidAdSenseConfig()) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('Error pushing ads:', error);
    }
  }

  /**
   * Get ad unit configuration
   */
  public getAdUnit(unitName: keyof typeof this.adConfig.adUnits) {
    return this.adConfig.adUnits[unitName];
  }

  /**
   * Check if AdSense is enabled
   */
  public isAdSenseEnabled(): boolean {
    return this.adConfig.enabled && this.hasValidAdSenseConfig();
  }

  /**
   * Get publisher ID
   */
  public getPublisherId(): string {
    return this.adConfig.publisherId;
  }
}

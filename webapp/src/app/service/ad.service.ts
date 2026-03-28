import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AdService {
  private adConfig = {
    publisherId: environment.googleAdSense.publisherId,
    enabled: environment.googleAdSense.enabled,
    adUnits: {
      headerBanner: {
        format: 'auto',
        slot: environment.googleAdSense.adUnits.headerBanner,
        responsive: true
      },
      sidebarTop: {
        format: '300x250',
        slot: environment.googleAdSense.adUnits.sidebarTop,
        responsive: true
      },
      contentMiddle: {
        format: '300x250',
        slot: environment.googleAdSense.adUnits.contentMiddle,
        responsive: true
      },
      footerBanner: {
        format: 'auto',
        slot: environment.googleAdSense.adUnits.footerBanner,
        responsive: true
      }
    }
  };

  constructor() {
    this.initializeAdSense();
  }

  /**
   * Initialize Google AdSense
   */
  private initializeAdSense(): void {
    if (!this.adConfig.enabled) {
      console.log('AdSense disabled in environment');
      return;
    }

    // Load AdSense script if not already loaded
    if (!window['adsbygoogle']) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.adConfig.publisherId}`;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        console.log('AdSense script loaded successfully');
      };
      script.onerror = () => {
        console.error('Failed to load AdSense script');
      };
      document.head.appendChild(script);
    }
  }

  /**
   * Push ad slots on page (call after template renders)
   */
  public pushAds(): void {
    if (!this.adConfig.enabled) {
      return;
    }

    try {
      if (window['adsbygoogle']) {
        window['adsbygoogle'].push({});
      }
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
    return this.adConfig.enabled;
  }

  /**
   * Get publisher ID
   */
  public getPublisherId(): string {
    return this.adConfig.publisherId;
  }
}

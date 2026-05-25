import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { AdService } from 'src/app/service/ad.service';
import { environment } from 'src/app/environment/environment';

@Component({
  selector: 'app-ad-placeholder',
  template: `
    <div class="ad-container" [ngClass]="'ad-' + placement" *ngIf="adService.isAdSenseEnabled()">
      <!-- Google AdSense In-Feed Ad -->
      <ins *ngIf="placement === 'infeed'"
           class="adsbygoogle"
           style="display:block"
           [attr.data-ad-client]="adService.getPublisherId()"
           [attr.data-ad-slot]="getAdSlot()"
           data-ad-format="fluid"
           data-ad-layout-key="-fb+5w+4e-db+86"
           [attr.data-adtest]="isTestMode() ? 'on' : null">
      </ins>
      <!-- Google AdSense Display Ad -->
      <ins *ngIf="placement !== 'infeed'"
           class="adsbygoogle"
           [attr.style]="getAdStyle()"
           [attr.data-ad-client]="adService.getPublisherId()"
           [attr.data-ad-slot]="getAdSlot()"
           data-ad-format="auto"
           [attr.data-adtest]="isTestMode() ? 'on' : null"
           data-full-width-responsive="true">
      </ins>
    </div>
  `,
  styles: [`
    .ad-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .ad-header {
      margin: 0.5rem 0;
      background: var(--color-surface-muted);
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      min-height: 50px;
    }

    .ad-sidebar {
      background: var(--color-surface-muted);
      padding: 0.75rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--color-border);
    }

    .ad-content {
      margin: 1.5rem 0;
      background: var(--color-surface-muted);
      padding: 0.75rem;
      border-radius: var(--radius-sm);
    }

    .ad-footer {
      margin: 0.5rem 0;
      background: var(--color-surface-muted);
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      min-height: 50px;
    }

    .ad-side {
      position: sticky;
      top: 5rem;
      background: var(--color-surface-muted);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      padding: 0.5rem;
      min-height: 600px;
      width: 160px;
    }

    .ad-infeed {
      margin: 0.75rem 0;
      width: 100%;
    }

    @media (max-width: 1440px) {
      .ad-side { display: none; }
    }
  `]
})
export class AdPlaceholderComponent implements OnInit, AfterViewInit {
  @Input() placement: 'header' | 'sidebar' | 'content' | 'footer' | 'side' | 'infeed' = 'header';

  constructor(public adService: AdService) {}

  ngOnInit(): void {
    // Component initialized
  }

  /**
   * Push ads after view is rendered
   */
  ngAfterViewInit(): void {
    if (this.adService.isAdSenseEnabled()) {
      setTimeout(() => {
        this.adService.pushAds();
      }, 600);
    }
  }

  isTestMode(): boolean {
    return !environment.production;
  }

  /**
   * Get ad slot based on placement
   */
  getAdSlot(): string {
    const placement: Record<string, string> = {
      header: this.adService.getAdUnit('headerBanner').slot,
      sidebar: this.adService.getAdUnit('sidebarTop').slot,
      content: this.adService.getAdUnit('contentMiddle').slot,
      footer: this.adService.getAdUnit('footerBanner').slot,
      side: this.adService.getAdUnit('sidebarTop').slot,
      infeed: this.adService.getAdUnit('infeed').slot
    };
    return placement[this.placement] || '';
  }

  /**
   * Get ad container styles based on placement
   */
  getAdStyle(): string {
    const styles: Record<string, string> = {
      header: 'display:block; width:100%; height:auto; min-height:50px;',
      sidebar: 'display:block; width:300px; height:250px;',
      content: 'display:block; width:100%; height:auto; min-height:90px;',
      footer: 'display:block; width:100%; height:auto; min-height:50px;',
      side: 'display:block; width:160px; height:600px;',
      infeed: 'display:block;'
    };
    return styles[this.placement] || styles['header'];
  }
}

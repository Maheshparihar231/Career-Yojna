import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AdService } from 'src/app/service/ad.service';

@Component({
  selector: 'app-ad-placeholder',
  template: `
    <div class="ad-container" [ngClass]="'ad-' + placement" *ngIf="adService.isAdSenseEnabled()">
      <!-- Google AdSense Ad -->
      <ins class="adsbygoogle"
           [attr.style]="getAdStyle()"
           [attr.data-ad-client]="adService.getPublisherId()"
           [attr.data-ad-slot]="getAdSlot()"
           data-ad-format="auto"
           data-full-width-responsive="true">
      </ins>
    </div>
  `,
  styles: [`
    .ad-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 1rem 0;
      min-height: 100px;
    }

    .ad-header {
      margin: 1rem 0;
      background: #f9f9f9;
      padding: 0.5rem;
      border-radius: 8px;
    }

    .ad-sidebar {
      background: #f9f9f9;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }

    .ad-content {
      margin: 2rem 0;
      background: #f9f9f9;
      padding: 1rem;
      border-radius: 8px;
    }

    .ad-footer {
      margin: 1rem 0;
      background: #f9f9f9;
      padding: 0.5rem;
      border-radius: 8px;
    }

    /* Mobile responsive */
    @media (max-width: 640px) {
      .ad-container {
        min-height: 80px;
      }
    }
  `]
})
export class AdPlaceholderComponent implements OnInit, AfterViewInit {
  @Input() placement: 'header' | 'sidebar' | 'content' | 'footer' = 'header';
  @ViewChild('adElement') adElement: ElementRef;

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
      }, 100);
    }
  }

  /**
   * Get ad slot based on placement
   */
  getAdSlot(): string {
    const placement = {
      header: this.adService.getAdUnit('headerBanner').slot,
      sidebar: this.adService.getAdUnit('sidebarTop').slot,
      content: this.adService.getAdUnit('contentMiddle').slot,
      footer: this.adService.getAdUnit('footerBanner').slot
    };
    return placement[this.placement] || '';
  }

  /**
   * Get ad container styles based on placement
   */
  getAdStyle(): string {
    const styles = {
      header: 'width:100%; height:90px;',
      sidebar: 'display:block; width:300px; height:250px;',
      content: 'display:block; width:300px; height:250px;',
      footer: 'width:100%; height:90px;'
    };
    return styles[this.placement] || styles.header;
  }
}

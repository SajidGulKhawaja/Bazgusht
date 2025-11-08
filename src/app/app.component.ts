import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PoemsService, Poem } from './poems.service';
import { TocService, TocItem } from './toc.service';

interface Couplet {
  line1: string;
  line2: string;
  poemTitle: string;
  poemId: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    NgIf,
    RouterModule
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  currentYear = new Date().getFullYear();
  toc: TocItem[] = [];
  sidebarOpen = false;
  isHome = true;

  latestPoem?: Poem;
  coupletOfTheDay?: Couplet;

  couplets: Couplet[] = [];
  currentCoupletIndex = 0;
  coupletInterval!: any;

  constructor(
    private poemsService: PoemsService,
    private http: HttpClient,
    private router: Router,
    private tocService: TocService
  ) {}

  ngOnInit(): void {
    // Subscribe to dynamic TOC changes
    this.tocService.toc$.subscribe(toc => {
      this.toc = toc;
    });

    // Load default TOC from JSON
    this.http.get<TocItem[]>('assets/toc.json').subscribe({
      next: data => this.tocService.setToc(data),
      error: err => console.error('Failed to load TOC:', err)
    });

    // Detect route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHome = event.urlAfterRedirects === '/'; // ✅ correct usage
      }
    });

    // Load poems
    this.poemsService.getPoems().subscribe({
      next: poems => {
        if (!poems.length) return;

        this.latestPoem = this.getPoemOfTheDay(poems);
        this.coupletOfTheDay = this.getCoupletOfTheDay(poems);
        this.generateThreeRandomCouplets(poems);

        // Auto-rotation
        this.coupletInterval = setInterval(() => {
          this.currentCoupletIndex = (this.currentCoupletIndex + 1) % this.couplets.length;
        }, 5000);
      },
      error: err => console.error('Failed to load poems:', err)
    });
  }

  ngOnDestroy(): void {
    if (this.coupletInterval) clearInterval(this.coupletInterval);
  }

  // Poem and couplet utilities
  getPoemOfTheDay(poems: Poem[]): Poem {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return poems[seed % poems.length];
  }

  getCoupletsFromPoem(poem: Poem): Couplet[] {
    const lines = poem.content.split('\n').map(l => l.trim()).filter(Boolean);
    const couplets: Couplet[] = [];
    for (let i = 0; i < lines.length; i += 2) {
      couplets.push({
        line1: lines[i],
        line2: lines[i + 1] || '',
        poemTitle: poem.title,
        poemId: poem.id
      });
    }
    return couplets;
  }

  getCoupletOfTheDay(poems: Poem[]): Couplet {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const poem = poems[seed % poems.length];
    const couplets = this.getCoupletsFromPoem(poem);
    return couplets[seed % couplets.length];
  }

  generateThreeRandomCouplets(poems: Poem[]): void {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const shuffled = [...poems]
      .sort((a, b) => ((a.id! + seed) % poems.length) - ((b.id! + seed) % poems.length))
      .slice(0, 3);
    this.couplets = shuffled.map((poem, index) => {
      const lines = poem.content.split('\n').filter(l => l.trim());
      if (lines.length < 2) return { line1: '', line2: '', poemTitle: poem.title, poemId: poem.id };
      const coupletIndex = (seed + index) % Math.floor(lines.length / 2);
      return {
        line1: lines[coupletIndex * 2],
        line2: lines[coupletIndex * 2 + 1],
        poemTitle: poem.title,
        poemId: poem.id
      };
    });
  }

  getCurrentCouplet(): Couplet {
    return this.couplets[this.currentCoupletIndex];
  }

  nextCouplet(): void {
    this.resetAutoRotation();
    this.currentCoupletIndex = (this.currentCoupletIndex + 1) % this.couplets.length;
  }

  prevCouplet(): void {
    this.resetAutoRotation();
    this.currentCoupletIndex = (this.currentCoupletIndex - 1 + this.couplets.length) % this.couplets.length;
  }

  private resetAutoRotation(): void {
    if (this.coupletInterval) clearInterval(this.coupletInterval);
    this.coupletInterval = setInterval(() => {
      this.currentCoupletIndex = (this.currentCoupletIndex + 1) % this.couplets.length;
    }, 5000);
  }
}

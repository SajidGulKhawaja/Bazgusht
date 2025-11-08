import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface TocItem {
  id?: number;
  title: string;
  link: string;
}

@Injectable({ providedIn: 'root' })
export class TocService {
  private tocSubject = new BehaviorSubject<TocItem[]>([]);
  toc$ = this.tocSubject.asObservable();

  /** Set TOC items (overwrites current TOC) */
  setToc(toc: TocItem[]) {
    this.tocSubject.next(toc);
  }

  /** Reset TOC (e.g., back to default) */
  resetToc(defaultToc: TocItem[]) {
    this.tocSubject.next(defaultToc);
  }
}

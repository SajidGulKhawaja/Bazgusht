import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Poem {
  id: number;
  title: string;
  date: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class PoemsService {
  private jsonUrl = 'assets/poems.json';

  constructor(private http: HttpClient) {}

  getPoems(): Observable<Poem[]> {
    return this.http.get<Poem[]>(this.jsonUrl);
  }

  getPoemById(id: number): Observable<Poem | undefined> {
    return new Observable(observer => {
      this.getPoems().subscribe(poems => {
        const poem = poems.find(p => p.id === id);
        observer.next(poem);
        observer.complete();
      });
    });
  }
}

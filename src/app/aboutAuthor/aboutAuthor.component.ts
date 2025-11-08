import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface TocItem {
  title: string;
  link: string;
}

interface Author {
  name: string;
  photo: string;
  bio: string[];
}

@Component({
  selector: 'app-about-author',
  templateUrl: './aboutAuthor.component.html',
  styleUrls: ['./aboutAuthor.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AboutAuthorComponent {
  currentYear = new Date().getFullYear();
  author: Author | null = null;
  toc: TocItem[] = [];
  isLoading = true;

  constructor(private http: HttpClient) {
    this.loadAuthor();
    this.loadToc();
  }

  private loadAuthor() {
    this.http.get<Author>('assets/author.json').subscribe({
      next: data => {
        this.author = data;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error loading author JSON', err);
        this.isLoading = false;
      }
    });
  }

  private loadToc() {
    this.http.get<TocItem[]>('assets/toc-author.json').subscribe({
      next: data => this.toc = data,
      error: err => console.error('Error loading author TOC', err)
    });
  }
}

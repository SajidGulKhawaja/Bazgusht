import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PoemsService, Poem } from '../poems.service';

@Component({
  selector: 'app-poem',
  templateUrl: './poem.component.html',
  styleUrls: ['./poem.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PoemComponent implements OnInit {
  poem?: Poem;

  constructor(
    private route: ActivatedRoute,
    private poemsService: PoemsService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.poemsService.getPoemById(id).subscribe(p => this.poem = p);
  }
}

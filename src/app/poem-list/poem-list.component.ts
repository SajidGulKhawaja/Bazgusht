import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoemsService, Poem } from '../poems.service';

@Component({
  selector: 'app-poem-list',
  templateUrl: './poem-list.component.html',
  styleUrls: ['./poem-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class PoemListComponent implements OnInit {
  poems: Poem[] = [];

  constructor(private poemsService: PoemsService) {}

  ngOnInit(): void {
    this.poemsService.getPoems().subscribe(data => this.poems = data);
  }
}

import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { PoemListComponent } from './poem-list/poem-list.component';
import { PoemComponent } from './poem/poem.component';
import { AboutAuthorComponent } from './aboutAuthor/aboutAuthor.component';
import { ContactComponent } from './contact/contact.component';
export const routes: Routes = [
  //{ path: '', component: AppComponent },          // Home page
  { path: 'poems', component: PoemListComponent }, // Poems List page
  { path: 'poem/:id', component: PoemComponent }, // Individual poem
  { path: 'about-author', component: AboutAuthorComponent }, // About Author page
  { path: 'contact', component: ContactComponent }, // About Author page
 // { path: '**', redirectTo: '' }                  // Fallback
];

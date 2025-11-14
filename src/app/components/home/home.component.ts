import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChurrascoComponent } from '../churrasco/churrasco.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ChurrascoComponent],
  template: `
    <div class="home-container">
      <section class="churrasco-section">
        <app-churrasco></app-churrasco>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 20px;
      text-align: center;
    }
  `]
})
export class HomeComponent {}
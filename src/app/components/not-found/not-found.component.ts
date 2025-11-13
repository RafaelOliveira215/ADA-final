import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  `,
  styles: [`
    .not-found-container {
      padding: 20px;
      text-align: center;
      margin-top: 50px;
    }
  `]
})
export class NotFoundComponent {}
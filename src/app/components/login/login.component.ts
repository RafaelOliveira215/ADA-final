import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="username">Username:</label>
          <input 
            type="text" 
            id="username" 
            formControlName="username" 
            class="form-control"
            placeholder="Digite seu usuário">
          <div *ngIf="form.get('username')?.invalid && form.get('username')?.touched" class="error-message">
            Usuário é obrigatório
          </div>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            formControlName="password" 
            class="form-control"
            placeholder="Digite sua senha">
          <div *ngIf="form.get('password')?.invalid && form.get('password')?.touched" class="error-message">
            Senha é obrigatória
          </div>
        </div>
        <button type="submit" class="btn-submit" [disabled]="form.invalid">Login</button>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
    }
    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }
    .form-control:focus {
      outline: none;
      border-color: #007bff;
    }
    .error-message {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
    }
    .btn-submit {
      width: 100%;
      padding: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-submit:hover:not(:disabled) {
      background-color: #0056b3;
    }
    .btn-submit:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class LoginComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.router.navigate(['/home']);
    }
  }
}
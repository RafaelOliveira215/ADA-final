import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-churrasco',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="churrasco-card">
      <h2>Formulário de Churrasco</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="field">
          <label for="criancas">Número de crianças</label>
          <input id="criancas" type="number" min="0" formControlName="criancas" />
        </div>

        <div class="field">
          <label for="adultos">Número de adultos</label>
          <input id="adultos" type="number" min="0" formControlName="adultos" />
        </div>

        <fieldset class="checkbox-group" formArrayName="meats">
          <legend>Carnes</legend>
          <div *ngFor="let opt of meatsOptions; let i = index" class="checkbox-item">
            <label>
              <input type="checkbox" [formControlName]="i" />
              {{ opt.label }}
            </label>
          </div>
        </fieldset>

        <fieldset class="checkbox-group" formArrayName="drinks">
          <legend>Bebidas</legend>
          <div *ngFor="let opt of drinksOptions; let i = index" class="checkbox-item">
            <label>
              <input type="checkbox" [formControlName]="i" />
              {{ opt.label }}
            </label>
          </div>
        </fieldset>

        <button type="submit">Calcular</button>
      </form>

      <div *ngIf="submitted" class="result">
        <p><strong>Crianças:</strong> {{ form.value.criancas }}</p>
        <p><strong>Adultos:</strong> {{ form.value.adultos }}</p>
        <p><strong>Total de pessoas:</strong> {{ totalPessoas() }}</p>
        <p><strong>Carnes selecionadas:</strong> {{ selectedMeats.length ? (selectedMeats.join(', ')) : '—' }}</p>
        <p><strong>Bebidas selecionadas:</strong> {{ selectedDrinks.length ? (selectedDrinks.join(', ')) : '—' }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .churrasco-card { border: 1px solid #ddd; padding: 16px; border-radius: 6px; max-width: 480px; margin: 0 auto; }
      .churrasco-card h2 { margin-top: 0; }
      .field { display: flex; flex-direction: column; margin-bottom: 12px; }
      label { font-size: 14px; margin-bottom: 4px; }
      input[type="number"] { padding: 6px 8px; font-size: 14px; }
      .checkbox-group { margin-bottom: 12px; border: 1px dashed #e0e0e0; padding: 8px; border-radius: 4px; }
      .checkbox-group legend { font-weight: 600; }
      .checkbox-item { margin: 6px 0; }
      button { padding: 8px 12px; cursor: pointer; }
      .result { margin-top: 12px; background: #f9f9f9; padding: 8px; border-radius: 4px; }
    `
  ]
})
export class ChurrascoComponent {
  criancas: number = 0;
  adultos: number = 0;
  submitted = false;

  meatsOptions = [
    { label: 'Picanha', value: 'picanha' },
    { label: 'Alcatra', value: 'alcatra' },
    { label: 'Linguiça', value: 'linguica' },
    { label: 'Frango', value: 'frango' }
  ];

  drinksOptions = [
    { label: 'Cerveja', value: 'cerveja' },
    { label: 'Refrigerante', value: 'refrigerante' },
    { label: 'Água', value: 'agua' },
    { label: 'Suco', value: 'suco' }
  ];

  selectedMeats: string[] = [];
  selectedDrinks: string[] = [];

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      criancas: [0],
      adultos: [0],
      meats: this.fb.array(this.meatsOptions.map(() => false)),
      drinks: this.fb.array(this.drinksOptions.map(() => false))
    });
  }

  get meats(): FormArray {
    return this.form.get('meats') as FormArray;
  }

  get drinks(): FormArray {
    return this.form.get('drinks') as FormArray;
  }

  onSubmit() {
    const v = this.form.value;
    this.selectedMeats = this.meatsOptions.filter((_, i) => v.meats[i]).map(o => o.value);
    this.selectedDrinks = this.drinksOptions.filter((_, i) => v.drinks[i]).map(o => o.value);
    this.submitted = true;
  }

  totalPessoas() {
    return Number(this.criancas || 0) + Number(this.adultos || 0);
  }
}

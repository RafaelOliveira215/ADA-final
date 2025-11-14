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
          <label for="adultos">Número de adultos</label>
          <input id="adultos" type="text" min="0" inputmode="numeric" formControlName="adultos" (keydown)="onlyNumbers($event)" />
        </div>

        <div class="field">
          <label for="criancas">Número de crianças</label>
          <input id="criancas" type="text" min="0" inputmode="numeric" formControlName="criancas" (keydown)="onlyNumbers($event)" />
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

      <div *ngIf="validationError && validationError.length > 0" class="error">
        {{ validationError }}
      </div>

      <div *ngIf="submitted && !validationError" class="result">
        <p><strong>Total de pessoas:</strong> {{ totalPessoas() }}</p>
        <p><strong>Valor Bebidas:</strong> R$ {{ drinkCost | number:'1.2-2' }}</p>
        <p><strong>Valor Carnes:</strong>R$ {{ meatCost | number:'1.2-2' }}</p>
        <p><strong>Valor Total:</strong>R$ {{ totalCost | number:'1.2-2' }}</p>
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
      .error { margin-top: 12px; background: #f8d7da; color: #721c24; padding: 8px; border-radius: 4px; border: 1px solid #f5c6cb; }
    `
    ]
})
export class ChurrascoComponent {
    criancas: number = 0;
    adultos: number = 0;
    submitted = false;
    validationError = '';

    meatsOptions = [
        { label: 'Picanha', value: 'picanha', pricePerKg: 70 },
        { label: 'Alcatra', value: 'alcatra', pricePerKg: 45 },
        { label: 'Linguiça', value: 'linguica', pricePerKg: 25 },
        { label: 'Frango', value: 'frango', pricePerKg: 18 }
    ];

    drinksOptions = [
        { label: 'Cerveja', value: 'cerveja', pricePerUnit: 6 },
        { label: 'Refrigerante', value: 'refrigerante', pricePerUnit: 7 },
        { label: 'Água', value: 'agua', pricePerUnit: 2 },
        { label: 'Suco', value: 'suco', pricePerUnit: 5 }
    ];

    selectedMeats: string[] = [];
    selectedDrinks: string[] = [];

    form: FormGroup;

    // calculation results
    meatCost: number = 0;
    drinkCost: number = 0;
    totalCost: number = 0;

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
        const adults = Number(v.adultos || 0);
        const children = Number(v.criancas || 0);
        const totalPeople = adults + children;

        console.log('Adultos:', v.adultos, 'Crianças:', v.criancas, 'Total:', totalPeople);

        // Validate: at least 1 person required
        if (totalPeople === 0) {
            this.validationError = 'É necessário ter pelo menos 1 criança ou 1 adulto';
            this.submitted = false;
            console.log('Erro de validação:', this.validationError);
            return;
        }

        this.validationError = '';
        this.selectedMeats = this.meatsOptions.filter((_, i) => v.meats[i]).map(o => o.value);
        this.selectedDrinks = this.drinksOptions.filter((_, i) => v.drinks[i]).map(o => o.value);

        if (this.selectedMeats.length > 0) {
            this.meatCost = this.meatsOptions
                .filter(m => this.selectedMeats.includes(m.value))
                .reduce((sum, m) => {
                    const kgPerChild = 0.3;
                    const kgPerAdult = 0.5;
                    const kgTotalForThisMeat = children * kgPerChild + adults * kgPerAdult;
                    return sum + (m.pricePerKg! * kgTotalForThisMeat);
                }, 0);
        } else {
            this.meatCost = 0;
        }

        if (this.selectedDrinks.length > 0) {
            this.drinkCost = this.drinksOptions
                .filter(d => this.selectedDrinks.includes(d.value))
                .reduce((sum, d) => {
                    // children do not consume beer (cerveja)
                    const peopleForThisDrink = (d.value === 'cerveja') ? adults : totalPeople;
                    return sum + (d.pricePerUnit! * peopleForThisDrink);
                }, 0);
        } else {
            this.drinkCost = 0;
        }

        this.totalCost = this.meatCost + this.drinkCost;
        this.submitted = true;
    }

    totalPessoas() {
        const v = this.form.value;
        return Number(v.criancas || 0) + Number(v.adultos || 0);
    }

    onlyNumbers(event: KeyboardEvent) {
        const key = event.key;
        // Allow numbers, backspace, delete, tab, enter, arrow keys
        if (!/^[0-9]$/.test(key) && 
            !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(key)) {
            event.preventDefault();
        }
    }
}

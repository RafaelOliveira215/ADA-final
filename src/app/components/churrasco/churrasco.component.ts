import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ChurrascoService, MeatOption, DrinkOption } from '../../services/churrasco.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-churrasco',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatExpansionModule,
        MatDividerModule
    ],
    template: `
    <mat-card class="churrasco-card">
      <mat-card-header>
        <mat-card-title>Formulário de Churrasco</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <div *ngIf="isLoading" class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Carregando dados...</p>
        </div>

        <mat-error *ngIf="loadingError && loadingError.length > 0">
          {{ loadingError }}
        </mat-error>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!isLoading">
          <!-- Pessoas -->
          <div class="section">
            <h3>Participantes</h3>
            <div class="form-row">
              <mat-form-field appearance="outline" class="field-half">
                <mat-label>Adultos</mat-label>
                <input 
                  matInput
                  type="text" 
                  inputmode="numeric" 
                  formControlName="adultos" 
                  (keydown)="onlyNumbers($event)"
                  placeholder="0" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="field-half">
                <mat-label>Crianças</mat-label>
                <input 
                  matInput
                  type="text" 
                  inputmode="numeric" 
                  formControlName="criancas" 
                  (keydown)="onlyNumbers($event)"
                  placeholder="0" />
              </mat-form-field>
            </div>
          </div>

          <!-- Carnes -->
          <mat-expansion-panel class="expansion-panel" formArrayName="meats">
            <mat-expansion-panel-header>
              <mat-panel-title>
                Carnes
              </mat-panel-title>
            </mat-expansion-panel-header>
            <div class="checkbox-grid">
              <div *ngFor="let opt of meatsOptions; let i = index" class="checkbox-item">
                <mat-checkbox [formControlName]="i">
                  {{ opt.label }} - R$ {{ opt.pricePerKg }}/kg
                </mat-checkbox>
              </div>
            </div>
          </mat-expansion-panel>

          <!-- Bebidas -->
          <mat-expansion-panel class="expansion-panel" formArrayName="drinks">
            <mat-expansion-panel-header>
              <mat-panel-title>
                Bebidas
              </mat-panel-title>
            </mat-expansion-panel-header>
            <div class="checkbox-grid">
              <div *ngFor="let opt of drinksOptions; let i = index" class="checkbox-item">
                <mat-checkbox [formControlName]="i">
                  {{ opt.label }} - R$ {{ opt.pricePerUnit }}/unidade
                </mat-checkbox>
              </div>
            </div>
          </mat-expansion-panel>

          <button 
            mat-raised-button 
            color="primary" 
            type="submit"
            class="submit-button">
            Calcular
          </button>
        </form>

        <!-- Validation Error -->
        <mat-error *ngIf="validationError && validationError.length > 0">
          {{ validationError }}
        </mat-error>

        <!-- Results -->
        <mat-card *ngIf="submitted && !validationError" class="result-card">
          <mat-card-header>
            <mat-card-title>Resultado do Cálculo</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="result-row">
              <span class="result-label">Total de pessoas:</span>
              <span class="result-value">{{ totalPessoas() }}</span>
            </div>
            <mat-divider class="result-divider"></mat-divider>
            <div class="result-row result-highlight">
              <span class="result-label">Valor Bebidas:</span>
              <span class="result-value">R$ {{ drinkCost | number:'1.2-2' }}</span>
            </div>
            <div class="result-row result-highlight">
              <span class="result-label">Valor Carnes:</span>
              <span class="result-value">R$ {{ meatCost | number:'1.2-2' }}</span>
            </div>
            <div class="result-row result-total">
              <span class="result-label">Valor Total:</span>
              <span class="result-value-total">R$ {{ totalCost | number:'1.2-2' }}</span>
            </div>
          </mat-card-content>
        </mat-card>
      </mat-card-content>
    </mat-card>
  `,
    styles: [`
      .churrasco-card {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px 20px;
      }

      .section {
        margin-bottom: 24px;
      }

      .section h3 {
        margin-bottom: 16px;
        color: #666;
      }

      .form-row {
        display: flex;
        gap: 16px;
      }

      .field-half {
        flex: 1;
        min-width: 120px;
      }

      .expansion-panel {
        margin-bottom: 16px;
      }

      .checkbox-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
        padding: 16px 0;
      }

      .checkbox-item {
        display: flex;
        align-items: center;
      }

      .submit-button {
        width: 100%;
        margin-top: 24px;
        height: 48px;
        font-size: 16px;
      }

      .result-card {
        margin-top: 24px;
        background: linear-gradient(to bottom, #f0f4ff, #f9f9f9);
      }

      .result-row {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        font-size: 16px;
      }

      .result-label {
        font-weight: 500;
        color: #666;
      }

      .result-value {
        color: #333;
      }

      .result-highlight {
        background: #f5f5f5;
        padding: 12px;
        border-radius: 4px;
      }

      .result-divider {
        margin: 16px 0;
      }

      .result-total {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 12px !important;
        border-radius: 6px;
        font-size: 18px;
      }

      .result-total .result-label,
      .result-total .result-value-total {
        color: white;
        font-weight: 600;
      }

      mat-error {
        display: block;
        margin-top: 12px;
        padding: 12px;
        background: #f8d7da;
        color: #721c24;
        border-radius: 4px;
        border: 1px solid #f5c6cb;
      }

      mat-icon {
        margin-right: 8px;
        vertical-align: middle;
      }
    `]
})
export class ChurrascoComponent implements OnInit {
    criancas: number = 0;
    adultos: number = 0;
    submitted = false;
    validationError = '';
    isLoading = true;
    loadingError = '';

    meatsOptions: MeatOption[] = [];
    drinksOptions: DrinkOption[] = [];

    selectedMeats: string[] = [];
    selectedDrinks: string[] = [];

    form: FormGroup;

    meatCost: number = 0;
    drinkCost: number = 0;
    totalCost: number = 0;

    constructor(private fb: FormBuilder, private churrascoService: ChurrascoService) {
        this.form = this.fb.group({
            criancas: [0],
            adultos: [0],
            meats: this.fb.array([]),
            drinks: this.fb.array([])
        });
    }

    ngOnInit(): void {
        this.loadOptions();
    }

    loadOptions(): void {
        this.isLoading = true;
        this.loadingError = '';

        this.churrascoService.getMeats().subscribe({
            next: (meats) => {
                this.meatsOptions = meats;
                this.updateMeatsFormArray();
            },
            error: (error) => {
                console.error('Erro ao carregar carnes:', error);
                this.loadingError = 'Erro ao carregar dados. Usando valores padrão.';
                this.setDefaultOptions();
                this.updateMeatsFormArray();
            }
        });

        this.churrascoService.getDrinks().subscribe({
            next: (drinks) => {
                this.drinksOptions = drinks;
                this.updateDrinksFormArray();
            },
            error: (error) => {
                console.error('Erro ao carregar bebidas:', error);
                this.loadingError = 'Erro ao carregar dados. Usando valores padrão.';
                this.setDefaultOptions();
                this.updateDrinksFormArray();
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    setDefaultOptions(): void {
        if (this.meatsOptions.length === 0) {
            this.meatsOptions = [
                { label: 'Picanha', value: 'picanha', pricePerKg: 70 },
                { label: 'Alcatra', value: 'alcatra', pricePerKg: 45 },
                { label: 'Linguiça', value: 'linguica', pricePerKg: 25 },
                { label: 'Frango', value: 'frango', pricePerKg: 18 }
            ];
        }
        if (this.drinksOptions.length === 0) {
            this.drinksOptions = [
                { label: 'Cerveja', value: 'cerveja', pricePerUnit: 6 },
                { label: 'Refrigerante', value: 'refrigerante', pricePerUnit: 7 },
                { label: 'Água', value: 'agua', pricePerUnit: 2 },
                { label: 'Suco', value: 'suco', pricePerUnit: 5 }
            ];
        }
    }

    updateMeatsFormArray(): void {
        const meatsArray = this.form.get('meats') as FormArray;
        meatsArray.clear();
        this.meatsOptions.forEach(() => {
            meatsArray.push(this.fb.control(false));
        });
    }

    updateDrinksFormArray(): void {
        const drinksArray = this.form.get('drinks') as FormArray;
        drinksArray.clear();
        this.drinksOptions.forEach(() => {
            drinksArray.push(this.fb.control(false));
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
        if (!/^[0-9]$/.test(key) && 
            !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(key)) {
            event.preventDefault();
        }
    }
}

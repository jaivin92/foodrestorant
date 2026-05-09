import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonComponent } from '../../components/ui/button/button.component';
import { CardComponent } from '../../components/ui/card/card.component';
import { InputComponent } from '../../components/ui/input/input.component';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ButtonComponent, CardComponent, InputComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly loginError = signal('');

  readonly form = this.formBuilder.group({
    email: ['superadmin@test.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    this.loginError.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        void this.router.navigate(['/dashboard']);
      },
      error: (error: unknown) => {
        this.isSubmitting.set(false);
        this.loginError.set(error instanceof Error ? error.message : 'Login failed. Please try again.');
      },
    });
  }
}

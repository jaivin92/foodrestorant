import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonComponent } from '../../components/ui/button/button.component';
import { CardComponent } from '../../components/ui/card/card.component';
import { InputComponent } from '../../components/ui/input/input.component';
import { AuthService } from '../../core/auth/auth.service';
import { LoginRole } from '../../core/auth/auth.models';

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

  readonly roles: readonly { value: LoginRole; label: string }[] = [
    { value: 'customer', label: 'Customer' },
    { value: 'staff', label: 'Floor staff' },
    { value: 'cook', label: 'Cook staff' },
    { value: 'cashier', label: 'Cashier' },
    { value: 'admin', label: 'Admin' },
  ];

  readonly form = this.formBuilder.group({
    email: ['guest@foodrestorant.test', [Validators.required, Validators.email]],
    password: ['password', [Validators.required, Validators.minLength(6)]],
    role: this.formBuilder.control<LoginRole>('customer', Validators.required),
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const credentials = this.form.getRawValue();
    this.auth.login(credentials);
    void this.router.navigate(['/dashboard']);
  }
}

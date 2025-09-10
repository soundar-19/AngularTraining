import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { definePreset } from '@primeng/themes';
import { ConfirmationService, MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      JwtInterceptor.withToken,
      (req, next) => {
        const messageService = inject(MessageService);
        const router = inject(Router);
        return ErrorInterceptor.withErrorHandling(messageService, router)(req, next);
      }
    ])),
    provideAnimations(),
    MessageService,
    ConfirmationService,
    providePrimeNG({
      theme: {
preset: definePreset(Lara, {
          primitive: {
            borderRadius: {
              none: '0',
              xs: '2px',
              sm: '4px',
              md: '6px',
              lg: '8px',
              xl: '12px'
            }
          },
          semantic: {
            colorScheme: {
              light: {
                surface: {
                  0: '#ffffff',
                  50: '#f8fafc',
                  100: '#f1f5f9',
                  200: '#e2e8f0',
                  300: '#cbd5e1',
                  400: '#94a3b8',
                  500: '#64748b',
                  600: '#475569',
                  700: '#334155',
                  800: '#1e293b',
                  900: '#0f172a',
                  950: '#020617'
                }
              }
            }
          }
        })
      }
    })
  ]
};

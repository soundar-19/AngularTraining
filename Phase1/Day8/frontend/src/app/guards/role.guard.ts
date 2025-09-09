import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const RoleGuard = (expectedRoles: string | string[]): CanActivateFn  => {
    return () => {
        const auth = inject(AuthService);
        const router = inject(Router);
        const role = auth.getUserRole();
        const allowedRoles = Array.isArray(expectedRoles) ? expectedRoles : [expectedRoles];
        if (allowedRoles.includes(role!)) return true;
        router.navigate(['/unauthorized']);
        return false;
    }
}
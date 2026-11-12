import { usePage } from '@inertiajs/react';

export function useAuth() {
    const { auth } = usePage().props;

    const user = auth.user;
    const roles = auth.roles;
    const permissions = auth.permissions;

    /**
     * Comprobar si tiene un permiso.
     */
    const can = (permission: string): boolean => {
        return permissions.includes(permission);
    };

    /**
     * Comprobar si tiene al menos uno de los permisos.
     */
    const canAny = (requiredPermissions: string[]): boolean => {
        return requiredPermissions.some(permission =>
            permissions.includes(permission)
        );
    };

    /**
     * Comprobar si tiene todos los permisos.
     */
    const canAll = (requiredPermissions: string[]): boolean => {
        return requiredPermissions.every(permission =>
            permissions.includes(permission)
        );
    };

    /**
     * Comprobar si tiene un rol.
     */
    const hasRole = (role: string): boolean => {
        return roles.includes(role);
    };

    /**
     * Comprobar si tiene al menos uno de los roles.
     */
    const hasAnyRole = (requiredRoles: string[]): boolean => {
        return requiredRoles.some(role =>
            roles.includes(role)
        );
    };

    return {
        user,
        roles,
        permissions,
        can,
        canAny,
        canAll,
        hasRole,
        hasAnyRole,
        isSuperAdmin: hasRole('super-admin'),
    };
}

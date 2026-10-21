export type User = {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    imagen?: string | null;
    telefono?: string | null;
    estado: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

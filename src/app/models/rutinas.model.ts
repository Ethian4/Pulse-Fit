import { Ejercicios } from "./ejercicios.model";

export interface Rutinas{
    id: string,
    name: string,
    nota: string,
    Ejercicio: Ejercicios,
    checked: boolean
    date: string; // Nueva propiedad para almacenar la fecha
}
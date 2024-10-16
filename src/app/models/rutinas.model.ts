import { Ejercicios } from "./ejercicios.model";

export interface Rutinas{
    id: string,
    name: string,
    nota: string,
    Ejercicio: Ejercicios
}
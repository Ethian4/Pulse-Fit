import { Photo } from "@capacitor/camera";

export interface User{
    uid: string,
    email: string,
    password: string,
    name: string,
    image: string,
    rutinasMes: number,
    rutinasSemana: number,
    peso: number,
    altura: number,
    genero: string,
    edad: number,
    cargoMensual: number,
    tokens: number,
    sigCobro: Date,
    tarjeta: number,
    rutinasCompletadas: number,
}
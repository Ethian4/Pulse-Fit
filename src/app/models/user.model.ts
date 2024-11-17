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
    rutinasCompletadas: number,
    cargoMensual: number,
    tokens: number,
    sigCobro: string,
    tarjeta: number,
    planNombre: string,
    ga: number,
    gp: number,
    qr: string,
}


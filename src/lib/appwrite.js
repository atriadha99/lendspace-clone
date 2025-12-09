// src/lib/appwrite.js
import { Client, Account, Databases, Storage, ID } from 'appwrite';

const client = new Client()
    .setEndpoint('https://attractive-acceptance-production.up.railway.app/v1') // ← GANTI KALAU URL BERBEDA
    .setProject('67f1a6c270a2467a3b38'); // ← ini Project ID dari Appwrite kamu (lihat di console Home)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const ID = ID;

// Ganti dengan ID database & collection yang kamu buat
export const DB_ID = 'lendspace';
export const USERS_COL = 'users';
export const PRODUCTS_COL = 'products';
export const BOOKINGS_COL = 'bookings';
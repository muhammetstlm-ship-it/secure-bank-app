// 1. Kullanıcı Hesap Bilgileri Modeli
export interface BankAccount {
  accountNumber: string; // IBAN veya Hesap No (Güvenlik için string tutulur)
  accountHolder: string; // Hesap Sahibi
  balance: number;       // Güncel Bakiye
  currency: "TRY" | "USD" | "EUR"; // Sadece bu para birimlerine izin veriyoruz (TypeScript Koruması)
}

// 2. Para Transfer (Log) Geçmişi Modeli
export interface BankTransaction {
  id: string;
  type: "TRANSFER" | "DEPOSIT" | "WITHDRAWAL"; // İşlem Türü: Gönderim, Para Yatırma, Para Çekme
  senderAccountNumber: string; // Gönderen hesap
  receiverAccountNumber: string; // Alıcı hesap
  amount: number; // Gönderilen miktar
  date: string; // İşlem tarihi
  description: string; // İşlem açıklaması
}

// --- SİSTEMDEKİ AKTİF HESAPLAR (LOKAL VERİTABANIMIZ) ---
export const MOCK_ACCOUNTS: BankAccount[] = [
  { accountNumber: "TR100020003000", accountHolder: "Muhammet Can Satılmış", balance: 145250.75, currency: "TRY" },
  { accountNumber: "TR500060007000", accountHolder: "Ahmet Yılmaz (Yazılım Müdürü)", balance: 4250.00, currency: "TRY" },
  { accountNumber: "US900080007000", accountHolder: "Global Security Corp", balance: 89000.00, currency: "USD" }
];

// --- SİSTEMDEKİ GEÇMİŞ PARA HAREKETLERİ ---
export const MOCK_TRANSACTIONS: BankTransaction[] = [
  {
    id: "TX-987452",
    type: "TRANSFER",
    senderAccountNumber: "TR500060007000",
    receiverAccountNumber: "TR100020003000",
    amount: 15000,
    date: "2026-06-12 14:30",
    description: "Proje Geliştirme Danışmanlık Ödemesi"
  },
  {
    id: "TX-112233",
    type: "DEPOSIT",
    senderAccountNumber: "SYSTEM",
    receiverAccountNumber: "TR100020003000",
    amount: 2500,
    date: "2026-06-11 09:15",
    description: "ATM Nakit Para Yatırma İşlemi"
  }
];
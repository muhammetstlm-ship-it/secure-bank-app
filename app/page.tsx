"use client";

import { useState, useEffect, useRef } from "react";
import { MOCK_ACCOUNTS, MOCK_TRANSACTIONS, BankTransaction } from "./constants/bankData";

// Siber Güvenlik Alarm Modeli
interface SecurityLog {
  id: string;
  timestamp: string;
  severity: "CRITICAL" | "WARNING";
  message: string;
  errorCode: string;
}

export default function BankDashboard() {
  // Mevcut Durumlar (States)
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [accounts, setAccounts] = useState(MOCK_ACCOUNTS);
  const [transactions, setTransactions] = useState<BankTransaction[]>(MOCK_TRANSACTIONS);

  // 🛡️ Siber Güvenlik SOC Log Durumu
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([
    {
      id: "SEC-4401",
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      severity: "WARNING",
      message: "Sistem oturumu başarıyla açıldı. IP: 192.168.1.9",
      errorCode: "AUTH_OK"
    }
  ]);

  // Form Verileri
  const [receiverIban, setReceiverIban] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [transferDesc, setTransferDesc] = useState<string>("");

  const [systemMessage, setSystemMessage] = useState<{ text: string; type: "success" | "error" | null }>({
    text: "",
    type: null
  });

  // 🛡️ RATE LIMIT KORUMASI: Son başarılı/başarısız işlem zamanını tutan hafıza hücresi
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);

  // 🔒 SENİN VİZYONUN: Butonun tıklanabilirliğini kilitleyen yeni durum (State)
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const myAccount = accounts[0];

  // 🎯 SOC MONITOR GÖRSEL ZIRH: En son loga odaklanacak çapa referansı
  const logEndRef = useRef<HTMLDivElement>(null);

  // ==========================================
  // 🛡️ ADLİ BİLİŞİM (FORENSICS) KALICILIK MOTORU
  // ==========================================

  useEffect(() => {
    const lokalLoglar = localStorage.getItem("secure_bank_logs");
    const lokalHesaplar = localStorage.getItem("secure_bank_accounts");
    const lokalIslemler = localStorage.getItem("secure_bank_transactions");

    if (lokalLoglar) setSecurityLogs(JSON.parse(lokalLoglar));
    if (lokalHesaplar) setAccounts(JSON.parse(lokalHesaplar));
    if (lokalIslemler) setTransactions(JSON.parse(lokalIslemler));
  }, []);

  useEffect(() => {
    localStorage.setItem("secure_bank_logs", JSON.stringify(securityLogs));
  }, [securityLogs]);

  useEffect(() => {
    localStorage.setItem("secure_bank_accounts", JSON.stringify(accounts));
    localStorage.setItem("secure_bank_transactions", JSON.stringify(transactions));
  }, [accounts, transactions]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [securityLogs]);

  // ==========================================

  // 🚨 Siber Güvenlik Log Fırlatıcı
  const triggerSecurityLog = (severity: "CRITICAL" | "WARNING", message: string, errorCode: string) => {
    const newLog: SecurityLog = {
      id: `SEC-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19).replace(' ', ' T: '),
      severity,
      message,
      errorCode
    };
    setSecurityLogs(prev => [newLog, ...prev]);
  };

  // 🛡️ TRANSFER MOTORU
  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();

    // ─── 🛡️ SİBER KATMAN 1: STATE BATCHING BAYPASLI RATE LIMITING ───
    let isFlooding = false;
    let timePassed = 0;

    setLastRequestTime((prevTime) => {
      const currentTime = Date.now();
      timePassed = currentTime - prevTime;

      if (prevTime !== 0 && timePassed < 3000) {
        isFlooding = true;
        return prevTime;
      }
      return currentTime;
    });

    // Eğer flood tespit edildiyse anında bloke et, log fırlat ve butonu kilitle!
    if (isFlooding) {
      setSystemMessage({
        text: "🚨 Güvenlik Protokolü: Çok hızlı işlem isteği! Lütfen 3 saniye bekleyin.",
        type: "error"
      });

      triggerSecurityLog(
        "CRITICAL",
        `Brute-Force / API Flooding denemesi engellendi! İstek aralığı: ${timePassed}ms`,
        "RATE_LIMIT_EXCEEDED"
      );

      // 🔥 Butonu kilitle ve 3 saniye (3000 ms) sonra geri aç
      setIsButtonDisabled(true);
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 3000);

      return;
    }

    // 1. Alanların eksiksiz doldurulup doldurulmadığını denetle
    if (!receiverIban || !transferAmount || !transferDesc) {
      setSystemMessage({ text: "⚠️ Lütfen tüm alanları eksiksiz doldurun.", type: "error" });
      return;
    }

    // ─── 🛡️ SİBER KATMAN 2: XSS FILTRESI ───
    const xssPattern = /<script\b[^>]*>([\s\S]*?)<\/script>|[\w\s]*\s*=\s*['"][^'"]*javascript:[^'"]*['"]|\b(onload|onerror|onclick|onmouseover)\b\s*=/gi;

    if (xssPattern.test(transferDesc) || xssPattern.test(receiverIban)) {
      setSystemMessage({
        text: "❌ Güvenlik Tehdidi: Girdilerde zararlı betik kodları tespit edildi! İşlem bloke edildi.",
        type: "error"
      });

      triggerSecurityLog(
        "CRITICAL",
        `XSS (Cross-Site Scripting) Enjeksiyon Atak Denemesi Bloke Edildi!`,
        "XSS_INJECTION_ATTACK"
      );
      return;
    }

    const amount = Number(transferAmount);

    // 🔴 KRİTİK ATAK KORUMASI
    if (!transferAmount || amount <= 0 || isNaN(amount)) {
      setSystemMessage({ text: "❌ Geçersiz miktar! Güvenlik protokolü uyarınca işlem reddedildi.", type: "error" });

      const sahteGirdi = transferAmount.trim() !== "" ? `${transferAmount} ₺` : "BOŞ BIRAKILDI / GİRİŞ YOK";

      triggerSecurityLog(
        "CRITICAL",
        `Manipülatif veya geçersiz bakiye denemesi! Girilen Değer: [${sahteGirdi}]`,
        "ERR_NEGATIVE_INJECTION"
      );
      return;
    }

    // 🟠 UYARI: Yetersiz Bakiye Kontrolü
    if (amount > myAccount.balance) {
      setSystemMessage({ text: "❌ Hesap bakiyesi bu işlem için yetersiz.", type: "error" });

      triggerSecurityLog(
        "WARNING",
        `Yetersiz bakiye limit aşım denemesi. Talep: ${amount} ₺`,
        "ERR_INSUFFICIENT_LIMIT"
      );
      return;
    }

    // 🟠 UYARI: Alıcı Hesap Kontrolü
    const targetAccount = accounts.find(acc => acc.accountNumber === receiverIban);
    if (!targetAccount) {
      setSystemMessage({ text: "❌ Alıcı hesap (IBAN) bulunamadı. Lütfen kontrol edin.", type: "error" });

      triggerSecurityLog(
        "WARNING",
        `Bilinmeyen/Hayali IBAN'a para gönderim denemesi: [${receiverIban}]`,
        "ERR_UNKNOWN_TARGET"
      );
      return;
    }

    if (receiverIban === myAccount.accountNumber) {
      setSystemMessage({ text: "⚠️ Kendi hesabınıza EFT yapamazsınız.", type: "error" });
      return;
    }

    // MUTABAKAT (BAŞARILI İŞLEM)
    const updatedAccounts = accounts.map(acc => {
      if (acc.accountNumber === myAccount.accountNumber) return { ...acc, balance: acc.balance - amount };
      if (acc.accountNumber === receiverIban) return { ...acc, balance: acc.balance + amount };
      return acc;
    });

    const newTransaction: BankTransaction = {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      type: "TRANSFER",
      senderAccountNumber: myAccount.accountNumber,
      receiverAccountNumber: receiverIban,
      amount: amount,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      description: transferDesc
    };

    setAccounts(updatedAccounts);
    setTransactions([newTransaction, ...transactions]);
    setSystemMessage({ text: "✅ Transfer işlemi siberDoc onayından geçti ve başarıyla tamamlandı!", type: "success" });

    triggerSecurityLog("WARNING", `Başarılı Transfer: ${amount} ₺ -> ${targetAccount.accountHolder}'a gönderildi.`, "TX_SUCCESS");

    setReceiverIban("");
    setTransferAmount("");
    setTransferDesc("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

      {/* KURUMSAL SİBER NAVBAR */}
      <nav className="bg-slate-900 px-8 py-4 flex justify-between items-center shadow-lg border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg text-slate-900 font-bold text-xl tracking-wider">SOC</div>
          <span className="text-xl font-bold tracking-tight text-white">SECURE BANK <span className="text-red-500 font-mono text-sm">[SIEM & SOC MONITOR]</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs bg-red-950/40 px-3 py-1.5 rounded-full border border-red-900/60 text-red-400 font-mono animate-pulse">
            🚨 SIEM Log Dinleyici Aktif
          </span>
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 text-sm shadow">MS</div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* SOL TARAF: KULLANICI ARAYÜZÜ */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* BAKİYE KARTI */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 border border-slate-700 shadow-xl">
            <p className="text-slate-400 text-xs font-medium">Aktif Operatör / Müşteri</p>
            <h1 className="text-xl font-bold text-emerald-400">{myAccount.accountHolder}</h1>

            <div className="mt-6 flex justify-between items-end">
              <div>
                <p className="text-xxs uppercase tracking-widest text-slate-400">Hesap No / IBAN</p>
                <p className="text-xs font-mono tracking-wider mt-1 text-slate-300 bg-slate-800 px-2 py-0.5 rounded inline-block">
                  {myAccount.accountNumber}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <p className="text-xxs uppercase tracking-widest text-slate-400">Bakiye</p>
                  <button onClick={() => setShowBalance(!showBalance)} className="text-xxs bg-slate-700 hover:bg-slate-600 px-1.5 py-0.5 rounded transition text-slate-300">
                    {showBalance ? "Gizle" : "Göster"}
                  </button>
                </div>
                <p className="text-2xl font-bold tracking-tight text-white font-mono mt-0.5">
                  {showBalance ? `${myAccount.balance.toLocaleString('tr-TR')} ${myAccount.currency}` : "••••••• ••"}
                </p>
              </div>
            </div>
          </div>

          {/* SİSTEM BİLDİRİMİ */}
          {systemMessage.type && (
            <div className={`p-3 rounded-xl text-xs font-semibold border ${systemMessage.type === "success" ? "bg-emerald-950/50 text-emerald-300 border-emerald-800" : "bg-red-950/50 text-red-300 border-red-900"
              }`}>
              {systemMessage.text}
            </div>
          )}

          {/* TRANSFER FORMU */}
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-md">
            <h3 className="font-bold text-sm text-slate-200 mb-4 flex items-center gap-1.5 uppercase tracking-wider text-emerald-400">
              💸 Para Transferi Test Modülü
            </h3>
            <form onSubmit={handleTransfer} className="flex flex-col gap-3.5">
              <div>
                <label className="block text-xxs font-bold uppercase text-slate-400 mb-1">Alıcı IBAN</label>
                <input type="text" value={receiverIban} onChange={(e) => setReceiverIban(e.target.value)} placeholder="TR500060007000" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-emerald-500 transition text-slate-200" />
              </div>
              <div>
                <label className="block text-xxs font-bold uppercase text-slate-400 mb-1">Tutar (₺)</label>
                <input type="number" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} placeholder="0.00" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-emerald-500 transition text-slate-200" />
              </div>
              <div>
                <label className="block text-xxs font-bold uppercase text-slate-400 mb-1">Açıklama</label>
                <input type="text" value={transferDesc} onChange={(e) => setTransferDesc(e.target.value)} placeholder="Ödeme gerekçesi" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500 transition text-slate-200" />
              </div>

              {/* 🔥 GÜNCELLENEN AKILLI SİBER BUTON */}
              <button
                type="submit"
                disabled={isButtonDisabled}
                className={`w-full font-bold py-2.5 px-4 rounded-xl shadow transition text-xs uppercase tracking-wider ${isButtonDisabled
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                    : "bg-emerald-600 hover:bg-emerald-500 text-slate-950"
                  }`}
              >
                {isButtonDisabled ? "🔒 Sistem Kilitlendi (Bekleyin...)" : "🔒 İşlemi Güvenlik Sırasına Gönder"}
              </button>
            </form>
          </div>
        </div>

        {/* SAĞ RATAF: SOC MONITOR */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl h-full flex flex-col">
            <div className="border-b border-slate-800 pb-3 mb-4 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-red-400 flex items-center gap-2 uppercase tracking-widest">
                  🛡️ SOC Gerçek Zamanlı Olay İzleme Sistemi
                </h2>
                <p className="text-xxs text-slate-500 font-medium mt-0.5">Siber Tehdit ve Güvenlik İhlal Kayıtları (SIEM)</p>
              </div>
              <span className="text-xxs bg-red-950 text-red-400 border border-red-900 px-2 py-0.5 rounded font-mono font-bold">
                LOG COUNT: {securityLogs.length}
              </span>
            </div>

            <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[420px] pr-1 font-mono">
              {securityLogs.map((log) => (
                <div key={log.id} className={`p-3 rounded-xl border text-xxs flex flex-col gap-1.5 transition-all ${log.severity === "CRITICAL"
                  ? "bg-red-950/20 border-red-900/60 text-red-300"
                  : "bg-amber-950/10 border-amber-900/40 text-amber-300"
                  }`}>
                  <div className="flex justify-between items-center font-bold">
                    <span className={`px-2 py-0.5 rounded text-white ${log.severity === "CRITICAL" ? "bg-red-700 animate-pulse" : "bg-amber-600"
                      }`}>
                      [{log.severity}]
                    </span>
                    <span className="text-slate-500 font-sans">{log.timestamp}</span>
                  </div>
                  <p className="font-semibold text-slate-200 leading-relaxed"><span className="text-slate-400 font-bold">Event:</span> {log.message}</p>
                  <div className="flex justify-between items-center text-slate-500 text-[10px] border-t border-slate-800/60 pt-1.5">
                    <span>ID: {log.id}</span>
                    <span className="font-bold text-slate-400">Code: {log.errorCode}</span>
                  </div>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
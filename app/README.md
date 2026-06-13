# 🛡️ Secure Bank Corp. - SIEM & SOC Dashboard

Bu proje, uluslararası finans standartlarına uygun olarak geliştirilmiş, TypeScript tabanlı ve siber güvenlik odaklı zırhlandırılmış bir **FinTech Bankacılık Yönetim Paneli (Dashboard)** simülasyonudur. 

Uygulama, kullanıcıların finansal işlemlerini takip etmesini sağlarken, arka planda gelişmiş filtreleme mekanizmalarıyla siber saldırıları ve manipülatif veri enjeksiyonlarını gerçek zamanlı olarak engeller.

---

## 🚨 Siber Güvenlik ve SOC (Security Operations Center) Mimarisi

Projenin kalbi, finansal manipülasyonları tespit etmek amacıyla entegre edilmiş **SIEM (Security Information and Event Management) Log Dinleyicisi** modülüdür. Sistem, kötü niyetli kullanıcıların veya saldırganların web arayüzü üzerinden yapmaya çalıştığı suistimalleri anında yakalar:

1. **Negatif Değer / Bakiye Enjeksiyonu Koruması (`CRITICAL`):** Saldırganların form alanlarına eksi değerler (`-5000 ₺`) girerek sistemi manipüle etmesi ve haksız bakiye elde etmesi sistem seviyesinde bloke edilir. SOC paneline anlık kritik alarm fırlatılır.
2. **Yetersiz Bakiye ve Limit Aşım Denetimi (`WARNING`):** Hesap bakiyesinin üzerindeki transfer talepleri işleme alınmaz ve şüpheli aktivite olarak loglanır.
3. **Hayali/Geçersiz Hesap Filtrelemesi (`WARNING`):** Sistemde tanımlı olmayan, bilinmeyen IBAN adreslerine para çıkışı engellenerek veri tutarlılığı korunur.

---

## 💻 Kullanılan Teknolojiler

* **Framework:** Next.js (Turbopack Derleyici)
* **Dil:** TypeScript (Tip Güvenlikli Mimari)
* **Stil Yönetimi:** Tailwind CSS (Responsive Kurumsal Arayüz)
* **State Yönetimi:** React Hooks (`useState` ile gerçek zamanlı dinamik bakiye ve defter mutabakatı)

---

## ⚙️ Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için:

```bash
# 1. Depoyu klonlayın
git clone <github-depo-linkiniz>

# 2. Proje dizinine gidin
cd secure-bank-app

# 3. Bağımlılıkları yükleyin
npm install

# 4. Geliştirici sunucusunu ayağa kaldırın
npm run dev
# 💳 Vulnerable Bank Mobile App
![logo](https://github.com/user-attachments/assets/a1b07585-3b60-400c-a10e-2daffa1f31ad)

**Vulnerable Bank** is an intentionally insecure mobile application built for security engineers, penetration testers, and mobile app security learners to practice and demonstrate real-world exploitation of insecure coding practices.

This mobile app acts as a frontend for the [Vulnerable Bank API](https://github.com/Commando-X/vuln-bank), a purposely vulnerable web API with typical banking features.

> 🛡️ **This fork** adds [Talsec **freeRASP**](https://github.com/talsec/Free-RASP-ReactNative)
> (Runtime Application Self-Protection) as a *defensive* layer on top of the
> vulnerable app, so you can watch RASP detect root/jailbreak, emulators,
> debuggers, Frida/hooking and repackaging in real time. See
> [**SECURITY-FREERASP.md**](./SECURITY-FREERASP.md).

---

## 📥 Download and Run Instantly (Recommended)

> 🆕 You can now download the compiled `.apk` directly from GitHub Releases.

- 📦 [Download Latest APK](https://github.com/Commando-X/vuln-bank-mobile/releases/latest)
- ⚠️ Enable **Install Unknown Apps** on your Android device
- 🚫 No need to build anything — just install and start testing!

> This APK includes all vulnerable features, static secrets, and works offline with your own hosted API server.

---

## 📲 Features

- 🔓 Insecure login with hardcoded credentials
- 🔍 Debug API endpoint exposed in the APK
- 🛑 Plaintext storage of credentials and balance in SharedPreferences
- 🔑 Hardcoded JWT tokens in source code
- 🔒 OWASP Mobile Top 10 Vulnerabilities including:
  - M1: Improper Platform Usage
  - M2: Insecure Data Storage
  - M4: Insecure Authentication
  - M5: Insufficient Cryptography
  - M9: Reverse Engineering
- 💾 Static secrets exposed in `AndroidManifest.xml`
- 📱 Emulates a realistic banking app with:
  - Balance check
  - Money transfer
  - Transaction history
  - Loans
  - Virtual cards
  - Admin-only hidden panel

---

## 🧪 Who Is It For?

Security professionals, students, and educators who want to:

- Practice Android security testing (JADX, Frida, MobSF, Burp Suite, etc.)
- Demonstrate OWASP Mobile Top 10 risks
- Build or demo mobile DevSecOps pipelines
- Run Capture-the-Flag (CTF) scenarios or internal red team labs

---

## 🚧 Build It Yourself (Optional)

### 🧱 Requirements

- Node.js v18+
- Android Studio (with emulator or physical device)
- Java JDK 11+
- Git

### 📦 Installation

```bash
git clone https://github.com/Commando-X/vuln-bank-mobile
cd vuln-bank-mobile
npm install
```

Start Metro server:

```bash
npx react-native start
```

In another terminal:

```bash
npx react-native run-android
```

> ⚠️ If testing on a real device, make sure to:
> - Update `API_BASE` in `App.tsx` with your server’s IP
> - Allow HTTP traffic by setting `android:usesCleartextTraffic="true"` in your manifest

---

## 🧠 Fun Security Challenges Inside

- Can you extract the admin JWT?
- Can you discover the debug API and access hidden user data?
- Can you reverse engineer the APK and find credentials in SharedPreferences?
- Can you tamper with API requests?

---

## 🧑‍💻 Dev Notes

- Written in **React Native (TypeScript)**
- Icons from `react-native-vector-icons`
- Emulator-friendly, but can be bundled for real Android devices
- Secrets deliberately placed in:
  - Java/Kotlin source code
  - SharedPreferences
  - AndroidManifest.xml

---

## 🛡 Disclaimer

> This app is intended **strictly for educational purposes**.  
> Do **NOT** install this app on real production devices or use with real financial data.  
> All API endpoints are intentionally insecure and should only be used in isolated testing environments.

---

## 📸 Screenshots

> ![image](https://github.com/user-attachments/assets/33f43c66-dcb1-467e-b076-66e91d028288)
> ![image](https://github.com/user-attachments/assets/6f80f404-823b-46e7-9c4e-841a1727cff9)
> ![image](https://github.com/user-attachments/assets/ad31551a-d0e5-4627-92d8-d0bb8c39abe8)

---

## 👨‍🎓 Author

**Badmus Al-Amir**  
Security Engineer • API Security Advocate • Mobile AppSec Educator  
[LinkedIn](https://linkedin.com/in/badmus-al-amir) • [GitHub](https://github.com/Commando-X)

---

## 📂 Related Projects

- [💻 Vulnerable Bank API (Flask)](https://github.com/Commando-X/vuln-bank)
- [📱 Android Static/Dynamic Testing Scripts (Frida, MobSF, etc)](https://github.com/Commando-X/)

---

## 🏁 License

MIT — use it, break it, teach with it 🧠

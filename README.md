# 🚀 Google-Powered Dynamic Portfolio

A modern, high-performance portfolio web application powered by **Google Workspace** & **Google Cloud** services.

---

## 🛠️ Integrated Google Services Architecture

1. **Google Sheets (Headless CMS)**:
   - Your projects, case studies, and tags are maintained directly in a spreadsheet.
   - When you add a new project row in Google Sheets, it updates on your live portfolio without redeploying code.
2. **Google Drive (Asset Delivery)**:
   - Host and preview your professional resume PDF and high-res case study files directly from Drive.
3. **Google Forms & Gmail (Inquiry Ingestion)**:
   - Inquiries submitted from your contact form are sent directly to your Google Sheet inbox and notify your Gmail.
4. **Google Slides & Looker Studio (Interactive Showcase)**:
   - Tabbed embedded views for case study presentation decks and live BI reports.
5. **Google Calendar (Booking)**:
   - Direct integration link for visitors and recruiters to schedule 15-minute introductory meetings.
6. **Firebase Hosting (Google Cloud CDN)**:
   - One-command deployment with free SSL and lightning-fast global CDN delivery.

---

## 🏃 Quick Start (Local Development)

The local dev server is currently running:
```bash
# View the live portfolio in your browser:
http://localhost:5173/
```

To run it again anytime:
```powershell
npm.cmd run dev
```

To build for production:
```powershell
npm.cmd run build
```

---

## 📋 Connecting Your Google Sheet in 3 Steps

1. **Create your Google Sheet**:
   - Create a spreadsheet with these columns in Row 1:
     `id, title, description, category, tags, demoUrl, githubUrl, imageUrl, featured`
2. **Add the Apps Script API**:
   - In your Google Sheet, click **Extensions > Apps Script**.
   - Copy and paste all the code from [`google-apps-script-template.js`](./google-apps-script-template.js).
   - Click **Deploy > New deployment**, select **Web app**, set access to **"Anyone"**, and copy the **Web app URL**.
3. **Sync with Your Portfolio**:
   - On the portfolio website, click the **Sheet CMS** button in the top navigation.
   - Paste your Web App URL and click **Save & Sync Now**.

---

## 🌐 Deploying to Google Firebase Hosting

This project is already pre-configured with `firebase.json`.

To deploy live to the web for free:
```powershell
# 1. Log in to your Google / Firebase account:
npx.cmd -y firebase login

# 2. Deploy your production build:
npm.cmd run build
npx.cmd -y firebase deploy
```

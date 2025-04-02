# Dealer QR Code

Welcome to the **DealerQRCode** project. This repository powers a suite of tools designed to help car dealerships easily generate custom QR codes for their inventory or landing pages.

## Website

**[dealerqrcode.com](https://dealerqrcode.com)** is a modern web app built with:

- **Next.js** (App Router)
- **Tailwind CSS**
- **shadcn/ui** component library
- **Deployed via Vercel**

The site provides an easy-to-use interface for dealerships to view pricing and generate QR codes that link to custom dealership pages or vehicles.

## Chrome Extensions

We’ve built two versions of a Chrome extension that enhance dealership capabilities directly in-browser:

### Version 1 – Basic HTML Extension

- Lightweight extension with a minimal UI
- Manual input fields for QR generation
- No advanced scraping or site interaction

### Version 2 – React + Vite Extension

- Fully rebuilt as a modern Vite + React app
- Scrapes dealership websites to auto-detect relevant information (e.g., vehicle details)
- Dynamically generates custom QR codes based on scraped content
- Provides a smoother, more integrated experience

## Repository Structure

```bash
dealerqrcode/
├── dealer-qrcode-website/         # Next.js + Tailwind + shadcn UI frontend
├── dealerqrcode-chrome-v1/        # Basic HTML Chrome Extension
├── dealerqrcode-chrome-v2/        # React + Vite Chrome Extension with web scraping

# ML Insight Pro - Local Setup Guide

This project is a full-stack Machine Learning dashboard with a Neural Assistant.

## Prerequisites
- Node.js installed on your machine.
- A Gemini API Key (Get one for free at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)).

## Installation

1. **Extract the ZIP file** to a folder on your computer.
2. **Open a terminal** in that folder.
3. **Install dependencies**:
   ```bash
   npm install
   ```

## Configuration (CRITICAL)

The Neural Assistant requires an API key to work. 

1. Create a file named **`.env`** in the root directory.
2. Open the `.env` file and add the following line:
   ```env
   GEMINI_API_KEY="YOUR_ACTUAL_API_KEY_HERE"
   ```
   *Replace `YOUR_ACTUAL_API_KEY_HERE` with the key you got from Google AI Studio.*

## Running the App

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser to [http://localhost:3000](http://localhost:3000).

## Troubleshooting "Invalid API Key"
If you see an "Invalid API Key" error:
- Ensure your `.env` file is named exactly `.env` (not `.env.txt`).
- Ensure there are no spaces before or after your API key inside the quotes.
- Verify the key works by testing it in the [Google AI Studio](https://aistudio.google.com/) chat.

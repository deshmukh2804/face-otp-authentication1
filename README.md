<h1 align="center">🔐 Face + OTP Authentication System</h1>

<h2 align="center">AI-Based Dual-Factor Secure Login Application</h2>

<p align="center">
<b>A smart authentication system that verifies users using Facial Recognition + Time-Based OTP</b><br>
Built using <b>React, TypeScript, Firebase & AI Face Verification</b>.
</p>

<hr>

<h2 align="center">🌐 LIVE APPLICATION</h2>

<h1 align="center">
🚀 <a href="https://face-otp-authentication1.vercel.app/#/login" target="_blank">
VERCEL – LIVE WEBSITE
</a>
</h1>

<p align="center">
⚠️ <b>Note:</b> This project is deployed using <b>Vercel</b>.<br>
Firebase Authentication and OTP services require valid API keys to work correctly.
</p>

<hr>

<h2>✨ FEATURES</h2>

<ul>
<li><b>User Signup & Login System</b></li>
<li><b>AI Face Recognition Authentication</b></li>
<li><b>Time-Limited OTP Verification</b> (Email/SMS OTP)</li>
<li><b>Secure Dual-Factor Authentication</b></li>
<li><b>Firebase Authentication & Firestore Database</b></li>
<li><b>Responsive UI</b> (Mobile & Desktop)</li>
<li><b>Modern UI Design</b> with React Components</li>
</ul>

<hr>

<h2>🛠️ TECH STACK</h2>

<table>
<tr><td><b>Frontend</b></td><td>React.js, TypeScript, HTML5, CSS3</td></tr>
<tr><td><b>Framework</b></td><td>Vite</td></tr>
<tr><td><b>Backend</b></td><td>Firebase Authentication, Firestore</td></tr>
<tr><td><b>AI Face Verification</b></td><td>Face-api.js / TensorFlow.js</td></tr>
<tr><td><b>OTP Service</b></td><td>Email OTP / SMS OTP (Twilio Integration)</td></tr>
<tr><td><b>Hosting</b></td><td>Vercel</td></tr>
<tr><td><b>Tools</b></td><td>VS Code, Git, GitHub</td></tr>
</table>

<hr>

<h2>📂 PROJECT STRUCTURE</h2>

<pre>
face-otp-authentication/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/               # Signup, Login, OTP Verification pages
│   ├── services/            # Firebase + Authentication services
│   ├── App.tsx              # Main App Component
│   └── main.tsx             # Entry Point
│
├── public/                  # Static assets
├── package.json             # Dependencies & Scripts
├── vite.config.ts           # Vite Configuration
└── README.md                # Project Documentation
</pre>

<hr>

<h2>⚙️ RUN LOCALLY</h2>

<h3>1️⃣ Clone the Repository</h3>

<pre>
git clone https://github.com/deshmukh2804/face-otp-authentication1.git
cd face-otp-authentication1
</pre>

<h3>2️⃣ Install Dependencies</h3>

<pre>
npm install
</pre>

<h3>3️⃣ Run Development Server</h3>

<pre>
npm run dev
</pre>

<p>
Project will run on:
</p>

<pre>
http://localhost:5173/
</pre>

<hr>

<h2>🔐 CONFIGURATION (IMPORTANT)</h2>

<ul>
<li>Add your <b>Firebase configuration</b> inside <code>src/services/firebase.ts</code></li>
<li>Enable <b>Email Authentication</b> or <b>Phone Authentication</b> in Firebase Console</li>
<li>OTP services require Twilio or Email API integration</li>
<li>Without API keys, Face + OTP authentication will not work fully</li>
</ul>

<hr>

<h2>🔑 AUTHENTICATION FLOW</h2>

<ul>
<li>User registers with Email + Face Data</li>
<li>User logs in using Face Recognition (Step 1)</li>
<li>OTP is generated and sent via Email/SMS (Step 2)</li>
<li>User enters OTP for verification</li>
<li>Access is granted only after both steps are successful</li>
</ul>

<hr>

<h2>🚀 DEPLOYMENT</h2>

<p>
This project is deployed using <b>Vercel</b>.
</p>

<h3>Deploy Steps:</h3>

<pre>
npm run build
vercel deploy
</pre>

<p>
Build output directory:
</p>

<pre>
dist/
</pre>

<hr>

<h2>📌 FUTURE ENHANCEMENTS</h2>

<ul>
<li>Add Liveness Detection to prevent spoofing</li>
<li>Add Admin Dashboard for monitoring logins</li>
<li>Improve Face Matching Accuracy</li>
<li>Full SMS OTP integration using Twilio</li>
<li>Multi-device authentication support</li>
</ul>

<hr>

<h2 align="center">👨‍💻 AUTHOR & CONTACT</h2>

<p align="center">
<b>Bhavuk Deshmukh</b><br><br>

📧 <b>Email:</b>  
<a href="mailto:bhavukdeshmukh@gmail.com">bhavukdeshmukh@gmail.com</a>
<br><br>

💼 <b>LinkedIn:</b>  
<a href="https://www.linkedin.com/in/bhavuk-deshmukh-189739257/" target="_blank">
linkedin.com/in/bhavuk-deshmukh-189739257
</a>
<br><br>

🐙 <b>GitHub:</b>  
<a href="https://github.com/deshmukh2804" target="_blank">
github.com/deshmukh2804
</a>
</p>

<hr>

<h1 align="center">⭐ PLEASE STAR THIS REPOSITORY ⭐</h1>

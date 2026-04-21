# **App Name**: VigilAgro Web

## Core Features:

- User Authentication: Minimalist login and registration for users via email and password, powered by Firebase Auth, with direct redirection to the main dashboard post-login.
- Plant Image Upload & Preview: A prominent section on the dashboard allowing users to upload plant images through a drag-and-drop component or file selector, supporting mobile camera access, with instant image preview.
- Client-Side Disease Detection: Utilizes TensorFlow.js to execute a pre-trained Computer Vision model directly in the browser for immediate identification of the plant and detection of potential diseases.
- Persistent Diagnostic History: Automatically saves processed images to Firebase Storage and diagnosis metadata (plant type, disease, date) to Firestore, building a historical record viewable on the dashboard.
- AI-Powered Treatment Advice Tool: A Firebase Cloud Function, triggered by new diagnoses, leverages the Google Gemini Pro API as a tool to generate personalized and practical treatment advice for the detected plant disease.
- Dynamic Advice Display: Displays detailed diagnostic information, including the large plant image and the generative AI's advice in an easily readable list format. Shows a 'generating advice' spinner for pending results.
- Accessible Dashboard Interface: A streamlined main dashboard designed for simplicity and accessibility, featuring the prominent plant scanner and a clear, navigable history of all past diagnostic results.

## Style Guidelines:

- Primary color: Grounded olive green (#546647), representing growth and stability in nature. (HSL: 90, 30%, 40%)
- Background color: A very light, subtle off-white with a hint of green (#F7FAF6), for a clean, natural canvas. (HSL: 90, 15%, 95%)
- Accent color: Vibrant golden yellow (#EEDE4C), evoking sunlight and vitality for clear call-to-actions and highlights. (HSL: 60, 70%, 60%)
- All text uses 'Inter', a humanist sans-serif font chosen for its modern, legible, and objective aesthetic, with a base font size of at least 18px for improved readability for all users.
- Uses clear, simple, and descriptive agricultural-themed icons that are easily recognizable. Buttons will incorporate these icons to visually represent their function.
- Adheres to extreme simplicity and linear navigation, avoiding complex sub-menus. Emphasizes prominent interactive elements and a focused, clutter-free content display to ensure ease of use for seniors.
- Incorporates subtle and functional loading indicators (spinners) during AI processing and image uploads to provide clear feedback without distracting the user.
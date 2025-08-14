# 🎨 2D Canvas Editor  

🚀 **Live:** [Click Here](https://2d-editor-canvas-3prsn0lnb-akshatnykz20-gmailcoms-projects.vercel.app?_vercel_share=PFHLZzllFaM9TvJ28jDyeX6VBrNDKtGq)  
🚀 **Live Demo created by me(fully editable) :** [Click Here](https://2d-editor-canvas-3prsn0lnb-akshatnykz20-gmailcoms-projects.vercel.app/canvas/74o371smtvbehntdqrz3ds)  
---

## 📌 Overview  
The **2D Canvas Editor** is a collaborative, browser-based design tool built with **React, Fabric.js, and Firebase Firestore**.  
It allows users to **draw shapes, add text, choose colors, snap to a grid, and collaborate in real-time** by sharing a unique link.  

---

## ✨ Features  
✅ **Draw Shapes** – Add rectangles and circles with a single click.  
✏️ **Text Tool** – Insert and edit text with ease.  
🖌 **Free Drawing Mode** – Express yourself with the pen tool.  
🎨 **Color Palette + Custom Picker** – Choose from preset colors or create your own.  
🗑 **Delete Tool** – Remove selected objects instantly.  
↩️ **Undo & Redo** – Move back and forth through your edits.  
🤝 **Real-Time Collaboration** – Multiple users can edit together live.  
☁️ **Firebase Backend** – Keeps your canvas synced across all connected users.  

---

## 🛠 Tech Stack  
- ⚛ **Frontend:** React + Vite  
- 🖼 **Canvas Rendering:** Fabric.js  
- 🔥 **Database:** Firebase Firestore  
- 🌐 **Hosting & Deployment:** Vercel  

---

## ⚖️ Trade-offs & Decisions  
- 🛠 **Chose Fabric.js** for rich object manipulation instead of the low-level Canvas API to speed up development.  
- 🔄 **Firestore** was used for real-time collaboration instead of a custom WebSocket server — faster to implement but with slight performance trade-offs in high-frequency updates.  
- 📏 **Snap-to-Grid** enhances precision but slightly limits freehand creativity.  

---

## 🚀 Deployment  
The app is deployed on **Vercel** with SPA routing handled via `vercel.json` to prevent 404 errors on shared links.  

🔗 **Live App:**  
[https://2d-editor-canvas-3prsn0lnb-akshatnykz20-gmailcoms-projects.vercel.app/canvas/74o371smtvbehntdqrz3ds](https://2d-editor-canvas-3prsn0lnb-akshatnykz20-gmailcoms-projects.vercel.app?_vercel_share=PFHLZzllFaM9TvJ28jDyeX6VBrNDKtGq)  

---

## 🏷 Tags  
`#React` `#FabricJS` `#Firebase` `#Vercel` `#CanvasEditor` `#RealTimeCollaboration` `#WebApp`  

---

# Velozity Project Management

A high-performance project management dashboard specifically architected to demonstrate advanced React performance optimizations. Features custom virtual scrolling implementations, 0-dependency native Drag-and-Drop algorithms, URL synced state persistence, and a real-time Mock Collaboration tracking framework.

## 🚀 Setup & Execution 

```bash
# Install Dependencies
npm install

# Start Local Dev Environment
npm run dev

# Construct Production Build
npm run build
```

## ✨ Architecture Highlights

### State Management Pipeline
**Redux Toolkit** natively controls the Global Document Context. It was selected because centralizing data normalization inside a strict framework allows elements like our simulated WebSockets and custom hook filtering arrays to securely process high-volume changes without choking React renders. Cross-component updates immediately synchronize globally without nested prop drills.

### Custom Virtual Scrolling Engine
Created an independent DOM rendering solution utilizing absolute positioning locked behind CSS transforms (`translateY`). Our generic logic precisely calculates vertical array chunks from exact `scrollTop` boundaries bounding mathematical limits with 5 visual render `BUFFERS` overlapping. This keeps memory signatures identically constrained whether sorting 500 tasks or 5,000 tasks inside `ListView.tsx`.

### Drag-and-Drop Abstraction
Strict 0-dependency methodology directly attaching `mousedown` & `touchstart` bounds mathematically off a single unified custom coordinate system. Built to safely decouple cloned DOM elements while running an intelligent `data-status` resolver using HTML bounding collisions to dynamically highlight and transition Task Cards without generic grid libraries. 

*(Achieves >90+ Desktop Lighthouse constraints strictly because DOM node weight never shifts!)*

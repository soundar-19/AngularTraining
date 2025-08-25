# 🎮 TETRIS ULTRA - Modern Edition

<div align="center">

![Tetris Ultra Logo](images/image-3.png)

[![Live Demo](https://img.shields.io/badge/🎮_Live_Demo-Play_Now-7c3aed?style=for-the-badge&logo=gamepad)](https://soundar-19.github.io/AngularTraining/Project2/Game/index.html)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

**🚀 Experience the classic Tetris game reimagined with ultra-modern UI, stunning visual effects, and professional-grade features!**

</div>

---

## 📸 Game Screenshots

<div align="center">

### 🎯 Main Game Interface
![Main Game Interface](images/image-5.png)

### GamePlay Interface
![GamePlay](images/image.png)

### Game Over Screen
![Game Over Screen](images/image-6.png)

### Game Controls
![Game Controls](images/image-4.png)

### 🏆 Achievement System
![Achievement System](images/image-2.png)

### ⚙️ Settings Panel
![Settings Panel](images/image-1.png)

</div>

---

## ✨ Key Features

<div align="center">

```mermaid
mindmap
  root((🎮 TETRIS ULTRA))
    🎯 Core Gameplay
      Classic Tetris Mechanics
      7 Unique Piece Types
      Line Clearing System
      Progressive Difficulty
    🎨 Visual Excellence
      Ultra-Modern UI Design
      Gradient Animations
      Particle Effects
      Screen Shake Effects
      Starfield Background
    🎵 Audio Experience
      Dynamic Sound Effects
      Background Music
      Volume Controls
      Mute Options
    🏆 Achievement System
      5 Unique Achievements
      Progress Tracking
      Unlock Notifications
      Visual Indicators
    📊 Advanced Statistics
      Real-time PPS Tracking
      APM Calculation
      Combo System
      Level Progression
    ⚙️ Customization
      Multiple Themes
      Ghost Piece Toggle
      Grid Lines Control
      Particle Effects Toggle
```

</div>

---

## 🎮 Game Flow Architecture

<div align="center">

```mermaid
flowchart TD
    A[🎮 Game Start] --> B{🎯 Initialize Game}
    B --> C[📋 Load Configuration]
    C --> D[🎨 Setup UI Components]
    D --> E[🎵 Initialize Audio]
    E --> F[⚡ Start Game Loop]
    
    F --> G{🎮 Game State}
    G -->|Playing| H[🔄 Update Game Logic]
    G -->|Paused| I[⏸️ Pause Overlay]
    G -->|Game Over| J[💀 Game Over Screen]
    
    H --> K[🎯 Spawn New Piece]
    K --> L[⬇️ Handle Piece Movement]
    L --> M{🔍 Check Collision}
    M -->|No Collision| N[📍 Update Position]
    M -->|Collision| O[🔒 Lock Piece]
    
    O --> P{📏 Check Lines}
    P -->|Lines Found| Q[💥 Clear Lines]
    P -->|No Lines| R[📊 Update Stats]
    
    Q --> S[🎊 Particle Effects]
    S --> T[🏆 Check Achievements]
    T --> U[📈 Update Score]
    U --> R
    
    R --> V{🎯 Continue?}
    V -->|Yes| K
    V -->|No| J
    
    I --> W[⏯️ Resume Game]
    W --> H
    
    J --> X[📊 Show Final Stats]
    X --> Y[💾 Save High Scores]
    Y --> Z[🔄 Restart Option]
    Z --> A
    
    style A fill:#7c3aed,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style F fill:#ec4899,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style Q fill:#00ff00,stroke:#ffffff,stroke-width:2px,color:#000000
    style J fill:#ff0000,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style T fill:#ffd700,stroke:#000000,stroke-width:2px,color:#000000
```

</div>

---

## 🎯 Core Game Mechanics

### 🧩 Tetris Pieces (Tetrominoes)

<div align="center">

| Piece | Shape | Color | Special Properties |
|-------|-------|-------|-------------------|
| **I** | `████` | 🟦 **Cyan** `#00ffff` | Line piece - Creates Tetris |
| **O** | `██`<br>`██` | 🟨 **Yellow** `#ffff00` | Square - No rotation |
| **T** | `▄█▄`<br>`███` | 🟪 **Magenta** `#ff00ff` | T-spin capable |
| **S** | `▄██`<br>`██▄` | 🟩 **Green** `#00ff00` | S-shaped |
| **Z** | `██▄`<br>`▄██` | 🟥 **Red** `#ff0044` | Z-shaped |
| **J** | `█▄▄`<br>`███` | 🔵 **Blue** `#0088ff` | J-shaped |
| **L** | `▄▄█`<br>`███` | 🟧 **Orange** `#ff8800` | L-shaped |

</div>

### 🎯 Scoring System

```mermaid
graph LR
    A[Single Line] -->|40 × Level| B[40-400 Points]
    C[Double Lines] -->|100 × Level| D[100-1000 Points]
    E[Triple Lines] -->|300 × Level| F[300-3000 Points]
    G[Tetris - 4 Lines] -->|1200 × Level| H[1200-12000 Points]
    I[Combo Multiplier] -->|×1.1 per combo| J[Bonus Points]
    
    style A fill:#06b6d4,stroke:#ffffff,stroke-width:2px,color:#000000
    style B fill:#0891b2,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style C fill:#10b981,stroke:#ffffff,stroke-width:2px,color:#000000
    style D fill:#059669,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style E fill:#f59e0b,stroke:#000000,stroke-width:2px,color:#000000
    style F fill:#d97706,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style G fill:#ffd700,stroke:#000000,stroke-width:3px,color:#000000
    style H fill:#ffd700,stroke:#000000,stroke-width:3px,color:#000000
    style I fill:#ec4899,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style J fill:#f472b6,stroke:#ffffff,stroke-width:2px,color:#000000
```

---

## 🎮 Controls & Gameplay

<div align="center">

### 🎯 Movement Controls
| Key | Action | Description |
|-----|--------|-------------|
| `←` `→` | **Move** | Move piece left/right |
| `↓` | **Soft Drop** | Accelerate piece downward |
| `↑` | **Rotate CW** | Rotate piece clockwise |
| `Z` | **Rotate CCW** | Rotate piece counter-clockwise |
| `Space` | **Hard Drop** | Instantly drop piece |

### 🎮 Game Controls
| Key | Action | Description |
|-----|--------|-------------|
| `C` | **Hold** | Hold current piece for later |
| `Esc` | **Pause** | Pause/Resume game |
| `R` | **Restart** | Restart current game |
| `F11` | **Fullscreen** | Toggle fullscreen mode |

### ⚙️ Special Features
| Key | Action | Description |
|-----|--------|-------------|
| `G` | **Ghost Toggle** | Show/hide ghost piece |
| `T` | **Theme Cycle** | Change color themes |
| `M` | **Mute** | Toggle audio on/off |

</div>

---

## 🏆 Achievement System

<div align="center">

```mermaid
graph TD
    A[🎯 First Tetris] --> A1[Clear 4 lines at once]
    B[🔥 Combo Master] --> B1[Achieve 5+ combo chain]
    C[🚀 Speed Demon] --> C1[Reach Level 10+]
    D[🏃 Marathon] --> D1[Play for 10+ minutes]
    E[💎 Perfectionist] --> E1[No single line clears in a game]
    
    A1 --> F[🏆 Achievement Unlocked!]
    B1 --> F
    C1 --> F
    D1 --> F
    E1 --> F
    
    style A fill:#4ade80,stroke:#ffffff,stroke-width:2px,color:#000000
    style B fill:#f59e0b,stroke:#ffffff,stroke-width:2px,color:#000000
    style C fill:#ef4444,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style D fill:#8b5cf6,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style E fill:#06b6d4,stroke:#ffffff,stroke-width:2px,color:#000000
    style F fill:#ffd700,stroke:#000000,stroke-width:3px,color:#000000
```

</div>

---

## 📊 Advanced Statistics

### 📈 Real-time Metrics

<div align="center">

| Metric | Description | Calculation |
|--------|-------------|-------------|
| **PPS** | Pieces Per Second | `Total Pieces ÷ Game Time` |
| **APM** | Actions Per Minute | `Total Actions ÷ (Game Time ÷ 60)` |
| **Combo** | Consecutive Line Clears | `Lines cleared without gaps` |
| **Level** | Current Difficulty | `Lines ÷ 10 + 1` |
| **Efficiency** | Lines per Piece | `Total Lines ÷ Total Pieces` |

</div>

### 🎯 Performance Tracking

```mermaid
graph LR
    A[Game Start] --> B[Track Actions]
    B --> C[Calculate PPS]
    B --> D[Calculate APM]
    B --> E[Monitor Combos]
    
    C --> F[Real-time Display]
    D --> F
    E --> F
    
    F --> G[Performance Analysis]
    G --> H[Skill Improvement]
    
    style A fill:#ec4899,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style B fill:#a855f7,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style C fill:#06b6d4,stroke:#ffffff,stroke-width:2px,color:#000000
    style D fill:#10b981,stroke:#ffffff,stroke-width:2px,color:#000000
    style E fill:#f59e0b,stroke:#000000,stroke-width:2px,color:#000000
    style F fill:#7c3aed,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style G fill:#8b5cf6,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style H fill:#00ff00,stroke:#ffffff,stroke-width:2px,color:#000000
```

---

## 🎨 Visual Features

### ✨ Modern UI Elements

- **🌟 Gradient Animations** - Smooth color transitions
- **💫 Particle Effects** - Dynamic visual feedback
- **🌌 Starfield Background** - Animated cosmic atmosphere
- **📱 Responsive Design** - Works on all screen sizes
- **🎭 Multiple Themes** - Customizable color schemes
- **👻 Ghost Piece** - Preview piece placement
- **📊 Progress Bars** - Visual level progression
- **🔥 Screen Shake** - Impact feedback effects

### 🎨 Theme System

```mermaid
graph TD
    A[🎨 Theme Engine] --> B[Classic Theme]
    A --> C[Neon Theme]
    A --> D[Retro Theme]
    A --> E[Cosmic Theme]
    
    B --> F[Traditional Colors]
    C --> G[Bright Neon Colors]
    D --> H[8-bit Style Colors]
    E --> I[Space-inspired Colors]
    
    style A fill:#7c3aed,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style B fill:#8b5cf6,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style C fill:#a855f7,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style D fill:#ec4899,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style E fill:#06b6d4,stroke:#ffffff,stroke-width:2px,color:#000000
    style F fill:#ffff00,stroke:#000000,stroke-width:2px,color:#000000
    style G fill:#00ff00,stroke:#000000,stroke-width:2px,color:#000000
    style H fill:#ff8800,stroke:#000000,stroke-width:2px,color:#000000
    style I fill:#00ffff,stroke:#000000,stroke-width:2px,color:#000000
```

---

## ⚙️ Technical Architecture

### 🏗️ System Architecture

<div align="center">

```mermaid
graph TB
    A[🎮 Tetris Game Engine] --> B[🎯 Game Logic Layer]
    A --> C[🎨 Rendering Engine]
    A --> D[🎵 Audio Manager]
    A --> E[📊 Statistics Tracker]
    A --> F[💾 Data Persistence]
    
    B --> B1[Piece Movement]
    B --> B2[Collision Detection]
    B --> B3[Line Clearing]
    B --> B4[Level Progression]
    
    C --> C1[Canvas Rendering]
    C --> C2[UI Components]
    C --> C3[Particle System]
    C --> C4[Animation Engine]
    
    D --> D1[Sound Effects]
    D --> D2[Background Music]
    D --> D3[Volume Control]
    
    E --> E1[Score Calculation]
    E --> E2[Performance Metrics]
    E --> E3[Achievement Tracking]
    
    F --> F1[High Scores]
    F --> F2[Settings]
    F --> F3[Achievement Data]
    
    style A fill:#7c3aed,stroke:#ffffff,stroke-width:3px,color:#ffffff
    style B fill:#ec4899,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style C fill:#06b6d4,stroke:#ffffff,stroke-width:2px,color:#000000
    style D fill:#10b981,stroke:#ffffff,stroke-width:2px,color:#000000
    style E fill:#f59e0b,stroke:#000000,stroke-width:2px,color:#000000
    style F fill:#8b5cf6,stroke:#ffffff,stroke-width:2px,color:#ffffff
```

</div>

### 📁 File Structure

```
📁 Tetris Ultra/
├── 📄 index.html          # Main HTML structure
├── 📄 app.ts             # Core game logic (TypeScript)
├── 📄 app.js             # Compiled JavaScript
├── 📄 styles.css         # Modern CSS styling
├── 📄 config.json        # Game configuration
└── 📄 README.md          # This documentation
```

### 🔧 Technologies Used

<div align="center">

| Technology | Purpose | Version |
|------------|---------|---------|
| **TypeScript** | Core game logic | Latest |
| **HTML5 Canvas** | Game rendering | Native |
| **CSS3** | Modern UI styling | Latest |
| **Web Audio API** | Sound effects | Native |
| **Local Storage** | Data persistence | Native |
| **Font Awesome** | Icon library | 6.4.0 |
| **Google Fonts** | Typography | Inter |

</div>

---

## 🚀 Getting Started

### 📋 Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Audio support (optional)

### 🎮 Quick Start

1. **🌐 Online Play**: [Click here to play instantly](https://soundar-19.github.io/AngularTraining/Project2/Game/index.html)

2. **💻 Local Setup**:
   ```bash
   # Clone or download the repository
   git clone <repository-url>
   
   # Navigate to game directory
   cd Game
   
   # Open in browser
   open index.html
   ```

3. **🎯 Start Playing**:
   - Use arrow keys to move pieces
   - Press Space for hard drop
   - Press C to hold pieces
   - Press Esc to pause

---

## 🎯 Game Modes & Features

### 🎮 Core Gameplay Features

<div align="center">

```mermaid
graph LR
    A[🎯 Standard Mode] --> B[Classic Tetris Rules]
    C[👻 Ghost Piece] --> D[Preview Placement]
    E[🔄 Hold System] --> F[Store Piece for Later]
    G[📊 Next Queue] --> H[See Upcoming Pieces]
    I[🏆 Achievements] --> J[Unlock Rewards]
    K[📈 Statistics] --> L[Track Performance]
    
    style A fill:#7c3aed,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style B fill:#8b5cf6,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style C fill:#a855f7,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style D fill:#c084fc,stroke:#ffffff,stroke-width:2px,color:#000000
    style E fill:#ec4899,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style F fill:#f472b6,stroke:#ffffff,stroke-width:2px,color:#000000
    style G fill:#06b6d4,stroke:#ffffff,stroke-width:2px,color:#000000
    style H fill:#0891b2,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style I fill:#ffd700,stroke:#000000,stroke-width:2px,color:#000000
    style J fill:#f59e0b,stroke:#000000,stroke-width:2px,color:#000000
    style K fill:#10b981,stroke:#ffffff,stroke-width:2px,color:#000000
    style L fill:#059669,stroke:#ffffff,stroke-width:2px,color:#ffffff
```

</div>

### ⚙️ Customization Options

- **🎨 Visual Settings**:
  - Ghost piece visibility
  - Grid lines toggle
  - Particle effects control
  - Screen shake intensity

- **🎵 Audio Settings**:
  - Sound effects volume
  - Background music control
  - Mute options

- **🎮 Gameplay Settings**:
  - Auto-repeat rate
  - Drop speed adjustment
  - Control sensitivity

---

## 📱 Responsive Design

### 📐 Screen Compatibility

<div align="center">

| Device Type | Screen Size | Layout |
|-------------|-------------|--------|
| **🖥️ Desktop** | 1200px+ | Full 3-column layout |
| **💻 Laptop** | 768px - 1199px | Responsive grid |
| **📱 Tablet** | 480px - 767px | Stacked layout |
| **📱 Mobile** | < 480px | Single column |

</div>

### 🎯 Adaptive Features

```mermaid
graph TD
    A[📱 Device Detection] --> B{Screen Size}
    B -->|Desktop| C[🖥️ Full Layout]
    B -->|Tablet| D[📱 Compact Layout]
    B -->|Mobile| E[📱 Mobile Layout]
    
    C --> F[3-Column Dashboard]
    D --> G[Responsive Grid]
    E --> H[Single Column Stack]
    
    F --> I[🎮 Optimal Experience]
    G --> I
    H --> I
    
    style A fill:#7c3aed,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style B fill:#a855f7,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style C fill:#ec4899,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style D fill:#f472b6,stroke:#ffffff,stroke-width:2px,color:#000000
    style E fill:#06b6d4,stroke:#ffffff,stroke-width:2px,color:#000000
    style F fill:#10b981,stroke:#ffffff,stroke-width:2px,color:#000000
    style G fill:#f59e0b,stroke:#000000,stroke-width:2px,color:#000000
    style H fill:#8b5cf6,stroke:#ffffff,stroke-width:2px,color:#ffffff
    style I fill:#00ff00,stroke:#ffffff,stroke-width:2px,color:#000000
```

---

## 🏆 High Scores & Leaderboard

### 📊 Score Tracking System

- **🥇 Top 5 High Scores** - Local leaderboard
- **📈 Personal Best Tracking** - Individual records
- **🎯 Session Statistics** - Current game metrics
- **💾 Persistent Storage** - Scores saved locally

### 🎯 Scoring Breakdown

```mermaid
pie title Score Distribution
    "Single Lines (40×)" : 20
    "Double Lines (100×)" : 25
    "Triple Lines (300×)" : 30
    "Tetris (1200×)" : 25
```

---

## 🎵 Audio Experience

### 🔊 Sound Design

<div align="center">

| Sound Effect | Trigger | Purpose |
|--------------|---------|---------|
| **🎵 Background Music** | Game start | Ambient atmosphere |
| **💥 Line Clear** | Lines cleared | Success feedback |
| **🔒 Piece Lock** | Piece placement | Action confirmation |
| **🎯 Level Up** | Level increase | Achievement sound |
| **🏆 Achievement** | Unlock earned | Reward notification |

</div>

### 🎛️ Audio Controls

- **🔊 Master Volume** - Overall audio level
- **🎵 Music Toggle** - Background music on/off
- **🔇 Mute All** - Quick silence option
- **⚙️ Individual Controls** - Per-effect volume

---

## 🛠️ Development & Customization

### 🔧 Configuration Options

The game uses `config.json` for easy customization:

```json
{
  "gameSettings": {
    "boardWidth": 10,
    "boardHeight": 20,
    "blockSize": 40,
    "dropSpeed": 500,
    "speedIncrease": 50,
    "linesPerLevel": 10
  },
  "colors": {
    "I": "#00ffff",
    "O": "#ffff00",
    "T": "#ff00ff"
  }
}
```

### 🎨 Theme Customization

Create custom themes by modifying the color schemes in the TypeScript code:

```typescript
themes = [
  { /* Classic Theme */ },
  { /* Neon Theme */ },
  { /* Custom Theme */ }
];
```

---

## 🐛 Troubleshooting

### ❓ Common Issues

<div align="center">

| Issue | Solution |
|-------|----------|
| **🎮 Game not loading** | Check JavaScript is enabled |
| **🔇 No sound** | Verify audio permissions |
| **📱 Mobile controls** | Use touch-friendly interface |
| **💾 Scores not saving** | Check local storage permissions |

</div>

### 🔧 Performance Tips

- **🖥️ Use modern browser** for best performance
- **🔊 Disable audio** if experiencing lag
- **📱 Close other tabs** on mobile devices
- **⚡ Enable hardware acceleration** in browser

---

## 👨‍💻 Author

<div align="center">

**Soundar Raja B**

*Game Developer & Software Engineer*

</div>

---

<div align="center">

## 🎮 Ready to Play?

[![Play Now](https://img.shields.io/badge/🎮_PLAY_NOW-Click_Here-7c3aed?style=for-the-badge&logo=gamepad&logoColor=white)](https://soundar-19.github.io/AngularTraining/Project2/Game/index.html)

**Experience the ultimate Tetris game with modern features and stunning visuals!**

---

*Made By Soundar Raja B*

</div>
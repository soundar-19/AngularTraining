interface GameConfig {
  gameSettings: {
    boardWidth: number;
    boardHeight: number;
    blockSize: number;
    dropSpeed: number;
    speedIncrease: number;
    linesPerLevel: number;
  };
  colors: { [key: string]: string };
  pieces: { [key: string]: number[][] };
}

class TetrisGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private holdCanvas: HTMLCanvasElement;
  private holdCtx: CanvasRenderingContext2D;
  private nextCanvases: HTMLCanvasElement[] = [];
  private nextCtxs: CanvasRenderingContext2D[] = [];
  private config: GameConfig;
  private board: string[][];
  private currentPiece: { shape: number[][], x: number, y: number, type: string, rotation: number } | null = null;
  private nextPieces: string[] = [];
  private holdPiece: string = '';
  private canHold = true;
  private score = 0;
  private level = 1;
  private lines = 0;
  private combo = 0;
  private totalPieces = 0;
  private actions = 0;
  private dropTime = 0;
  private lastTime = 0;
  private gameStartTime = 0;
  private gameEndTime = 0;
  private isPaused = false;
  private isGameOver = false;
  private highScores: number[] = [0, 0, 0, 0, 0];
  private achievements = {
    tetris: false,
    combo: false,
    speed: false,
    marathon: false,
    perfectionist: false
  };
  private settings = {
    ghostPiece: true,
    gridLines: true,
    particles: true,
    soundFx: true,
    screenShake: true,
    autoRepeat: 100,
    dropSpeed: 5,
    musicVolume: 50
  };
  private particles: any[] = [];
  private screenShake = 0;
  private singleLinesThisGame = 0;
  private currentTheme = 0;
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private backgroundMusic: HTMLAudioElement | null = null;
  private currentMusicTrack = 0;
  private musicTracks = ['sounds/Background.mp3', 'sounds/Background2.mp3'];
  private gameStarted = false;
  private themes = [
    {
      I: '#00bcd4', O: '#ffeb3b', T: '#9c27b0', S: '#4caf50',
      Z: '#f44336', J: '#2196f3', L: '#ff9800'
    },
    {
      I: '#e91e63', O: '#00e676', T: '#3f51b5', S: '#ffeb3b',
      Z: '#ff5722', J: '#009688', L: '#795548'
    },
    {
      I: '#673ab7', O: '#ff9800', T: '#4caf50', S: '#2196f3',
      Z: '#e91e63', J: '#00bcd4', L: '#ffc107'
    }
  ];

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.holdCanvas = document.getElementById('holdCanvas') as HTMLCanvasElement;
    this.holdCtx = this.holdCanvas.getContext('2d')!;
    
    for (let i = 1; i <= 5; i++) {
      const canvas = document.getElementById('next' + i + 'Canvas') as HTMLCanvasElement;
      if (canvas) {
        this.nextCanvases.push(canvas);
        this.nextCtxs.push(canvas.getContext('2d')!);
      }
    }
    
    this.board = this.createBoard();
    this.loadData();
    this.loadSounds();
    this.loadConfig();
  }

  private createBoard(): string[][] {
    const board: string[][] = [];
    for (let i = 0; i < 20; i++) {
      const row: string[] = [];
      for (let j = 0; j < 10; j++) {
        row.push('');
      }
      board.push(row);
    }
    return board;
  }

  private loadConfig(): void {
    fetch('config.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then(config => {
        this.config = config;
        this.config.colors = this.themes[this.currentTheme];
        this.canvas.width = this.config.gameSettings.boardWidth * this.config.gameSettings.blockSize;
        this.canvas.height = this.config.gameSettings.boardHeight * this.config.gameSettings.blockSize;
        this.init();
      })
      .catch(error => {
        console.error('Failed to load config:', error);
        this.config = {
          gameSettings: { boardWidth: 10, boardHeight: 20, blockSize: 40, dropSpeed: 500, speedIncrease: 50, linesPerLevel: 10 },
          colors: this.themes[this.currentTheme],
          pieces: {
            I: [[1, 1, 1, 1]], O: [[1, 1], [1, 1]], T: [[0, 1, 0], [1, 1, 1]],
            S: [[0, 1, 1], [1, 1, 0]], Z: [[1, 1, 0], [0, 1, 1]],
            J: [[1, 0, 0], [1, 1, 1]], L: [[0, 0, 1], [1, 1, 1]]
          }
        };
        this.canvas.width = this.config.gameSettings.boardWidth * this.config.gameSettings.blockSize;
        this.canvas.height = this.config.gameSettings.boardHeight * this.config.gameSettings.blockSize;
        this.init();
      });
  }

  private loadData(): void {
    try {
      const savedScores = localStorage.getItem('tetris-pro-scores');
      if (savedScores) {
        this.highScores = JSON.parse(savedScores);
      }
    } catch (error) {
      console.error('Failed to load scores:', error);
    }
    
    try {
      const savedAchievements = localStorage.getItem('tetris-pro-achievements');
      if (savedAchievements) {
        this.achievements = JSON.parse(savedAchievements);
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }
    
    try {
      const savedSettings = localStorage.getItem('tetris-pro-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        this.settings = {
          ghostPiece: parsed.ghostPiece ?? this.settings.ghostPiece,
          gridLines: parsed.gridLines ?? this.settings.gridLines,
          particles: parsed.particles ?? this.settings.particles,
          soundFx: parsed.soundFx ?? this.settings.soundFx,
          screenShake: parsed.screenShake ?? this.settings.screenShake,
          autoRepeat: parsed.autoRepeat ?? this.settings.autoRepeat,
          dropSpeed: parsed.dropSpeed ?? this.settings.dropSpeed,
          musicVolume: parsed.musicVolume ?? this.settings.musicVolume
        };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    
    this.updateHighScoreDisplay();
    this.updateAchievementDisplay();
    this.updateSettingsDisplay();
  }

  private loadSounds(): void {
    const soundFiles = {
      lineClear: 'sounds/LineClear.mp3',
      levelUp: 'sounds/level-up-05-326133.mp3',
      gameOver: 'sounds/game-over-arcade-6435.mp3',
      click: 'sounds/pause_resume.mp3',
      rotate: 'sounds/rotate.mp3',
      drop: 'sounds/Drop sound.mp3',
      achievement: 'sounds/game-bonus-02-294436.mp3'
    };

    Object.keys(soundFiles).forEach(key => {
      this.sounds[key] = new Audio(soundFiles[key as keyof typeof soundFiles]);
      this.sounds[key].volume = 0.3;
    });

    this.backgroundMusic = new Audio(this.musicTracks[this.currentMusicTrack]);
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 1.0;
  }

  private playSound(soundName: string): void {
    if (this.settings.soundFx && this.sounds[soundName]) {
      this.sounds[soundName].currentTime = 0;
      this.sounds[soundName].play().catch(() => {});
    }
  }

  private playBackgroundMusic(): void {
    if (this.backgroundMusic && this.settings.soundFx) {
      this.backgroundMusic.play().catch(() => {});
    }
  }

  private stopBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  private switchMusicTrack(): void {
    const wasPlaying = this.backgroundMusic && !this.backgroundMusic.paused;
    this.stopBackgroundMusic();
    this.currentMusicTrack = (this.currentMusicTrack + 1) % this.musicTracks.length;
    this.backgroundMusic = new Audio(this.musicTracks[this.currentMusicTrack]);
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = this.settings.musicVolume / 100 * 1.0;
    if (wasPlaying && this.settings.soundFx) {
      this.playBackgroundMusic();
    }
    this.playSound('click');
  }

  private saveData(): void {
    localStorage.setItem('tetris-pro-scores', JSON.stringify(this.highScores));
    localStorage.setItem('tetris-pro-achievements', JSON.stringify(this.achievements));
    localStorage.setItem('tetris-pro-settings', JSON.stringify(this.settings));
  }

  private updateHighScoreDisplay(): void {
    for (let i = 0; i < 5; i++) {
      const element = document.getElementById('highScore' + (i + 1));
      if (element) {
        element.textContent = this.highScores[i].toLocaleString();
      }
    }
  }

  private updateHighScores(): void {
    this.highScores.push(this.score);
    this.highScores.sort((a, b) => b - a);
    this.highScores = this.highScores.slice(0, 5);
    this.updateHighScoreDisplay();
  }

  private init(): void {
    this.setupControls();
    this.setupButtons();
    this.canvas.style.cursor = 'pointer';
    this.gameLoop(0); // Start the game loop to show start screen
  }

  private startGame(): void {
    this.gameStarted = true;
    this.isGameOver = false;
    this.isPaused = false;
    
    // Reset game state
    this.board = this.createBoard();
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.combo = 0;
    this.totalPieces = 0;
    this.actions = 0;
    this.holdPiece = '';
    this.canHold = true;
    this.nextPieces = [];
    this.dropTime = 0;
    this.particles = [];
    this.screenShake = 0;
    this.singleLinesThisGame = 0;
    
    this.playSound('click');
    this.playBackgroundMusic();
    this.generateNextPieces();
    this.spawnPiece();
    this.gameStartTime = Date.now();
    this.canvas.style.cursor = 'default';
    
    // Update UI
    this.updateUI();
    this.drawHoldPiece();
    
    const statusIndicator = document.getElementById('statusIndicator')!;
    statusIndicator.className = 'status-indicator playing';
    statusIndicator.innerHTML = '<i class="fas fa-play"></i> PLAYING';
    
    this.hideOverlay();
  }

  private drawStartScreen(): void {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.isGameOver) {
      // Background overlay
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Game Over title with glow
      this.ctx.shadowColor = '#ff4444';
      this.ctx.shadowBlur = 20;
      this.ctx.fillStyle = '#ff4444';
      this.ctx.font = 'bold 42px Inter';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 100);
      this.ctx.shadowBlur = 0;
      
      // Stats box background
      this.ctx.fillStyle = 'rgba(79, 70, 229, 0.2)';
      this.ctx.strokeStyle = '#4f46e5';
      this.ctx.lineWidth = 2;
      const boxWidth = 280;
      const boxHeight = 120;
      const boxX = this.canvas.width / 2 - boxWidth / 2;
      const boxY = this.canvas.height / 2 - 60;
      this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
      this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
      
      // Stats text
      const gameTime = Math.floor((this.gameEndTime - this.gameStartTime) / 1000);
      const pps = this.totalPieces / Math.max(gameTime, 1);
      const apm = Math.floor(this.actions / Math.max(gameTime / 60, 1/60));
      
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 18px Inter';
      this.ctx.fillText('FINAL SCORE: ' + this.score.toLocaleString(), this.canvas.width / 2, boxY + 25);
      
      this.ctx.font = '14px Inter';
      this.ctx.fillStyle = '#d1d5db';
      this.ctx.fillText('Lines: ' + this.lines + '  •  Level: ' + this.level, this.canvas.width / 2, boxY + 50);
      this.ctx.fillText('Time: ' + this.formatTime(gameTime) + '  •  PPS: ' + pps.toFixed(1), this.canvas.width / 2, boxY + 70);
      this.ctx.fillText('APM: ' + apm, this.canvas.width / 2, boxY + 90);
      
      // Restart button with glow
      this.ctx.shadowColor = '#ec4899';
      this.ctx.shadowBlur = 15;
      this.ctx.fillStyle = '#ec4899';
      this.ctx.font = 'bold 24px Inter';
      this.ctx.fillText('RESTART', this.canvas.width / 2, this.canvas.height / 2 + 100);
      this.ctx.shadowBlur = 0;
    } else {
      this.ctx.fillStyle = '#a855f7';
      this.ctx.font = 'bold 48px Inter';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('TETRIS ULTRA', this.canvas.width / 2, this.canvas.height / 2 - 50);
      
      this.ctx.fillStyle = '#ec4899';
      this.ctx.font = 'bold 24px Inter';
      this.ctx.fillText('Click to Start', this.canvas.width / 2, this.canvas.height / 2 + 20);
    }
  }

  private setupButtons(): void {
    document.getElementById('pauseBtn')!.addEventListener('click', () => { this.playSound('click'); this.togglePause(); });
    


    document.getElementById('settingsBtn')!.addEventListener('click', () => { this.playSound('click'); this.showSettings(); });
    document.getElementById('closeSettings')!.addEventListener('click', () => { this.playSound('click'); this.hideSettings(); });
    document.getElementById('fullscreenBtn')!.addEventListener('click', () => { this.playSound('click'); this.toggleFullscreen(); });
    
    // Controls footer toggle
    document.getElementById('controlsToggle')!.addEventListener('click', () => {
      this.playSound('click');
      const footer = document.getElementById('controlsFooter')!;
      const toggle = document.getElementById('controlsToggle')!;
      footer.classList.toggle('collapsed');
      toggle.innerHTML = footer.classList.contains('collapsed') ? 
        '<i class="fas fa-keyboard"></i> Show Controls' : 
        '<i class="fas fa-keyboard"></i> Hide Controls';
    });
    
    // Focus mode toggle
    document.getElementById('focusBtn')!.addEventListener('click', () => {
      this.playSound('click');
      document.body.classList.toggle('focus-mode');
      const focusBtn = document.getElementById('focusBtn')!;
      focusBtn.innerHTML = document.body.classList.contains('focus-mode') ?
        '<i class="fas fa-eye-slash"></i> EXIT FOCUS' :
        '<i class="fas fa-eye"></i> FOCUS';
    });
    

    
    // Canvas click to start/restart
    this.canvas.addEventListener('click', (e) => {
      e.preventDefault();
      this.startGame();
    });
    
    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.startGame();
    });
    
    // Music toggle button
    document.getElementById('musicToggle')!.addEventListener('click', () => {
      this.switchMusicTrack();
    });
    
    // Settings event listeners
    document.getElementById('ghostPiece')!.addEventListener('change', (e) => {
      this.settings.ghostPiece = (e.target as HTMLInputElement).checked;
      this.saveData();
    });
    
    document.getElementById('gridLines')!.addEventListener('change', (e) => {
      this.settings.gridLines = (e.target as HTMLInputElement).checked;
      this.saveData();
    });
    
    document.getElementById('particles')!.addEventListener('change', (e) => {
      this.settings.particles = (e.target as HTMLInputElement).checked;
      this.saveData();
    });
    
    document.getElementById('soundFx')!.addEventListener('change', (e) => {
      this.settings.soundFx = (e.target as HTMLInputElement).checked;
      this.saveData();
    });
    
    document.getElementById('screenShake')!.addEventListener('change', (e) => {
      this.settings.screenShake = (e.target as HTMLInputElement).checked;
      this.saveData();
    });
    
    document.getElementById('autoRepeat')!.addEventListener('input', (e) => {
      this.settings.autoRepeat = parseInt((e.target as HTMLInputElement).value);
      this.saveData();
    });
    
    document.getElementById('dropSpeed')!.addEventListener('input', (e) => {
      this.settings.dropSpeed = parseInt((e.target as HTMLInputElement).value);
      this.saveData();
    });
    
    document.getElementById('musicVolume')!.addEventListener('input', (e) => {
      this.settings.musicVolume = parseInt((e.target as HTMLInputElement).value);
      if (this.backgroundMusic) {
        this.backgroundMusic.volume = this.settings.musicVolume / 100 * 1.0;
      }
      this.saveData();
    });
  }

  private setupControls(): void {
    document.addEventListener('keydown', (e) => {
      
      this.actions++;
      
      switch (e.code) {
        case 'ArrowLeft':
          if (!this.isPaused) this.movePiece(-1, 0);
          break;
        case 'ArrowRight':
          if (!this.isPaused) this.movePiece(1, 0);
          break;
        case 'ArrowDown':
          if (!this.isPaused) this.movePiece(0, 1);
          break;
        case 'ArrowUp':
          if (!this.isPaused) {
            this.rotatePiece(1);
            this.playSound('rotate');
          }
          break;
        case 'Space':
          if (!this.isPaused) {
            e.preventDefault();
            this.hardDrop();
          }
          break;
        case 'Escape':
          this.togglePause();
          this.playSound('click');
          break;
        case 'KeyR':
          if (this.isGameOver || !this.gameStarted) {
            this.startGame();
          } else {
            this.restart();
          }
          break;
        case 'KeyC':
          if (!this.isPaused) this.holdCurrentPiece();
          break;
        case 'KeyZ':
          if (!this.isPaused) {
            this.rotatePiece(-1);
            this.playSound('rotate');
          }
          break;
        case 'KeyG':
          this.settings.ghostPiece = !this.settings.ghostPiece;
          this.updateSettingsDisplay();
          this.saveData();
          break;
        case 'KeyT':
          this.cycleTheme();
          break;
        case 'KeyM':
          this.settings.soundFx = !this.settings.soundFx;
          if (this.settings.soundFx) {
            this.playBackgroundMusic();
          } else {
            this.stopBackgroundMusic();
          }
          this.updateSettingsDisplay();
          this.saveData();
          break;
        case 'KeyN':
          this.switchMusicTrack();
          break;
        case 'F11':
          e.preventDefault();
          this.toggleFullscreen();
          break;
      }
    });
  }

  private generateNextPieces(): void {
    const pieces = Object.keys(this.config.pieces);
    while (this.nextPieces.length < 5) {
      this.nextPieces.push(pieces[Math.floor(Math.random() * pieces.length)]);
    }
  }

  private spawnPiece(): void {
    if (this.nextPieces.length === 0) this.generateNextPieces();
    
    const pieceType = this.nextPieces.shift()!;
    this.currentPiece = {
      shape: this.config.pieces[pieceType],
      x: Math.floor(this.config.gameSettings.boardWidth / 2) - 1,
      y: 0,
      type: pieceType,
      rotation: 0
    };

    this.generateNextPieces();
    this.drawNextPieces();
    this.canHold = true;
    this.totalPieces++;

    if (this.checkCollision(this.currentPiece.shape, this.currentPiece.x, this.currentPiece.y)) {
      this.gameOver();
    }
  }

  private movePiece(dx: number, dy: number): void {
    if (!this.currentPiece) return;
    
    const newX = this.currentPiece.x + dx;
    const newY = this.currentPiece.y + dy;
    
    if (!this.checkCollision(this.currentPiece.shape, newX, newY)) {
      this.currentPiece.x = newX;
      this.currentPiece.y = newY;
    } else if (dy > 0) {
      this.placePiece();
    }
  }

  private rotatePiece(direction: number): void {
    if (!this.currentPiece) return;
    
    let rotated: number[][];
    if (direction === 1) {
      // Clockwise
      rotated = this.currentPiece.shape[0].map((_, i) =>
        this.currentPiece!.shape.map(row => row[i]).reverse()
      );
    } else {
      // Counter-clockwise
      rotated = this.currentPiece.shape[0].map((_, i) =>
        this.currentPiece!.shape.map(row => row[row.length - 1 - i])
      );
    }
    
    // Wall kick system
    const kicks = this.getWallKicks(this.currentPiece.rotation, this.currentPiece.rotation + direction, this.currentPiece.type);
    
    for (const kick of kicks) {
      if (!this.checkCollision(rotated, this.currentPiece.x + kick.x, this.currentPiece.y + kick.y)) {
        this.currentPiece.shape = rotated;
        this.currentPiece.x += kick.x;
        this.currentPiece.y += kick.y;
        this.currentPiece.rotation = (this.currentPiece.rotation + direction + 4) % 4;
        break;
      }
    }
  }

  private getWallKicks(fromRotation: number, toRotation: number, pieceType: string): {x: number, y: number}[] {
    // SRS (Super Rotation System) wall kicks
    if (pieceType === 'I') {
      // I-piece has special wall kicks
      const iKicks: {[key: string]: {x: number, y: number}[]} = {
        '0->1': [{x: 0, y: 0}, {x: -2, y: 0}, {x: 1, y: 0}, {x: -2, y: -1}, {x: 1, y: 2}],
        '1->0': [{x: 0, y: 0}, {x: 2, y: 0}, {x: -1, y: 0}, {x: 2, y: 1}, {x: -1, y: -2}],
        '1->2': [{x: 0, y: 0}, {x: -1, y: 0}, {x: 2, y: 0}, {x: -1, y: 2}, {x: 2, y: -1}],
        '2->1': [{x: 0, y: 0}, {x: 1, y: 0}, {x: -2, y: 0}, {x: 1, y: -2}, {x: -2, y: 1}],
        '2->3': [{x: 0, y: 0}, {x: 2, y: 0}, {x: -1, y: 0}, {x: 2, y: 1}, {x: -1, y: -2}],
        '3->2': [{x: 0, y: 0}, {x: -2, y: 0}, {x: 1, y: 0}, {x: -2, y: -1}, {x: 1, y: 2}],
        '3->0': [{x: 0, y: 0}, {x: 1, y: 0}, {x: -2, y: 0}, {x: 1, y: -2}, {x: -2, y: 1}],
        '0->3': [{x: 0, y: 0}, {x: -1, y: 0}, {x: 2, y: 0}, {x: -1, y: 2}, {x: 2, y: -1}]
      };
      const key = fromRotation + '->' + (toRotation % 4);
      return iKicks[key] || [{x: 0, y: 0}];
    } else if (pieceType === 'O') {
      // O-piece doesn't rotate
      return [{x: 0, y: 0}];
    } else {
      // Standard wall kicks for other pieces
      const standardKicks: {[key: string]: {x: number, y: number}[]} = {
        '0->1': [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: 1}, {x: 0, y: -2}, {x: -1, y: -2}],
        '1->0': [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0, y: 2}, {x: 1, y: 2}],
        '1->2': [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0, y: 2}, {x: 1, y: 2}],
        '2->1': [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: 1}, {x: 0, y: -2}, {x: -1, y: -2}],
        '2->3': [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: -2}, {x: 1, y: -2}],
        '3->2': [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: -1}, {x: 0, y: 2}, {x: -1, y: 2}],
        '3->0': [{x: 0, y: 0}, {x: -1, y: 0}, {x: -1, y: -1}, {x: 0, y: 2}, {x: -1, y: 2}],
        '0->3': [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: -2}, {x: 1, y: -2}]
      };
      const key = fromRotation + '->' + (toRotation % 4);
      return standardKicks[key] || [{x: 0, y: 0}];
    }
  }

  private holdCurrentPiece(): void {
    if (!this.currentPiece || !this.canHold) return;
    
    const currentType = this.currentPiece.type;
    
    if (this.holdPiece) {
      this.currentPiece = {
        shape: this.config.pieces[this.holdPiece],
        x: Math.floor(this.config.gameSettings.boardWidth / 2) - 1,
        y: 0,
        type: this.holdPiece,
        rotation: 0
      };
    } else {
      this.spawnPiece();
    }
    
    this.holdPiece = currentType;
    this.canHold = false;
    this.drawHoldPiece();
  }

  private hardDrop(): void {
    if (!this.currentPiece) return;
    
    let dropDistance = 0;
    while (!this.checkCollision(this.currentPiece.shape, this.currentPiece.x, this.currentPiece.y + 1) && 
           dropDistance < this.config.gameSettings.boardHeight) {
      this.currentPiece.y++;
      dropDistance++;
    }
    
    this.score += dropDistance * 2;
    this.placePiece();
    
    if (this.settings.particles) {
      this.createParticles(this.currentPiece.x, this.currentPiece.y);
    }
  }

  private checkCollision(shape: number[][], x: number, y: number): boolean {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newX = x + col;
          const newY = y + row;
          
          if (newX < 0 || newX >= this.config.gameSettings.boardWidth || 
              newY >= this.config.gameSettings.boardHeight ||
              (newY >= 0 && this.board[newY][newX])) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private placePiece(): void {
    if (!this.currentPiece) return;
    
    this.playSound('drop');
    
    for (let row = 0; row < this.currentPiece.shape.length; row++) {
      for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
        if (this.currentPiece.shape[row][col]) {
          const x = this.currentPiece.x + col;
          const y = this.currentPiece.y + row;
          if (y >= 0) {
            this.board[y][x] = this.currentPiece.type;
          }
        }
      }
    }
    
    this.clearLines();
    this.spawnPiece();
  }

  private clearLines(): void {
    let linesCleared = 0;
    const clearedRows: number[] = [];
    
    for (let row = this.config.gameSettings.boardHeight - 1; row >= 0; row--) {
      if (this.board[row].every(cell => cell !== '')) {
        clearedRows.push(row);
        this.board.splice(row, 1);
        const newRow: string[] = [];
        for (let i = 0; i < this.config.gameSettings.boardWidth; i++) {
          newRow.push('');
        }
        this.board.unshift(newRow);
        linesCleared++;
        row++;
      }
    }
    
    if (linesCleared > 0) {
      this.lines += linesCleared;
      this.playSound('lineClear');
      
      if (linesCleared === 1) this.singleLinesThisGame++;
      
      this.combo++;
      
      // Advanced scoring system
      let baseScore = 0;
      switch (linesCleared) {
        case 1: baseScore = 100; break;
        case 2: baseScore = 300; break;
        case 3: baseScore = 500; break;
        case 4: baseScore = 800; this.unlockAchievement('tetris'); break;
      }
      
      const comboMultiplier = 1 + (this.combo * 0.1);
      this.score += Math.floor(baseScore * this.level * comboMultiplier);
      
      const newLevel = Math.floor(this.lines / this.config.gameSettings.linesPerLevel) + 1;
      if (newLevel > this.level) {
        this.level = newLevel;
        this.playSound('levelUp');
      }
      
      if (this.combo >= 5) this.unlockAchievement('combo');
      
      // Screen shake effect
      if (this.settings.screenShake) {
        this.screenShake = linesCleared * 3;
      }
      
      // Particle effects
      if (this.settings.particles) {
        clearedRows.forEach(row => {
          for (let col = 0; col < this.config.gameSettings.boardWidth; col++) {
            this.createParticles(col, row);
          }
        });
      }
      
    } else {
      this.combo = 0;
    }
    
    this.updateUI();
  }

  private createParticles(x: number, y: number): void {
    if (!this.settings.particles) return;
    
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: x * this.config.gameSettings.blockSize + this.config.gameSettings.blockSize / 2,
        y: y * this.config.gameSettings.blockSize + this.config.gameSettings.blockSize / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        color: '#4f46e5',
        life: 1.0,
        decay: 0.02
      });
    }
  }

  private updateParticles(): void {
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.2; // gravity
      particle.life -= particle.decay;
      return particle.life > 0;
    });
  }

  private drawParticles(): void {
    this.particles.forEach(particle => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.life;
      this.ctx.fillStyle = particle.color;
      this.ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
      this.ctx.restore();
    });
  }

  private updateUI(): void {
    const headerScore = document.getElementById('headerScore');
    const headerLevel = document.getElementById('headerLevel');
    if (headerScore) headerScore.textContent = this.score.toLocaleString();
    if (headerLevel) headerLevel.textContent = this.level.toString();
    
    const lines = document.getElementById('lines');
    const combo = document.getElementById('combo');
    if (lines) lines.textContent = this.lines.toString();
    if (combo) combo.textContent = this.combo.toString();
    
    const multiplier = 1 + (this.combo * 0.1);
    const comboMultiplier = document.getElementById('comboMultiplier');
    if (comboMultiplier) comboMultiplier.textContent = '×' + multiplier.toFixed(1);
    
    const gameTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
    const gameTimeEl = document.getElementById('gameTime');
    if (gameTimeEl) gameTimeEl.textContent = this.formatTime(gameTime);
    
    const pps = this.totalPieces / Math.max(gameTime, 1);
    const ppsEl = document.getElementById('piecesPerSecond');
    if (ppsEl) ppsEl.textContent = pps.toFixed(1);
    
    const apm = Math.floor(this.actions / Math.max(gameTime / 60, 1/60));
    const apmEl = document.getElementById('actionsPerMinute');
    if (apmEl) apmEl.textContent = apm.toString();
    
    const linesInLevel = this.lines % this.config.gameSettings.linesPerLevel;
    const progress = (linesInLevel / this.config.gameSettings.linesPerLevel) * 100;
    const progressBar = document.getElementById('levelProgress');
    if (progressBar) progressBar.style.width = progress + '%';
    
    if (gameTime >= 600) this.unlockAchievement('marathon');
    if (pps >= 2.0) this.unlockAchievement('speed');
  }

  private gameLoop(time: number): void {
    if (!this.gameStarted) {
      this.drawStartScreen();
      requestAnimationFrame((time) => this.gameLoop(time));
      return;
    }
    
    if (this.isGameOver) {
      this.drawStartScreen();
      requestAnimationFrame((time) => this.gameLoop(time));
      return;
    }
    
    if (!this.isPaused && !this.isGameOver) {
      const deltaTime = time - this.lastTime;
      this.dropTime += deltaTime;
      
      const baseSpeed = this.config.gameSettings.dropSpeed * (1 - (this.settings.dropSpeed - 5) * 0.1);
      const dropSpeed = Math.max(50, baseSpeed - (this.level - 1) * this.config.gameSettings.speedIncrease);
      
      if (this.dropTime > dropSpeed) {
        this.movePiece(0, 1);
        this.dropTime = 0;
      }
      
      this.updateParticles();
      this.updateUI();
    }
    
    if (this.screenShake > 0) {
      this.screenShake *= 0.9;
      if (this.screenShake < 0.1) this.screenShake = 0;
    }
    
    this.lastTime = time;
    this.draw();
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  private draw(): void {
    this.ctx.save();
    
    // Screen shake effect
    if (this.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * this.screenShake;
      const shakeY = (Math.random() - 0.5) * this.screenShake;
      this.ctx.translate(shakeX, shakeY);
    }
    
    // Clear canvas
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw grid lines
    if (this.settings.gridLines) {
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      this.ctx.lineWidth = 1;
      
      for (let i = 0; i <= this.config.gameSettings.boardWidth; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(i * this.config.gameSettings.blockSize, 0);
        this.ctx.lineTo(i * this.config.gameSettings.blockSize, this.canvas.height);
        this.ctx.stroke();
      }
      
      for (let i = 0; i <= this.config.gameSettings.boardHeight; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, i * this.config.gameSettings.blockSize);
        this.ctx.lineTo(this.canvas.width, i * this.config.gameSettings.blockSize);
        this.ctx.stroke();
      }
    }
    
    // Draw board pieces
    for (let row = 0; row < this.config.gameSettings.boardHeight; row++) {
      for (let col = 0; col < this.config.gameSettings.boardWidth; col++) {
        if (this.board[row][col]) {
          this.drawBlock(col, row, this.config.colors[this.board[row][col]]);
        }
      }
    }
    
    // Draw ghost piece
    this.drawGhostPiece();
    
    // Draw current piece
    if (this.currentPiece) {
      for (let row = 0; row < this.currentPiece.shape.length; row++) {
        for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
          if (this.currentPiece.shape[row][col]) {
            this.drawBlock(
              this.currentPiece.x + col,
              this.currentPiece.y + row,
              this.config.colors[this.currentPiece.type]
            );
          }
        }
      }
    }
    
    // Draw particles
    this.drawParticles();
    
    this.ctx.restore();
  }

  private drawBlock(x: number, y: number, color: string): void {
    const blockX = x * this.config.gameSettings.blockSize;
    const blockY = y * this.config.gameSettings.blockSize;
    const size = this.config.gameSettings.blockSize - 2;
    
    // Main block
    this.ctx.fillStyle = color;
    this.ctx.fillRect(blockX + 1, blockY + 1, size, size);
    
    // 3D effect
    const gradient = this.ctx.createLinearGradient(blockX, blockY, blockX + size, blockY + size);
    gradient.addColorStop(0, 'rgba(255,255,255,0.3)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.3)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(blockX + 1, blockY + 1, size, size);
  }

  private drawGhostPiece(): void {
    if (!this.currentPiece || !this.settings.ghostPiece) return;
    
    let ghostY = this.currentPiece.y;
    while (!this.checkCollision(this.currentPiece.shape, this.currentPiece.x, ghostY + 1)) {
      ghostY++;
    }
    
    if (ghostY === this.currentPiece.y) return;
    
    this.ctx.save();
    this.ctx.globalAlpha = 0.3;
    
    for (let row = 0; row < this.currentPiece.shape.length; row++) {
      for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
        if (this.currentPiece.shape[row][col]) {
          this.drawBlock(
            this.currentPiece.x + col,
            ghostY + row,
            this.config.colors[this.currentPiece.type]
          );
        }
      }
    }
    
    this.ctx.restore();
  }

  private drawNextPieces(): void {
    for (let i = 0; i < Math.min(5, this.nextCanvases.length); i++) {
      const ctx = this.nextCtxs[i];
      const canvas = this.nextCanvases[i];
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (this.nextPieces[i]) {
        const shape = this.config.pieces[this.nextPieces[i]];
        const blockSize = i === 0 ? 20 : (i === 1 ? 16 : 12);
        const offsetX = (canvas.width - shape[0].length * blockSize) / 2;
        const offsetY = (canvas.height - shape.length * blockSize) / 2;
        
        for (let row = 0; row < shape.length; row++) {
          for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
              const x = offsetX + col * blockSize;
              const y = offsetY + row * blockSize;
              
              ctx.fillStyle = this.config.colors[this.nextPieces[i]];
              ctx.fillRect(x, y, blockSize - 1, blockSize - 1);
            }
          }
        }
      }
    }
  }

  private drawHoldPiece(): void {
    this.holdCtx.clearRect(0, 0, this.holdCanvas.width, this.holdCanvas.height);
    
    if (this.holdPiece) {
      const shape = this.config.pieces[this.holdPiece];
      const blockSize = 20;
      const offsetX = (this.holdCanvas.width - shape[0].length * blockSize) / 2;
      const offsetY = (this.holdCanvas.height - shape.length * blockSize) / 2;
      
      const alpha = this.canHold ? 1.0 : 0.5;
      this.holdCtx.save();
      this.holdCtx.globalAlpha = alpha;
      
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            const x = offsetX + col * blockSize;
            const y = offsetY + row * blockSize;
            
            this.holdCtx.fillStyle = this.config.colors[this.holdPiece];
            this.holdCtx.fillRect(x, y, blockSize - 1, blockSize - 1);
          }
        }
      }
      
      this.holdCtx.restore();
    }
  }

  private gameOver(): void {
    this.isGameOver = true;
    this.gameEndTime = Date.now();
    this.stopBackgroundMusic();
    this.playSound('gameOver');
    this.updateHighScores();
    
    const statusIndicator = document.getElementById('statusIndicator')!;
    statusIndicator.className = 'status-indicator game-over';
    statusIndicator.innerHTML = '<i class="fas fa-skull"></i> GAME OVER';
    
    if (this.singleLinesThisGame === 0 && this.lines > 0) {
      this.unlockAchievement('perfectionist');
    }
    
    this.saveData();
    this.canvas.style.cursor = 'pointer';
  }

  private togglePause(): void {
    if (this.isGameOver) return;
    this.isPaused = !this.isPaused;
    
    const statusIndicator = document.getElementById('statusIndicator')!;
    if (this.isPaused) {
      if (this.backgroundMusic && !this.backgroundMusic.paused) {
        this.backgroundMusic.pause();
      }
      this.showOverlay('PAUSED', 'Press ESC to resume');
      document.getElementById('pauseBtn')!.innerHTML = '<i class="fas fa-play"></i> RESUME';
      statusIndicator.className = 'status-indicator paused';
      statusIndicator.innerHTML = '<i class="fas fa-pause"></i> PAUSED';
    } else {
      if (this.backgroundMusic && this.settings.soundFx) {
        this.backgroundMusic.play().catch(() => {});
      }
      this.hideOverlay();
      document.getElementById('pauseBtn')!.innerHTML = '<i class="fas fa-pause"></i> PAUSE';
      statusIndicator.className = 'status-indicator playing';
      statusIndicator.innerHTML = '<i class="fas fa-play"></i> PLAYING';
    }
  }

  private restart(): void {
    this.board = this.createBoard();
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.combo = 0;
    this.totalPieces = 0;
    this.actions = 0;
    this.holdPiece = '';
    this.canHold = true;
    this.nextPieces = [];
    this.isPaused = false;
    this.isGameOver = false;
    this.dropTime = 0;
    this.particles = [];
    this.screenShake = 0;
    this.singleLinesThisGame = 0;
    this.gameStartTime = Date.now();
    
    this.playBackgroundMusic();
    this.updateUI();
    this.hideOverlay();
    document.getElementById('pauseBtn')!.innerHTML = '<i class="fas fa-pause"></i> PAUSE';
    
    const statusIndicator = document.getElementById('statusIndicator')!;
    statusIndicator.className = 'status-indicator playing';
    statusIndicator.innerHTML = '<i class="fas fa-play"></i> PLAYING';
    
    this.generateNextPieces();
    this.spawnPiece();
    this.drawHoldPiece();
  }

  private showSettings(): void {
    document.getElementById('settingsModal')!.classList.remove('hidden');
  }

  private hideSettings(): void {
    document.getElementById('settingsModal')!.classList.add('hidden');
  }

  private toggleFullscreen(): void {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        const btn = document.getElementById('fullscreenBtn');
        if (btn) btn.innerHTML = '🗗 EXIT FULLSCREEN';
      } else {
        document.exitFullscreen();
        const btn = document.getElementById('fullscreenBtn');
        if (btn) btn.innerHTML = '🔲 FULLSCREEN';
      }
    } catch (error) {
      console.error('Fullscreen not supported:', error);
    }
  }

  private cycleTheme(): void {
    this.currentTheme = (this.currentTheme + 1) % this.themes.length;
    this.config.colors = this.themes[this.currentTheme];
  }

  private unlockAchievement(achievement: string): void {
    if (!this.achievements[achievement as keyof typeof this.achievements]) {
      this.achievements[achievement as keyof typeof this.achievements] = true;
      this.playSound('achievement');
      this.updateAchievementDisplay();
      this.saveData();
      this.showAchievementNotification(achievement);
    }
  }

  private showAchievementNotification(achievement: string): void {
    const notification = document.createElement('div');
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4f46e5; color: white; padding: 16px 24px; border-radius: 12px; font-weight: 600; z-index: 1000; box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3); animation: slideIn 0.5s ease;';
    const title = document.createElement('span');
    title.textContent = '🏆 Achievement Unlocked: ' + achievement.toUpperCase();
    notification.appendChild(title);
    
    const style = document.createElement('style');
    style.textContent = '@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }';
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  }

  private updateAchievementDisplay(): void {
    Object.keys(this.achievements).forEach(key => {
      const element = document.querySelector('[data-achievement="' + key + '"]');
      if (element) {
        if (this.achievements[key as keyof typeof this.achievements]) {
          element.classList.remove('locked');
          element.classList.add('unlocked');
        } else {
          element.classList.add('locked');
          element.classList.remove('unlocked');
        }
      }
    });
  }

  private updateSettingsDisplay(): void {
    const ghostPiece = document.getElementById('ghostPiece') as HTMLInputElement;
    const gridLines = document.getElementById('gridLines') as HTMLInputElement;
    const particles = document.getElementById('particles') as HTMLInputElement;
    const soundFx = document.getElementById('soundFx') as HTMLInputElement;
    const screenShake = document.getElementById('screenShake') as HTMLInputElement;
    const autoRepeat = document.getElementById('autoRepeat') as HTMLInputElement;
    const dropSpeed = document.getElementById('dropSpeed') as HTMLInputElement;
    const musicVolume = document.getElementById('musicVolume') as HTMLInputElement;
    
    if (ghostPiece) ghostPiece.checked = this.settings.ghostPiece;
    if (gridLines) gridLines.checked = this.settings.gridLines;
    if (particles) particles.checked = this.settings.particles;
    if (soundFx) soundFx.checked = this.settings.soundFx;
    if (screenShake) screenShake.checked = this.settings.screenShake;
    if (autoRepeat) autoRepeat.value = this.settings.autoRepeat.toString();
    if (dropSpeed) dropSpeed.value = this.settings.dropSpeed.toString();
    if (musicVolume) musicVolume.value = this.settings.musicVolume.toString();
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const minsStr = mins < 10 ? '0' + mins : mins.toString();
    const secsStr = secs < 10 ? '0' + secs : secs.toString();
    return minsStr + ':' + secsStr;
  }

  private showOverlay(title: string, message: string, stats = ''): void {
    document.getElementById('overlayTitle')!.textContent = title;
    document.getElementById('overlayMessage')!.textContent = message;
    document.getElementById('overlayStats')!.innerHTML = stats;
    document.getElementById('gameOverlay')!.classList.remove('hidden');
  }

  private hideOverlay(): void {
    document.getElementById('gameOverlay')!.classList.add('hidden');
  }
}

new TetrisGame();
// Global function for collapsible panels
function togglePanel(panelId: string): void {
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.classList.toggle('collapsed');
  }
}

// Make it available globally
(window as any).togglePanel = togglePanel;
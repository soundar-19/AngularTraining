var TetrisGame = /** @class */ (function () {
    function TetrisGame() {
        this.nextCanvases = [];
        this.nextCtxs = [];
        this.currentPiece = null;
        this.nextPieces = [];
        this.holdPiece = '';
        this.canHold = true;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.combo = 0;
        this.totalPieces = 0;
        this.actions = 0;
        this.dropTime = 0;
        this.lastTime = 0;
        this.gameStartTime = 0;
        this.gameEndTime = 0;
        this.isPaused = false;
        this.isGameOver = false;
        this.highScores = [0, 0, 0, 0, 0];
        this.achievements = {
            tetris: false,
            combo: false,
            speed: false,
            marathon: false,
            perfectionist: false
        };
        this.settings = {
            ghostPiece: true,
            gridLines: true,
            particles: true,
            soundFx: true,
            screenShake: true,
            autoRepeat: 100,
            dropSpeed: 5,
            musicVolume: 50
        };
        this.particles = [];
        this.screenShake = 0;
        this.singleLinesThisGame = 0;
        this.currentTheme = 0;
        this.sounds = {};
        this.backgroundMusic = null;
        this.currentMusicTrack = 0;
        this.musicTracks = ['sounds/Background.mp3', 'sounds/Background2.mp3'];
        this.gameStarted = false;
        this.themes = [
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
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.holdCanvas = document.getElementById('holdCanvas');
        this.holdCtx = this.holdCanvas.getContext('2d');
        for (var i = 1; i <= 5; i++) {
            var canvas = document.getElementById('next' + i + 'Canvas');
            if (canvas) {
                this.nextCanvases.push(canvas);
                this.nextCtxs.push(canvas.getContext('2d'));
            }
        }
        this.board = this.createBoard();
        this.loadData();
        this.loadSounds();
        this.loadConfig();
    }
    TetrisGame.prototype.createBoard = function () {
        var board = [];
        for (var i = 0; i < 20; i++) {
            var row = [];
            for (var j = 0; j < 10; j++) {
                row.push('');
            }
            board.push(row);
        }
        return board;
    };
    TetrisGame.prototype.loadConfig = function () {
        var _this = this;
        fetch('config.json')
            .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP ".concat(response.status));
            }
            return response.json();
        })
            .then(function (config) {
            _this.config = config;
            _this.config.colors = _this.themes[_this.currentTheme];
            _this.canvas.width = _this.config.gameSettings.boardWidth * _this.config.gameSettings.blockSize;
            _this.canvas.height = _this.config.gameSettings.boardHeight * _this.config.gameSettings.blockSize;
            _this.init();
        })
            .catch(function (error) {
            console.error('Failed to load config:', error);
            _this.config = {
                gameSettings: { boardWidth: 10, boardHeight: 20, blockSize: 40, dropSpeed: 500, speedIncrease: 50, linesPerLevel: 10 },
                colors: _this.themes[_this.currentTheme],
                pieces: {
                    I: [[1, 1, 1, 1]], O: [[1, 1], [1, 1]], T: [[0, 1, 0], [1, 1, 1]],
                    S: [[0, 1, 1], [1, 1, 0]], Z: [[1, 1, 0], [0, 1, 1]],
                    J: [[1, 0, 0], [1, 1, 1]], L: [[0, 0, 1], [1, 1, 1]]
                }
            };
            _this.canvas.width = _this.config.gameSettings.boardWidth * _this.config.gameSettings.blockSize;
            _this.canvas.height = _this.config.gameSettings.boardHeight * _this.config.gameSettings.blockSize;
            _this.init();
        });
    };
    TetrisGame.prototype.loadData = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        try {
            var savedScores = localStorage.getItem('tetris-pro-scores');
            if (savedScores) {
                this.highScores = JSON.parse(savedScores);
            }
        }
        catch (error) {
            console.error('Failed to load scores:', error);
        }
        try {
            var savedAchievements = localStorage.getItem('tetris-pro-achievements');
            if (savedAchievements) {
                this.achievements = JSON.parse(savedAchievements);
            }
        }
        catch (error) {
            console.error('Failed to load achievements:', error);
        }
        try {
            var savedSettings = localStorage.getItem('tetris-pro-settings');
            if (savedSettings) {
                var parsed = JSON.parse(savedSettings);
                this.settings = {
                    ghostPiece: (_a = parsed.ghostPiece) !== null && _a !== void 0 ? _a : this.settings.ghostPiece,
                    gridLines: (_b = parsed.gridLines) !== null && _b !== void 0 ? _b : this.settings.gridLines,
                    particles: (_c = parsed.particles) !== null && _c !== void 0 ? _c : this.settings.particles,
                    soundFx: (_d = parsed.soundFx) !== null && _d !== void 0 ? _d : this.settings.soundFx,
                    screenShake: (_e = parsed.screenShake) !== null && _e !== void 0 ? _e : this.settings.screenShake,
                    autoRepeat: (_f = parsed.autoRepeat) !== null && _f !== void 0 ? _f : this.settings.autoRepeat,
                    dropSpeed: (_g = parsed.dropSpeed) !== null && _g !== void 0 ? _g : this.settings.dropSpeed,
                    musicVolume: (_h = parsed.musicVolume) !== null && _h !== void 0 ? _h : this.settings.musicVolume
                };
            }
        }
        catch (error) {
            console.error('Failed to load settings:', error);
        }
        this.updateHighScoreDisplay();
        this.updateAchievementDisplay();
        this.updateSettingsDisplay();
    };
    TetrisGame.prototype.loadSounds = function () {
        var _this = this;
        var soundFiles = {
            lineClear: 'sounds/LineClear.mp3',
            levelUp: 'sounds/level-up-05-326133.mp3',
            gameOver: 'sounds/game-over-arcade-6435.mp3',
            click: 'sounds/pause_resume.mp3',
            rotate: 'sounds/rotate.mp3',
            drop: 'sounds/Drop sound.mp3',
            achievement: 'sounds/game-bonus-02-294436.mp3'
        };
        Object.keys(soundFiles).forEach(function (key) {
            _this.sounds[key] = new Audio(soundFiles[key]);
            _this.sounds[key].volume = 0.3;
        });
        this.backgroundMusic = new Audio(this.musicTracks[this.currentMusicTrack]);
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 1.0;
    };
    TetrisGame.prototype.playSound = function (soundName) {
        if (this.settings.soundFx && this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(function () { });
        }
    };
    TetrisGame.prototype.playBackgroundMusic = function () {
        if (this.backgroundMusic && this.settings.soundFx) {
            this.backgroundMusic.play().catch(function () { });
        }
    };
    TetrisGame.prototype.stopBackgroundMusic = function () {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    };
    TetrisGame.prototype.switchMusicTrack = function () {
        var wasPlaying = this.backgroundMusic && !this.backgroundMusic.paused;
        this.stopBackgroundMusic();
        this.currentMusicTrack = (this.currentMusicTrack + 1) % this.musicTracks.length;
        this.backgroundMusic = new Audio(this.musicTracks[this.currentMusicTrack]);
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = this.settings.musicVolume / 100 * 1.0;
        if (wasPlaying && this.settings.soundFx) {
            this.playBackgroundMusic();
        }
        this.playSound('click');
    };
    TetrisGame.prototype.saveData = function () {
        localStorage.setItem('tetris-pro-scores', JSON.stringify(this.highScores));
        localStorage.setItem('tetris-pro-achievements', JSON.stringify(this.achievements));
        localStorage.setItem('tetris-pro-settings', JSON.stringify(this.settings));
    };
    TetrisGame.prototype.updateHighScoreDisplay = function () {
        for (var i = 0; i < 5; i++) {
            var element = document.getElementById('highScore' + (i + 1));
            if (element) {
                element.textContent = this.highScores[i].toLocaleString();
            }
        }
    };
    TetrisGame.prototype.updateHighScores = function () {
        this.highScores.push(this.score);
        this.highScores.sort(function (a, b) { return b - a; });
        this.highScores = this.highScores.slice(0, 5);
        this.updateHighScoreDisplay();
    };
    TetrisGame.prototype.init = function () {
        this.setupControls();
        this.setupButtons();
        this.canvas.style.cursor = 'pointer';
        this.gameLoop(0); // Start the game loop to show start screen
    };
    TetrisGame.prototype.startGame = function () {
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
        var statusIndicator = document.getElementById('statusIndicator');
        statusIndicator.className = 'status-indicator playing';
        statusIndicator.innerHTML = '<i class="fas fa-play"></i> PLAYING';
        this.hideOverlay();
    };
    TetrisGame.prototype.drawStartScreen = function () {
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
            var boxWidth = 280;
            var boxHeight = 120;
            var boxX = this.canvas.width / 2 - boxWidth / 2;
            var boxY = this.canvas.height / 2 - 60;
            this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
            this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
            // Stats text
            var gameTime = Math.floor((this.gameEndTime - this.gameStartTime) / 1000);
            var pps = this.totalPieces / Math.max(gameTime, 1);
            var apm = Math.floor(this.actions / Math.max(gameTime / 60, 1 / 60));
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
        }
        else {
            this.ctx.fillStyle = '#a855f7';
            this.ctx.font = 'bold 48px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('TETRIS ULTRA', this.canvas.width / 2, this.canvas.height / 2 - 50);
            this.ctx.fillStyle = '#ec4899';
            this.ctx.font = 'bold 24px Inter';
            this.ctx.fillText('Click to Start', this.canvas.width / 2, this.canvas.height / 2 + 20);
        }
    };
    TetrisGame.prototype.setupButtons = function () {
        var _this = this;
        document.getElementById('pauseBtn').addEventListener('click', function () { _this.playSound('click'); _this.togglePause(); });
        document.getElementById('settingsBtn').addEventListener('click', function () { _this.playSound('click'); _this.showSettings(); });
        document.getElementById('closeSettings').addEventListener('click', function () { _this.playSound('click'); _this.hideSettings(); });
        document.getElementById('fullscreenBtn').addEventListener('click', function () { _this.playSound('click'); _this.toggleFullscreen(); });
        // Controls footer toggle
        document.getElementById('controlsToggle').addEventListener('click', function () {
            _this.playSound('click');
            var footer = document.getElementById('controlsFooter');
            var toggle = document.getElementById('controlsToggle');
            footer.classList.toggle('collapsed');
            toggle.innerHTML = footer.classList.contains('collapsed') ?
                '<i class="fas fa-keyboard"></i> Show Controls' :
                '<i class="fas fa-keyboard"></i> Hide Controls';
        });
        // Focus mode toggle
        document.getElementById('focusBtn').addEventListener('click', function () {
            _this.playSound('click');
            document.body.classList.toggle('focus-mode');
            var focusBtn = document.getElementById('focusBtn');
            focusBtn.innerHTML = document.body.classList.contains('focus-mode') ?
                '<i class="fas fa-eye-slash"></i> EXIT FOCUS' :
                '<i class="fas fa-eye"></i> FOCUS';
        });
        // Canvas click to start/restart
        this.canvas.addEventListener('click', function (e) {
            e.preventDefault();
            _this.startGame();
        });
        this.canvas.addEventListener('touchend', function (e) {
            e.preventDefault();
            _this.startGame();
        });
        // Music toggle button
        document.getElementById('musicToggle').addEventListener('click', function () {
            _this.switchMusicTrack();
        });
        // Settings event listeners
        document.getElementById('ghostPiece').addEventListener('change', function (e) {
            _this.settings.ghostPiece = e.target.checked;
            _this.saveData();
        });
        document.getElementById('gridLines').addEventListener('change', function (e) {
            _this.settings.gridLines = e.target.checked;
            _this.saveData();
        });
        document.getElementById('particles').addEventListener('change', function (e) {
            _this.settings.particles = e.target.checked;
            _this.saveData();
        });
        document.getElementById('soundFx').addEventListener('change', function (e) {
            _this.settings.soundFx = e.target.checked;
            _this.saveData();
        });
        document.getElementById('screenShake').addEventListener('change', function (e) {
            _this.settings.screenShake = e.target.checked;
            _this.saveData();
        });
        document.getElementById('autoRepeat').addEventListener('input', function (e) {
            _this.settings.autoRepeat = parseInt(e.target.value);
            _this.saveData();
        });
        document.getElementById('dropSpeed').addEventListener('input', function (e) {
            _this.settings.dropSpeed = parseInt(e.target.value);
            _this.saveData();
        });
        document.getElementById('musicVolume').addEventListener('input', function (e) {
            _this.settings.musicVolume = parseInt(e.target.value);
            if (_this.backgroundMusic) {
                _this.backgroundMusic.volume = _this.settings.musicVolume / 100 * 1.0;
            }
            _this.saveData();
        });
    };
    TetrisGame.prototype.setupControls = function () {
        var _this = this;
        document.addEventListener('keydown', function (e) {
            _this.actions++;
            switch (e.code) {
                case 'ArrowLeft':
                    if (!_this.isPaused)
                        _this.movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    if (!_this.isPaused)
                        _this.movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    if (!_this.isPaused)
                        _this.movePiece(0, 1);
                    break;
                case 'ArrowUp':
                    if (!_this.isPaused) {
                        _this.rotatePiece(1);
                        _this.playSound('rotate');
                    }
                    break;
                case 'Space':
                    if (!_this.isPaused) {
                        e.preventDefault();
                        _this.hardDrop();
                    }
                    break;
                case 'Escape':
                    _this.togglePause();
                    _this.playSound('click');
                    break;
                case 'KeyR':
                    if (_this.isGameOver || !_this.gameStarted) {
                        _this.startGame();
                    }
                    else {
                        _this.restart();
                    }
                    break;
                case 'KeyC':
                    if (!_this.isPaused)
                        _this.holdCurrentPiece();
                    break;
                case 'KeyZ':
                    if (!_this.isPaused) {
                        _this.rotatePiece(-1);
                        _this.playSound('rotate');
                    }
                    break;
                case 'KeyG':
                    _this.settings.ghostPiece = !_this.settings.ghostPiece;
                    _this.updateSettingsDisplay();
                    _this.saveData();
                    break;
                case 'KeyT':
                    _this.cycleTheme();
                    break;
                case 'KeyM':
                    _this.settings.soundFx = !_this.settings.soundFx;
                    if (_this.settings.soundFx) {
                        _this.playBackgroundMusic();
                    }
                    else {
                        _this.stopBackgroundMusic();
                    }
                    _this.updateSettingsDisplay();
                    _this.saveData();
                    break;
                case 'KeyN':
                    _this.switchMusicTrack();
                    break;
                case 'F11':
                    e.preventDefault();
                    _this.toggleFullscreen();
                    break;
            }
        });
    };
    TetrisGame.prototype.generateNextPieces = function () {
        var pieces = Object.keys(this.config.pieces);
        while (this.nextPieces.length < 5) {
            this.nextPieces.push(pieces[Math.floor(Math.random() * pieces.length)]);
        }
    };
    TetrisGame.prototype.spawnPiece = function () {
        if (this.nextPieces.length === 0)
            this.generateNextPieces();
        var pieceType = this.nextPieces.shift();
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
    };
    TetrisGame.prototype.movePiece = function (dx, dy) {
        if (!this.currentPiece)
            return;
        var newX = this.currentPiece.x + dx;
        var newY = this.currentPiece.y + dy;
        if (!this.checkCollision(this.currentPiece.shape, newX, newY)) {
            this.currentPiece.x = newX;
            this.currentPiece.y = newY;
        }
        else if (dy > 0) {
            this.placePiece();
        }
    };
    TetrisGame.prototype.rotatePiece = function (direction) {
        var _this = this;
        if (!this.currentPiece)
            return;
        var rotated;
        if (direction === 1) {
            // Clockwise
            rotated = this.currentPiece.shape[0].map(function (_, i) {
                return _this.currentPiece.shape.map(function (row) { return row[i]; }).reverse();
            });
        }
        else {
            // Counter-clockwise
            rotated = this.currentPiece.shape[0].map(function (_, i) {
                return _this.currentPiece.shape.map(function (row) { return row[row.length - 1 - i]; });
            });
        }
        // Wall kick system
        var kicks = this.getWallKicks(this.currentPiece.rotation, this.currentPiece.rotation + direction, this.currentPiece.type);
        for (var _i = 0, kicks_1 = kicks; _i < kicks_1.length; _i++) {
            var kick = kicks_1[_i];
            if (!this.checkCollision(rotated, this.currentPiece.x + kick.x, this.currentPiece.y + kick.y)) {
                this.currentPiece.shape = rotated;
                this.currentPiece.x += kick.x;
                this.currentPiece.y += kick.y;
                this.currentPiece.rotation = (this.currentPiece.rotation + direction + 4) % 4;
                break;
            }
        }
    };
    TetrisGame.prototype.getWallKicks = function (fromRotation, toRotation, pieceType) {
        // SRS (Super Rotation System) wall kicks
        if (pieceType === 'I') {
            // I-piece has special wall kicks
            var iKicks = {
                '0->1': [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: -1 }, { x: 1, y: 2 }],
                '1->0': [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 1 }, { x: -1, y: -2 }],
                '1->2': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 2 }, { x: 2, y: -1 }],
                '2->1': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: -2 }, { x: -2, y: 1 }],
                '2->3': [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 1 }, { x: -1, y: -2 }],
                '3->2': [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: -1 }, { x: 1, y: 2 }],
                '3->0': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: -2 }, { x: -2, y: 1 }],
                '0->3': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 2 }, { x: 2, y: -1 }]
            };
            var key = fromRotation + '->' + (toRotation % 4);
            return iKicks[key] || [{ x: 0, y: 0 }];
        }
        else if (pieceType === 'O') {
            // O-piece doesn't rotate
            return [{ x: 0, y: 0 }];
        }
        else {
            // Standard wall kicks for other pieces
            var standardKicks = {
                '0->1': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
                '1->0': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
                '1->2': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
                '2->1': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
                '2->3': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
                '3->2': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
                '3->0': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
                '0->3': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }]
            };
            var key = fromRotation + '->' + (toRotation % 4);
            return standardKicks[key] || [{ x: 0, y: 0 }];
        }
    };
    TetrisGame.prototype.holdCurrentPiece = function () {
        if (!this.currentPiece || !this.canHold)
            return;
        var currentType = this.currentPiece.type;
        if (this.holdPiece) {
            this.currentPiece = {
                shape: this.config.pieces[this.holdPiece],
                x: Math.floor(this.config.gameSettings.boardWidth / 2) - 1,
                y: 0,
                type: this.holdPiece,
                rotation: 0
            };
        }
        else {
            this.spawnPiece();
        }
        this.holdPiece = currentType;
        this.canHold = false;
        this.drawHoldPiece();
    };
    TetrisGame.prototype.hardDrop = function () {
        if (!this.currentPiece)
            return;
        var dropDistance = 0;
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
    };
    TetrisGame.prototype.checkCollision = function (shape, x, y) {
        for (var row = 0; row < shape.length; row++) {
            for (var col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    var newX = x + col;
                    var newY = y + row;
                    if (newX < 0 || newX >= this.config.gameSettings.boardWidth ||
                        newY >= this.config.gameSettings.boardHeight ||
                        (newY >= 0 && this.board[newY][newX])) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    TetrisGame.prototype.placePiece = function () {
        if (!this.currentPiece)
            return;
        this.playSound('drop');
        for (var row = 0; row < this.currentPiece.shape.length; row++) {
            for (var col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col]) {
                    var x = this.currentPiece.x + col;
                    var y = this.currentPiece.y + row;
                    if (y >= 0) {
                        this.board[y][x] = this.currentPiece.type;
                    }
                }
            }
        }
        this.clearLines();
        this.spawnPiece();
    };
    TetrisGame.prototype.clearLines = function () {
        var _this = this;
        var linesCleared = 0;
        var clearedRows = [];
        for (var row = this.config.gameSettings.boardHeight - 1; row >= 0; row--) {
            if (this.board[row].every(function (cell) { return cell !== ''; })) {
                clearedRows.push(row);
                this.board.splice(row, 1);
                var newRow = [];
                for (var i = 0; i < this.config.gameSettings.boardWidth; i++) {
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
            if (linesCleared === 1)
                this.singleLinesThisGame++;
            this.combo++;
            // Advanced scoring system
            var baseScore = 0;
            switch (linesCleared) {
                case 1:
                    baseScore = 100;
                    break;
                case 2:
                    baseScore = 300;
                    break;
                case 3:
                    baseScore = 500;
                    break;
                case 4:
                    baseScore = 800;
                    this.unlockAchievement('tetris');
                    break;
            }
            var comboMultiplier = 1 + (this.combo * 0.1);
            this.score += Math.floor(baseScore * this.level * comboMultiplier);
            var newLevel = Math.floor(this.lines / this.config.gameSettings.linesPerLevel) + 1;
            if (newLevel > this.level) {
                this.level = newLevel;
                this.playSound('levelUp');
            }
            if (this.combo >= 5)
                this.unlockAchievement('combo');
            // Screen shake effect
            if (this.settings.screenShake) {
                this.screenShake = linesCleared * 3;
            }
            // Particle effects
            if (this.settings.particles) {
                clearedRows.forEach(function (row) {
                    for (var col = 0; col < _this.config.gameSettings.boardWidth; col++) {
                        _this.createParticles(col, row);
                    }
                });
            }
        }
        else {
            this.combo = 0;
        }
        this.updateUI();
    };
    TetrisGame.prototype.createParticles = function (x, y) {
        if (!this.settings.particles)
            return;
        for (var i = 0; i < 6; i++) {
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
    };
    TetrisGame.prototype.updateParticles = function () {
        this.particles = this.particles.filter(function (particle) {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2; // gravity
            particle.life -= particle.decay;
            return particle.life > 0;
        });
    };
    TetrisGame.prototype.drawParticles = function () {
        var _this = this;
        this.particles.forEach(function (particle) {
            _this.ctx.save();
            _this.ctx.globalAlpha = particle.life;
            _this.ctx.fillStyle = particle.color;
            _this.ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
            _this.ctx.restore();
        });
    };
    TetrisGame.prototype.updateUI = function () {
        var headerScore = document.getElementById('headerScore');
        var headerLevel = document.getElementById('headerLevel');
        if (headerScore)
            headerScore.textContent = this.score.toLocaleString();
        if (headerLevel)
            headerLevel.textContent = this.level.toString();
        var lines = document.getElementById('lines');
        var combo = document.getElementById('combo');
        if (lines)
            lines.textContent = this.lines.toString();
        if (combo)
            combo.textContent = this.combo.toString();
        var multiplier = 1 + (this.combo * 0.1);
        var comboMultiplier = document.getElementById('comboMultiplier');
        if (comboMultiplier)
            comboMultiplier.textContent = '×' + multiplier.toFixed(1);
        var gameTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
        var gameTimeEl = document.getElementById('gameTime');
        if (gameTimeEl)
            gameTimeEl.textContent = this.formatTime(gameTime);
        var pps = this.totalPieces / Math.max(gameTime, 1);
        var ppsEl = document.getElementById('piecesPerSecond');
        if (ppsEl)
            ppsEl.textContent = pps.toFixed(1);
        var apm = Math.floor(this.actions / Math.max(gameTime / 60, 1 / 60));
        var apmEl = document.getElementById('actionsPerMinute');
        if (apmEl)
            apmEl.textContent = apm.toString();
        var linesInLevel = this.lines % this.config.gameSettings.linesPerLevel;
        var progress = (linesInLevel / this.config.gameSettings.linesPerLevel) * 100;
        var progressBar = document.getElementById('levelProgress');
        if (progressBar)
            progressBar.style.width = progress + '%';
        if (gameTime >= 600)
            this.unlockAchievement('marathon');
        if (pps >= 2.0)
            this.unlockAchievement('speed');
    };
    TetrisGame.prototype.gameLoop = function (time) {
        var _this = this;
        if (!this.gameStarted) {
            this.drawStartScreen();
            requestAnimationFrame(function (time) { return _this.gameLoop(time); });
            return;
        }
        if (this.isGameOver) {
            this.drawStartScreen();
            requestAnimationFrame(function (time) { return _this.gameLoop(time); });
            return;
        }
        if (!this.isPaused && !this.isGameOver) {
            var deltaTime = time - this.lastTime;
            this.dropTime += deltaTime;
            var baseSpeed = this.config.gameSettings.dropSpeed * (1 - (this.settings.dropSpeed - 5) * 0.1);
            var dropSpeed = Math.max(50, baseSpeed - (this.level - 1) * this.config.gameSettings.speedIncrease);
            if (this.dropTime > dropSpeed) {
                this.movePiece(0, 1);
                this.dropTime = 0;
            }
            this.updateParticles();
            this.updateUI();
        }
        if (this.screenShake > 0) {
            this.screenShake *= 0.9;
            if (this.screenShake < 0.1)
                this.screenShake = 0;
        }
        this.lastTime = time;
        this.draw();
        requestAnimationFrame(function (time) { return _this.gameLoop(time); });
    };
    TetrisGame.prototype.draw = function () {
        this.ctx.save();
        // Screen shake effect
        if (this.screenShake > 0) {
            var shakeX = (Math.random() - 0.5) * this.screenShake;
            var shakeY = (Math.random() - 0.5) * this.screenShake;
            this.ctx.translate(shakeX, shakeY);
        }
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw grid lines
        if (this.settings.gridLines) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            this.ctx.lineWidth = 1;
            for (var i = 0; i <= this.config.gameSettings.boardWidth; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(i * this.config.gameSettings.blockSize, 0);
                this.ctx.lineTo(i * this.config.gameSettings.blockSize, this.canvas.height);
                this.ctx.stroke();
            }
            for (var i = 0; i <= this.config.gameSettings.boardHeight; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, i * this.config.gameSettings.blockSize);
                this.ctx.lineTo(this.canvas.width, i * this.config.gameSettings.blockSize);
                this.ctx.stroke();
            }
        }
        // Draw board pieces
        for (var row = 0; row < this.config.gameSettings.boardHeight; row++) {
            for (var col = 0; col < this.config.gameSettings.boardWidth; col++) {
                if (this.board[row][col]) {
                    this.drawBlock(col, row, this.config.colors[this.board[row][col]]);
                }
            }
        }
        // Draw ghost piece
        this.drawGhostPiece();
        // Draw current piece
        if (this.currentPiece) {
            for (var row = 0; row < this.currentPiece.shape.length; row++) {
                for (var col = 0; col < this.currentPiece.shape[row].length; col++) {
                    if (this.currentPiece.shape[row][col]) {
                        this.drawBlock(this.currentPiece.x + col, this.currentPiece.y + row, this.config.colors[this.currentPiece.type]);
                    }
                }
            }
        }
        // Draw particles
        this.drawParticles();
        this.ctx.restore();
    };
    TetrisGame.prototype.drawBlock = function (x, y, color) {
        var blockX = x * this.config.gameSettings.blockSize;
        var blockY = y * this.config.gameSettings.blockSize;
        var size = this.config.gameSettings.blockSize - 2;
        // Main block
        this.ctx.fillStyle = color;
        this.ctx.fillRect(blockX + 1, blockY + 1, size, size);
        // 3D effect
        var gradient = this.ctx.createLinearGradient(blockX, blockY, blockX + size, blockY + size);
        gradient.addColorStop(0, 'rgba(255,255,255,0.3)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.3)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(blockX + 1, blockY + 1, size, size);
    };
    TetrisGame.prototype.drawGhostPiece = function () {
        if (!this.currentPiece || !this.settings.ghostPiece)
            return;
        var ghostY = this.currentPiece.y;
        while (!this.checkCollision(this.currentPiece.shape, this.currentPiece.x, ghostY + 1)) {
            ghostY++;
        }
        if (ghostY === this.currentPiece.y)
            return;
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        for (var row = 0; row < this.currentPiece.shape.length; row++) {
            for (var col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col]) {
                    this.drawBlock(this.currentPiece.x + col, ghostY + row, this.config.colors[this.currentPiece.type]);
                }
            }
        }
        this.ctx.restore();
    };
    TetrisGame.prototype.drawNextPieces = function () {
        for (var i = 0; i < Math.min(5, this.nextCanvases.length); i++) {
            var ctx = this.nextCtxs[i];
            var canvas = this.nextCanvases[i];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (this.nextPieces[i]) {
                var shape = this.config.pieces[this.nextPieces[i]];
                var blockSize = i === 0 ? 20 : (i === 1 ? 16 : 12);
                var offsetX = (canvas.width - shape[0].length * blockSize) / 2;
                var offsetY = (canvas.height - shape.length * blockSize) / 2;
                for (var row = 0; row < shape.length; row++) {
                    for (var col = 0; col < shape[row].length; col++) {
                        if (shape[row][col]) {
                            var x = offsetX + col * blockSize;
                            var y = offsetY + row * blockSize;
                            ctx.fillStyle = this.config.colors[this.nextPieces[i]];
                            ctx.fillRect(x, y, blockSize - 1, blockSize - 1);
                        }
                    }
                }
            }
        }
    };
    TetrisGame.prototype.drawHoldPiece = function () {
        this.holdCtx.clearRect(0, 0, this.holdCanvas.width, this.holdCanvas.height);
        if (this.holdPiece) {
            var shape = this.config.pieces[this.holdPiece];
            var blockSize = 20;
            var offsetX = (this.holdCanvas.width - shape[0].length * blockSize) / 2;
            var offsetY = (this.holdCanvas.height - shape.length * blockSize) / 2;
            var alpha = this.canHold ? 1.0 : 0.5;
            this.holdCtx.save();
            this.holdCtx.globalAlpha = alpha;
            for (var row = 0; row < shape.length; row++) {
                for (var col = 0; col < shape[row].length; col++) {
                    if (shape[row][col]) {
                        var x = offsetX + col * blockSize;
                        var y = offsetY + row * blockSize;
                        this.holdCtx.fillStyle = this.config.colors[this.holdPiece];
                        this.holdCtx.fillRect(x, y, blockSize - 1, blockSize - 1);
                    }
                }
            }
            this.holdCtx.restore();
        }
    };
    TetrisGame.prototype.gameOver = function () {
        this.isGameOver = true;
        this.gameEndTime = Date.now();
        this.stopBackgroundMusic();
        this.playSound('gameOver');
        this.updateHighScores();
        var statusIndicator = document.getElementById('statusIndicator');
        statusIndicator.className = 'status-indicator game-over';
        statusIndicator.innerHTML = '<i class="fas fa-skull"></i> GAME OVER';
        if (this.singleLinesThisGame === 0 && this.lines > 0) {
            this.unlockAchievement('perfectionist');
        }
        this.saveData();
        this.canvas.style.cursor = 'pointer';
    };
    TetrisGame.prototype.togglePause = function () {
        if (this.isGameOver)
            return;
        this.isPaused = !this.isPaused;
        var statusIndicator = document.getElementById('statusIndicator');
        if (this.isPaused) {
            if (this.backgroundMusic && !this.backgroundMusic.paused) {
                this.backgroundMusic.pause();
            }
            this.showOverlay('PAUSED', 'Press ESC to resume');
            document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-play"></i> RESUME';
            statusIndicator.className = 'status-indicator paused';
            statusIndicator.innerHTML = '<i class="fas fa-pause"></i> PAUSED';
        }
        else {
            if (this.backgroundMusic && this.settings.soundFx) {
                this.backgroundMusic.play().catch(function () { });
            }
            this.hideOverlay();
            document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-pause"></i> PAUSE';
            statusIndicator.className = 'status-indicator playing';
            statusIndicator.innerHTML = '<i class="fas fa-play"></i> PLAYING';
        }
    };
    TetrisGame.prototype.restart = function () {
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
        document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-pause"></i> PAUSE';
        var statusIndicator = document.getElementById('statusIndicator');
        statusIndicator.className = 'status-indicator playing';
        statusIndicator.innerHTML = '<i class="fas fa-play"></i> PLAYING';
        this.generateNextPieces();
        this.spawnPiece();
        this.drawHoldPiece();
    };
    TetrisGame.prototype.showSettings = function () {
        document.getElementById('settingsModal').classList.remove('hidden');
    };
    TetrisGame.prototype.hideSettings = function () {
        document.getElementById('settingsModal').classList.add('hidden');
    };
    TetrisGame.prototype.toggleFullscreen = function () {
        try {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
                var btn = document.getElementById('fullscreenBtn');
                if (btn)
                    btn.innerHTML = '🗗 EXIT FULLSCREEN';
            }
            else {
                document.exitFullscreen();
                var btn = document.getElementById('fullscreenBtn');
                if (btn)
                    btn.innerHTML = '🔲 FULLSCREEN';
            }
        }
        catch (error) {
            console.error('Fullscreen not supported:', error);
        }
    };
    TetrisGame.prototype.cycleTheme = function () {
        this.currentTheme = (this.currentTheme + 1) % this.themes.length;
        this.config.colors = this.themes[this.currentTheme];
    };
    TetrisGame.prototype.unlockAchievement = function (achievement) {
        if (!this.achievements[achievement]) {
            this.achievements[achievement] = true;
            this.playSound('achievement');
            this.updateAchievementDisplay();
            this.saveData();
            this.showAchievementNotification(achievement);
        }
    };
    TetrisGame.prototype.showAchievementNotification = function (achievement) {
        var notification = document.createElement('div');
        notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4f46e5; color: white; padding: 16px 24px; border-radius: 12px; font-weight: 600; z-index: 1000; box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3); animation: slideIn 0.5s ease;';
        var title = document.createElement('span');
        title.textContent = '🏆 Achievement Unlocked: ' + achievement.toUpperCase();
        notification.appendChild(title);
        var style = document.createElement('style');
        style.textContent = '@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }';
        document.head.appendChild(style);
        document.body.appendChild(notification);
        setTimeout(function () {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    };
    TetrisGame.prototype.updateAchievementDisplay = function () {
        var _this = this;
        Object.keys(this.achievements).forEach(function (key) {
            var element = document.querySelector('[data-achievement="' + key + '"]');
            if (element) {
                if (_this.achievements[key]) {
                    element.classList.remove('locked');
                    element.classList.add('unlocked');
                }
                else {
                    element.classList.add('locked');
                    element.classList.remove('unlocked');
                }
            }
        });
    };
    TetrisGame.prototype.updateSettingsDisplay = function () {
        var ghostPiece = document.getElementById('ghostPiece');
        var gridLines = document.getElementById('gridLines');
        var particles = document.getElementById('particles');
        var soundFx = document.getElementById('soundFx');
        var screenShake = document.getElementById('screenShake');
        var autoRepeat = document.getElementById('autoRepeat');
        var dropSpeed = document.getElementById('dropSpeed');
        var musicVolume = document.getElementById('musicVolume');
        if (ghostPiece)
            ghostPiece.checked = this.settings.ghostPiece;
        if (gridLines)
            gridLines.checked = this.settings.gridLines;
        if (particles)
            particles.checked = this.settings.particles;
        if (soundFx)
            soundFx.checked = this.settings.soundFx;
        if (screenShake)
            screenShake.checked = this.settings.screenShake;
        if (autoRepeat)
            autoRepeat.value = this.settings.autoRepeat.toString();
        if (dropSpeed)
            dropSpeed.value = this.settings.dropSpeed.toString();
        if (musicVolume)
            musicVolume.value = this.settings.musicVolume.toString();
    };
    TetrisGame.prototype.formatTime = function (seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        var minsStr = mins < 10 ? '0' + mins : mins.toString();
        var secsStr = secs < 10 ? '0' + secs : secs.toString();
        return minsStr + ':' + secsStr;
    };
    TetrisGame.prototype.showOverlay = function (title, message, stats) {
        if (stats === void 0) { stats = ''; }
        document.getElementById('overlayTitle').textContent = title;
        document.getElementById('overlayMessage').textContent = message;
        document.getElementById('overlayStats').innerHTML = stats;
        document.getElementById('gameOverlay').classList.remove('hidden');
    };
    TetrisGame.prototype.hideOverlay = function () {
        document.getElementById('gameOverlay').classList.add('hidden');
    };
    return TetrisGame;
}());
new TetrisGame();
// Global function for collapsible panels
function togglePanel(panelId) {
    var panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.toggle('collapsed');
    }
}
// Make it available globally
window.togglePanel = togglePanel;

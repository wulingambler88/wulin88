import {
  BRAIN_BADGES,
  type DifficultyTier,
  evaluateBadges,
  MEMORY_CARDS,
  type MemoryDeckCard,
  PUZZLES,
  type PuzzleTile,
  QUIZ_QUESTIONS,
  type QuizQuestion,
} from '../data/minigames'
import { playerState } from '../state/PlayerState'
import { audioManager } from '../audio/AudioManager'
import { showToast } from './UIManager'
import { completeActivity } from '../state/DailyActivities'

interface PhaserSceneLike { input?: { enabled: boolean } }
interface PhaserGameLike {
  scene?: { getScenes(active: boolean): PhaserSceneLike[] }
  events?: { emit(event: string, ...args: unknown[]): void }
}

function getPhaserGame(): PhaserGameLike | null {
  if (typeof window === 'undefined') return null
  return (window as Window & { __PHASER_GAME__?: PhaserGameLike }).__PHASER_GAME__ ?? null
}

function setSceneInput(enabled: boolean): void {
  const phaserGame = getPhaserGame()
  phaserGame?.scene?.getScenes(true).forEach((scene) => { if (scene.input) scene.input.enabled = enabled })
}

function completeBrainGame(): void {
  completeActivity(playerState.data.minigames, 'game')
  playerState.save(true)
  getPhaserGame()?.events?.emit('brain:completed')
}

interface DeckCard extends MemoryDeckCard {
  uid: number
  flipped: boolean
  matched: boolean
}

interface RuntimePuzzleTile extends PuzzleTile {
  currentPos: number
}

export type BrainHubTab = 'memory' | 'quiz' | 'puzzle' | 'badges'

export class BrainHubModal {
  private container: HTMLElement
  private currentTab: BrainHubTab = 'memory'
  private inputToken = 0

  // Memory Game State
  private memoryTier: DifficultyTier = 'junior'
  private memoryDeck: DeckCard[] = []
  private firstFlippedIdx: number | null = null
  private secondFlippedIdx: number | null = null
  private memoryLocked = false
  private memoryFlips = 0
  private memoryMatchesFound = 0
  private memoryWon = false
  private memoryReward = 0

  // Quiz Game State
  private quizCategory: 'all' | 'math' | 'science' | 'words' = 'all'
  private quizTier: DifficultyTier = 'junior'
  private quizQuestions: QuizQuestion[] = []
  private quizCurrentIndex = 0
  private quizScore = 0
  private quizSelectedOption: number | null = null
  private quizCompleted = false
  private quizReward = 0

  // Puzzle Game State
  private currentPuzzleIndex = 0
  private puzzleTiles: RuntimePuzzleTile[] = []
  private puzzleSelectedPos: number | null = null
  private puzzleWon = false
  private puzzleReward = 0

  constructor() {
    this.container = document.createElement('div')
    this.container.className = 'brain-modal-overlay'
    this.container.hidden = true
    this.container.style.display = 'none'
    document.body.appendChild(this.container)

    this.container.addEventListener('pointerdown', (event) => event.stopPropagation())
    this.container.addEventListener('pointerup', (event) => event.stopPropagation())

    // Close when clicking outside modal sheet on the overlay background
    this.container.addEventListener('click', (event) => {
      event.stopPropagation()
      if (event.target === this.container) {
        this.close()
      }
    })

    // Close when pressing Escape key
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !this.container.hidden) {
        this.close()
      }
    })

    this.initMemoryGame()
    this.initQuizGame()
    this.initPuzzleGame()
    this.render()
  }

  open(tab?: BrainHubTab): void {
    if (tab) {
      this.currentTab = tab
    }
    // Invalidate any pending re-enable timer from a recent close (BUG-7 fix).
    this.inputToken++
    setSceneInput(false)

    this.checkBadges(false)
    this.container.hidden = false
    this.container.style.display = 'grid'
    this.render()
    audioManager.play('wardrobe')
  }

  close(): void {
    this.container.hidden = true
    this.container.style.display = 'none'
    audioManager.play('button')
    const token = ++this.inputToken
    const restore = (): void => {
      if (token !== this.inputToken) return
      setSceneInput(true)
    }
    // Restore input immediately, then run one safety pass in case a scene
    // transition started right after closing (new scene created mid-transition).
    restore()
    setTimeout(restore, 120)
  }

  private setTab(tab: BrainHubTab): void {
    this.currentTab = tab
    audioManager.play('button')
    this.render()
  }

  // --- MEMORY GAME LOGIC ---
  private initMemoryGame(): void {
    this.memoryFlips = 0
    this.memoryMatchesFound = 0
    this.firstFlippedIdx = null
    this.secondFlippedIdx = null
    this.memoryLocked = false
    this.memoryWon = false
    this.memoryReward = 0

    let pairCount = 4
    if (this.memoryTier === 'explorer') pairCount = 6
    if (this.memoryTier === 'champion') pairCount = 8

    const selectedCards = MEMORY_CARDS.slice(0, pairCount)
    const deck: DeckCard[] = []
    let uidCounter = 0

    selectedCards.forEach((card) => {
      deck.push({ ...card, uid: uidCounter++, flipped: false, matched: false })
      deck.push({ ...card, uid: uidCounter++, flipped: false, matched: false })
    })

    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = deck[i]
      deck[i] = deck[j]
      deck[j] = temp
    }

    this.memoryDeck = deck
  }

  private handleCardClick(idx: number): void {
    if (this.memoryLocked || idx === this.firstFlippedIdx) return
    const card = this.memoryDeck[idx]
    if (card.flipped || card.matched) return

    card.flipped = true
    audioManager.play('pop')

    if (this.firstFlippedIdx === null) {
      this.firstFlippedIdx = idx
      this.render()
      return
    }

    this.secondFlippedIdx = idx
    this.memoryFlips++
    this.memoryLocked = true
    this.render()

    const firstCard = this.memoryDeck[this.firstFlippedIdx]
    if (firstCard.id === card.id) {
      // Match!
      firstCard.matched = true
      card.matched = true
      this.memoryMatchesFound++
      audioManager.play('chime')
      this.firstFlippedIdx = null
      this.secondFlippedIdx = null
      this.memoryLocked = false

      const totalPairs = this.memoryDeck.length / 2
      if (this.memoryMatchesFound >= totalPairs) {
        this.memoryWon = true
        let reward = 15
        if (this.memoryTier === 'explorer') reward = 25
        if (this.memoryTier === 'champion') reward = 35
        this.memoryReward = reward

        playerState.currency.add(reward)
        const stats = playerState.data.minigames
        stats.memoryMatches = (stats.memoryMatches ?? 0) + 1
        stats.brainCoinsEarned = (stats.brainCoinsEarned ?? 0) + reward
        completeBrainGame()
        audioManager.play('purchase')
        showToast(`🎉 Memory Champion! +${reward} ⭐`)
        this.checkBadges(true)
      }
      this.render()
    } else {
      // No match -> flip back after brief pause
      setTimeout(() => {
        if (this.firstFlippedIdx !== null) this.memoryDeck[this.firstFlippedIdx].flipped = false
        if (this.secondFlippedIdx !== null) this.memoryDeck[this.secondFlippedIdx].flipped = false
        this.firstFlippedIdx = null
        this.secondFlippedIdx = null
        this.memoryLocked = false
        this.render()
      }, 700)
    }
  }

  // --- QUIZ GAME LOGIC ---
  private initQuizGame(): void {
    let pool = QUIZ_QUESTIONS.filter((q) => q.tier === this.quizTier)
    if (this.quizCategory !== 'all') {
      pool = pool.filter((q) => q.category === this.quizCategory)
    }
    // Shuffle questions
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    let questions = shuffled.slice(0, 5)
    // BUG-14 fix: a single category can hold fewer than 5 questions per tier.
    // Top the round up to a full 5 with same-tier questions from other
    // categories so quiz length, rewards and perfect-score logic stay consistent.
    if (questions.length < 5) {
      const usedIds = new Set(questions.map((q) => q.id))
      const fillers = QUIZ_QUESTIONS
        .filter((q) => q.tier === this.quizTier && !usedIds.has(q.id))
        .sort(() => Math.random() - 0.5)
      questions = [...questions, ...fillers.slice(0, 5 - questions.length)]
    }
    this.quizQuestions = questions
    this.quizCurrentIndex = 0
    this.quizScore = 0
    this.quizSelectedOption = null
    this.quizCompleted = false
    this.quizReward = 0
  }

  private handleQuizOption(optionIdx: number): void {
    if (this.quizSelectedOption !== null) return
    this.quizSelectedOption = optionIdx
    const currentQ = this.quizQuestions[this.quizCurrentIndex]
    const isCorrect = optionIdx === currentQ.correctIndex

    if (isCorrect) {
      this.quizScore++
      audioManager.play('chime')
      const stats = playerState.data.minigames
      stats.quizCorrect = (stats.quizCorrect ?? 0) + 1
      if (currentQ.category === 'math') {
        stats.mathQuizCorrect = (stats.mathQuizCorrect ?? 0) + 1
      }
      playerState.save()
    } else {
      audioManager.play('drop')
    }

    this.render()
  }

  private handleQuizNext(): void {
    if (this.quizCurrentIndex < this.quizQuestions.length - 1) {
      this.quizCurrentIndex++
      this.quizSelectedOption = null
      audioManager.play('button')
      this.render()
    } else {
      // Quiz completed!
      this.quizCompleted = true
      let reward = this.quizScore * 5
      if (this.quizScore === this.quizQuestions.length && this.quizScore > 0) {
        reward += 10 // Perfect score bonus!
      }
      this.quizReward = reward
      completeBrainGame()

      if (reward > 0) {
        playerState.currency.add(reward)
        const stats = playerState.data.minigames
        stats.brainCoinsEarned = (stats.brainCoinsEarned ?? 0) + reward
        playerState.save(true)
        audioManager.play('purchase')
        showToast(`🌟 Quiz Complete! +${reward} ⭐`)
        this.checkBadges(true)
      }
      this.render()
    }
  }

  // --- PUZZLE GAME LOGIC ---
  private initPuzzleGame(): void {
    const puzzle = PUZZLES[this.currentPuzzleIndex]
    this.puzzleWon = false
    this.puzzleSelectedPos = null
    this.puzzleReward = 0

    // Clone tiles and shuffle positions
    const tiles: RuntimePuzzleTile[] = puzzle.tiles.map((t, idx) => ({
      ...t,
      currentPos: idx,
    }))

    // Shuffle positions ensuring not all in original spots
    const total = tiles.length
    const positions = Array.from({ length: total }, (_, i) => i)
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = positions[i]
      positions[i] = positions[j]
      positions[j] = temp
    }

    // Ensure it's not pre-solved
    const allMatching = positions.every((pos, i) => pos === i)
    if (allMatching && total >= 2) {
      const tmp = positions[0]
      positions[0] = positions[1]
      positions[1] = tmp
    }

    tiles.forEach((t, i) => {
      t.currentPos = positions[i]
    })

    this.puzzleTiles = tiles
  }

  private handlePuzzleTileClick(pos: number): void {
    if (this.puzzleWon) return

    if (this.puzzleSelectedPos === null) {
      this.puzzleSelectedPos = pos
      audioManager.play('pop')
      this.render()
      return
    }

    if (this.puzzleSelectedPos === pos) {
      this.puzzleSelectedPos = null
      audioManager.play('button')
      this.render()
      return
    }

    // Swap tile positions
    const tileA = this.puzzleTiles.find((t) => t.currentPos === this.puzzleSelectedPos)
    const tileB = this.puzzleTiles.find((t) => t.currentPos === pos)

    if (tileA && tileB) {
      const tempPos = tileA.currentPos
      tileA.currentPos = tileB.currentPos
      tileB.currentPos = tempPos
      audioManager.play('pop')
    }

    this.puzzleSelectedPos = null
    this.checkPuzzleSolved()
    this.render()
  }

  private hintFixOnePiece(): void {
    if (this.puzzleWon) return

    // Find first misplaced tile
    const misplaced = this.puzzleTiles.find((t) => t.currentPos !== t.targetIndex)
    if (!misplaced) return

    // Find the tile sitting where misplaced belongs
    const occupier = this.puzzleTiles.find((t) => t.currentPos === misplaced.targetIndex)
    if (occupier) {
      const targetPos = misplaced.targetIndex
      occupier.currentPos = misplaced.currentPos
      misplaced.currentPos = targetPos
      audioManager.play('chime')
      showToast(`💡 Hint: Placed Piece #${targetPos + 1} (${misplaced.label}) into its spot!`)
    }

    this.puzzleSelectedPos = null
    this.checkPuzzleSolved()
    this.render()
  }

  private checkPuzzleSolved(): void {
    const isSolved = this.puzzleTiles.every((t) => t.currentPos === t.targetIndex)
    if (isSolved && !this.puzzleWon) {
      this.puzzleWon = true
      const reward = 25
      this.puzzleReward = reward

      playerState.currency.add(reward)
      const stats = playerState.data.minigames
      stats.puzzlesSolved = (stats.puzzlesSolved ?? 0) + 1
      stats.brainCoinsEarned = (stats.brainCoinsEarned ?? 0) + reward
      completeBrainGame()
      audioManager.play('purchase')
      showToast(`🧩 Fantastic! Puzzle Solved! +${reward} ⭐`)
      this.checkBadges(true)
    }
  }

  // --- BADGE EVALUATION ---
  private checkBadges(notify: boolean): void {
    const stats = playerState.data.minigames
    const earned = evaluateBadges(stats)

    earned.forEach((badgeId) => {
      if (!stats[badgeId]) {
        stats[badgeId] = 1
        const badgeDef = BRAIN_BADGES.find((b) => b.id === badgeId)
        if (badgeDef) {
          playerState.currency.add(20)
          stats.brainCoinsEarned = (stats.brainCoinsEarned ?? 0) + 20
          if (notify) {
            showToast(`🏆 Badge Unlocked: ${badgeDef.name}! +20 ⭐`)
          }
        }
      }
    })
    playerState.save()
  }

  // --- RENDERING ---
  private render(): void {
    this.container.innerHTML = `
      <div class="brain-modal-sheet" role="dialog" aria-modal="true" aria-label="Little Scholars Brain Academy">
        <header class="brain-header">
          <div class="brain-title-area">
            <span class="brain-logo" title="Professor Owl Mascot">🦉</span>
            <div>
              <small>✨ LITTLE SCHOLARS CLUB ✨</small>
              <h2>Brain Academy Hub</h2>
            </div>
          </div>
          <button type="button" class="brain-close-btn" aria-label="Close brain games" title="Close">✕</button>
        </header>

        <nav class="brain-nav-tabs">
          <button type="button" class="brain-tab-btn ${this.currentTab === 'memory' ? 'active' : ''}" data-tab="memory">
            <span>🌸</span><b>Memory Garden</b>
          </button>
          <button type="button" class="brain-tab-btn ${this.currentTab === 'quiz' ? 'active' : ''}" data-tab="quiz">
            <span>🎓</span><b>Quiz Academy</b>
          </button>
          <button type="button" class="brain-tab-btn ${this.currentTab === 'puzzle' ? 'active' : ''}" data-tab="puzzle">
            <span>🧩</span><b>Puzzle Workshop</b>
          </button>
          <button type="button" class="brain-tab-btn ${this.currentTab === 'badges' ? 'active' : ''}" data-tab="badges">
            <span>🏆</span><b>Honor Scrapbook</b>
          </button>
        </nav>

        <div class="brain-body">
          ${this.renderTabContent()}
        </div>
      </div>
    `

    this.bindEvents()
  }

  private renderTabContent(): string {
    switch (this.currentTab) {
      case 'memory':
        return this.renderMemoryTab()
      case 'quiz':
        return this.renderQuizTab()
      case 'puzzle':
        return this.renderPuzzleTab()
      case 'badges':
        return this.renderBadgesTab()
    }
  }

  // --- MEMORY TAB HTML ---
  private renderMemoryTab(): string {
    const totalPairs = this.memoryDeck.length / 2
    let gridCols = 'repeat(4, 1fr)'
    if (this.memoryDeck.length > 12) gridCols = 'repeat(4, 1fr)'

    const cardsHtml = this.memoryDeck
      .map((card, idx) => {
        const isFlipped = card.flipped || card.matched
        return `
          <button type="button" class="memory-card ${isFlipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}" data-idx="${idx}" ${card.matched ? 'disabled' : ''}>
            <div class="memory-card-inner">
              <div class="memory-card-front">
                <span>🌟</span>
              </div>
              <div class="memory-card-back">
                <span class="card-icon">${card.icon}</span>
                <small class="card-label">${card.label}</small>
              </div>
            </div>
          </button>
        `
      })
      .join('')

    return `
      <div class="game-panel memory-panel">
        <div class="game-toolbar">
          <div class="tier-selector">
            <button type="button" class="tier-pill ${this.memoryTier === 'junior' ? 'active' : ''}" data-tier="junior">Junior (8)</button>
            <button type="button" class="tier-pill ${this.memoryTier === 'explorer' ? 'active' : ''}" data-tier="explorer">Explorer (12)</button>
            <button type="button" class="tier-pill ${this.memoryTier === 'champion' ? 'active' : ''}" data-tier="champion">Champion (16)</button>
          </div>
          <div class="stats-badge">
            <span>Pairs: <b>${this.memoryMatchesFound} / ${totalPairs}</b></span>
            <span>Flips: <b>${this.memoryFlips}</b></span>
          </div>
          <button type="button" class="btn-refresh" id="memory-reset-btn" title="Restart Game">↺ New Game</button>
        </div>

        ${
          this.memoryWon
            ? `
          <div class="celebration-banner">
            <h3>🎉 Outstanding Memory!</h3>
            <p>You matched all pairs in <b>${this.memoryFlips}</b> flips!</p>
            <div class="reward-pill">+ ${this.memoryReward} ⭐ Coins</div>
            <button type="button" class="btn-action" id="memory-again-btn">Play Again</button>
          </div>
        `
            : `
          <div class="memory-grid" style="grid-template-columns: ${gridCols}">
            ${cardsHtml}
          </div>
        `
        }
      </div>
    `
  }

  // --- QUIZ TAB HTML ---
  private renderQuizTab(): string {
    if (this.quizQuestions.length === 0) {
      return `
        <div class="quiz-panel">
          <p>No questions found for this tier. Tap below to reset!</p>
          <button type="button" class="btn-action" id="quiz-reset-btn">Reset Quiz</button>
        </div>
      `
    }

    if (this.quizCompleted) {
      return `
        <div class="game-panel quiz-panel">
          <div class="celebration-banner">
            <h3>🎓 Chalkboard Quiz Finished!</h3>
            <p>You scored <b>${this.quizScore} out of ${this.quizQuestions.length}</b>!</p>
            <div class="reward-pill">+ ${this.quizReward} ⭐ Coins</div>
            <p style="margin-top:8px;font-size:0.9rem;color:#754c72;">${
              this.quizScore === this.quizQuestions.length
                ? '🌟 Perfect score! You are a genuine genius!'
                : this.quizScore >= 3
                  ? 'Great effort! Your brain is growing stronger!'
                  : 'Keep learning! Every mistake teaches something new!'
            }</p>
            <button type="button" class="btn-action" id="quiz-again-btn" style="margin-top:12px">Try Another Quiz</button>
          </div>
        </div>
      `
    }

    const currentQ = this.quizQuestions[this.quizCurrentIndex]
    const hasAnswered = this.quizSelectedOption !== null

    const optionsHtml = currentQ.options
      .map((opt, i) => {
        let stateClass = ''
        if (hasAnswered) {
          if (i === currentQ.correctIndex) stateClass = 'correct'
          else if (i === this.quizSelectedOption) stateClass = 'wrong'
        }
        return `
          <button type="button" class="quiz-option-btn ${stateClass}" data-opt="${i}" ${hasAnswered ? 'disabled' : ''}>
            <span class="opt-letter">${String.fromCharCode(65 + i)}</span>
            <span class="opt-text">${opt}</span>
          </button>
        `
      })
      .join('')

    return `
      <div class="game-panel quiz-panel">
        <div class="game-toolbar">
          <div class="tier-selector">
            <button type="button" class="tier-pill ${this.quizTier === 'junior' ? 'active' : ''}" data-quiz-tier="junior">Junior (7-8y)</button>
            <button type="button" class="tier-pill ${this.quizTier === 'explorer' ? 'active' : ''}" data-quiz-tier="explorer">Explorer (9-10y)</button>
            <button type="button" class="tier-pill ${this.quizTier === 'champion' ? 'active' : ''}" data-quiz-tier="champion">Champion (11-12y)</button>
          </div>
          <div class="category-pills">
            <button type="button" class="cat-pill ${this.quizCategory === 'all' ? 'active' : ''}" data-cat="all">All</button>
            <button type="button" class="cat-pill ${this.quizCategory === 'math' ? 'active' : ''}" data-cat="math">➕ Math</button>
            <button type="button" class="cat-pill ${this.quizCategory === 'science' ? 'active' : ''}" data-cat="science">🌿 Science</button>
            <button type="button" class="cat-pill ${this.quizCategory === 'words' ? 'active' : ''}" data-cat="words">📚 Words</button>
          </div>
        </div>

        <div class="quiz-card">
          <div class="quiz-progress-bar">
            <span>Question <b>${this.quizCurrentIndex + 1} of ${this.quizQuestions.length}</b></span>
            <span>Score: <b>${this.quizScore} ⭐</b></span>
          </div>

          <div class="quiz-question-box">
            <span class="quiz-icon">${currentQ.icon}</span>
            <h3 class="quiz-question">${currentQ.question}</h3>
          </div>

          <div class="quiz-options-list">
            ${optionsHtml}
          </div>

          ${
            hasAnswered
              ? `
            <div class="quiz-explanation">
              <p>💡 ${currentQ.explanation}</p>
              <button type="button" class="btn-action" id="quiz-next-btn">
                ${this.quizCurrentIndex === this.quizQuestions.length - 1 ? 'See Results 🌟' : 'Next Question ➜'}
              </button>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `
  }

  // --- PUZZLE TAB HTML ---
  private renderPuzzleTab(): string {
    const puzzle = PUZZLES[this.currentPuzzleIndex]
    const gridSize = puzzle.gridSize

    // Render tiles in order of their currentPos
    const sortedTiles = [...this.puzzleTiles].sort((a, b) => a.currentPos - b.currentPos)

    const selectedTile = this.puzzleSelectedPos !== null
      ? this.puzzleTiles.find((t) => t.currentPos === this.puzzleSelectedPos)
      : null

    const tilesHtml = sortedTiles
      .map((tile) => {
        const isSelected = this.puzzleSelectedPos === tile.currentPos
        const isInCorrectPlace = tile.currentPos === tile.targetIndex
        return `
          <button type="button" class="puzzle-tile ${isSelected ? 'selected' : ''} ${isInCorrectPlace ? 'correct-spot' : ''}"
            style="background:${tile.bg}"
            data-puzzle-pos="${tile.currentPos}"
            aria-label="${tile.label}, piece number ${tile.targetIndex + 1}">
            <div class="tile-header-bar">
              <span class="tile-badge">Piece #${tile.targetIndex + 1}</span>
              ${
                isInCorrectPlace
                  ? '<span class="tile-status-tag correct">✓ Match!</span>'
                  : `<span class="tile-status-tag need">Go to #${tile.targetIndex + 1}</span>`
              }
            </div>
            <span class="puzzle-icon">${tile.icon}</span>
            <small class="puzzle-label">${tile.label}</small>
            <span class="slot-indicator">In Slot #${tile.currentPos + 1}</span>
          </button>
        `
      })
      .join('')

    // Target Goal mini grid
    const goalTilesHtml = puzzle.tiles.map((t, idx) => `
      <div class="puzzle-goal-tile" style="background:${t.bg}">
        <span class="goal-num">#${idx + 1}</span>
        <span class="goal-icon">${t.icon}</span>
        <small class="goal-label">${t.label}</small>
      </div>
    `).join('')

    return `
      <div class="game-panel puzzle-panel">
        <div class="game-toolbar">
          <div class="puzzle-selector">
            ${PUZZLES.map(
              (p, idx) => `
              <button type="button" class="puzzle-pill ${this.currentPuzzleIndex === idx ? 'active' : ''}" data-puzzle-idx="${idx}">
                ${p.title}
              </button>
            `
            ).join('')}
          </div>
          <div class="puzzle-actions">
            <button type="button" class="btn-action-hint" id="puzzle-hint-btn">💡 Fix 1 Piece</button>
            <button type="button" class="btn-refresh" id="puzzle-shuffle-btn">↺ Shuffle</button>
          </div>
        </div>

        <!-- Target Goal Preview -->
        <div class="puzzle-guide-box">
          <div class="puzzle-goal-header">
            <span>🎯 <b>Goal Picture (Target)</b></span>
            <small>Swap pieces below until they match this order!</small>
          </div>
          <div class="puzzle-goal-grid" style="grid-template-columns: repeat(${gridSize}, 1fr)">
            ${goalTilesHtml}
          </div>
        </div>

        <!-- Dynamic Instructions for Kids -->
        <div class="puzzle-instruction-bar ${selectedTile ? 'highlight' : ''}">
          ${
            selectedTile
              ? `<span>✨ <b>Piece #${selectedTile.targetIndex + 1} (${selectedTile.label})</b> picked up! <b>Now tap another tile to swap them!</b> (Or tap again to unselect)</span>`
              : '<span>👆 <b>How to solve:</b> Tap any piece to pick it up, then tap another piece to swap their places!</span>'
          }
        </div>

        ${
          this.puzzleWon
            ? `
          <div class="celebration-banner">
            <h3>🧩 Splendid Puzzle Solving!</h3>
            <p>You reassembled <b>${puzzle.title}</b> flawlessly!</p>
            <div class="reward-pill">+ ${this.puzzleReward} ⭐ Coins</div>
            <button type="button" class="btn-action" id="puzzle-again-btn">Play Another</button>
          </div>
        `
            : `
          <div class="puzzle-board" style="grid-template-columns: repeat(${gridSize}, 1fr)">
            ${tilesHtml}
          </div>
        `
        }
      </div>
    `
  }

  // --- BADGES TAB HTML ---
  private renderBadgesTab(): string {
    const stats = playerState.data.minigames
    const badgesHtml = BRAIN_BADGES.map((badge) => {
      const isUnlocked = Boolean(stats[badge.id])
      return `
        <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="badge-icon-box">
            <span class="badge-icon">${badge.icon}</span>
            ${isUnlocked ? '<span class="badge-medal">🏆</span>' : ''}
          </div>
          <div class="badge-info">
            <h4>${badge.name}</h4>
            <p class="badge-desc">${badge.description}</p>
            <small class="badge-req">🎯 ${badge.requirement}</small>
          </div>
          <div class="badge-status">
            ${isUnlocked ? '<b class="status-unlocked">UNLOCKED ⭐</b>' : '<span class="status-locked">🔒 In Progress</span>'}
          </div>
        </div>
      `
    }).join('')

    return `
      <div class="game-panel badges-panel">
        <div class="brain-stats-strip">
          <div class="stat-pill">🧠 <span>Memory Matches:</span> <b>${stats.memoryMatches ?? 0}</b></div>
          <div class="stat-pill">📝 <span>Quiz Correct:</span> <b>${stats.quizCorrect ?? 0}</b></div>
          <div class="stat-pill">🧩 <span>Puzzles Solved:</span> <b>${stats.puzzlesSolved ?? 0}</b></div>
          <div class="stat-pill">⭐ <span>Brain Coins Won:</span> <b>${stats.brainCoinsEarned ?? 0}</b></div>
        </div>

        <div class="badges-grid">
          ${badgesHtml}
        </div>

        <div class="badges-footer">
          <button type="button" class="btn-action" id="badges-close-btn">✓ Close & Return to Town</button>
        </div>
      </div>
    `
  }

  // --- DOM EVENT BINDING ---
  private bindEvents(): void {
    // Close button (bind both click and pointerdown for instant responsiveness)
    const closeBtn = this.container.querySelector<HTMLButtonElement>('.brain-close-btn')
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.stopPropagation()
        this.close()
      }
    }

    // Badges bottom close button
    const badgesCloseBtn = this.container.querySelector<HTMLButtonElement>('#badges-close-btn')
    if (badgesCloseBtn) {
      badgesCloseBtn.onclick = (e) => {
        e.stopPropagation()
        this.close()
      }
    }

    // Tabs
    this.container.querySelectorAll<HTMLButtonElement>('.brain-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab as BrainHubTab
        if (tab) this.setTab(tab)
      })
    })

    // Memory events
    this.container.querySelectorAll<HTMLButtonElement>('.tier-pill[data-tier]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.memoryTier = btn.dataset.tier as DifficultyTier
        this.initMemoryGame()
        this.render()
      })
    })

    this.container.querySelector('#memory-reset-btn')?.addEventListener('click', () => {
      this.initMemoryGame()
      this.render()
    })
    this.container.querySelector('#memory-again-btn')?.addEventListener('click', () => {
      this.initMemoryGame()
      this.render()
    })

    this.container.querySelectorAll<HTMLButtonElement>('.memory-card').forEach((card) => {
      card.addEventListener('click', () => {
        const idx = Number(card.dataset.idx)
        if (!isNaN(idx)) this.handleCardClick(idx)
      })
    })

    // Quiz events
    this.container.querySelectorAll<HTMLButtonElement>('.tier-pill[data-quiz-tier]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.quizTier = btn.dataset.quizTier as DifficultyTier
        this.initQuizGame()
        this.render()
      })
    })

    this.container.querySelectorAll<HTMLButtonElement>('.cat-pill[data-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.quizCategory = btn.dataset.cat as 'all' | 'math' | 'science' | 'words'
        this.initQuizGame()
        this.render()
      })
    })

    this.container.querySelectorAll<HTMLButtonElement>('.quiz-option-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const opt = Number(btn.dataset.opt)
        if (!isNaN(opt)) this.handleQuizOption(opt)
      })
    })

    this.container.querySelector('#quiz-next-btn')?.addEventListener('click', () => {
      this.handleQuizNext()
    })

    this.container.querySelector('#quiz-again-btn')?.addEventListener('click', () => {
      this.initQuizGame()
      this.render()
    })
    this.container.querySelector('#quiz-reset-btn')?.addEventListener('click', () => {
      this.initQuizGame()
      this.render()
    })

    // Puzzle events
    this.container.querySelectorAll<HTMLButtonElement>('.puzzle-pill[data-puzzle-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.puzzleIdx)
        if (!isNaN(idx)) {
          this.currentPuzzleIndex = idx
          this.initPuzzleGame()
          this.render()
        }
      })
    })

    this.container.querySelector('#puzzle-shuffle-btn')?.addEventListener('click', () => {
      this.initPuzzleGame()
      this.render()
    })
    this.container.querySelector('#puzzle-hint-btn')?.addEventListener('click', () => {
      this.hintFixOnePiece()
    })
    this.container.querySelector('#puzzle-again-btn')?.addEventListener('click', () => {
      this.initPuzzleGame()
      this.render()
    })

    this.container.querySelectorAll<HTMLButtonElement>('.puzzle-tile').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pos = Number(btn.dataset.puzzlePos)
        if (!isNaN(pos)) this.handlePuzzleTileClick(pos)
      })
    })
  }
}

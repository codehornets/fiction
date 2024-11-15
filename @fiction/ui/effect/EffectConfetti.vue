<script lang="ts" setup>
import { vue, waitFor } from '@fiction/core'
import confetti from 'canvas-confetti'

type ConfettiMode = 'default' | 'firework' | 'snow'

const {
  active,
  mode = 'default',
  duration = 3000,
  particleCount = 50,
  spread = 360,
  testing = false,
  colors = [
    '#FF1461', // Pink
    '#18FF92', // Neon Green
    '#1A8FE3', // Blue
    '#FFD300', // Yellow
    '#FF7F50', // Coral
    '#7B68EE', // Purple
  ],
} = defineProps<{
  active: boolean
  mode?: ConfettiMode
  duration?: number
  particleCount?: number
  spread?: number
  testing?: boolean
  colors?: string[]
}>()

const canvasContainer = vue.ref<HTMLDivElement | null>(null)
const instanceCreated = vue.ref(false)
let myConfetti: ReturnType<typeof confetti.create>
let timeoutId: NodeJS.Timeout | null = null
let animationFrameId: number | null = null
let cleanupHandlers: (() => void)[] = []

// Utility function for random range
function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min
}

const defaultConfettiConfig = {
  particleCount,
  spread,
  colors,
}

const fireworkDefaults = {
  spread: 360,
  ticks: 50,
  gravity: 0,
  decay: 0.94,
  startVelocity: 30,
  colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8'],
  origin: { x: 0.5, y: 0.5 },
}

function createConfettiInstance() {
  if (!canvasContainer.value || instanceCreated.value)
    return false

  const canvas = document.createElement('canvas')
  canvas.className = 'pointer-events-none fixed inset-0 z-[100] w-full h-full'

  canvasContainer.value.innerHTML = ''
  canvasContainer.value.appendChild(canvas)

  myConfetti = confetti.create(canvas, {
    resize: true,
    useWorker: true,
    disableForReducedMotion: true,
  })

  instanceCreated.value = true
  return true
}

function fireDefaultConfetti(x = 0.5, y = 0.5) {
  if (!myConfetti)
    return
  myConfetti({ ...defaultConfettiConfig, origin: { x, y } })
}

function fireFirework(x = 0.5, y = 0.5) {
  if (!myConfetti)
    return

  myConfetti({
    ...fireworkDefaults,
    particleCount: 40,
    scalar: 1.2,
    shapes: ['star'],
    origin: { x, y },
  })

  myConfetti({
    ...fireworkDefaults,
    particleCount: 10,
    scalar: 0.75,
    shapes: ['circle'],
    origin: { x, y },
  })
}

function startSnowfall() {
  if (!myConfetti)
    return

  const animationEnd = Date.now() + duration
  let skew = 1

  function frame() {
    const timeLeft = animationEnd - Date.now()
    const ticks = Math.max(200, 500 * (timeLeft / duration))
    skew = Math.max(0.8, skew - 0.001)

    myConfetti({
      particleCount: 1,
      startVelocity: 0,
      ticks,
      origin: {
        x: Math.random(),
        y: (Math.random() * skew) - 0.2,
      },
      colors: ['#ffffff'],
      shapes: ['circle'],
      gravity: randomInRange(0.4, 0.6),
      scalar: randomInRange(0.4, 1),
      drift: randomInRange(-0.4, 0.4),
    })

    if (timeLeft > 0) {
      animationFrameId = requestAnimationFrame(frame)
    }
  }

  frame()
}

async function fireConfetti(x = 0.5, y = 0.5) {
  // Only create instance when needed
  if (!instanceCreated.value) {
    const created = createConfettiInstance()
    if (!created)
      return

    // Give the canvas time to initialize
    await waitFor(20)
  }

  if (!myConfetti)
    return

  switch (mode) {
    case 'firework': {
      fireFirework(x, y)
      setTimeout(() => fireFirework(x, y), 100)
      setTimeout(() => fireFirework(x, y), 200)
      break
    }
    case 'snow': {
      startSnowfall()
      break
    }
    default: {
      fireDefaultConfetti(x, y)
    }
  }
}

function stopConfetti() {
  if (myConfetti) {
    myConfetti.reset()
  }
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

function cleanup() {
  stopConfetti()
  cleanupHandlers.forEach(handler => handler())
  cleanupHandlers = []
  if (canvasContainer.value) {
    canvasContainer.value.innerHTML = ''
  }
  instanceCreated.value = false
}

// Only setup on client-side mount
vue.onMounted(() => {
  // Handle active state changes
  const activeWatcher = vue.watch(() => active, async (newValue) => {
    if (newValue) {
      await fireConfetti()
      if (mode !== 'snow') {
        timeoutId = setTimeout(() => {
          stopConfetti()
        }, duration)
      }
    }
    else {
      stopConfetti()
    }
  })
  cleanupHandlers.push(() => activeWatcher())

  // Handle mode changes
  const modeWatcher = vue.watch(() => mode, async (newValue, oldValue) => {
    if (active && newValue !== oldValue) {
      stopConfetti()
      await fireConfetti()
      if (newValue !== 'snow') {
        timeoutId = setTimeout(() => {
          stopConfetti()
        }, duration)
      }
    }
  })
  cleanupHandlers.push(() => modeWatcher())

  // Setup click handler for testing
  if (testing) {
    const handleClick = async (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight

      stopConfetti()
      await fireConfetti(x, y)

      if (mode !== 'snow') {
        timeoutId = setTimeout(() => {
          stopConfetti()
        }, duration)
      }
    }

    window.addEventListener('click', handleClick)
    cleanupHandlers.push(() => window.removeEventListener('click', handleClick))
  }
})

vue.onBeforeUnmount(cleanup)
</script>

<template>
  <teleport to=".x-site">
    <div
      ref="canvasContainer"
      :class="!active && !testing ? 'hidden' : 'block'"
    />
  </teleport>
</template>

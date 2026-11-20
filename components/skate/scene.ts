import * as THREE from 'three'
import { PALETTE, SPACING, type SceneStation, type TrickName } from './tricks'

type Options = {
  reducedMotion: boolean
  /** Scroll progress from 0 (top) to 1 (bottom). Read every frame. */
  getProgress: () => number
  /** Called when the nearest stop changes: -1 is the intro, stations.length the outro. */
  onStation: (index: number) => void
  /** Called every rendered frame with the smoothed progress. */
  onProgress: (progress: number) => void
}

export type SkateScene = { dispose: () => void }

const JUMP = 3.4 // half the length of the jump, in world units
const RIDE_HEIGHT = 0.3 // deck centre above the floor when rolling
const WHEEL_R = 0.09
const TAU = Math.PI * 2

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

/** Rotation of the board at point u (0 to 1) through a trick. */
function trickPose(trick: TrickName, u: number) {
  const e = easeInOut(Math.min(1, Math.max(0, (u - 0.12) / 0.7)))
  // Every trick pops the tail first, then levels out for the landing.
  const pitch = 0.42 * Math.sin(Math.PI * Math.min(1, u * 2.2)) * (u < 0.46 ? 1 : 0)
  switch (trick) {
    case 'Kickflip':
      return { pitch, yaw: 0, roll: TAU * e }
    case 'Heelflip':
      return { pitch, yaw: 0, roll: -TAU * e }
    case 'Pop Shove-it':
      return { pitch, yaw: Math.PI * e, roll: 0 }
    case '360 Flip':
      return { pitch, yaw: TAU * e, roll: TAU * e }
    case 'Varial Kickflip':
      return { pitch, yaw: Math.PI * e, roll: TAU * e }
    case 'Frontside 180':
      return { pitch, yaw: Math.PI * e, roll: 0 }
    default:
      return { pitch, yaw: 0, roll: 0 }
  }
}

/** Planks running down the rink, drawn once into a repeating texture. */
function plankTexture(maxAnisotropy: number) {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 512
  const g = c.getContext('2d')!
  const tones = [PALETTE.plank, PALETTE.wood, '#7a4f2e', '#664126']
  const plankW = 64
  for (let i = 0; i < c.width / plankW; i++) {
    g.fillStyle = tones[i % tones.length]
    g.fillRect(i * plankW, 0, plankW, c.height)
    // Grain: thin darker streaks along each plank.
    g.strokeStyle = 'rgba(30, 18, 8, 0.18)'
    g.lineWidth = 1
    for (let s = 0; s < 7; s++) {
      const x = i * plankW + 6 + Math.random() * (plankW - 12)
      g.beginPath()
      g.moveTo(x, 0)
      g.bezierCurveTo(x + 4, 170, x - 4, 340, x + 2, 512)
      g.stroke()
    }
    // Seams between planks and a butt joint at a random height.
    g.fillStyle = 'rgba(13, 11, 8, 0.85)'
    g.fillRect(i * plankW, 0, 2, c.height)
    g.fillRect(i * plankW, ((i * 197) % 512) | 0, plankW, 2)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.anisotropy = maxAnisotropy
  return tex
}

/** Text painted onto a sign. Shrinks the font until the words fit. */
function signTexture(index: string, text: string, kind: string, maxAnisotropy: number) {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 512
  const g = c.getContext('2d')!
  g.fillStyle = PALETTE.bark
  g.fillRect(0, 0, c.width, c.height)
  g.strokeStyle = PALETTE.moss
  g.lineWidth = 18
  g.strokeRect(9, 9, c.width - 18, c.height - 18)

  g.fillStyle = PALETTE.sage
  g.font = '600 40px ui-monospace, SFMono-Regular, Menlo, monospace'
  g.textBaseline = 'top'
  g.fillText(`${index} / ${kind.toUpperCase()}`, 56, 52)

  g.fillStyle = PALETTE.cream
  let size = 104
  let lines: string[] = []
  const maxW = c.width - 112
  while (size > 40) {
    g.font = `800 ${size}px system-ui, -apple-system, Segoe UI, sans-serif`
    lines = []
    let line = ''
    for (const word of text.toUpperCase().split(' ')) {
      const next = line ? `${line} ${word}` : word
      if (g.measureText(next).width > maxW && line) {
        lines.push(line)
        line = word
      } else line = next
    }
    lines.push(line)
    if (lines.length * size * 1.02 <= 330 && lines.every((l) => g.measureText(l).width <= maxW)) break
    size -= 6
  }
  lines.forEach((l, i) => g.fillText(l, 56, 130 + i * size * 1.02))

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = maxAnisotropy
  return tex
}

function buildBoard() {
  const board = new THREE.Group() // position along the rink
  const spin = new THREE.Group() // trick rotations
  board.add(spin)

  // Deck: a rounded rectangle, nose and tail along z.
  const len = 2
  const w = 0.56
  const r = w / 2
  const shape = new THREE.Shape()
  shape.moveTo(-w / 2, -len / 2 + r)
  shape.lineTo(-w / 2, len / 2 - r)
  shape.absarc(0, len / 2 - r, r, Math.PI, 0, true)
  shape.lineTo(w / 2, -len / 2 + r)
  shape.absarc(0, -len / 2 + r, r, 0, Math.PI, true)
  const deckGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.05,
    bevelEnabled: true,
    bevelSize: 0.012,
    bevelThickness: 0.012,
    bevelSegments: 2,
  })
  deckGeo.rotateX(-Math.PI / 2) // lie flat, shape's y becomes -z
  deckGeo.translate(0, -0.025, 0)

  const deck = new THREE.Mesh(
    deckGeo,
    new THREE.MeshStandardMaterial({ color: PALETTE.moss, roughness: 0.55 }),
  )
  deck.castShadow = true
  spin.add(deck)

  // Grip tape on top.
  const gripGeo = new THREE.ShapeGeometry(shape)
  gripGeo.rotateX(-Math.PI / 2)
  const grip = new THREE.Mesh(
    gripGeo,
    new THREE.MeshStandardMaterial({ color: '#141210', roughness: 1 }),
  )
  grip.position.y = 0.04
  grip.scale.setScalar(0.985)
  spin.add(grip)

  // Trucks and wheels.
  const metal = new THREE.MeshStandardMaterial({ color: '#8d8a83', metalness: 0.7, roughness: 0.35 })
  const urethane = new THREE.MeshStandardMaterial({ color: PALETTE.cream, roughness: 0.6 })
  const wheelGeo = new THREE.CylinderGeometry(WHEEL_R, WHEEL_R, 0.07, 20)
  wheelGeo.rotateZ(Math.PI / 2)
  const wheels: THREE.Mesh[] = []
  for (const z of [-0.62, 0.62]) {
    const truck = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.1), metal)
    truck.position.set(0, -0.09, z)
    truck.castShadow = true
    spin.add(truck)
    for (const x of [-0.24, 0.24]) {
      const wheel = new THREE.Mesh(wheelGeo, urethane)
      wheel.position.set(x, -0.21, z)
      wheel.castShadow = true
      spin.add(wheel)
      wheels.push(wheel)
    }
  }
  return { board, spin, wheels }
}

type ObstacleKind = 'hurdle' | 'box' | 'cones'

function buildObstacle(kind: ObstacleKind) {
  const g = new THREE.Group()
  const dark = new THREE.MeshStandardMaterial({ color: '#1c1813', roughness: 0.8 })
  const green = new THREE.MeshStandardMaterial({ color: PALETTE.moss, roughness: 0.6 })
  const brown = new THREE.MeshStandardMaterial({ color: PALETTE.bark, roughness: 0.7 })
  if (kind === 'hurdle') {
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.2, 16), green)
    bar.rotation.z = Math.PI / 2
    bar.position.y = 0.62
    g.add(bar)
    for (const x of [-1.5, 1.5]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.62, 0.1), dark)
      post.position.set(x, 0.31, 0)
      g.add(post)
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.7), dark)
      foot.position.set(x, 0.02, 0)
      g.add(foot)
    }
    return { group: g, height: 0.67 }
  }
  if (kind === 'box') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(3, 0.42, 1.2), brown)
    body.position.y = 0.21
    g.add(body)
    const coping = new THREE.Mesh(new THREE.BoxGeometry(3.04, 0.05, 1.24), green)
    coping.position.y = 0.43
    g.add(coping)
    return { group: g, height: 0.46 }
  }
  const coneGeo = new THREE.ConeGeometry(0.17, 0.5, 18)
  const band = new THREE.MeshStandardMaterial({ color: PALETTE.cream, roughness: 0.6 })
  for (const x of [-1.1, 0, 1.1]) {
    const cone = new THREE.Mesh(coneGeo, brown)
    cone.position.set(x, 0.25, 0)
    g.add(cone)
    const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.125, 0.07, 18), band)
    stripe.position.set(x, 0.3, 0)
    g.add(stripe)
  }
  return { group: g, height: 0.5 }
}

export function createSkateScene(
  canvas: HTMLCanvasElement,
  stations: SceneStation[],
  opts: Options,
): SkateScene | null {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  } catch {
    return null
  }

  const small = () => window.innerWidth < 768
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small() ? 1.5 : 1.75))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = !small()
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  const aniso = renderer.capabilities.getMaxAnisotropy()

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(PALETTE.ink)
  scene.fog = new THREE.Fog(PALETTE.ink, 18, 62)

  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 200)

  // Light: warm sky, dark ground, plus a sun that follows the board for shadows.
  scene.add(new THREE.HemisphereLight('#f3e3c6', '#120d08', 1.1))
  const sun = new THREE.DirectionalLight('#ffe9c7', 2.1)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  const sc = sun.shadow.camera
  sc.left = -8
  sc.right = 8
  sc.top = 8
  sc.bottom = -8
  sc.near = 1
  sc.far = 40
  sun.shadow.bias = -0.0005
  scene.add(sun, sun.target)

  const total = (stations.length + 1) * SPACING
  const floorLen = total + 80

  // Floor.
  const planks = plankTexture(aniso)
  planks.repeat.set(16 / 4, floorLen / 4)
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(16, floorLen),
    new THREE.MeshStandardMaterial({ map: planks, roughness: 0.62 }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.z = -total / 2
  floor.receiveShadow = true
  scene.add(floor)

  // Rink walls: black boards with a green rail on top.
  const wallMat = new THREE.MeshStandardMaterial({ color: '#100d0a', roughness: 0.9 })
  const railMat = new THREE.MeshStandardMaterial({ color: PALETTE.moss, roughness: 0.5 })
  for (const x of [-8, 8]) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.1, floorLen), wallMat)
    wall.position.set(x, 0.55, -total / 2)
    wall.receiveShadow = true
    scene.add(wall)
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, floorLen), railMat)
    rail.position.set(x, 1.14, -total / 2)
    scene.add(rail)
  }

  // Dashed centre lane, one instanced mesh for every dash.
  const dashCount = Math.ceil(floorLen / 3)
  const dashes = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.08, 0.005, 1.4),
    new THREE.MeshStandardMaterial({ color: PALETTE.sage, roughness: 0.8 }),
    dashCount,
  )
  const m = new THREE.Matrix4()
  for (let i = 0; i < dashCount; i++) {
    m.makeTranslation(-2.2, 0.003, 40 - i * 3)
    dashes.setMatrixAt(i, m)
  }
  scene.add(dashes)

  // One obstacle and one sign per station.
  const kinds: ObstacleKind[] = ['hurdle', 'box', 'cones']
  const heights: number[] = []
  const signGeo = new THREE.PlaneGeometry(4.4, 2.2)
  const postGeo = new THREE.BoxGeometry(0.12, 2.4, 0.12)
  const textures: THREE.Texture[] = [planks]
  stations.forEach((s, i) => {
    const z = -(i + 1) * SPACING
    const { group, height } = buildObstacle(kinds[i % kinds.length])
    group.position.z = z
    group.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
    scene.add(group)
    heights.push(height)

    const tex = signTexture(String(i + 1).padStart(2, '0'), s.sign, s.kind, aniso)
    textures.push(tex)
    const sign = new THREE.Group()
    const face = new THREE.Mesh(signGeo, new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }))
    face.position.y = 3.3
    sign.add(face)
    for (const x of [-1.9, 1.9]) {
      const post = new THREE.Mesh(postGeo, wallMat)
      post.position.set(x, 1.2, -0.05)
      sign.add(post)
    }
    // Set back down the rink so it is still in view while the board is in the air.
    sign.position.set(-5.2, 0, z - 7)
    sign.rotation.y = 0.22
    scene.add(sign)
  })

  // Finish banner at the end of the run.
  const finishTex = signTexture('FIN', 'Thanks for riding', 'end of run', aniso)
  textures.push(finishTex)
  const finish = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 3.5),
    new THREE.MeshBasicMaterial({ map: finishTex, toneMapped: false }),
  )
  finish.position.set(0, 4.2, -total - 7)
  scene.add(finish)

  const { board, spin, wheels } = buildBoard()
  scene.add(board)

  // Sizing.
  const resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // Phones in portrait need a wider view to keep the board and sign in frame.
    camera.fov = w / h < 0.8 ? 64 : 48
    camera.updateProjectionMatrix()
    dirty = true
  }
  let dirty = true
  resize()
  window.addEventListener('resize', resize)

  // Pose of the board at a given distance down the rink.
  const pose = (d: number) => {
    let y = 0
    let rot = { pitch: 0, yaw: 0, roll: 0 }
    for (let i = 0; i < stations.length; i++) {
      const rel = d - (i + 1) * SPACING
      if (rel > -JUMP && rel < JUMP) {
        const u = (rel + JUMP) / (2 * JUMP)
        y = (heights[i] + 0.55) * 4 * u * (1 - u)
        rot = trickPose(stations[i].trick, u)
        break
      }
    }
    return { y, ...rot }
  }

  const camPos = new THREE.Vector3()
  const camLook = new THREE.Vector3()
  const wantPos = new THREE.Vector3()
  const wantLook = new THREE.Vector3()
  let smooth = opts.getProgress()
  let lastStation = Number.NaN
  let lastD = Number.NaN
  let first = true
  let raf = 0
  let prev = performance.now()

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame)
    const dt = Math.min(0.05, (now - prev) / 1000)
    prev = now

    const target = opts.getProgress()
    // Lenis already smooths the scroll, so this only takes the edge off.
    const k = opts.reducedMotion ? 1 : 1 - Math.exp(-dt * 10)
    smooth += (target - smooth) * k
    if (Math.abs(target - smooth) < 1e-5) smooth = target
    const d = smooth * total

    // Camera: behind and to the right, a little higher at the start.
    const intro = Math.max(0, 1 - d / SPACING)
    wantPos.set(2.6 + intro * 2, 1.9 + intro * 2.2, -d + 5.6 + intro * 3)
    wantLook.set(-0.6, 0.6, -d - 4)
    if (first) {
      camPos.copy(wantPos)
      camLook.copy(wantLook)
      first = false
    } else {
      const ck = opts.reducedMotion ? 1 : 1 - Math.exp(-dt * 7)
      camPos.lerp(wantPos, ck)
      camLook.lerp(wantLook, ck)
    }
    const settled = camPos.distanceToSquared(wantPos) < 1e-6

    if (!dirty && d === lastD && settled) return
    dirty = false

    if (d !== lastD) {
      const p = pose(d)
      board.position.set(0, RIDE_HEIGHT + p.y, -d)
      spin.rotation.set(p.pitch, p.yaw, p.roll, 'YXZ')
      for (const wheel of wheels) wheel.rotation.x = -d / WHEEL_R
      sun.position.set(6, 12, -d + 5)
      sun.target.position.set(0, 0, -d)
      lastD = d

      const station = Math.max(-1, Math.min(stations.length, Math.round(d / SPACING) - 1))
      if (station !== lastStation) {
        lastStation = station
        opts.onStation(station)
      }
      opts.onProgress(smooth)
    }

    camera.position.copy(camPos)
    camera.lookAt(camLook)
    renderer.render(scene, camera)
  }
  raf = requestAnimationFrame(frame)

  return {
    dispose() {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.InstancedMesh) {
          o.geometry.dispose()
          const mats = Array.isArray(o.material) ? o.material : [o.material]
          mats.forEach((mat) => mat.dispose())
        }
      })
      textures.forEach((t) => t.dispose())
      renderer.dispose()
    },
  }
}

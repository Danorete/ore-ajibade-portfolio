import * as THREE from 'three'
import { buildFeature, parkMaterials, profile, RIDE, trickState, type Motion } from './park'
import { buildRider } from './rider'
import { INTRO, OUTRO, PALETTE, SPACING, type SceneStation } from './tricks'

type Options = {
  reducedMotion: boolean
  /** Font for painted text: the deck graphic and signs. */
  displayFont: string
  /** Initials for the deck. */
  initials: string
  /** Scroll progress from 0 (top) to 1 (bottom). Read every frame. */
  getProgress: () => number
  /** Called when the current stop changes: -1 title, -2 drop-in, stations.length the outro. */
  onStation: (index: number) => void
  /** Called every rendered frame with the smoothed progress. */
  onProgress: (progress: number) => void
}

export type SkateScene = { dispose: () => void }

const WHEEL_R = 0.09
const DROP_R = 3.4 // radius and height of the drop-in ramp
const DECK_LEN = 3.5 // flat deck behind the drop-in coping

/** Seeded random numbers so the park looks the same on every visit. */
function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
}

function canvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, aniso: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d')!)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = aniso
  return tex
}

/** Warm concrete slab with expansion joints, one 6-unit tile. */
function concreteTexture(aniso: number) {
  const tex = canvasTexture(
    512,
    512,
    (g) => {
      g.fillStyle = '#74685a'
      g.fillRect(0, 0, 512, 512)
      const r = rng(11)
      for (let i = 0; i < 9000; i++) {
        const v = r()
        g.fillStyle = v > 0.5 ? 'rgba(255,240,220,0.05)' : 'rgba(20,14,8,0.07)'
        g.fillRect(r() * 512, r() * 512, 2, 2)
      }
      g.fillStyle = 'rgba(15,11,7,0.55)'
      g.fillRect(0, 0, 512, 3)
      g.fillRect(0, 0, 3, 512)
    },
    aniso,
  )
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

/** Text painted on a sign. Shrinks the font until the words fit. */
function signTexture(index: string, text: string, kind: string, font: string, aniso: number) {
  return canvasTexture(
    1024,
    512,
    (g) => {
      g.fillStyle = PALETTE.bark
      g.fillRect(0, 0, 1024, 512)
      g.strokeStyle = PALETTE.moss
      g.lineWidth = 18
      g.strokeRect(9, 9, 1006, 494)
      g.fillStyle = PALETTE.sage
      g.font = '600 40px ui-monospace, SFMono-Regular, Menlo, monospace'
      g.textBaseline = 'top'
      g.fillText(`${index} / ${kind.toUpperCase()}`, 56, 52)
      g.fillStyle = PALETTE.cream
      let size = 100
      let lines: string[] = []
      const maxW = 912
      while (size > 40) {
        g.font = `${size}px ${font}`
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
        if (lines.length * size * 1.05 <= 320 && lines.every((l) => g.measureText(l).width <= maxW)) break
        size -= 6
      }
      lines.forEach((l, i) => g.fillText(l, 56, 128 + i * size * 1.05))
    },
    aniso,
  )
}

function buildBoard(initials: string, font: string, aniso: number) {
  const board = new THREE.Group() // position on the course
  const spin = new THREE.Group() // trick rotations
  board.add(spin)

  const len = 2
  const w = 0.56
  const r = w / 2
  const shape = new THREE.Shape()
  shape.moveTo(-w / 2, -len / 2 + r)
  shape.lineTo(-w / 2, len / 2 - r)
  shape.absarc(0, len / 2 - r, r, Math.PI, 0, true)
  shape.lineTo(w / 2, -len / 2 + r)
  shape.absarc(0, -len / 2 + r, r, 0, Math.PI, true)

  // Plywood edge.
  const deckGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: false })
  deckGeo.rotateX(-Math.PI / 2)
  deckGeo.translate(0, -0.025, 0)
  const deck = new THREE.Mesh(deckGeo, new THREE.MeshStandardMaterial({ color: '#c99a63', roughness: 0.6 }))
  deck.castShadow = true
  spin.add(deck)

  // Shape UVs are in deck units; map them to 0..1 across the texture.
  const fit = (tex: THREE.Texture) => {
    tex.repeat.set(1 / w, 1 / len)
    tex.offset.set(0.5, 0.5)
    return tex
  }

  // Grip tape with the initials cut out near the tail.
  const gripTex = fit(
    canvasTexture(
      288,
      1024,
      (g) => {
        g.fillStyle = '#121010'
        g.fillRect(0, 0, 288, 1024)
        const rr = rng(5)
        for (let i = 0; i < 2500; i++) {
          g.fillStyle = 'rgba(255,255,255,0.05)'
          g.fillRect(rr() * 288, rr() * 1024, 2, 2)
        }
        g.save()
        g.translate(144, 790)
        g.rotate(-Math.PI / 2)
        g.fillStyle = PALETTE.sage
        g.font = `110px ${font}`
        g.textAlign = 'center'
        g.textBaseline = 'middle'
        g.fillText(initials, 0, 6)
        g.restore()
      },
      aniso,
    ),
  )
  const gripGeo = new THREE.ShapeGeometry(shape)
  gripGeo.rotateX(-Math.PI / 2)
  const grip = new THREE.Mesh(gripGeo, new THREE.MeshStandardMaterial({ map: gripTex, roughness: 1 }))
  grip.position.y = 0.0255
  spin.add(grip)

  // Graphic on the bottom: big initials on green with brown stripes. Shows on every flip.
  const artTex = fit(
    canvasTexture(
      288,
      1024,
      (g) => {
        g.fillStyle = PALETTE.moss
        g.fillRect(0, 0, 288, 1024)
        g.fillStyle = PALETTE.bark
        for (const y of [120, 168, 856, 904]) g.fillRect(0, y, 288, 22)
        g.save()
        g.translate(144, 512)
        g.rotate(Math.PI / 2)
        g.textAlign = 'center'
        g.textBaseline = 'middle'
        g.font = `230px ${font}`
        g.lineWidth = 14
        g.strokeStyle = PALETTE.ink
        g.strokeText(initials, 0, 10)
        g.fillStyle = PALETTE.cream
        g.fillText(initials, 0, 10)
        g.restore()
      },
      aniso,
    ),
  )
  const artGeo = new THREE.ShapeGeometry(shape)
  artGeo.rotateX(Math.PI / 2) // face down
  const art = new THREE.Mesh(artGeo, new THREE.MeshStandardMaterial({ map: artTex, roughness: 0.5 }))
  art.position.y = -0.0255
  spin.add(art)

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
  return { board, spin, wheels, textures: [gripTex, artTex] }
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
  renderer.toneMappingExposure = 1.1
  renderer.shadowMap.enabled = !small()
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  const aniso = renderer.capabilities.getMaxAnisotropy()
  const font = opts.displayFont

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(PALETTE.ink)
  scene.fog = new THREE.Fog(PALETTE.ink, 26, 90)
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 260)

  // Night session under the park lights.
  scene.add(new THREE.HemisphereLight('#e8d6b4', '#120d08', 1.0))
  const lamp = new THREE.DirectionalLight('#ffe6bf', 2.3)
  lamp.castShadow = true
  lamp.shadow.mapSize.set(1536, 1536)
  Object.assign(lamp.shadow.camera, { left: -11, right: 11, top: 11, bottom: -11, near: 1, far: 50 })
  lamp.shadow.bias = -0.0006
  scene.add(lamp, lamp.target)

  const n = stations.length
  const total = INTRO + n * SPACING + OUTRO
  const center = (i: number) => INTRO + i * SPACING + SPACING / 2
  const textures: THREE.Texture[] = []
  const mats = parkMaterials()

  // Concrete plaza, with grass and trees past the curbs.
  const groundLen = total + 120
  const slab = concreteTexture(aniso)
  textures.push(slab)
  slab.repeat.set(34 / 6, groundLen / 6)
  const plaza = new THREE.Mesh(
    new THREE.PlaneGeometry(34, groundLen),
    new THREE.MeshStandardMaterial({ map: slab, roughness: 0.95 }),
  )
  plaza.rotation.x = -Math.PI / 2
  plaza.position.z = -total / 2
  plaza.receiveShadow = true
  scene.add(plaza)

  const grassMat = new THREE.MeshStandardMaterial({ color: PALETTE.leaf, roughness: 1 })
  for (const x of [-47, 47]) {
    const grass = new THREE.Mesh(new THREE.PlaneGeometry(60, groundLen), grassMat)
    grass.rotation.x = -Math.PI / 2
    grass.position.set(x, -0.01, -total / 2)
    grass.receiveShadow = true
    scene.add(grass)
    const curb = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, groundLen), mats.side)
    curb.position.set(Math.sign(x) * 17.2, 0.17, -total / 2)
    curb.receiveShadow = true
    scene.add(curb)
  }

  // Drop-in ramp at the start: a deck and a quarter-pipe transition down to the plaza.
  const qp: [number, number][] = [[-DECK_LEN - 2, 0], [-DECK_LEN - 2, DROP_R], [0, DROP_R]]
  for (let i = 1; i <= 16; i++) {
    const t = (i / 16) * DROP_R
    qp.push([t, DROP_R - Math.sqrt(DROP_R ** 2 - (DROP_R - t) ** 2)])
  }
  const dropShape = new THREE.Shape(qp.map(([s, y]) => new THREE.Vector2(s, y)))
  const dropGeo = new THREE.ExtrudeGeometry(dropShape, { depth: 9, bevelEnabled: false, curveSegments: 1 })
  dropGeo.applyMatrix4(new THREE.Matrix4().set(0, 0, 1, -4.5, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1))
  dropGeo.computeVertexNormals()
  const drop = new THREE.Mesh(dropGeo, mats.concrete)
  drop.position.z = -DECK_LEN
  drop.castShadow = drop.receiveShadow = true
  scene.add(drop)
  const dropCoping = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 9, 12), mats.coping)
  dropCoping.rotation.z = Math.PI / 2
  dropCoping.position.set(0, DROP_R, -DECK_LEN)
  scene.add(dropCoping)

  // Obstacles, signs, lights and side dressing for every stop.
  const r = rng(42)
  const leafMats = [PALETTE.leaf, '#3b5a2b', '#24381b'].map(
    (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.9, flatShading: true }),
  )
  const trunkMat = new THREE.MeshStandardMaterial({ color: PALETTE.bark, roughness: 0.9 })
  const lampMat = new THREE.MeshStandardMaterial({ color: '#ffe2a8', emissive: '#ffcf7a', emissiveIntensity: 2.2 })
  const canopy = new THREE.IcosahedronGeometry(1, 0)
  const trunkGeo = new THREE.CylinderGeometry(0.18, 0.26, 1, 7)
  const poleGeo = new THREE.CylinderGeometry(0.09, 0.12, 8, 8)
  const lampGeo = new THREE.BoxGeometry(1.1, 0.25, 0.5)
  const signGeo = new THREE.PlaneGeometry(5.2, 2.6)

  const addTree = (x: number, z: number) => {
    const h = 2.5 + r() * 2
    const trunk = new THREE.Mesh(trunkGeo, trunkMat)
    trunk.scale.y = h
    trunk.position.set(x, h / 2, z)
    trunk.castShadow = true
    scene.add(trunk)
    const top = new THREE.Mesh(canopy, leafMats[Math.floor(r() * 3)])
    const s = 1.6 + r() * 1.4
    top.scale.set(s, s * (1.1 + r() * 0.5), s)
    top.position.set(x, h + s * 0.7, z)
    top.rotation.y = r() * 3
    top.castShadow = true
    scene.add(top)
  }

  stations.forEach((st, i) => {
    const c = center(i)
    const feature = buildFeature(st.trick.feature, mats)
    feature.position.z = -c
    scene.add(feature)

    // Sign on a low wall, set down the line so it is in view during the trick.
    const tex = signTexture(String(i + 1).padStart(2, '0'), st.sign, st.kind, font, aniso)
    textures.push(tex)
    const sign = new THREE.Group()
    const face = new THREE.Mesh(signGeo, new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }))
    face.position.y = 2.9
    sign.add(face)
    const wall = new THREE.Mesh(new THREE.BoxGeometry(5.8, 4.4, 0.4), mats.metal)
    wall.position.set(0, 2.2, -0.25)
    wall.castShadow = true
    sign.add(wall)
    sign.position.set(-8.5, 0, -(c + 5))
    sign.rotation.y = 0.32
    scene.add(sign)

    // Light poles both sides.
    for (const x of [-15.5, 15.5]) {
      const pole = new THREE.Mesh(poleGeo, mats.metal)
      pole.position.set(x, 4, -c + SPACING / 2)
      scene.add(pole)
      const head = new THREE.Mesh(lampGeo, lampMat)
      head.position.set(x - Math.sign(x) * 0.5, 8, -c + SPACING / 2)
      scene.add(head)
    }

    // A ledge-bench and a planter on the right so the plaza never looks empty.
    const bench = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 5), mats.concrete)
    bench.position.set(9 + r() * 3, 0.35, -c + (r() - 0.5) * 8)
    bench.castShadow = bench.receiveShadow = true
    scene.add(bench)
    if (i % 2 === 0) addTree(12 + r() * 3, -c - 6)

    for (let k = 0; k < 3; k++) {
      addTree(-(20 + r() * 18), -c + (r() - 0.5) * SPACING)
      addTree(20 + r() * 18, -c + (r() - 0.5) * SPACING)
    }
  })

  // Stars.
  const starPos = new Float32Array(600 * 3)
  for (let i = 0; i < 600; i++) {
    const a = r() * Math.PI * 2
    const e = 0.15 + r() * 1.2
    starPos.set([Math.cos(a) * 180, 40 + Math.sin(e) * 120, -total / 2 + Math.sin(a) * 180], i * 3)
  }
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: PALETTE.cream, size: 0.7, sizeAttenuation: true, fog: false }),
  )
  scene.add(stars)

  const { board, spin, wheels, textures: boardTex } = buildBoard(opts.initials, font, aniso)
  textures.push(...boardTex)
  scene.add(board)
  const rider = buildRider()
  scene.add(rider.root)

  // Where the board is d units into the run, before any trick rotation.
  const surface = (d: number): Motion => {
    if (d < INTRO) {
      if (d < DECK_LEN) return { x: 0, y: RIDE + DROP_R, mode: 'ground', u: 0 }
      const t = Math.min(DROP_R, d - DECK_LEN)
      return { x: 0, y: RIDE + DROP_R - Math.sqrt(DROP_R ** 2 - (DROP_R - t) ** 2), mode: 'ground', u: 0 }
    }
    const i = Math.min(n - 1, Math.floor((d - INTRO) / SPACING))
    if (d >= INTRO + n * SPACING) return { x: 0, y: RIDE, mode: 'ground', u: 0 }
    return profile(stations[i].trick.feature, d - center(i))
  }
  // -1 is the title screen, -2 the drop-in itself (no card, so the rider is in view).
  const stationAt = (d: number) =>
    d < 2.5 ? -1 : d < INTRO ? -2 : d >= INTRO + n * SPACING ? n : Math.floor((d - INTRO) / SPACING)

  const resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // Portrait phones need a wider view to keep the rider and sign in frame.
    camera.fov = w / h < 0.8 ? 68 : 50
    camera.updateProjectionMatrix()
    dirty = true
  }
  let dirty = true
  resize()
  window.addEventListener('resize', resize)

  const camPos = new THREE.Vector3()
  const camLook = new THREE.Vector3()
  const wantPos = new THREE.Vector3()
  const wantLook = new THREE.Vector3()
  let smoothP = opts.getProgress()
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
    const k = opts.reducedMotion ? 1 : 1 - Math.exp(-dt * 10)
    smoothP += (target - smoothP) * k
    if (Math.abs(target - smoothP) < 1e-5) smoothP = target
    const d = smoothP * total

    // Camera: behind and to the right, pulled back and up for the drop-in.
    const m = surface(d)
    const intro = Math.max(0, 1 - d / INTRO)
    const portrait = camera.aspect < 0.8 ? 1 : 0
    wantPos.set(
      5.2 + intro * 3,
      Math.max(m.y, 1.2) + 3.4 + intro * 5 + portrait,
      -d + 9.5 + intro * 2 + portrait * 3,
    )
    // At the top of the drop-in, look down the ramp so the rider stays in frame below the title.
    // Portrait phones look a little lower, which lifts the rider above the stop card.
    wantLook.set(-0.8, Math.max(m.y, 0.6) + 1.6 - intro * 3.5 - portrait * 2.2, -d - 6)
    if (first) {
      camPos.copy(wantPos)
      camLook.copy(wantLook)
      first = false
    } else {
      const ck = opts.reducedMotion ? 1 : 1 - Math.exp(-dt * 6)
      camPos.lerp(wantPos, ck)
      camLook.lerp(wantLook, ck)
    }
    const settled = camPos.distanceToSquared(wantPos) < 1e-6

    if (!dirty && d === lastD && settled) return
    dirty = false

    if (d !== lastD) {
      const i = stationAt(d)
      const trick = i >= 0 && i < n ? stations[i].trick : null // no trick on the drop-in or roll-out
      const st = trick
        ? trickState(trick, m)
        : { pitch: 0, yaw: 0, roll: 0, riderYaw: 0, crouch: 0.3, tuck: 0, arms: 0.35, lean: 0 }

      // Board pitch follows the ground on ramps; in the air the trick decides.
      let slope = 0
      if (m.mode === 'ground') {
        const e = 0.25
        slope = Math.atan((surface(d + e).y - surface(d - e).y) / (2 * e))
        slope = Math.max(-1.15, Math.min(1.15, slope))
      }
      // A manual rides on two wheels, so the deck centre lifts with the pitch.
      const manualLift = m.mode === 'manual' ? Math.abs(Math.sin(st.pitch)) * 0.6 : 0

      board.position.set(m.x, m.y + manualLift, -d)
      spin.rotation.set(slope + st.pitch, st.yaw, st.roll, 'YXZ')
      for (const wheel of wheels) wheel.rotation.x = -d / WHEEL_R

      rider.root.position.set(m.x, m.y + manualLift, -d)
      rider.root.rotation.set(slope * 0.8 + (m.mode === 'manual' ? st.pitch * 0.5 : 0), st.riderYaw, 0, 'YXZ')
      rider.pose(st, 0.05)

      lamp.position.set(m.x + 7, m.y + 16, -d + 6)
      lamp.target.position.set(m.x, 0, -d)
      lastD = d

      if (i !== lastStation) {
        lastStation = i
        opts.onStation(i)
      }
      opts.onProgress(smoothP)
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
      const geos = new Set<THREE.BufferGeometry>()
      const ms = new Set<THREE.Material>()
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Points) {
          geos.add(o.geometry)
          ;(Array.isArray(o.material) ? o.material : [o.material]).forEach((mm) => ms.add(mm))
        }
      })
      geos.forEach((g) => g.dispose())
      ms.forEach((mm) => mm.dispose())
      textures.forEach((t) => t.dispose())
      renderer.dispose()
    },
  }
}

import * as THREE from 'three'

/*
 * A stylized skater built from simple shapes: a young Black man with black locs,
 * an oversized charcoal graphic tee (silver cross, wings and filigree), baggy
 * faded jeans stacked over chunky black-and-white skate shoes. He faces +x
 * (side-on to the line of travel, which is -z) with his front foot toward -z.
 * Arms and legs are two bones each, placed by a small IK solve so the feet stay
 * on the board. Prints and fabric are painted onto canvases, so there are no
 * image files to load.
 */

const SKIN = '#3f2b22' // sampled from the reference image
const HAIR = ['#0d0a08', '#15100c', '#1c1510']
const TEE = '#3a3737'
const SHOE = '#121011'
const WHITE = '#ece8df'

export type RiderPose = {
  crouch: number // 0 standing tall, 1 deep crouch
  tuck: number // 0 to 1, knees pulled up in the air
  arms: number // 0 relaxed, 1 out wide for balance
  lean: number // + forward over the toes, - back over the heels (manuals)
}

const UP = new THREE.Vector3(0, 1, 0)
const THIGH = 1.0
const SHIN = 0.95
const UPPER_ARM = 0.72
const FOREARM = 0.7
const TORSO = 1.3

// Scratch vectors, reused every frame.
const v1 = new THREE.Vector3()
const v2 = new THREE.Vector3()
const v3 = new THREE.Vector3()

/** Stretch a unit cylinder or box between two points. */
function span(mesh: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, thick: number, deep = thick) {
  v1.subVectors(b, a)
  const len = v1.length()
  mesh.position.copy(a).add(b).multiplyScalar(0.5)
  mesh.quaternion.setFromUnitVectors(UP, v1.multiplyScalar(1 / len))
  mesh.scale.set(thick, len, deep)
}

/** Two-bone IK: the middle joint for a limb from a to c, bending toward pole. */
function solveJoint(a: THREE.Vector3, c: THREE.Vector3, l1: number, l2: number, pole: THREE.Vector3, out: THREE.Vector3) {
  v2.subVectors(c, a)
  const d = Math.min(v2.length(), l1 + l2 - 1e-3)
  v2.normalize()
  const along = (l1 * l1 - l2 * l2 + d * d) / (2 * d)
  const h = Math.sqrt(Math.max(0, l1 * l1 - along * along))
  v3.copy(pole).addScaledVector(v2, -pole.dot(v2)).normalize()
  return out.copy(a).addScaledVector(v2, along).addScaledVector(v3, h)
}

function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
}

function paint(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d')!)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Worn charcoal cotton: speckle and a little fading. */
function fabric(g: CanvasRenderingContext2D, w: number, h: number, base: string, seed: number) {
  g.fillStyle = base
  g.fillRect(0, 0, w, h)
  const r = rng(seed)
  for (let i = 0; i < (w * h) / 40; i++) {
    g.fillStyle = r() > 0.5 ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.08)'
    g.fillRect(r() * w, r() * h, 2, 2)
  }
}

/** One filigree curl: a spiral-ish stroke that ends in a small loop. */
function curl(g: CanvasRenderingContext2D, x: number, y: number, s: number, dir: number) {
  g.beginPath()
  g.moveTo(x, y)
  g.bezierCurveTo(x + dir * s * 0.6, y - s * 0.5, x + dir * s * 1.1, y + s * 0.1, x + dir * s * 0.7, y + s * 0.45)
  g.bezierCurveTo(x + dir * s * 0.45, y + s * 0.65, x + dir * s * 0.2, y + s * 0.4, x + dir * s * 0.38, y + s * 0.25)
  g.stroke()
}

/** Front print: a gothic cross with flared ends, spread wings and filigree. */
function teeFront() {
  return paint(512, 640, (g) => {
    fabric(g, 512, 640, TEE, 3)
    const cx = 256
    const silver = '#d9d6cf'
    const shade = '#8f8b84'

    // Wings: layered feather rows sweeping out and down from behind the cross.
    for (const side of [-1, 1]) {
      for (let row = 0; row < 4; row++) {
        for (let f = 0; f < 7 - row; f++) {
          const x0 = cx + side * (34 + f * 26 + row * 6)
          const y0 = 210 + row * 34 + f * 6
          const len = 70 - row * 10 - f * 4
          g.fillStyle = row % 2 ? shade : silver
          g.beginPath()
          g.moveTo(x0, y0)
          g.quadraticCurveTo(x0 + side * len * 0.55, y0 + len * 0.15, x0 + side * len * 0.35, y0 + len)
          g.quadraticCurveTo(x0 + side * len * 0.1, y0 + len * 0.55, x0, y0)
          g.fill()
        }
      }
    }

    // Filigree scrolls around the wings and across the hem.
    g.strokeStyle = shade
    g.lineWidth = 5
    g.lineCap = 'round'
    for (const side of [-1, 1]) {
      for (let k = 0; k < 4; k++) curl(g, cx + side * (70 + k * 38), 400 + (k % 2) * 30, 46, side)
      curl(g, cx + side * 40, 120, 40, side)
      curl(g, cx + side * 30, 520, 52, side)
      curl(g, cx + side * 120, 560, 44, side)
    }

    // The cross: a dark outline, then silver with flared, pointed ends.
    const arm = (x: number, y: number, w: number, l: number, angle: number) => {
      g.save()
      g.translate(x, y)
      g.rotate(angle)
      g.beginPath()
      g.moveTo(-w / 2, 0)
      g.lineTo(-w / 2, -l + w)
      g.lineTo(-w * 1.05, -l + w * 0.35)
      g.lineTo(0, -l - w * 0.2)
      g.lineTo(w * 1.05, -l + w * 0.35)
      g.lineTo(w / 2, -l + w)
      g.lineTo(w / 2, 0)
      g.closePath()
      g.fill()
      g.stroke()
      g.restore()
    }
    const crossY = 250
    g.lineWidth = 8
    g.strokeStyle = '#141313'
    g.fillStyle = silver
    arm(cx, crossY, 34, 150, 0) // top
    arm(cx, crossY, 34, 250, Math.PI) // bottom, longer
    arm(cx, crossY, 34, 112, -Math.PI / 2) // left
    arm(cx, crossY, 34, 112, Math.PI / 2) // right
    // Centre medallion with a ring and an inner diamond.
    g.beginPath()
    g.arc(cx, crossY, 32, 0, Math.PI * 2)
    g.fill()
    g.stroke()
    g.lineWidth = 4
    g.strokeStyle = shade
    g.beginPath()
    g.moveTo(cx, crossY - 18)
    g.lineTo(cx + 14, crossY)
    g.lineTo(cx, crossY + 18)
    g.lineTo(cx - 14, crossY)
    g.closePath()
    g.stroke()
    // Inner line down each arm for the engraved look.
    g.beginPath()
    g.moveTo(cx, crossY - 120)
    g.lineTo(cx, crossY - 40)
    g.moveTo(cx, crossY + 40)
    g.lineTo(cx, crossY + 220)
    g.moveTo(cx - 90, crossY)
    g.lineTo(cx - 40, crossY)
    g.moveTo(cx + 40, crossY)
    g.lineTo(cx + 90, crossY)
    g.stroke()

    // Washed-out print: knock some of it back so it reads as worn.
    const r = rng(9)
    for (let i = 0; i < 2600; i++) {
      g.fillStyle = 'rgba(42,40,41,0.55)'
      g.fillRect(r() * 512, r() * 640, 3, 3)
    }
  })
}

/** Sleeves and sides: faint vine scrolls, no shapes that read as letters. */
function teeSide() {
  return paint(256, 256, (g) => {
    fabric(g, 256, 256, TEE, 5)
    g.strokeStyle = 'rgba(200,196,188,0.4)'
    g.lineWidth = 3
    g.lineCap = 'round'
    for (const y of [60, 150, 230]) {
      g.beginPath()
      g.moveTo(-10, y)
      g.bezierCurveTo(70, y - 40, 150, y + 40, 266, y - 10)
      g.stroke()
    }
  })
}

/** Back: a small cross under the collar and vine scrolls. */
function teeBack() {
  return paint(256, 320, (g) => {
    fabric(g, 256, 320, TEE, 6)
    g.strokeStyle = 'rgba(200,196,188,0.4)'
    g.lineWidth = 3
    g.lineCap = 'round'
    for (const y of [190, 260]) {
      g.beginPath()
      g.moveTo(-10, y)
      g.bezierCurveTo(70, y - 40, 150, y + 40, 266, y - 10)
      g.stroke()
    }
    g.fillStyle = '#cfccc5'
    g.fillRect(122, 40, 12, 70)
    g.fillRect(100, 62, 56, 12)
  })
}

/** Faded dark-wash denim with whiskers and lighter thighs. */
function denim() {
  const tex = paint(256, 512, (g) => {
    const grad = g.createLinearGradient(0, 0, 0, 512)
    grad.addColorStop(0, '#3f4a57')
    grad.addColorStop(0.35, '#6a7684') // faded thighs
    grad.addColorStop(0.7, '#465260')
    grad.addColorStop(1, '#333c47')
    g.fillStyle = grad
    g.fillRect(0, 0, 256, 512)
    const r = rng(17)
    // Diagonal twill.
    g.strokeStyle = 'rgba(15,20,28,0.18)'
    g.lineWidth = 1
    for (let i = -512; i < 512; i += 4) {
      g.beginPath()
      g.moveTo(i, 0)
      g.lineTo(i + 512, 512)
      g.stroke()
    }
    // Whiskers across the front of the thighs.
    g.strokeStyle = 'rgba(210,220,230,0.28)'
    g.lineWidth = 3
    for (let k = 0; k < 6; k++) {
      const y = 120 + k * 14 + r() * 6
      g.beginPath()
      g.moveTo(40 + r() * 20, y)
      g.quadraticCurveTo(128, y - 18, 216 - r() * 20, y)
      g.stroke()
    }
    // Stacking creases near the hem.
    g.strokeStyle = 'rgba(10,14,20,0.35)'
    g.lineWidth = 4
    for (let k = 0; k < 5; k++) {
      const y = 430 + k * 16
      g.beginPath()
      g.moveTo(0, y)
      g.bezierCurveTo(64, y - 10, 192, y + 10, 256, y)
      g.stroke()
    }
  })
  tex.wrapS = THREE.RepeatWrapping
  return tex
}

/** Artwork cropped from Ore's reference image (public/skate). Painted canvases stand in until they load. */
const ART = {
  front: '/skate/tee-front.webp',
  sleeve: '/skate/tee-sleeve.webp',
  plain: '/skate/tee-plain.webp',
  jeans: '/skate/jeans.webp',
}

/** onChange: called when an artwork image finishes loading, so the scene can redraw. */
export function buildRider(onChange?: () => void) {
  const root = new THREE.Group()
  const mat = (color: string, roughness = 0.75, map?: THREE.Texture) =>
    new THREE.MeshStandardMaterial({ color: map ? '#ffffff' : color, roughness, map })

  const front = teeFront()
  const side = teeSide()
  const back = teeBack()
  const jeansTex = denim()
  const textures: THREE.Texture[] = [front, side, back, jeansTex]

  const skin = mat(SKIN, 0.55)
  const teeSideMat = mat(TEE, 0.9, side)
  const sleeveMat = mat(TEE, 0.9, side)
  const teeFrontMat = mat(TEE, 0.9, front)
  const teeBackMat = mat(TEE, 0.9, back)
  const jeans = mat('#4a5563', 0.92, jeansTex)

  // Swap in the real artwork once each image arrives.
  const loader = new THREE.TextureLoader()
  const useArt = (url: string, mats: THREE.MeshStandardMaterial[], wrap = false) =>
    loader.load(url, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      if (wrap) tex.wrapS = THREE.RepeatWrapping
      if (url === ART.jeans) tex.repeat.x = 2 // the strip is one leg's front; repeat it around the leg
      textures.push(tex)
      for (const m of mats) {
        m.map = tex
        m.needsUpdate = true
      }
      onChange?.()
    })
  useArt(ART.front, [teeFrontMat])
  useArt(ART.sleeve, [sleeveMat], true)
  useArt(ART.plain, [teeSideMat, teeBackMat], true)
  useArt(ART.jeans, [jeans], true)
  const shoe = mat(SHOE, 0.6)
  const white = mat(WHITE, 0.7)

  const cyl = new THREE.CylinderGeometry(1, 1, 1, 14)
  const flare = new THREE.CylinderGeometry(0.85, 1, 1, 14) // wider at the bottom
  const cube = new THREE.BoxGeometry(1, 1, 1)
  const ball = new THREE.SphereGeometry(1, 16, 12)

  const add = (geo: THREE.BufferGeometry, m: THREE.Material | THREE.Material[]) => {
    const mesh = new THREE.Mesh(geo, m)
    mesh.castShadow = true
    root.add(mesh)
    return mesh
  }
  const joint = (r: number, m: THREE.Material) => {
    const j = add(ball, m)
    j.scale.setScalar(r)
    return j
  }

  const sides = [-1, 1] as const // -1 front foot (toward -z), +1 back foot
  const legs = sides.map(() => ({
    thigh: add(cyl, jeans),
    shin: add(flare, jeans),
    knee: joint(0.215, jeans),
    stack: add(cyl, jeans), // bunched denim over the shoe
    upper: add(cube, shoe),
    panel: add(cube, white), // white side panel
    toe: add(cube, white),
    sole: add(cube, white),
  }))
  const arms = sides.map(() => ({
    sleeve: add(flare, sleeveMat), // short, loose sleeve to just above the elbow
    upper: add(cyl, skin),
    fore: add(cyl, skin),
    elbow: joint(0.075, skin),
    hand: joint(0.095, skin),
  }))
  const seat = add(cube, jeans)
  // Box faces: +x is the chest (he faces +x), so the print goes on material 0 and the back on 1.
  const torso = add(cube, [teeFrontMat, teeBackMat, teeSideMat, teeSideMat, teeSideMat, teeSideMat])
  const neck = add(cyl, skin)

  // Head: skin, eyes, a hair cap and locs that fall to the shoulders.
  const head = new THREE.Group()
  root.add(head)
  const skull = new THREE.Mesh(ball, skin)
  skull.scale.set(0.27, 0.31, 0.26)
  skull.castShadow = true
  head.add(skull)
  const eyeMat = mat('#070505', 0.4)
  for (const z of [-0.09, 0.09]) {
    const eye = new THREE.Mesh(ball, eyeMat)
    eye.scale.setScalar(0.03)
    eye.position.set(0.245, 0.05, z)
    head.add(eye)
  }
  // Short goatee.
  const beard = new THREE.Mesh(ball, mat(HAIR[0], 0.95))
  beard.scale.set(0.07, 0.07, 0.1)
  beard.position.set(0.225, -0.22, 0)
  head.add(beard)
  const cap = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.45), mat(HAIR[0], 0.95))
  cap.scale.set(0.3, 0.34, 0.3)
  cap.position.set(-0.02, 0.035, 0)
  cap.rotation.z = 0.3 // tip the cap back so the hairline sits above the face
  cap.castShadow = true
  head.add(cap)

  const locGeo = new THREE.CylinderGeometry(0.8, 1, 1, 6)
  const tipGeo = new THREE.SphereGeometry(1, 6, 5)
  const locMats = HAIR.map((c) => mat(c, 0.95))
  const r = rng(7)
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const scale = new THREE.Vector3(0.29, 0.32, 0.29)
  for (let i = 0; i < 120; i++) {
    const theta = r() * Math.PI * 2
    const phi = 0.2 + r() * 1.05
    const dir = new THREE.Vector3(Math.cos(theta) * Math.sin(phi), Math.cos(phi), Math.sin(theta) * Math.sin(phi))
    // Keep the face clear: nothing from the front, except the crown and the sides that frame it.
    if (dir.x > 0.45) continue
    if (dir.x > 0.05 && Math.abs(dir.z) < 0.55 && phi > 0.5) continue
    a.copy(dir).multiply(scale)
    const len = 0.5 + r() * 0.3 // to the neck and collarbone, like the reference
    b.copy(a)
      .add(new THREE.Vector3(Math.min(dir.x, 0) * 0.3 - 0.06, 0, dir.z * 0.35))
      .add(new THREE.Vector3(0, -len, 0))
    const m = locMats[i % locMats.length]
    const loc = new THREE.Mesh(locGeo, m)
    span(loc, a, b, 0.05)
    loc.castShadow = true
    head.add(loc)
    const tip = new THREE.Mesh(tipGeo, m)
    tip.position.copy(b)
    tip.scale.setScalar(0.05)
    head.add(tip)
  }

  // Working vectors for the pose.
  const H = new THREE.Vector3()
  const N = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const hip = new THREE.Vector3()
  const ankle = new THREE.Vector3()
  const knee = new THREE.Vector3()
  const shoulder = new THREE.Vector3()
  const hand = new THREE.Vector3()
  const elbow = new THREE.Vector3()
  const pole = new THREE.Vector3()
  const tmp = new THREE.Vector3()

  /** footY: height of the deck top in rider space, without any tuck. */
  function pose(p: RiderPose, footY: number) {
    const c = p.crouch
    const lift = p.tuck * 0.32 // feet come off the board so it can flip
    const hipH = 1.82 - c * 0.62 - p.tuck * 0.12
    H.set(-0.1 - c * 0.18 + p.lean * 0.35, footY + hipH, 0)
    const bend = 0.1 + c * 0.42 + p.lean * 0.6
    dir.set(Math.sin(bend), Math.cos(bend), 0)
    N.copy(H).addScaledVector(dir, TORSO)

    // Baggy seat of the jeans.
    seat.position.copy(H)
    seat.quaternion.setFromUnitVectors(UP, dir)
    seat.scale.set(0.5, 0.38, 0.72)

    // Oversized tee: wide, deep, and long enough to hang past the hips.
    tmp.copy(H).addScaledVector(dir, -0.2)
    torso.position.copy(tmp).addScaledVector(dir, (TORSO + 0.1) / 2)
    torso.quaternion.setFromUnitVectors(UP, dir)
    torso.scale.set(0.5, TORSO + 0.1, 0.8)

    tmp.copy(N).addScaledVector(dir, 0.22)
    span(neck, N, tmp, 0.1)
    head.position.copy(N).addScaledVector(dir, 0.48)
    // Look down the line, over the front shoulder.
    head.rotation.set(0, 0.85, -bend * 0.55)

    sides.forEach((s, i) => {
      const L = legs[i]
      hip.set(H.x, H.y - 0.08, s * 0.22)
      ankle.set(0.04, footY + lift + 0.34, s * 0.5)
      pole.set(1, 0, s * 0.35)
      solveJoint(hip, ankle, THIGH, SHIN, pole, knee)
      span(L.thigh, hip, knee, 0.22)
      span(L.shin, knee, ankle, 0.22)
      L.knee.position.copy(knee)
      // Denim stacked in rolls over the top of the shoe.
      L.stack.position.set(0.06, footY + lift + 0.37, s * 0.5)
      L.stack.quaternion.identity()
      L.stack.scale.set(0.25, 0.16, 0.25)

      // Chunky skate shoe: black upper, white side panel and toe cap, thick white sole.
      const fy = footY + lift
      L.sole.position.set(0.12, fy + 0.045, s * 0.5)
      L.sole.scale.set(0.74, 0.09, 0.34)
      L.upper.position.set(0.1, fy + 0.2, s * 0.5)
      L.upper.scale.set(0.66, 0.24, 0.3)
      L.panel.position.set(0.04, fy + 0.17, s * 0.5)
      L.panel.scale.set(0.34, 0.09, 0.31)
      L.toe.position.set(0.38, fy + 0.13, s * 0.5)
      L.toe.scale.set(0.16, 0.11, 0.31)

      const A = arms[i]
      shoulder.copy(N).addScaledVector(dir, -0.14)
      shoulder.z += s * 0.4
      const out = p.arms
      hand.set(shoulder.x + 0.2 - out * 0.05, shoulder.y - 1.25 + out * 0.95, shoulder.z + s * (0.2 + out * 1.1))
      pole.set(-0.6, -0.5, s * 0.6)
      solveJoint(shoulder, hand, UPPER_ARM, FOREARM, pole, elbow)
      span(A.upper, shoulder, elbow, 0.09)
      span(A.fore, elbow, hand, 0.08)
      // The sleeve covers the top two thirds of the upper arm and flares a little.
      tmp.copy(shoulder).lerp(elbow, 0.68)
      v2.copy(shoulder).lerp(elbow, -0.08)
      span(A.sleeve, v2, tmp, 0.19)
      A.elbow.position.copy(elbow)
      A.hand.position.copy(hand)
    })
  }

  pose({ crouch: 0.3, tuck: 0, arms: 0.35, lean: 0 }, 0.05)
  return { root, pose, textures }
}

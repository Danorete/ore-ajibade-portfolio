import * as THREE from 'three'
import { PALETTE, type FeatureKind, type Trick } from './tricks'

/*
 * Every obstacle lives in its own local frame: s runs along the line of travel
 * (forward is -z in the world), y is up, x is across. s = 0 is the middle of the
 * obstacle. A "profile" says where the board's centre is at each s.
 */

export const RIDE = 0.3 // deck centre above a surface, rolling on wheels
const GRIND = 0.2 // deck centre above an edge, sitting on the trucks
const SLIDE = 0.07 // deck centre above a bar, sliding on the deck

export type Phase = 'pop' | 'in' | 'out'
export type Motion = {
  x: number
  y: number
  mode: 'ground' | 'air' | 'grind' | 'manual'
  /** Progress through the current air or grind, 0 to 1. */
  u: number
  /** Air only: what the jump is for, and the board pitch at take-off and landing. */
  phase?: Phase
  p0?: number
  p1?: number
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
const smooth = (a: number, b: number, s: number) => {
  const t = clamp01((s - a) / (b - a))
  return t * t * (3 - 2 * t)
}

function jump(
  s: number,
  s0: number,
  s1: number,
  y0: number,
  y1: number,
  height: number,
  phase: Phase,
  p0 = 0,
  p1 = 0,
): Motion {
  const u = (s - s0) / (s1 - s0)
  return { x: 0, y: lerp(y0, y1, u) + 4 * height * u * (1 - u), mode: 'air', u, phase, p0, p1 }
}

const ground = (y = RIDE, x = 0): Motion => ({ x, y, mode: 'ground', u: 0 })

// Obstacle sizes, shared by the meshes and the profiles so they always agree.
const GAP = { k0: -5.5, k1: -2.2, l0: 2.6, l1: 5.9, h: 1.1 }
const LEDGE = { s0: -4.6, s1: 4.6, h: 1.0, edgeX: -0.25, width: 1.6 }
const RAIL = { s0: -4.4, s1: 4.4, h: 0.95 }
const STAIRS = { bank0: -9, bank1: -5.6, top1: -1.6, h: 1.8, steps: 5, run: 0.8, handX: 2.1 }
const PAD = { s0: -4, s1: 4, h: 0.5 }
const PYR = { up0: -7.5, up1: -3.2, down0: 3.2, down1: 7.5, h: 1.6 }
const PYR_SLOPE = Math.atan(PYR.h / (PYR.up1 - PYR.up0))
const KICK_SLOPE = Math.atan(GAP.h / (GAP.k1 - GAP.k0))

/** Where the board is at s, relative to the obstacle centre. */
export function profile(kind: FeatureKind, s: number): Motion {
  switch (kind) {
    case 'gap': {
      const { k0, k1, l0, l1, h } = GAP
      if (s < k0) return ground()
      if (s < k1) return ground(RIDE + (h * (s - k0)) / (k1 - k0))
      if (s < l0) return jump(s, k1, l0, RIDE + h, RIDE + h, 1.7, 'pop', KICK_SLOPE, -KICK_SLOPE)
      if (s < l1) return ground(RIDE + h * (1 - (s - l0) / (l1 - l0)))
      return ground()
    }
    case 'ledge': {
      // Drift over so the trucks lock onto the ledge's edge, then drift back.
      const x = LEDGE.edgeX * (smooth(-11, -6.8, s) - smooth(6.8, 11, s))
      const top = LEDGE.h + GRIND
      let m: Motion
      if (s < -6.6) m = ground()
      else if (s < -4.3) m = jump(s, -6.6, -4.3, RIDE, top, 0.55, 'in')
      else if (s < 4.4) m = { x: 0, y: top, mode: 'grind', u: (s + 4.3) / 8.7 }
      else if (s < 6.8) m = jump(s, 4.4, 6.8, top, RIDE, 0.35, 'out')
      else m = ground()
      return { ...m, x }
    }
    case 'rail': {
      const top = RAIL.h + SLIDE
      if (s < -6.6) return ground()
      if (s < -4.2) return jump(s, -6.6, -4.2, RIDE, top, 0.6, 'in')
      if (s < 4.3) return { x: 0, y: top, mode: 'grind', u: (s + 4.2) / 8.5 }
      if (s < 6.7) return jump(s, 4.3, 6.7, top, RIDE, 0.35, 'out')
      return ground()
    }
    case 'stairs': {
      const { bank0, bank1, top1, h } = STAIRS
      if (s < bank0) return ground()
      if (s < bank1) return ground(RIDE + (h * (s - bank0)) / (bank1 - bank0))
      if (s < top1) return ground(RIDE + h)
      if (s < 4.4) return jump(s, top1, 4.4, RIDE + h, RIDE, 1.0, 'pop')
      return ground()
    }
    case 'manual': {
      const top = RIDE + PAD.h
      if (s < -5.9) return ground()
      if (s < -3.6) return jump(s, -5.9, -3.6, RIDE, top, 0.45, 'in')
      if (s < 3.9) return { x: 0, y: top, mode: 'manual', u: (s + 3.6) / 7.5 }
      if (s < 5.9) return jump(s, 3.9, 5.9, top, RIDE, 0.3, 'out')
      return ground()
    }
    case 'pyramid': {
      const { up0, up1, down0, down1, h } = PYR
      const bank = (x: number) =>
        x < up0 || x > down1
          ? 0
          : x < up1
            ? (h * (x - up0)) / (up1 - up0)
            : x < down0
              ? h
              : h * (1 - (x - down0) / (down1 - down0))
      if (s > -3.6 && s < 4.6)
        return jump(s, -3.6, 4.6, RIDE + bank(-3.6), RIDE + bank(4.6), 1.6, 'pop', PYR_SLOPE, -PYR_SLOPE)
      return ground(RIDE + bank(s))
    }
  }
}

/** How the board and rider move for a trick at a given point in the profile. */
export type TrickState = {
  pitch: number
  yaw: number
  roll: number
  riderYaw: number
  crouch: number
  tuck: number
  arms: number
  lean: number
}

const TAU = Math.PI * 2

// Held positions for grinds, slides and manuals.
const HOLDS: Record<string, Partial<TrickState>> = {
  '50-50 Grind': {},
  '5-0 Grind': { pitch: 0.16, lean: -0.12 },
  'Crooked Grind': { pitch: -0.14, yaw: 0.32, lean: 0.1 },
  Boardslide: { yaw: Math.PI / 2, riderYaw: Math.PI / 2 },
  Lipslide: { yaw: -Math.PI / 2, riderYaw: -Math.PI / 2 },
  'Feeble Grind': { yaw: 0.3, roll: 0.28, pitch: 0.2 },
  Manual: { pitch: 0.3, lean: -0.3 },
  'Nose Manual': { pitch: -0.28, lean: 0.25 },
}

export function trickState(trick: Trick, m: Motion): TrickState {
  const st: TrickState = { pitch: 0, yaw: 0, roll: 0, riderYaw: 0, crouch: 0.3, tuck: 0, arms: 0.35, lean: 0 }

  if (m.mode === 'air') {
    st.tuck = Math.sin(Math.PI * m.u)
    st.crouch = 0.3 + 0.3 * st.tuck
    st.arms = 0.75
    st.pitch = lerp(m.p0 ?? 0, m.p1 ?? 0, m.u)
    // The tail snaps down on take-off, then the board levels out.
    if (m.u < 0.4) st.pitch += 0.32 * Math.sin((Math.PI * m.u) / 0.4)
  }

  const hold = HOLDS[trick.name]
  if (hold) {
    // Grinds, slides and manuals: ease into the held position, hold it, ease out.
    let k = 0
    if (m.mode === 'grind' || m.mode === 'manual') k = 1
    else if (m.mode === 'air' && m.phase === 'in') k = easeInOut(clamp01(m.u * 1.25))
    else if (m.mode === 'air' && m.phase === 'out') k = 1 - easeInOut(clamp01(m.u * 1.25))
    st.pitch += (hold.pitch ?? 0) * k
    st.yaw += (hold.yaw ?? 0) * k
    st.roll += (hold.roll ?? 0) * k
    st.riderYaw += (hold.riderYaw ?? 0) * k
    st.lean += (hold.lean ?? 0) * k
    if (m.mode === 'grind' || m.mode === 'manual') {
      st.crouch = 0.45
      st.arms = 1
    }
    return st
  }

  if (m.mode !== 'air' || m.phase !== 'pop') return st

  // Flip tricks and spins happen in the air.
  const e = easeInOut(clamp01((m.u - 0.1) / 0.68))
  switch (trick.name) {
    case 'Kickflip':
      st.roll = TAU * e
      break
    case 'Heelflip':
      st.roll = -TAU * e
      break
    case 'Varial Kickflip':
      st.roll = TAU * e
      st.yaw = Math.PI * e
      break
    case '360 Flip':
      st.roll = TAU * e
      st.yaw = TAU * e
      break
    case 'Hardflip':
      st.roll = TAU * e
      st.yaw = -Math.PI * e
      break
    case 'Pop Shove-it':
      st.yaw = Math.PI * e
      break
    case 'Frontside 360':
      st.yaw = TAU * e
      st.riderYaw = TAU * e
      break
    case 'Backside 360':
      st.yaw = -TAU * e
      st.riderYaw = -TAU * e
      break
  }
  return st
}

// ---------------------------------------------------------------- meshes

export type ParkMaterials = {
  concrete: THREE.Material
  side: THREE.Material
  coping: THREE.Material
  metal: THREE.Material
}

export function parkMaterials(): ParkMaterials {
  return {
    concrete: new THREE.MeshStandardMaterial({ color: PALETTE.concrete, roughness: 0.92 }),
    side: new THREE.MeshStandardMaterial({ color: '#5f5447', roughness: 0.95 }),
    coping: new THREE.MeshStandardMaterial({ color: PALETTE.moss, roughness: 0.45, metalness: 0.35 }),
    metal: new THREE.MeshStandardMaterial({ color: '#16130f', roughness: 0.55, metalness: 0.4 }),
  }
}

/** A solid made from a side profile: points are (s, y), extruded across x. */
function profileSolid(points: [number, number][], width: number, mat: THREE.Material, x = 0) {
  const shape = new THREE.Shape(points.map(([s, y]) => new THREE.Vector2(s, y)))
  const geo = new THREE.ExtrudeGeometry(shape, { depth: width, bevelEnabled: false })
  // (s, y, e) -> (e - width / 2 + x, y, -s)
  geo.applyMatrix4(new THREE.Matrix4().set(0, 0, 1, x - width / 2, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1))
  geo.computeVertexNormals()
  return new THREE.Mesh(geo, mat)
}

function box(w: number, h: number, l: number, mat: THREE.Material, x: number, y: number, s: number) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, l), mat)
  m.position.set(x, y, -s)
  return m
}

/** A bar between two (x, y, s) points. */
function bar(a: [number, number, number], b: [number, number, number], r: number, mat: THREE.Material) {
  const A = new THREE.Vector3(a[0], a[1], -a[2])
  const B = new THREE.Vector3(b[0], b[1], -b[2])
  const len = A.distanceTo(B)
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 12), mat)
  m.position.copy(A).add(B).multiplyScalar(0.5)
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize())
  return m
}

export function buildFeature(kind: FeatureKind, mats: ParkMaterials) {
  const g = new THREE.Group()
  const { concrete, coping, metal, side } = mats
  switch (kind) {
    case 'gap': {
      const { k0, k1, l0, l1, h } = GAP
      g.add(profileSolid([[k0, 0], [k1, 0], [k1, h]], 3, concrete))
      g.add(profileSolid([[l0, h], [l0, 0], [l1, 0]], 3, concrete))
      g.add(box(3.04, 0.06, 0.08, coping, 0, h, k1))
      g.add(box(3.04, 0.06, 0.08, coping, 0, h, l0))
      // A low planter in the gap so it reads as a gap.
      g.add(box(2.2, 0.5, 1.6, side, 0, 0.25, (k1 + l0) / 2))
      const shrub = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.55, 0),
        new THREE.MeshStandardMaterial({ color: PALETTE.leaf, roughness: 0.9, flatShading: true }),
      )
      shrub.scale.set(1.8, 0.7, 1.2)
      shrub.position.set(0, 0.7, -(k1 + l0) / 2)
      g.add(shrub)
      break
    }
    case 'ledge': {
      const { s0, s1, h, edgeX, width } = LEDGE
      const cx = edgeX - width / 2
      g.add(box(width, h, s1 - s0, concrete, cx, h / 2, 0))
      g.add(box(0.07, 0.07, s1 - s0, coping, edgeX, h, 0))
      break
    }
    case 'rail': {
      const { s0, s1, h } = RAIL
      g.add(bar([0, h, s0], [0, h, s1], 0.055, coping))
      for (const s of [s0 + 0.4, 0, s1 - 0.4]) {
        g.add(bar([0, 0, s], [0, h, s], 0.05, metal))
        g.add(box(0.5, 0.04, 0.5, metal, 0, 0.02, s))
      }
      break
    }
    case 'stairs': {
      const { bank0, bank1, top1, h, steps, run, handX } = STAIRS
      const rise = h / steps
      const pts: [number, number][] = [[bank0, 0], [bank1, h], [top1, h]]
      for (let i = 0; i < steps; i++) {
        pts.push([top1 + i * run, h - (i + 1) * rise])
        pts.push([top1 + (i + 1) * run, h - (i + 1) * rise])
      }
      g.add(profileSolid(pts, 5, concrete))
      g.add(box(5.04, 0.06, 0.08, coping, 0, h, top1))
      // Handrail down the side of the stairs.
      const end = top1 + steps * run
      g.add(bar([handX, h + 0.9, top1], [handX, 0.9, end], 0.05, coping))
      g.add(bar([handX, h, top1], [handX, h + 0.9, top1], 0.05, metal))
      g.add(bar([handX, 0, end], [handX, 0.9, end], 0.05, metal))
      break
    }
    case 'manual': {
      const { s0, s1, h } = PAD
      g.add(box(2.6, h, s1 - s0, concrete, 0, h / 2, 0))
      for (const s of [s0, s1]) g.add(box(2.64, 0.05, 0.07, coping, 0, h, s))
      break
    }
    case 'pyramid': {
      const { up0, up1, down0, down1, h } = PYR
      g.add(profileSolid([[up0, 0], [up1, h], [down0, h], [down1, 0]], 5, concrete))
      for (const s of [up1, down0]) g.add(box(5.04, 0.05, 0.08, coping, 0, h, s))
      break
    }
  }
  g.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  return g
}

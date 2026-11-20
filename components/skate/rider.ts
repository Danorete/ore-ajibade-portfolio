import * as THREE from 'three'

/*
 * A low-poly skater built from simple shapes: a Black man with dreadlocks in an
 * olive tee, brown pants and black shoes. He faces +x (side-on to the line of
 * travel, which is -z) with his front foot toward -z. Arms and legs are two
 * bones each, placed by a small IK solve so the feet stay on the board.
 */

const SKIN = '#5a3825'
const HAIR = ['#1d130b', '#271910', '#30200f']
const TEE = '#556b2f'
const PANTS = '#5b4026'
const SHOE = '#141210'
const SOLE = '#e9e1cf'

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
function span(mesh: THREE.Mesh, a: THREE.Vector3, b: THREE.Vector3, thick: number, deep = thick) {
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

export function buildRider() {
  const root = new THREE.Group()
  const mat = (color: string, roughness = 0.75) => new THREE.MeshStandardMaterial({ color, roughness })
  const skin = mat(SKIN, 0.6)
  const tee = mat(TEE, 0.85)
  const pants = mat(PANTS, 0.9)
  const shoe = mat(SHOE, 0.7)
  const sole = mat(SOLE, 0.8)

  const cyl = new THREE.CylinderGeometry(1, 1, 1, 12)
  const cube = new THREE.BoxGeometry(1, 1, 1)
  const ball = new THREE.SphereGeometry(1, 16, 12)

  const add = (geo: THREE.BufferGeometry, m: THREE.Material) => {
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
    thigh: add(cyl, pants),
    shin: add(cyl, pants),
    knee: joint(0.15, pants),
    shoe: add(cube, shoe),
    sole: add(cube, sole),
  }))
  const arms = sides.map(() => ({
    upper: add(cyl, tee),
    fore: add(cyl, skin),
    elbow: joint(0.085, skin),
    shoulder: joint(0.17, tee),
    hand: joint(0.1, skin),
  }))
  const pelvis = add(cube, pants)
  const torso = add(cube, tee)
  const neck = add(cyl, skin)

  // Head: skin, eyes, a hair cap and locs that hang to the shoulders.
  const head = new THREE.Group()
  root.add(head)
  const skull = new THREE.Mesh(ball, skin)
  skull.scale.set(0.27, 0.31, 0.26)
  skull.castShadow = true
  head.add(skull)
  const eyeMat = mat('#0b0806', 0.4)
  for (const z of [-0.09, 0.09]) {
    const eye = new THREE.Mesh(ball, eyeMat)
    eye.scale.setScalar(0.032)
    eye.position.set(0.245, 0.05, z)
    head.add(eye)
  }
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(1, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.42),
    mat(HAIR[0], 0.95),
  )
  cap.scale.set(0.29, 0.33, 0.29)
  cap.position.set(-0.025, 0.03, 0)
  cap.rotation.z = 0.35 // tip the cap back so the hairline sits above the face
  cap.castShadow = true
  head.add(cap)

  const locGeo = new THREE.CylinderGeometry(0.75, 1, 1, 6)
  const locMats = HAIR.map((c) => mat(c, 0.95))
  let seed = 7
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  for (let i = 0; i < 60; i++) {
    // Roots spread over the crown and back of the head, none over the face.
    const theta = -Math.PI * 0.95 + rand() * Math.PI * 1.9 // around the head
    const phi = 0.25 + rand() * 0.95 // down from the top
    const dir = new THREE.Vector3(Math.cos(theta) * Math.sin(phi), Math.cos(phi), Math.sin(theta) * Math.sin(phi))
    if (dir.x > 0.05) continue // locs fall from the crown, sides and back, clear of the face
    a.copy(dir).multiply(new THREE.Vector3(0.28, 0.31, 0.28))
    const len = 0.55 + rand() * 0.45
    b.copy(a)
      .add(new THREE.Vector3(dir.x * 0.25 - 0.08, 0, dir.z * 0.3))
      .add(new THREE.Vector3(0, -len, 0))
    const loc = new THREE.Mesh(locGeo, locMats[i % locMats.length])
    span(loc, a, b, 0.042)
    loc.castShadow = true
    head.add(loc)
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

  /** footY: height of the deck top in rider space, without any tuck. */
  function pose(p: RiderPose, footY: number) {
    const c = p.crouch
    const lift = p.tuck * 0.32 // feet come off the board so it can flip
    const hipH = 1.82 - c * 0.62 - p.tuck * 0.12
    H.set(-0.1 - c * 0.18 + p.lean * 0.35, footY + hipH, 0)
    const bend = 0.1 + c * 0.42 + p.lean * 0.6
    dir.set(Math.sin(bend), Math.cos(bend), 0)
    N.copy(H).addScaledVector(dir, TORSO)

    pelvis.position.copy(H)
    pelvis.quaternion.setFromUnitVectors(UP, dir)
    pelvis.scale.set(0.42, 0.34, 0.6)
    v1.copy(H).addScaledVector(dir, 0.12)
    torso.position.copy(v1).addScaledVector(dir, TORSO / 2 - 0.08)
    torso.quaternion.setFromUnitVectors(UP, dir)
    torso.scale.set(0.38, TORSO - 0.1, 0.66)

    v1.copy(N).addScaledVector(dir, 0.22)
    span(neck, N, v1, 0.1)
    head.position.copy(N).addScaledVector(dir, 0.48)
    // Look down the line, over the front shoulder.
    head.rotation.set(0, 0.85, -bend * 0.55)

    sides.forEach((side, i) => {
      const L = legs[i]
      hip.set(H.x, H.y - 0.08, side * 0.2)
      ankle.set(0.04, footY + lift + 0.17, side * 0.5)
      pole.set(1, 0, side * 0.35)
      solveJoint(hip, ankle, THIGH, SHIN, pole, knee)
      span(L.thigh, hip, knee, 0.15)
      span(L.shin, knee, ankle, 0.12)
      L.knee.position.copy(knee)
      L.shoe.position.set(0.12, footY + lift + 0.1, side * 0.5)
      L.shoe.scale.set(0.6, 0.16, 0.25)
      L.sole.position.set(0.12, footY + lift + 0.02, side * 0.5)
      L.sole.scale.set(0.62, 0.04, 0.26)

      const A = arms[i]
      shoulder.copy(N).addScaledVector(dir, -0.12)
      shoulder.z += side * 0.38
      const out = p.arms
      hand.set(
        shoulder.x + 0.2 - out * 0.05,
        shoulder.y - 1.25 + out * 0.95,
        shoulder.z + side * (0.18 + out * 1.1),
      )
      pole.set(-0.6, -0.5, side * 0.6)
      solveJoint(shoulder, hand, UPPER_ARM, FOREARM, pole, elbow)
      span(A.upper, shoulder, elbow, 0.12)
      span(A.fore, elbow, hand, 0.085)
      A.elbow.position.copy(elbow)
      A.shoulder.position.copy(shoulder)
      A.hand.position.copy(hand)
    })
  }

  pose({ crouch: 0.3, tuck: 0, arms: 0.35, lean: 0 }, 0.05)
  return { root, pose }
}

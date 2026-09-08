import React, { useRef, useState, useEffect, useMemo, useCallback, useSyncExternalStore } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { cn } from '@/lib/utils';

export interface InfiniteGalleryImage {
  url: string;
  width?: number;
  height?: number;
  title?: string;
  description?: string;
}

export interface InfiniteGalleryProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  images?: InfiniteGalleryImage[];
  density?: number;
  imageSize?: number;
  cellSize?: number;
  viewRange?: number;
  fogNear?: number;
  fogFar?: number;
  dragSpeed?: number;
  driftAmount?: number;
  friction?: number;
  autoZoom?: boolean;
  autoZoomSpeed?: number;
  imageRadius?: number;
  allowImageFocusOnClick?: boolean;
  backgroundColor?: string;
  fogColor?: string;
}

interface FocusTarget {
  px: number;
  py: number;
  pz: number;
  scaleX: number;
  scaleY: number;
}

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
const lerp = (start: number, end: number, t: number) => start + (end - start) * t;
const pseudoRandom = (seed: number) => {
  const t = 1e4 * Math.sin(9999 * seed);
  return t - Math.floor(t);
};

const textureCache = new Map<string, THREE.Texture>();
const textureLoader = new THREE.TextureLoader();
const cellCache = new Map<string, Array<{ id: string; px: number; py: number; pz: number; size: number; imgIdx: number }>>();
const planeGeometry = new THREE.PlaneGeometry(1, 1);

const vertexShader = `
varying vec2 vUv;
#include <fog_pars_vertex>
void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`;

const fragmentShader = `
precision highp float;
uniform sampler2D uMap;
uniform float uOpacity;
uniform float uRadius;
uniform vec2 uSize;
varying vec2 vUv;

#ifdef USE_FOG
  uniform vec3 fogColor;
  uniform float fogNear;
  uniform float fogFar;
  varying float vFogDepth;
#endif

float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

void main() {
  vec4 tex = texture2D(uMap, vUv);

  float shortEdge = min(uSize.x, uSize.y);
  float r = uRadius * shortEdge * 0.5;
  vec2 p = (vUv - 0.5) * uSize;
  vec2 halfSize = uSize * 0.5;
  float d = roundedBox(p, halfSize, r);
  float aa = fwidth(d);
  float mask = 1.0 - smoothstep(-aa, aa, d);

  float alpha = mask * uOpacity;

  #ifdef USE_FOG
    float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
    alpha *= 1.0 - fogFactor;
  #endif

  if (alpha < 0.001) discard;
  gl_FragColor = vec4(tex.rgb, alpha);
  #include <colorspace_fragment>
}
`;

const sharedFocus: { current: FocusTarget | null } = { current: null };

interface ItemProps {
  info: { id: string; px: number; py: number; pz: number; size: number; imgIdx: number };
  media: InfiniteGalleryImage;
  camRef: React.RefObject<{ x: number; y: number; z: number }>;
  cellSize: number;
  viewRange: number;
  imageRadius: number;
  onFocus?: ((target: FocusTarget) => void) | null;
}

function GalleryItem({ info, media, camRef, cellSize, viewRange, imageRadius, onFocus }: ItemProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const isTarget = sharedFocus.current &&
    sharedFocus.current.px === info.px &&
    sharedFocus.current.py === info.py &&
    sharedFocus.current.pz === info.pz;
  
  const opacityRef = useRef<number>(isTarget ? 1 : 0);
  const isLoadedRef = useRef(false);

  const scale = useMemo(() => {
    const aspect = (media.width && media.height) ? media.width / media.height : 1.5;
    return new THREE.Vector3(info.size * aspect, info.size, 1);
  }, [media, info.size]);

  const uniforms = useMemo(() => {
    return THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        uMap: { value: null },
        uOpacity: { value: isTarget ? 1 : 0 },
        uRadius: { value: imageRadius },
        uSize: { value: new THREE.Vector2(1, 1) }
      }
    ]);
  }, [imageRadius, isTarget]);

  useEffect(() => {
    if (textureCache.has(media.url)) {
      isLoadedRef.current = true;
      return;
    }
    textureLoader.setCrossOrigin('anonymous');
    textureLoader.load(
      media.url,
      (tex) => {
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
        textureCache.set(media.url, tex);
        isLoadedRef.current = true;
      },
      undefined,
      () => {
        console.warn('InfiniteGallery: failed to load image', media.url);
      }
    );
  }, [media.url]);

  const maxDist = cellSize * (viewRange + 1);

  useFrame(() => {
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!mesh || !mat) return;

    if (!mat.uniforms.uMap.value && isLoadedRef.current) {
      const tex = textureCache.get(media.url);
      if (tex) {
        mat.uniforms.uMap.value = tex;
        mat.needsUpdate = true;
      }
    }

    if (!mat.uniforms.uMap.value) {
      mesh.visible = false;
      return;
    }

    const cam = camRef.current;
    if (!cam) return;

    const dx = info.px - cam.x;
    const dy = info.py - cam.y;
    const dz = info.pz - cam.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    const sf = sharedFocus.current;
    const isThisFocused = sf && sf.px === info.px && sf.py === info.py && sf.pz === info.pz;

    opacityRef.current = isThisFocused ? 1 : lerp(opacityRef.current, (isThisFocused || dist < maxDist) ? 1 : 0, 0.12);
    mat.uniforms.uOpacity.value = opacityRef.current;
    mat.uniforms.uRadius.value = imageRadius;
    mat.uniforms.uSize.value.set(scale.x, scale.y);
    mesh.visible = opacityRef.current > 0.01;
    mesh.renderOrder = isThisFocused ? 999 : 0;
    mat.depthTest = !isThisFocused;
  });

  const handleClick = useCallback((evt: any) => {
    if (onFocus) {
      evt.stopPropagation();
      onFocus({
        px: info.px,
        py: info.py,
        pz: info.pz,
        scaleX: scale.x,
        scaleY: scale.y
      });
    }
  }, [info, scale, onFocus]);

  return (
    <mesh
      ref={meshRef}
      geometry={planeGeometry}
      position={[info.px, info.py, info.pz]}
      scale={scale}
      visible={false}
      onClick={handleClick}
    >
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        depthWrite={false}
        fog={true}
        side={THREE.DoubleSide}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function GridCell({ cx, cy, cz, images, cellSize, density, imageSize, camRef, viewRange, imageRadius, onFocus }: {
  cx: number;
  cy: number;
  cz: number;
  images: InfiniteGalleryImage[];
  cellSize: number;
  density: number;
  imageSize: number;
  camRef: React.RefObject<{ x: number; y: number; z: number }>;
  viewRange: number;
  imageRadius: number;
  onFocus?: ((target: FocusTarget) => void) | null;
}) {
  const items = useMemo(() => {
    const key = `${cx},${cy},${cz}|${cellSize}|${density}|${imageSize}`;
    const cached = cellCache.get(key);
    if (cached) return cached;

    let seed = 0;
    for (let i = 0; i < key.length; i++) {
      seed = (seed << 5) - seed + key.charCodeAt(i) | 0;
    }
    seed = Math.abs(seed);

    const generated = [];
    for (let o = 0; o < density; o++) {
      const r = seed + 7919 * o;
      const size = imageSize * (0.65 + 0.7 * pseudoRandom(r + 4));
      generated.push({
        id: `${key}-${o}`,
        px: cx * cellSize + pseudoRandom(r + 0) * cellSize,
        py: cy * cellSize + pseudoRandom(r + 1) * cellSize,
        pz: cz * cellSize + pseudoRandom(r + 2) * cellSize,
        size,
        imgIdx: Math.floor(1e6 * pseudoRandom(r + 5))
      });
    }

    cellCache.set(key, generated);
    if (cellCache.size > 512) {
      const firstKey = cellCache.keys().next().value;
      if (firstKey !== undefined) cellCache.delete(firstKey);
    }
    return generated;
  }, [cx, cy, cz, cellSize, density, imageSize]);

  return (
    <>
      {items.map((item) => {
        const media = images[item.imgIdx % images.length];
        return media ? (
          <GalleryItem
            key={item.id}
            info={item}
            media={media}
            camRef={camRef}
            cellSize={cellSize}
            viewRange={viewRange}
            imageRadius={imageRadius}
            onFocus={onFocus}
          />
        ) : null;
      })}
    </>
  );
}

function GalleryScene({
  images,
  cellSize,
  density,
  imageSize,
  viewRange,
  dragSpeed,
  driftAmount,
  friction,
  autoZoom,
  autoZoomSpeed,
  imageRadius,
  allowFocus
}: {
  images: InfiniteGalleryImage[];
  cellSize: number;
  density: number;
  imageSize: number;
  viewRange: number;
  dragSpeed: number;
  driftAmount: number;
  friction: number;
  autoZoom: boolean;
  autoZoomSpeed: number;
  imageRadius: number;
  allowFocus: boolean;
}) {
  const { camera, gl } = useThree();

  const neighborhood = useMemo(() => {
    const range = viewRange + 1;
    const cells: Array<{ dx: number; dy: number; dz: number }> = [];
    for (let x = -range; x <= range; x++) {
      for (let y = -range; y <= range; y++) {
        for (let z = -range; z <= range; z++) {
          if (Math.max(Math.abs(x), Math.abs(y), Math.abs(z)) <= range) {
            cells.push({ dx: x, dy: y, dz: z });
          }
        }
      }
    }
    return cells;
  }, [viewRange]);

  const state = useRef({
    vel: { x: 0, y: 0, z: 0 },
    tgt: { x: 0, y: 0, z: 0 },
    pos: { x: 0, y: 0, z: 50 },
    drift: { x: 0, y: 0 },
    mouse: { x: 0, y: 0 },
    lastMouse: { x: 0, y: 0 },
    dragging: false,
    scrollAccum: 0,
    lastKey: '',
    lastTouches: [] as Touch[],
    lastTouchDist: 0,
    focused: false,
    focusTarget: null as FocusTarget | null,
    dragDistSq: 0
  });

  const camRef = useRef({ x: 0, y: 0, z: 50 });
  const [activeCells, setActiveCells] = useState<Array<{ key: string; cx: number; cy: number; cz: number }>>([]);

  const handleFocus = useCallback((target: FocusTarget) => {
    const s = state.current;
    if (s.dragDistSq > 16) return;

    if (s.focused && s.focusTarget) {
      if (s.focusTarget.px === target.px && s.focusTarget.py === target.py && s.focusTarget.pz === target.pz) {
        s.focused = false;
        s.focusTarget = null;
        sharedFocus.current = null;
        return;
      }
      s.focusTarget = target;
      sharedFocus.current = target;
      s.vel = { x: 0, y: 0, z: 0 };
      s.tgt = { x: 0, y: 0, z: 0 };
      s.scrollAccum = 0;
      return;
    }

    s.focused = true;
    s.focusTarget = target;
    sharedFocus.current = target;
    s.vel = { x: 0, y: 0, z: 0 };
    s.tgt = { x: 0, y: 0, z: 0 };
    s.scrollAccum = 0;
  }, []);

  const handleBackgroundClick = useCallback(() => {
    const s = state.current;
    if (s.focused) {
      s.focused = false;
      s.focusTarget = null;
      sharedFocus.current = null;
    }
  }, []);

  useEffect(() => {
    const s = state.current;
    s.pos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    const cx = Math.floor(s.pos.x / cellSize);
    const cy = Math.floor(s.pos.y / cellSize);
    const cz = Math.floor(s.pos.z / cellSize);
    setActiveCells(neighborhood.map((n) => ({
      key: `${cx + n.dx},${cy + n.dy},${cz + n.dz}`,
      cx: cx + n.dx,
      cy: cy + n.dy,
      cz: cz + n.dz
    })));
  }, [camera, cellSize, neighborhood]);

  useEffect(() => {
    const canvas = gl.domElement;
    const s = state.current;

    const onMouseDown = (e: MouseEvent) => {
      s.dragging = true;
      s.lastMouse = { x: e.clientX, y: e.clientY };
      s.dragDistSq = 0;
    };

    const onMouseUp = () => {
      s.dragging = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      const width = canvas.clientWidth || 1;
      const height = canvas.clientHeight || 1;
      s.mouse = {
        x: (e.clientX / width) * 2 - 1,
        y: -(e.clientY / height) * 2 + 1
      };

      if (s.dragging) {
        const dx = e.clientX - s.lastMouse.x;
        const dy = e.clientY - s.lastMouse.y;
        s.dragDistSq += dx * dx + dy * dy;

        if (s.focused) {
          if (s.dragDistSq > 16) {
            s.focused = false;
            s.focusTarget = null;
            sharedFocus.current = null;
          }
        } else {
          s.tgt.x -= dx * dragSpeed * 0.025;
          s.tgt.y += dy * dragSpeed * 0.025;
        }
        s.lastMouse = { x: e.clientX, y: e.clientY };
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (s.focused) {
        s.focused = false;
        s.focusTarget = null;
        sharedFocus.current = null;
      }
      s.scrollAccum += e.deltaY * 0.006;
    };

    const calcTouchDist = (touches: Touch[]) => {
      if (touches.length < 2) return 0;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      s.lastTouches = Array.from(e.touches);
      s.lastTouchDist = calcTouchDist(s.lastTouches);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touches = Array.from(e.touches);
      if (touches.length === 1 && s.lastTouches.length >= 1) {
        const t1 = touches[0];
        const last1 = s.lastTouches[0];
        if (t1 && last1) {
          if (s.focused) {
            s.focused = false;
            s.focusTarget = null;
            sharedFocus.current = null;
          }
          s.tgt.x -= (t1.clientX - last1.clientX) * dragSpeed * 0.02;
          s.tgt.y += (t1.clientY - last1.clientY) * dragSpeed * 0.02;
        }
      } else if (touches.length === 2 && s.lastTouchDist > 0) {
        const dist = calcTouchDist(touches);
        if (s.focused) {
          s.focused = false;
          s.focusTarget = null;
          sharedFocus.current = null;
        }
        s.scrollAccum += (s.lastTouchDist - dist) * 0.006;
        s.lastTouchDist = dist;
      }
      s.lastTouches = touches;
    };

    const onTouchEnd = (e: TouchEvent) => {
      s.lastTouches = Array.from(e.touches);
      s.lastTouchDist = calcTouchDist(s.lastTouches);
    };

    const onMouseLeave = () => {
      s.mouse = { x: 0, y: 0 };
      s.dragging = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [gl, dragSpeed]);

  useFrame(() => {
    const s = state.current;

    if (s.focused && s.focusTarget) {
      const target = s.focusTarget;
      const zoomDist = 1.2 * Math.max(target.scaleX, target.scaleY);
      const tx = target.px;
      const ty = target.py;
      const tz = target.pz + zoomDist;

      s.pos.x = lerp(s.pos.x, tx, 0.08);
      s.pos.y = lerp(s.pos.y, ty, 0.08);
      s.pos.z = lerp(s.pos.z, tz, 0.08);
      s.drift.x = lerp(s.drift.x, 0, 0.15);
      s.drift.y = lerp(s.drift.y, 0, 0.15);

      camera.position.set(s.pos.x + s.drift.x, s.pos.y + s.drift.y, s.pos.z);
      s.vel = { x: 0, y: 0, z: 0 };
      s.tgt = { x: 0, y: 0, z: 0 };
      s.scrollAccum = 0;
      camRef.current = { x: s.pos.x, y: s.pos.y, z: s.pos.z };

      const cx = Math.floor(s.pos.x / cellSize);
      const cy = Math.floor(s.pos.y / cellSize);
      const cz = Math.floor(s.pos.z / cellSize);
      const currentKey = `${cx},${cy},${cz}`;
      if (currentKey !== s.lastKey) {
        s.lastKey = currentKey;
        setActiveCells(neighborhood.map((n) => ({
          key: `${cx + n.dx},${cy + n.dy},${cz + n.dz}`,
          cx: cx + n.dx,
          cy: cy + n.dy,
          cz: cz + n.dz
        })));
      }
      return;
    }

    const depthScale = clamp(s.pos.z / 50, 0.3, 2);
    if (!s.dragging) {
      s.drift.x = lerp(s.drift.x, s.mouse.x * driftAmount * depthScale, 0.12);
      s.drift.y = lerp(s.drift.y, s.mouse.y * driftAmount * depthScale, 0.12);
    }

    s.tgt.z += s.scrollAccum;
    s.scrollAccum *= 0.8;

    if (autoZoom) {
      s.pos.z -= autoZoomSpeed;
    }

    s.tgt.x = clamp(s.tgt.x, -3.2, 3.2);
    s.tgt.y = clamp(s.tgt.y, -3.2, 3.2);
    s.tgt.z = clamp(s.tgt.z, -3.2, 3.2);

    s.vel.x = lerp(s.vel.x, s.tgt.x, 0.16);
    s.vel.y = lerp(s.vel.y, s.tgt.y, 0.16);
    s.vel.z = lerp(s.vel.z, s.tgt.z, 0.16);

    s.pos.x += s.vel.x;
    s.pos.y += s.vel.y;
    s.pos.z += s.vel.z;

    camera.position.set(s.pos.x + s.drift.x, s.pos.y + s.drift.y, s.pos.z);

    s.tgt.x *= friction;
    s.tgt.y *= friction;
    s.tgt.z *= friction;

    camRef.current = { x: s.pos.x, y: s.pos.y, z: s.pos.z };

    const cx = Math.floor(s.pos.x / cellSize);
    const cy = Math.floor(s.pos.y / cellSize);
    const cz = Math.floor(s.pos.z / cellSize);
    const currentKey = `${cx},${cy},${cz}`;
    if (currentKey !== s.lastKey) {
      s.lastKey = currentKey;
      setActiveCells(neighborhood.map((n) => ({
        key: `${cx + n.dx},${cy + n.dy},${cz + n.dz}`,
        cx: cx + n.dx,
        cy: cy + n.dy,
        cz: cz + n.dz
      })));
    }
  });

  return (
    <>
      {allowFocus && (
        <mesh
          position={[camera.position.x, camera.position.y, camera.position.z - 400]}
          onClick={handleBackgroundClick}
        >
          <planeGeometry args={[10000, 10000]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      )}
      {activeCells.map((cell) => (
        <GridCell
          key={cell.key}
          cx={cell.cx}
          cy={cell.cy}
          cz={cell.cz}
          images={images}
          cellSize={cellSize}
          density={density}
          imageSize={imageSize}
          camRef={camRef}
          viewRange={viewRange}
          imageRadius={imageRadius}
          onFocus={allowFocus ? handleFocus : null}
        />
      ))}
    </>
  );
}

const DEFAULT_IMAGES: InfiniteGalleryImage[] = [
  { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=75', width: 600, height: 400 },
  { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=75', width: 600, height: 400 },
  { url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=75', width: 600, height: 400 },
  { url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&q=75', width: 600, height: 400 },
  { url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&q=75', width: 600, height: 400 },
  { url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=75', width: 600, height: 400 },
  { url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=75', width: 600, height: 400 },
  { url: 'https://images.unsplash.com/photo-1465056836900-8f1e4f32c1f6?w=600&q=75', width: 600, height: 338 }
];

const getDpr = () => typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;
const subscribeDpr = (cb: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const media = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
  media.addEventListener('change', cb, { once: true });
  return () => media.removeEventListener('change', cb);
};
const getSnapshotDpr = () => 1;

const normalizeColor = (hex: string) => {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return match ? `#${match[1]}${match[2]}${match[3]}` : '#ffffff';
};

export const InfiniteGallery: React.FC<InfiniteGalleryProps> = ({
  width = '100%',
  height = '100%',
  className,
  images = DEFAULT_IMAGES,
  density = 5,
  imageSize = 14,
  cellSize = 110,
  viewRange = 2,
  fogNear = 120,
  fogFar = 320,
  dragSpeed = 1,
  driftAmount = 8,
  friction = 0.9,
  autoZoom = false,
  autoZoomSpeed = 0.5,
  imageRadius = 0.06,
  allowImageFocusOnClick = true,
  backgroundColor = '#000000',
  fogColor = '#000000'
}) => {
  const galleryImages = images && images.length > 0 ? images : DEFAULT_IMAGES;
  const bg = normalizeColor(backgroundColor);
  const fog = normalizeColor(fogColor);
  const dpr = useSyncExternalStore(subscribeDpr, getDpr, getSnapshotDpr);

  return (
    <div
      className={cn('relative overflow-hidden touch-none select-none', className)}
      style={{ width, height }}
    >
      <Canvas
        className="absolute inset-0 h-full w-full"
        camera={{ position: [0, 0, 50], fov: 60, near: 1, far: 500 }}
        dpr={dpr}
        flat={true}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={[bg]} />
        <fog attach="fog" args={[fog, fogNear, fogFar]} />
        <GalleryScene
          images={galleryImages}
          cellSize={cellSize}
          density={density}
          imageSize={imageSize}
          viewRange={viewRange}
          dragSpeed={dragSpeed}
          driftAmount={driftAmount}
          friction={friction}
          autoZoom={autoZoom}
          autoZoomSpeed={autoZoomSpeed}
          imageRadius={imageRadius}
          allowFocus={allowImageFocusOnClick}
        />
      </Canvas>
    </div>
  );
};

InfiniteGallery.displayName = 'InfiniteGallery';
export default InfiniteGallery;

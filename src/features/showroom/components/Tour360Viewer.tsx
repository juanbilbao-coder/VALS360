import React, { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Tour360Viewer
 * Lightweight WebGL panorama viewer for equirectangular images.
 * Renders a full-screen quad and maps it to a virtual sphere using yaw/pitch.
 */

const DEG_TO_RAD = Math.PI / 180;
const FOV_DEG = 70;
const MAX_PITCH = Math.PI / 2 - 0.05;

type Tour360ViewerProps = {
  src: string;
  label?: string;
  hotspots?: Tour360Hotspot[];
  onSelectScene?: (sceneId: string) => void;
  initialYaw?: number;
  initialPitch?: number;
};

type Tour360Hotspot = {
  targetSceneId: string;
  yaw: number;
  pitch: number;
};

type GLResources = {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  buffer: WebGLBuffer;
  texture: WebGLTexture | null;
  uniforms: {
    uYaw: WebGLUniformLocation | null;
    uPitch: WebGLUniformLocation | null;
    uAspect: WebGLUniformLocation | null;
    uFov: WebGLUniformLocation | null;
    uSampler: WebGLUniformLocation | null;
  };
};

const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uSampler;
uniform float uYaw;
uniform float uPitch;
uniform float uAspect;
uniform float uFov;

const float PI = 3.141592653589793;

vec3 rotateY(vec3 v, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec3(c * v.x + s * v.z, v.y, -s * v.x + c * v.z);
}

vec3 rotateX(vec3 v, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec3(v.x, c * v.y - s * v.z, s * v.y + c * v.z);
}

void main() {
  float fov = radians(uFov);
  float tanHalf = tan(fov * 0.5);
  vec2 uv = vUv;
  vec3 ray = normalize(vec3(uv.x * tanHalf * uAspect, uv.y * tanHalf, 1.0));
  ray = rotateY(ray, uYaw);
  ray = rotateX(ray, uPitch);

  float u = atan(ray.z, ray.x) / (2.0 * PI) + 0.5;
  float v = 0.5 - asin(clamp(ray.y, -1.0, 1.0)) / PI;
  u = fract(u);

  gl_FragColor = texture2D(uSampler, vec2(u, v));
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vertexSrc: string, fragmentSrc: string) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSrc);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
  if (!vertexShader || !fragmentShader) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function rotateYVec(v: [number, number, number], angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [c * v[0] + s * v[2], v[1], -s * v[0] + c * v[2]] as [number, number, number];
}

function rotateXVec(v: [number, number, number], angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [v[0], c * v[1] - s * v[2], s * v[1] + c * v[2]] as [number, number, number];
}

export default function Tour360Viewer({
  src,
  label = 'Recorrido 360°',
  hotspots = [],
  onSelectScene,
  initialYaw,
  initialPitch
}: Tour360ViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<GLResources | null>(null);
  const frameRef = useRef<number | null>(null);
  const viewFrameRef = useRef<number | null>(null);
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const draggingRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });
  const [viewAngles, setViewAngles] = useState({ yaw: 0, pitch: 0 });
  const [viewport, setViewport] = useState({ width: 1, height: 1 });
  const orientationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext('webgl', { antialias: true, alpha: false });
    if (!gl) return;

    const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    if (!program) return;

    const buffer = gl.createBuffer();
    if (!buffer) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1
      ]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'aPosition');
    const uYaw = gl.getUniformLocation(program, 'uYaw');
    const uPitch = gl.getUniformLocation(program, 'uPitch');
    const uAspect = gl.getUniformLocation(program, 'uAspect');
    const uFov = gl.getUniformLocation(program, 'uFov');
    const uSampler = gl.getUniformLocation(program, 'uSampler');

    const texture = gl.createTexture();
    if (texture) {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }

    resourcesRef.current = {
      gl,
      program,
      buffer,
      texture,
      uniforms: { uYaw, uPitch, uAspect, uFov, uSampler }
    };

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(clientHeight * dpr));
      canvas.style.width = `${clientWidth}px`;
      canvas.style.height = `${clientHeight}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      setViewport({ width: clientWidth, height: clientHeight });
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    const render = () => {
      const resources = resourcesRef.current;
      if (!resources) return;
      const { gl: rgl, program: rprogram, buffer: rbuffer, uniforms } = resources;
      rgl.useProgram(rprogram);
      rgl.bindBuffer(rgl.ARRAY_BUFFER, rbuffer);
      rgl.enableVertexAttribArray(positionLocation);
      rgl.vertexAttribPointer(positionLocation, 2, rgl.FLOAT, false, 0, 0);
      rgl.clearColor(0.92, 0.91, 0.88, 1);
      rgl.clear(rgl.COLOR_BUFFER_BIT);
      if (uniforms.uYaw) rgl.uniform1f(uniforms.uYaw, yawRef.current);
      if (uniforms.uPitch) rgl.uniform1f(uniforms.uPitch, pitchRef.current);
      if (uniforms.uAspect) rgl.uniform1f(uniforms.uAspect, canvas.width / canvas.height);
      if (uniforms.uFov) rgl.uniform1f(uniforms.uFov, FOV_DEG);
      if (uniforms.uSampler) rgl.uniform1i(uniforms.uSampler, 0);
      rgl.drawArrays(rgl.TRIANGLES, 0, 6);
      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (viewFrameRef.current) {
        cancelAnimationFrame(viewFrameRef.current);
      }
      if (resourcesRef.current?.texture) {
        gl.deleteTexture(resourcesRef.current.texture);
      }
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  useEffect(() => {
    const resources = resourcesRef.current;
    if (!resources || !src) return;
    const { gl, texture } = resources;
    if (!texture) return;

    const image = new Image();
    image.src = src;
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    };
  }, [src]);

  useEffect(() => {
    const targetYaw = typeof initialYaw === 'number' ? initialYaw : 0;
    const targetPitch = typeof initialPitch === 'number' ? initialPitch : 0;

    if (orientationFrameRef.current) {
      cancelAnimationFrame(orientationFrameRef.current);
    }

    const startYaw = yawRef.current;
    const startPitch = pitchRef.current;
    const startTime = performance.now();
    const duration = 220;

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const t = progress * (2 - progress);
      yawRef.current = startYaw + (targetYaw - startYaw) * t;
      pitchRef.current = startPitch + (targetPitch - startPitch) * t;
      setViewAngles({ yaw: yawRef.current, pitch: pitchRef.current });
      if (progress < 1) {
        orientationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    orientationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (orientationFrameRef.current) {
        cancelAnimationFrame(orientationFrameRef.current);
      }
    };
  }, [src, initialYaw, initialPitch]);

  const requestViewUpdate = () => {
    if (viewFrameRef.current) return;
    viewFrameRef.current = requestAnimationFrame(() => {
      viewFrameRef.current = null;
      setViewAngles({ yaw: yawRef.current, pitch: pitchRef.current });
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    lastRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const dx = event.clientX - lastRef.current.x;
    const dy = event.clientY - lastRef.current.y;
    lastRef.current = { x: event.clientX, y: event.clientY };
    const sensitivity = 0.005;
    yawRef.current -= dx * sensitivity;
    pitchRef.current -= dy * sensitivity;
    // Pitch is clamped to avoid flipping the camera upside down.
    pitchRef.current = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, pitchRef.current));
    requestViewUpdate();
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  if (!src) {
    return (
      <div className="w-full h-full rounded-2xl border border-border-subtle bg-[#EFECE8] flex items-center justify-center text-secondary text-xs uppercase tracking-[0.24em]">
        {label}
      </div>
    );
  }

  const projectedHotspots = useMemo(() => {
    if (!hotspots.length || viewport.width <= 0 || viewport.height <= 0) return [];
    const aspect = viewport.width / viewport.height;
    const fovRad = FOV_DEG * DEG_TO_RAD;
    const tanHalf = Math.tan(fovRad / 2);

    const computed = hotspots
      .map((hotspot) => {
        const cy = Math.cos(hotspot.yaw);
        const sy = Math.sin(hotspot.yaw);
        const cp = Math.cos(hotspot.pitch);
        const sp = Math.sin(hotspot.pitch);
        // Convention: yaw=0 points forward (+Z), matching shader camera direction.
        let dir: [number, number, number] = [cp * sy, sp, cp * cy];
        // Rotate by inverse camera orientation to project into view space.
        dir = rotateYVec(dir, -viewAngles.yaw);
        dir = rotateXVec(dir, -viewAngles.pitch);
        const z = dir[2];
        // Behind the camera -> skip hotspot.
        if (z <= 0.1) return null;
        const xNdc = dir[0] / (z * tanHalf * aspect);
        const yNdc = dir[1] / (z * tanHalf);
        // Outside view bounds -> skip hotspot.
        if (xNdc < -1.1 || xNdc > 1.1 || yNdc < -1.1 || yNdc > 1.1) return null;
        return {
          ...hotspot,
          x: (xNdc + 1) * 0.5 * viewport.width,
          y: (1 - yNdc) * 0.5 * viewport.height
        };
      })
      .filter(Boolean) as Array<Tour360Hotspot & { x: number; y: number }>;

    return computed;
  }, [hotspots, viewAngles, viewport]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full rounded-2xl border border-border-subtle bg-[#EFECE8] overflow-hidden select-none cursor-grab active:cursor-grabbing touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="img"
      aria-label={label}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute inset-0 pointer-events-none z-20">
        {projectedHotspots.map((hotspot) => (
          <button
            key={hotspot.targetSceneId}
            type="button"
            className="pointer-events-auto absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#B89050]/70 bg-white/70 text-[#B89050] shadow-md backdrop-blur-sm transition-transform duration-200 hover:scale-105"
            style={{ left: hotspot.x, top: hotspot.y }}
            onClick={() => onSelectScene?.(hotspot.targetSceneId)}
            aria-label="Ir a otra escena"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" className="mx-auto">
              <path d="M6 12h12m-4-4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

import React, {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type CSSProperties,
  type HTMLAttributes
} from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
  type SpringOptions
} from 'framer-motion';
import { cn } from '@/lib/utils';

export interface UserCursorClassNames {
  root?: string;
  cursor?: string;
  arrow?: string;
  label?: string;
  labelText?: string;
}

export interface UserCursorProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  name?: string;
  arrow?: ReactNode | ((color: string) => ReactNode);
  label?: ReactNode;
  color?: string;
  textColor?: string;
  size?: number;
  tilt?: number;
  directionAwareTilt?: boolean;
  labelTiltStrength?: number;
  trigger?: 'always' | 'hover' | 'press';
  showLabel?: boolean;
  hideNativeCursor?: boolean;
  fullScreen?: boolean;
  spring?: SpringOptions;
  labelSpring?: SpringOptions;
  offset?: { x?: number; y?: number };
  labelOffset?: { x?: number; y?: number };
  pressScale?: number;
  classNames?: UserCursorClassNames;
  hideOnTouch?: boolean;
  zIndex?: number;
}

const defaultSpring: SpringOptions = { stiffness: 380, damping: 32, mass: 0.6 };
const defaultLabelSpring: SpringOptions = { stiffness: 220, damping: 26, mass: 0.7 };

export const DefaultArrow: React.FC<{ color?: string; size?: number; [key: string]: any }> = ({
  color = '#F39C2A',
  size = 28,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <path
      d="M5.2 3.4c-.7-.3-1.5.4-1.2 1.1l5.7 14.8c.3.8 1.5.8 1.8 0l2.4-6 6-2.4c.8-.3.8-1.5 0-1.8L5.2 3.4Z"
      fill={color}
      stroke="rgba(0,0,0,0.22)"
      strokeWidth={1.2}
      strokeLinejoin="round"
    />
  </svg>
);

export const UserCursor = forwardRef<HTMLDivElement, UserCursorProps>(function UserCursor(
  {
    children,
    name = 'Sophie',
    arrow,
    label,
    color = '#F39C2A',
    textColor = '#ffffff',
    size = 28,
    tilt = -14,
    directionAwareTilt = false,
    labelTiltStrength = 8,
    trigger = 'hover',
    showLabel = true,
    hideNativeCursor = true,
    fullScreen = false,
    spring,
    labelSpring,
    offset,
    labelOffset,
    pressScale = 0.92,
    classNames,
    hideOnTouch = true,
    zIndex = 50,
    className,
    style,
    onPointerEnter,
    onPointerLeave,
    onPointerMove,
    onPointerDown,
    onPointerUp,
    ...rest
  },
  forwardedRef
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(trigger === 'always');
  const [isPressed, setIsPressed] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  const offsetX = offset?.x ?? 0;
  const offsetY = offset?.y ?? 0;
  const labelOffsetX = labelOffset?.x ?? size * 0.9;
  const labelOffsetY = labelOffset?.y ?? size * 0.2 + 6;

  const springConfig = { ...defaultSpring, ...spring };
  const labelSpringConfig = { ...defaultLabelSpring, ...labelSpring };

  const rawX = useMotionValue(-9999);
  const rawY = useMotionValue(-9999);

  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);

  const smoothLabelX = useSpring(rawX, labelSpringConfig);
  const smoothLabelY = useSpring(rawY, labelSpringConfig);

  const velX = useVelocity(rawX);
  const velY = useVelocity(rawY);

  const filteredVelX = useSpring(velX, { stiffness: 120, damping: 26, mass: 0.5 });
  const filteredVelY = useSpring(velY, { stiffness: 120, damping: 26, mass: 0.5 });

  const arrowAngle = useTransform([filteredVelX, filteredVelY], ([vx, vy]: number[]) => {
    if (!directionAwareTilt) return tilt;
    const speed = Math.hypot(vx, vy);
    if (speed < 40) return tilt;
    let angle = (Math.atan2(vy, vx) * 180) / Math.PI - -138 - tilt;
    angle = ((angle + 540) % 360) - 180;
    return tilt + angle * Math.min(1, (speed - 40) / 560);
  });

  const labelAngle = useTransform([filteredVelX, filteredVelY], ([vx, vy]: number[]) => {
    if (!directionAwareTilt) return 0;
    const speed = Math.hypot(vx, vy);
    if (speed < 40) return 0;
    const factor = Math.min(1, (speed - 40) / 560);
    const ratio = Math.abs(vx) / (speed + 0.001);
    return (
      Math.sign(vy) * ratio * labelTiltStrength * factor +
      Math.sign(vx) * (1 - ratio) * (0.4 * labelTiltStrength) * factor
    );
  });

  const smoothArrowRotate = useSpring(arrowAngle, { stiffness: 220, damping: 24, mass: 0.5 });
  const smoothLabelRotate = useSpring(labelAngle, { stiffness: 160, damping: 22, mass: 0.6 });

  // Coarse touch detection
  useEffect(() => {
    if (!hideOnTouch) return;
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(pointer: coarse)');
    const onChange = () => setIsCoarsePointer(mql.matches);
    onChange();
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, [hideOnTouch]);

  // Hide native cursor when fullScreen is active
  useEffect(() => {
    if (!fullScreen || !hideNativeCursor || isCoarsePointer) return;
    document.documentElement.classList.add('hide-native-cursor');
    return () => {
      document.documentElement.classList.remove('hide-native-cursor');
    };
  }, [fullScreen, hideNativeCursor, isCoarsePointer]);

  // Full-screen window listeners
  useEffect(() => {
    if (!fullScreen || isCoarsePointer) return;

    const handlePointerMove = (e: PointerEvent) => {
      rawX.set(e.clientX + offsetX);
      rawY.set(e.clientY + offsetY);
      if (trigger !== 'always') {
        setIsVisible(true);
      }
    };

    const handlePointerDown = () => {
      setIsPressed(true);
      if (trigger === 'press') {
        setIsVisible(true);
      }
    };

    const handlePointerUp = () => {
      setIsPressed(false);
      if (trigger === 'press') {
        setIsVisible(false);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [fullScreen, isCoarsePointer, offsetX, offsetY, rawX, rawY, trigger]);

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!fullScreen && trigger !== 'always') {
        setIsVisible(true);
      }
      onPointerEnter?.(e);
    },
    [fullScreen, trigger, onPointerEnter]
  );

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!fullScreen && trigger !== 'always') {
        setIsVisible(false);
        setIsPressed(false);
      }
      onPointerLeave?.(e);
    },
    [fullScreen, trigger, onPointerLeave]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (fullScreen) {
        onPointerMove?.(e);
        return;
      }
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        rawX.set(e.clientX - rect.left + offsetX);
        rawY.set(e.clientY - rect.top + offsetY);
      }
      onPointerMove?.(e);
    },
    [fullScreen, offsetX, offsetY, onPointerMove, rawX, rawY]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsPressed(true);
      if (trigger === 'press') {
        setIsVisible(true);
      }
      onPointerDown?.(e);
    },
    [trigger, onPointerDown]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsPressed(false);
      if (trigger === 'press' && !fullScreen) {
        setIsVisible(false);
      }
      onPointerUp?.(e);
    },
    [trigger, fullScreen, onPointerUp]
  );

  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      containerRef.current = el;
      if (typeof forwardedRef === 'function') {
        forwardedRef(el);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }
    },
    [forwardedRef]
  );

  const arrowNode =
    typeof arrow === 'function'
      ? arrow(color)
      : arrow ?? <DefaultArrow color={color} size={size} />;

  const containerStyle: CSSProperties = {
    ...(hideNativeCursor && !isCoarsePointer ? { cursor: 'none' } : null),
    ...style
  };

  const cursorLayerStyle: CSSProperties = fullScreen
    ? { position: 'fixed', inset: 0, pointerEvents: 'none', zIndex }
    : { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex };

  const shouldRenderCursor = !isCoarsePointer && isVisible;

  return (
    <div
      ref={setRef}
      className={cn('relative', fullScreen ? 'contents' : null, classNames?.root, className)}
      style={containerStyle}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      {...rest}
    >
      {children}
      <div style={cursorLayerStyle} aria-hidden="true">
        <AnimatePresence>
          {shouldRenderCursor && (
            <>
              {/* Arrow */}
              <motion.div
                key="user-cursor-arrow"
                className={cn('absolute left-0 top-0 select-none will-change-transform', classNames?.cursor)}
                style={{ x: smoothX, y: smoothY, rotate: smoothArrowRotate }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: isPressed ? pressScale : 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={cn('block', classNames?.arrow)}>{arrowNode}</div>
              </motion.div>

              {/* Little Name Tag Pill */}
              {showLabel && (
                <motion.div
                  key="user-cursor-label"
                  className={cn('absolute left-0 top-0 select-none will-change-transform', classNames?.label)}
                  style={{ x: smoothLabelX, y: smoothLabelY, rotate: smoothLabelRotate }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: isPressed ? pressScale : 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  {label ?? (
                    <div
                      className={cn(
                        'inline-flex items-center rounded-full font-bold leading-none border-[1.5px] border-[#181d18] shadow-[2px_2px_0px_#181d18]',
                        classNames?.labelText
                      )}
                      style={{
                        background: color,
                        color: textColor,
                        fontSize: `${0.48 * size}px`,
                        paddingInline: `${0.44 * size}px`,
                        paddingBlock: `${0.2 * size}px`,
                        transform: `translate(${labelOffsetX}px, ${labelOffsetY}px)`
                      }}
                    >
                      {name}
                    </div>
                  )}
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

UserCursor.displayName = 'UserCursor';
export default UserCursor;

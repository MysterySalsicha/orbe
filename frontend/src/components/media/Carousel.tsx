import React, { useRef, useState, useEffect, forwardRef, useCallback } from "react";
import MidiaCard from "./MidiaCard";
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Filme, Serie, Anime, Jogo, TipoMidia, Preferencias, UserAction, UserInteraction } from "@/types";

interface CarouselProps {
  items: (Filme | Serie | Anime | Jogo)[];
  className?: string;
  type: TipoMidia;
  title: string;
  showNavigation?: boolean;
  onTitleClick?: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  userInteractions?: UserInteraction[];
  onInteraction?: (action: UserAction, midia: Filme | Serie | Anime | Jogo) => void;
}

const DRAG_SENSITIVITY = 2.6;

const Carousel = forwardRef<HTMLDivElement, CarouselProps>(({ 
  items,
  className = "",
  type,
  title,
  showNavigation = false,
  onTitleClick,
  onNavigate,
  userInteractions,
  onInteraction,
}, ref) => {

  const localRef = useRef<HTMLDivElement | null>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false); // Added hasDraggedRef
  const [dragging, setDragging] = useState(false);

  const setRefs = useCallback((node: HTMLDivElement) => {
    localRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
  }, [ref]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = localRef.current;
    if (!el) return;

    isDownRef.current = true;
    setDragging(true);
    hasDraggedRef.current = false; // Reset hasDragged on pointer down
    const rect = el.getBoundingClientRect();
    startXRef.current = e.clientX - rect.left;
    scrollLeftRef.current = el.scrollLeft;

    try {
      el.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDownRef.current) return;
    const el = localRef.current;
    if (!el) return;

    const currentX = e.clientX - el.getBoundingClientRect().left;
    const distance = Math.abs(currentX - startXRef.current);

    // If moved beyond a threshold, it's a drag
    if (distance > 20) { // Increased threshold to 20 pixels
      hasDraggedRef.current = true;
    }

    if (hasDraggedRef.current) {
      e.preventDefault(); // Only prevent default if it's a drag
      const walk = (currentX - startXRef.current) * DRAG_SENSITIVITY;
      el.scrollLeft = scrollLeftRef.current - walk;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const wasDragged = hasDraggedRef.current; // Capture drag status before resetting

    isDownRef.current = false;
    setDragging(false);
    hasDraggedRef.current = false; // Reset hasDragged on pointer up
    const el = localRef.current;
    if (!el) return;
    try {
      el.releasePointerCapture(e.pointerId);
    } catch {}

    // If it was not a drag, manually trigger the MidiaCard's click handler
    if (!wasDragged) {
      const elementUnderPointer = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      const clickableCardElement = elementUnderPointer?.closest('[data-clickable-card]') as HTMLElement;
      if (clickableCardElement) {
        clickableCardElement.click(); // Trigger the native click event on the clickable div
      }
    } else {
      // If it was a drag, prevent any lingering click events
      e.preventDefault();
    }
  };

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;
    const onCancel = () => {
      isDownRef.current = false;
      setDragging(false);
    };
    el.addEventListener("pointercancel", onCancel);

    return () => {
      el.removeEventListener("pointercancel", onCancel);
    };
  }, [localRef]);

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // If Shift key is pressed, or if it's a horizontal scroll (e.g., trackpad horizontal gesture)
      if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault(); // Prevent default only if we are handling it
        // Perform horizontal scroll on the carousel
        el.scrollLeft += e.deltaX + e.deltaY;
      } else {
        // If it's a pure vertical scroll (e.deltaY is dominant) and Shift is NOT pressed,
        // manually scroll the window/document vertically.
        window.scrollBy({
          top: e.deltaY,
          behavior: 'auto' // Use 'auto' for immediate response
        });
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, [localRef]);

  const handleArrowScroll = (direction: 'left' | 'right') => {
    if (localRef.current) {
      const { current } = localRef;
      const scrollAmount = current.offsetWidth * 0.8;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
    onNavigate?.(direction === 'left' ? 'prev' : 'next');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => onTitleClick?.()}
          className="text-2xl font-bold hover:text-primary transition-colors cursor-pointer"
        >
          {title}
        </button>

        {showNavigation && (
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => handleArrowScroll('left')}
              className="p-2 rounded-full border border-border hover:bg-muted text-foreground transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleArrowScroll('right')}
              className="p-2 rounded-full border border-border hover:bg-muted text-foreground transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={setRefs}
        style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
        className={`flex overflow-x-auto scrollbar-hide gap-4 px-4 py-2 ${className} ${
          dragging ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 snap-center flex justify-center items-center" // Added flex centering
            style={{ willChange: "transform", minWidth: 200 }}
          >
            <MidiaCard midia={item} type={type} userInteractions={userInteractions} onInteraction={onInteraction} />
          </div>
        ))}
      </div>
    </div>
  );
});

Carousel.displayName = 'Carousel';

export default Carousel;
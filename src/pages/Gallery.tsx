import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';
import { CustomEase } from 'gsap/CustomEase';
import SplitType from 'split-type';
import items, { images, editorial } from './gallery-items';
import './Gallery.css';

gsap.registerPlugin(CustomEase);
if (!CustomEase.get('hop')) CustomEase.create('hop', '0.9, 0, 0.1, 1');

type GalleryState = {
  isDragging: boolean;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
  dragVelocityX: number;
  dragVelocityY: number;
  lastDragTime: number;
  mouseHasMoved: boolean;
  visibleItems: Set<string>;
  lastUpdateTime: number;
  lastX: number;
  lastY: number;
  isExpanded: boolean;
  activeItem: HTMLDivElement | null;
  canDrag: boolean;
  originalPosition: { id: string; rect: DOMRect; imgSrc: string } | null;
  expandedItem: HTMLDivElement | null;
  activeItemId: string | null;
  titleSplit: SplitType | null;
  animationFrameId: number | null;
  introAnimationPlayed: boolean;
};

const itemCount = images.length;
const itemGap = 170;
const columns = 4;
const itemWidth = 170;
const itemHeight = 230;
const masonryOffset = 170;

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const projectTitleRef = useRef<HTMLDivElement>(null);
  const editorialRef = useRef<HTMLDivElement>(null);

  const [initialized, setInitialized] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  const stateRef = useRef<GalleryState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    dragVelocityX: 0,
    dragVelocityY: 0,
    lastDragTime: 0,
    mouseHasMoved: false,
    visibleItems: new Set<string>(),
    lastUpdateTime: 0,
    lastX: 0,
    lastY: 0,
    isExpanded: false,
    activeItem: null,
    canDrag: true,
    originalPosition: null,
    expandedItem: null,
    activeItemId: null,
    titleSplit: null,
    animationFrameId: null,
    introAnimationPlayed: false,
  });

  const setAndAnimateTitle = (title: string) => {
    const { titleSplit } = stateRef.current;
    const projectTitleElement = projectTitleRef.current?.querySelector('p');
    if (!projectTitleElement) return;

    if (titleSplit) titleSplit.revert();
    projectTitleElement.textContent = title;

    stateRef.current.titleSplit = new SplitType(projectTitleElement, {
      types: 'words',
    });
    if (stateRef.current.titleSplit.words) {
      gsap.set(stateRef.current.titleSplit.words, { y: '100%' });
    }
  };

  const animateTitleIn = () => {
    const split = stateRef.current.titleSplit;
    if (!split?.words) return;
    gsap.to(split.words, {
      y: '0%',
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out',
    });
  };

  const animateTitleOut = () => {
    const split = stateRef.current.titleSplit;
    if (!split?.words) return;
    gsap.to(split.words, {
      y: '-100%',
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out',
    });
  };

  const playIntroAnimation = () => {
    if (stateRef.current.introAnimationPlayed) return;
    const allItems = document.querySelectorAll('.gallery-page .item');
    if (allItems.length === 0) return;

    stateRef.current.introAnimationPlayed = true;

    gsap.to(allItems, {
      scale: 1,
      delay: 0.4,
      duration: 0.5,
      stagger: { amount: 1, from: 'random' },
      ease: 'power1.out',
    });
  };

  const updateVisibleItems = () => {
    const state = stateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth <= 1000;
    const buffer = isMobile ? 0.8 : 1.5;
    const viewWidth = window.innerWidth * (1 + buffer);
    const viewHeight = window.innerHeight * (1 + buffer);
    const movingRight = state.targetX > state.currentX;
    const movingDown = state.targetY > state.currentY;
    const directionBufferX = movingRight
      ? isMobile
        ? -100
        : -200
      : isMobile
      ? 100
      : 200;
    const directionBufferY = movingDown
      ? isMobile
        ? -100
        : -200
      : isMobile
      ? 100
      : 200;

    const startCol = Math.floor(
      (-state.currentX - viewWidth / 2 + (movingRight ? directionBufferX : 0)) /
        (itemWidth + itemGap)
    );
    const endCol = Math.ceil(
      (-state.currentX +
        viewWidth * (isMobile ? 1.0 : 1.2) +
        (!movingRight ? directionBufferX : 0)) /
        (itemWidth + itemGap)
    );
    const startRow = Math.floor(
      (-state.currentY - viewHeight / 2 + (movingDown ? directionBufferY : 0)) /
        (itemHeight + itemGap)
    );
    const endRow = Math.ceil(
      (-state.currentY +
        viewHeight * (isMobile ? 1.0 : 1.2) +
        (!movingDown ? directionBufferY : 0)) /
        (itemHeight + itemGap)
    );

    const currentItems = new Set<string>();
    let newItemsCreated = false;

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const itemId = `${col},${row}`;
        currentItems.add(itemId);

        if (state.visibleItems.has(itemId)) continue;
        if (state.activeItemId === itemId && state.isExpanded) continue;

        const item = document.createElement('div');
        item.className = 'item';
        item.id = itemId;

        const isEvenRow = row % 2 === 0;
        const horizontalOffset = isEvenRow ? masonryOffset : 0;
        item.style.left = `${col * (itemWidth + itemGap) + horizontalOffset}px`;
        item.style.top = `${row * (itemHeight + itemGap)}px`;
        item.dataset.col = String(col);
        item.dataset.row = String(row);

        // Image + title share an index so closing the lightbox lines back up
        // with the original tile and the title regex bug from the original
        // code is sidestepped entirely.
        const slotIndex = Math.abs(row * columns + col) % itemCount;
        item.dataset.slot = String(slotIndex);

        if (!state.introAnimationPlayed) {
          gsap.set(item, { scale: 0 });
        }

        const img = document.createElement('img');
        img.src = images[slotIndex];
        img.alt = items[slotIndex];
        img.draggable = false;
        item.appendChild(img);

        item.addEventListener('click', () => {
          if (state.mouseHasMoved || state.isDragging) return;
          handleItemClick(item);
        });

        canvas.appendChild(item);
        state.visibleItems.add(itemId);
        newItemsCreated = true;
      }
    }

    state.visibleItems.forEach((itemId) => {
      if (
        !currentItems.has(itemId) ||
        (state.activeItemId === itemId && state.isExpanded)
      ) {
        const item = document.getElementById(itemId);
        if (item && canvas.contains(item)) canvas.removeChild(item);
        state.visibleItems.delete(itemId);
      }
    });

    if (newItemsCreated && !state.introAnimationPlayed) {
      playIntroAnimation();
    }
  };

  const handleItemClick = (item: HTMLDivElement) => {
    const state = stateRef.current;
    if (state.isExpanded) {
      if (state.expandedItem) closeExpandedItem();
    } else {
      expandItem(item);
    }
  };

  const expandItem = (item: HTMLDivElement) => {
    const state = stateRef.current;
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;

    state.isExpanded = true;
    state.activeItem = item;
    state.activeItemId = item.id;
    state.canDrag = false;
    container.classList.remove('is-grabbing');
    container.style.cursor = 'auto';

    const slotIndex = Number(item.dataset.slot ?? 0);
    setAndAnimateTitle(items[slotIndex]);
    setActiveSlot(slotIndex);
    item.style.visibility = 'hidden';

    // Magazine-style side copy fades in just behind the image animation.
    if (editorialRef.current) {
      gsap.killTweensOf(editorialRef.current);
      gsap.fromTo(
        editorialRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.55, ease: 'power2.out' }
      );
    }

    const rect = item.getBoundingClientRect();
    const targetImg = (item.querySelector('img') as HTMLImageElement).src;

    state.originalPosition = { id: item.id, rect, imgSrc: targetImg };

    overlay.classList.add('active');

    const expandedItem = document.createElement('div');
    expandedItem.className = 'expanded-item';
    expandedItem.style.width = `${itemWidth}px`;
    expandedItem.style.height = `${itemHeight}px`;

    const img = document.createElement('img');
    img.src = targetImg;
    img.draggable = false;
    expandedItem.appendChild(img);
    expandedItem.addEventListener('click', closeExpandedItem);
    document.body.appendChild(expandedItem);

    state.expandedItem = expandedItem;

    document.querySelectorAll('.gallery-page .item').forEach((el) => {
      if (el !== state.activeItem) {
        gsap.to(el, { opacity: 0, duration: 0.3, ease: 'power2.out' });
      }
    });

    const viewportWidth = window.innerWidth;
    const isMobile = window.innerWidth <= 1000;
    const targetWidth = viewportWidth * (isMobile ? 0.75 : 0.4);
    const targetHeight = targetWidth * 1.2;

    gsap.delayedCall(0.5, animateTitleIn);

    gsap.fromTo(
      expandedItem,
      {
        width: itemWidth,
        height: itemHeight,
        x: rect.left + itemWidth / 2 - window.innerWidth / 2,
        y: rect.top + itemHeight / 2 - window.innerHeight / 2,
      },
      {
        width: targetWidth,
        height: targetHeight,
        x: 0,
        y: 0,
        duration: 1,
        ease: 'hop',
      }
    );
  };

  const closeExpandedItem = () => {
    const state = stateRef.current;
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!state.expandedItem || !state.originalPosition || !container || !overlay) return;

    animateTitleOut();
    overlay.classList.remove('active');
    const originalRect = state.originalPosition.rect;

    if (editorialRef.current) {
      gsap.killTweensOf(editorialRef.current);
      gsap.to(editorialRef.current, {
        opacity: 0,
        y: 8,
        duration: 0.5,
        ease: 'power2.out',
      });
    }

    document.querySelectorAll('.gallery-page .item').forEach((el) => {
      if (el.id !== state.activeItemId) {
        gsap.to(el, {
          opacity: 1,
          duration: 0.5,
          delay: 0.5,
          ease: 'power2.out',
        });
      }
    });

    const originalItem = state.activeItemId
      ? (document.getElementById(state.activeItemId) as HTMLDivElement | null)
      : null;

    gsap.to(state.expandedItem, {
      width: itemWidth,
      height: itemHeight,
      x: originalRect.left + itemWidth / 2 - window.innerWidth / 2,
      y: originalRect.top + itemHeight / 2 - window.innerHeight / 2,
      duration: 1,
      ease: 'hop',
      onComplete: () => {
        if (state.expandedItem && state.expandedItem.parentNode) {
          document.body.removeChild(state.expandedItem);
        }
        if (originalItem) originalItem.style.visibility = 'visible';

        state.expandedItem = null;
        state.isExpanded = false;
        state.activeItem = null;
        state.originalPosition = null;
        state.activeItemId = null;
        state.canDrag = true;
        container.style.cursor = 'grab';
        state.dragVelocityX = 0;
        state.dragVelocityY = 0;
        setActiveSlot(null);
      },
    });
  };

  useEffect(() => {
    let mounted = true;

    const animate = () => {
      const state = stateRef.current;
      const canvas = canvasRef.current;
      if (!canvas || !mounted) return;

      if (state.canDrag) {
        const ease = 0.085;
        state.currentX += (state.targetX - state.currentX) * ease;
        state.currentY += (state.targetY - state.currentY) * ease;

        canvas.style.transform = `translate3d(${state.currentX}px, ${state.currentY}px, 0)`;

        const now = Date.now();
        const distMoved = Math.hypot(
          state.currentX - state.lastX,
          state.currentY - state.lastY
        );

        const isMobile = window.innerWidth <= 1000;
        const updateThreshold = isMobile ? 100 : 80;
        const updateInterval = isMobile ? 150 : 100;

        if (
          distMoved > updateThreshold ||
          now - state.lastUpdateTime > updateInterval
        ) {
          updateVisibleItems();
          state.lastX = state.currentX;
          state.lastY = state.currentY;
          state.lastUpdateTime = now;
        }
      }

      state.animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const state = stateRef.current;
      if (!state.canDrag) return;
      state.isDragging = true;
      state.mouseHasMoved = false;
      state.startX = e.clientX;
      state.startY = e.clientY;
      containerRef.current?.classList.add('is-grabbing');
    };

    const handleMouseMove = (e: MouseEvent) => {
      const state = stateRef.current;
      if (!state.isDragging || !state.canDrag) return;

      const dx = e.clientX - state.startX;
      const dy = e.clientY - state.startY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) state.mouseHasMoved = true;

      const now = Date.now();
      const dt = Math.max(10, now - state.lastDragTime);
      state.lastDragTime = now;

      state.dragVelocityX = dx / dt;
      state.dragVelocityY = dy / dt;

      state.targetX += dx;
      state.targetY += dy;

      state.startX = e.clientX;
      state.startY = e.clientY;
    };

    const handleMouseUp = () => {
      const state = stateRef.current;
      if (!state.isDragging) return;
      state.isDragging = false;

      if (state.canDrag) {
        containerRef.current?.classList.remove('is-grabbing');
        if (
          Math.abs(state.dragVelocityX) > 0.1 ||
          Math.abs(state.dragVelocityY) > 0.1
        ) {
          const momentumFactor = 200;
          state.targetX += state.dragVelocityX * momentumFactor;
          state.targetY += state.dragVelocityY * momentumFactor;
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const state = stateRef.current;
      if (!state.canDrag) return;
      state.isDragging = true;
      state.mouseHasMoved = false;
      state.startX = e.touches[0].clientX;
      state.startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const state = stateRef.current;
      if (!state.isDragging || !state.canDrag) return;

      const dx = e.touches[0].clientX - state.startX;
      const dy = e.touches[0].clientY - state.startY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) state.mouseHasMoved = true;

      const sensitivityMultiplier = 1.5;
      state.targetX += dx * sensitivityMultiplier;
      state.targetY += dy * sensitivityMultiplier;

      state.startX = e.touches[0].clientX;
      state.startY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      stateRef.current.isDragging = false;
    };

    const handleOverlayClick = () => {
      if (stateRef.current.isExpanded) closeExpandedItem();
    };

    const handleResize = () => {
      const state = stateRef.current;
      if (state.isExpanded && state.expandedItem) {
        const viewportWidth = window.innerWidth;
        const isMobile = window.innerWidth <= 768;
        const targetWidth = viewportWidth * (isMobile ? 0.6 : 0.4);
        const targetHeight = targetWidth * 1.2;
        gsap.to(state.expandedItem, {
          width: targetWidth,
          height: targetHeight,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        updateVisibleItems();
      }
    };

    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('resize', handleResize);
    overlay.addEventListener('click', handleOverlayClick);

    updateVisibleItems();
    setInitialized(true);
    animate();

    return () => {
      mounted = false;

      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      overlay.removeEventListener('click', handleOverlayClick);

      const state = stateRef.current;

      if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
        state.animationFrameId = null;
      }

      if (state.expandedItem && state.expandedItem.parentNode) {
        document.body.removeChild(state.expandedItem);
        state.expandedItem = null;
      }

      overlay.classList.remove('active');

      state.isExpanded = false;
      state.activeItem = null;
      state.originalPosition = null;
      state.activeItemId = null;
      state.canDrag = true;

      if (state.titleSplit) {
        state.titleSplit.revert();
        state.titleSplit = null;
      }
    };
  }, []);

  return (
    <div className="gallery-page" data-initialized={initialized}>
      <div className="gallery-container" ref={containerRef}>
        <div className="canvas" ref={canvasRef}></div>
        <div className="overlay" ref={overlayRef}></div>
      </div>

      <div className="project-title" ref={projectTitleRef}>
        <p></p>
      </div>

      <div
        className="editorial"
        ref={editorialRef}
        aria-hidden={activeSlot === null}
      >
        <div className="editorial__top">
          <span>Evara · The Archive</span>
          <span>{activeSlot !== null ? editorial[activeSlot].issue : ''}</span>
        </div>

        <aside className="editorial__left">
          <span className="editorial__eyebrow">
            {activeSlot !== null ? editorial[activeSlot].issue : ''}
            <span className="editorial__eyebrow-rule" />
            Folio
          </span>
          <p className="editorial__caption">
            {activeSlot !== null ? editorial[activeSlot].caption : ''}
          </p>
          <p className="editorial__body">
            {activeSlot !== null ? editorial[activeSlot].body : ''}
          </p>
        </aside>

        <aside className="editorial__right">
          {activeSlot !== null && (
            <>
              <div className="editorial__credit">
                <span className="editorial__credit-label">Photography</span>
                <span className="editorial__credit-value">{editorial[activeSlot].photography}</span>
              </div>
              <div className="editorial__credit">
                <span className="editorial__credit-label">Styling</span>
                <span className="editorial__credit-value">{editorial[activeSlot].styling}</span>
              </div>
              <div className="editorial__credit">
                <span className="editorial__credit-label">Location</span>
                <span className="editorial__credit-value">{editorial[activeSlot].location}</span>
              </div>
              <div className="editorial__credit">
                <span className="editorial__credit-label">Year</span>
                <span className="editorial__credit-value">{editorial[activeSlot].year}</span>
              </div>
            </>
          )}
        </aside>

        <div className="editorial__bottom">
          <span>Press · Click image to close</span>
          <span>
            {activeSlot !== null ? `p. ${String(activeSlot + 1).padStart(2, '0')}` : ''}
          </span>
        </div>
      </div>

      <div className="gallery-label">
        <span className="gallery-label__eyebrow">The Archive</span>
        <span className="gallery-label__title">Moments &amp; Light</span>
      </div>

      <div className="gallery-hint">Drag · Click to open</div>
    </div>
  );
}

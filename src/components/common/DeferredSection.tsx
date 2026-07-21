import React, { useEffect, useRef, useState } from "react";

interface DeferredSectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  rootMargin?: string;
  threshold?: number;
}

const DeferredSection: React.FC<DeferredSectionProps> = ({
  children,
  fallback = null,
  className,
  rootMargin = "200px 0px",
  threshold = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(
    () => typeof window === "undefined" || !("IntersectionObserver" in window),
  );

  useEffect(() => {
    if (shouldRender || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin, threshold },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [rootMargin, shouldRender, threshold]);

  return (
    <div ref={containerRef} className={className}>
      {shouldRender ? children : fallback}
    </div>
  );
};

export default DeferredSection;

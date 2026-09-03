import React from 'react';

interface SelectionBoxProps {
  children: React.ReactNode;
  className?: string;
  enabled?: boolean;
}

export const SelectionBox: React.FC<SelectionBoxProps> = ({
  children,
  className = '',
  enabled = true,
}) => {
  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <div className={`selection-box-container group relative ${className}`}>
      {children}

      {/* Gradient Selection Border */}
      <div className="selection-overlay pointer-events-none" />

      {/* 4 Corner Handles */}
      <span className="selection-handle selection-handle-tl" />
      <span className="selection-handle selection-handle-tr" />
      <span className="selection-handle selection-handle-bl" />
      <span className="selection-handle selection-handle-br" />

      {/* 4 Mid-edge Handles */}
      <span className="selection-handle selection-handle-tm" />
      <span className="selection-handle selection-handle-bm" />
      <span className="selection-handle selection-handle-ml" />
      <span className="selection-handle selection-handle-mr" />
    </div>
  );
};

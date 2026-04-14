import React from 'react';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const NeonButton: React.FC<NeonButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  type = 'button'
}) => {
  const baseStyle = "px-8 py-3 font-display font-bold uppercase tracking-wider transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 text-sm md:text-base";
  
  const variants = {
    primary: "bg-transparent border-2 border-neonCyan text-neonCyan shadow-[0_0_10px_rgba(0,243,255,0.3)] hover:shadow-[0_0_20px_rgba(0,243,255,0.6),inset_0_0_10px_rgba(0,243,255,0.4)] hover:bg-neonCyan/10 hover:text-white",
    secondary: "bg-neonPink text-white border-2 border-neonPink shadow-[0_0_10px_rgba(255,0,255,0.4)] hover:shadow-[0_0_25px_rgba(255,0,255,0.6)] hover:bg-transparent hover:text-neonPink",
    outline: "border border-white/30 text-white hover:border-white hover:bg-white/10",
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
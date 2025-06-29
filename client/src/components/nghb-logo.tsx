import logoPath from "@assets/WhatsApp Image 2025-05-30 at 16.44.23.jpeg";
import navLogoPath from "@assets/WhatsApp Image 2025-05-30 at 16.44.23.jpeg";

interface HubWithinLogoProps {
  size?: "small" | "medium" | "large";
  variant?: "default" | "navigation";
  className?: string;
}

export default function HubWithinLogo({ size = "medium", variant = "default", className }: HubWithinLogoProps) {
  // Use navigation logo for navbar, main logo for other places
  const imagePath = variant === "navigation" ? navLogoPath : logoPath;
  
  const sizeClasses = {
    small: variant === "navigation" ? "h-10 w-auto max-w-32" : "w-full max-w-24 h-auto",
    medium: "w-full max-w-md h-auto", 
    large: "w-full max-w-2xl h-auto"
  };

  const containerStyle = variant === "navigation" ? {
    backgroundColor: 'transparent',
    padding: '2px',
    maxWidth: '150px',
  } : {};

  const imageStyle = variant === "navigation" ? {
    filter: 'brightness(1.1) contrast(1.0)',
    objectPosition: 'center',
    objectFit: 'contain'
  } : {
    objectPosition: 'center',
    objectFit: 'contain'
  };

  return (
    <div className={`${variant === "navigation" ? "flex justify-start" : "flex justify-center w-full"} ${className || ""}`} style={containerStyle}>
      <img 
        src={imagePath} 
        alt="Hub Within" 
        className={`${sizeClasses[size]} ${variant === "navigation" ? "object-contain" : "object-cover"}`}
        style={imageStyle}
      />
    </div>
  );
}

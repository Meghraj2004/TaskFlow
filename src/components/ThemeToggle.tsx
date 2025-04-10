
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === 'light' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Toggle {theme === 'light' ? 'dark' : 'light'} mode</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ThemeToggle;

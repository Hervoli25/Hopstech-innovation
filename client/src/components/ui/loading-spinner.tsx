import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
  xl: 'h-16 w-16 border-4',
};

export const LoadingSpinner = ({ size = 'md', className, label = 'Loading...' }: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center" role="status" aria-label={label}>
      <div
        className={cn(
          'animate-spin rounded-full border-blue-500 border-t-transparent',
          sizeClasses[size],
          className
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

interface GradientSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

export const GradientSpinner = ({ size = 'md', className, label = 'Loading...' }: GradientSpinnerProps) => {
  return (
    <div className="flex items-center justify-center" role="status" aria-label={label}>
      <div className="relative">
        <div
          className={cn(
            'animate-spin rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500',
            sizeClasses[size],
            className
          )}
          style={{
            maskImage: 'linear-gradient(transparent 50%, black 50%)',
            WebkitMaskImage: 'linear-gradient(transparent 50%, black 50%)',
          }}
        />
        <div
          className={cn(
            'absolute inset-0 rounded-full bg-slate-900',
            size === 'sm' && 'm-[2px]',
            size === 'md' && 'm-[2px]',
            size === 'lg' && 'm-[3px]',
            size === 'xl' && 'm-[4px]'
          )}
        />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
};

interface FullScreenLoaderProps {
  message?: string;
}

export const FullScreenLoader = ({ message = 'Loading HOPSTECH Portal...' }: FullScreenLoaderProps) => {
  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            {/* Outer spinning gradient ring */}
            <div className="h-20 w-20 animate-spin rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 p-1">
              <div className="h-full w-full rounded-full bg-slate-950" />
            </div>
            
            {/* Inner pulsing logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center animate-pulse">
                <span className="text-white font-bold text-2xl">H</span>
              </div>
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-white mb-2">HOPSTECH</h2>
        <p className="text-gray-400 text-sm">{message}</p>
        
        {/* Loading dots animation */}
        <div className="flex justify-center gap-1 mt-4">
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

interface ButtonSpinnerProps {
  className?: string;
}

export const ButtonSpinner = ({ className }: ButtonSpinnerProps) => {
  return (
    <div
      className={cn('h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent', className)}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};


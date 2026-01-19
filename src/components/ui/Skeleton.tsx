import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'avatar' | 'button';
}

export const Skeleton = ({ className = '', variant = 'card' }: SkeletonProps) => {
  const variants = {
    card: 'h-48 rounded-xl',
    text: 'h-4 rounded',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24 rounded-lg'
  };

  return (
    <motion.div
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ${variants[variant]} ${className}`}
      animate={{
        background: [
          'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
          'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        ],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

export const RecipeCardSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton variant="card" className="h-48" />
      <div className="space-y-2">
        <Skeleton variant="text" className="h-6 w-3/4" />
        <Skeleton variant="text" className="h-4 w-1/2" />
        <div className="flex items-center gap-4 pt-2">
          <Skeleton variant="text" className="h-4 w-16" />
          <Skeleton variant="text" className="h-4 w-16" />
          <Skeleton variant="text" className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
};

export const RecipeDetailsSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Skeleton variant="card" className="h-96" />
      <div className="space-y-4">
        <Skeleton variant="text" className="h-8 w-3/4" />
        <div className="flex items-center gap-6">
          <Skeleton variant="text" className="h-6 w-24" />
          <Skeleton variant="text" className="h-6 w-24" />
          <Skeleton variant="text" className="h-6 w-24" />
        </div>
        <div className="space-y-3">
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
};

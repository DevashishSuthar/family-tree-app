import React, { useState } from 'react';
import { getInitials } from '../utils/formatters';

interface AvatarProps {
  name: string;
  src?: string;
  gender?: 'MALE' | 'FEMALE';
  size?: number;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = React.memo(({ name, src, gender, size = 44, className = '' }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const genderClasses =
    gender === 'FEMALE'
      ? 'bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300'
      : 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300';

  if (!src || imageFailed) {
    return (
      <span
        className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${genderClasses} ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.36 }}
      >
        {getInitials(name) || '?'}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setImageFailed(true)}
      className={`shrink-0 rounded-full object-cover ring-2 ring-white dark:ring-slate-900 ${className}`}
      style={{ width: size, height: size }}
    />
  );
});

Avatar.displayName = 'Avatar';
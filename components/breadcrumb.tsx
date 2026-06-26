import React from 'react';
import { useRouter } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const router = useRouter();

  const handleClick = (href?: string) => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] font-medium font-sans">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span>/</span>}
          <span
            onClick={() => handleClick(item.href)}
            className={`${
              idx === items.length - 1
                ? 'text-[#ff502d]'
                : 'hover:underline cursor-pointer'
            } ${item.href ? 'cursor-pointer' : ''}`}
          >
            {item.label}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

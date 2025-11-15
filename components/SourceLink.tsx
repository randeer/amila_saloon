import React from 'react';
import type { GroundingChunk } from '../types';

interface SourceLinkProps {
  source: GroundingChunk;
}

const SourceLink: React.FC<SourceLinkProps> = ({ source }) => {
  const linkData = source.web || source.maps;
  if (!linkData) return null;

  const icon = source.maps ? 'map-pin' : 'search';

  return (
    <li>
      <a
        href={linkData.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm bg-brand-accent text-brand-primary px-3 py-1.5 rounded-full hover:bg-brand-secondary hover:text-white transition-colors duration-300"
      >
        <i data-lucide={icon} className="w-4 h-4"></i>
        <span>{linkData.title || 'Source'}</span>
      </a>
    </li>
  );
};

export default SourceLink;

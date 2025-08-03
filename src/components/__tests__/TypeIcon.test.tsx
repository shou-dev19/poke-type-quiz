import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TypeIcon from '../TypeIcon';
import { PokemonType } from '../../types/pokemon';

// Mock console.error to avoid noise in test output
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('TypeIcon', () => {
  it('should render type icon with correct image source', () => {
    render(<TypeIcon type="ほのお" />);
    
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/types/fire.svg');
    expect(image).toHaveAttribute('alt', 'ほのおタイプ');
  });

  it('should render with correct size classes', () => {
    const { rerender } = render(<TypeIcon type="みず" size="sm" />);
    
    let container = screen.getByRole('img').parentElement;
    expect(container).toHaveClass('w-12', 'h-12');

    rerender(<TypeIcon type="みず" size="md" />);
    container = screen.getByRole('img').parentElement;
    expect(container).toHaveClass('w-16', 'h-16');

    rerender(<TypeIcon type="みず" size="lg" />);
    container = screen.getByRole('img').parentElement;
    expect(container).toHaveClass('w-24', 'h-24');
  });

  it('should apply custom className', () => {
    render(<TypeIcon type="でんき" className="custom-class" />);
    
    const container = screen.getByRole('img').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('should map Japanese type names to English filenames correctly', () => {
    const typeMapping = [
      { japanese: 'ノーマル', english: 'normal' },
      { japanese: 'ほのお', english: 'fire' },
      { japanese: 'みず', english: 'water' },
      { japanese: 'でんき', english: 'electric' },
      { japanese: 'くさ', english: 'grass' },
      { japanese: 'こおり', english: 'ice' },
      { japanese: 'かくとう', english: 'fighting' },
      { japanese: 'どく', english: 'poison' },
      { japanese: 'じめん', english: 'ground' },
      { japanese: 'ひこう', english: 'flying' },
      { japanese: 'エスパー', english: 'psychic' },
      { japanese: 'むし', english: 'bug' },
      { japanese: 'いわ', english: 'rock' },
      { japanese: 'ゴースト', english: 'ghost' },
      { japanese: 'ドラゴン', english: 'dragon' },
      { japanese: 'あく', english: 'dark' },
      { japanese: 'はがね', english: 'steel' },
      { japanese: 'フェアリー', english: 'fairy' },
    ];

    typeMapping.forEach(({ japanese, english }) => {
      const { unmount } = render(<TypeIcon type={japanese as PokemonType} />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', `/images/types/${english}.svg`);
      unmount();
    });
  });

  it('should handle image load errors gracefully', () => {
    render(<TypeIcon type="ほのお" />);
    
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    
    // Simulate image load error
    const errorEvent = new Event('error');
    image.dispatchEvent(errorEvent);
    
    // Component should still be rendered and not crash
    expect(image).toBeInTheDocument();
  });

  it('should render with animated class when animated prop is true', () => {
    render(<TypeIcon type="くさ" animated={true} />);
    
    const container = screen.getByRole('img').parentElement;
    expect(container).toHaveClass('animate-type-grass');
  });

  it('should not have animated class when animated prop is false', () => {
    render(<TypeIcon type="くさ" animated={false} />);
    
    const container = screen.getByRole('img').parentElement;
    expect(container).not.toHaveClass('animate-type-grass');
    expect(container).toHaveClass('transition-all', 'duration-300');
  });
});
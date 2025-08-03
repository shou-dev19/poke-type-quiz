import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StartScreen from '../StartScreen';

// Mock TypeIcon component
vi.mock('../TypeIcon', () => ({
  default: ({ type, className }: { type: string; className?: string }) => {
    // Add unique suffix to avoid duplicate testids
    const testId = `type-icon-${type}-${Math.random().toString(36).substr(2, 9)}`;
    return (
      <div data-testid={testId} className={className}>
        {type}
      </div>
    );
  },
}));

describe('StartScreen', () => {
  const mockOnStart = vi.fn();

  beforeEach(() => {
    mockOnStart.mockClear();
  });

  it('should render title and description', () => {
    render(<StartScreen onStart={mockOnStart} />);
    
    expect(screen.getByText('ポケモンタイプ相性クイズ')).toBeInTheDocument();
    expect(screen.getByText('ポケモンのタイプ相性を覚えて、バトルマスターを目指そう！')).toBeInTheDocument();
  });

  it('should render type icons in the animation', () => {
    render(<StartScreen onStart={mockOnStart} />);
    
    // Check if at least some type icons are rendered (avoiding duplicate testid issues)
    const typeElements = screen.getAllByText('ノーマル');
    expect(typeElements.length).toBeGreaterThan(0);
    
    const fireElements = screen.getAllByText('ほのお');
    expect(fireElements.length).toBeGreaterThan(0);
  });

  it('should render difficulty selection', () => {
    render(<StartScreen onStart={mockOnStart} />);
    
    expect(screen.getByText('難易度を選択してください')).toBeInTheDocument();
    
    // Check if select trigger is present
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThan(0);
  });

  it('should render question count selection', () => {
    render(<StartScreen onStart={mockOnStart} />);
    
    expect(screen.getByText('問題数を選択してください')).toBeInTheDocument();
    
    // Check if select triggers are present (should be 2: difficulty and question count)
    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(2);
  });

  it('should have start button', () => {
    render(<StartScreen onStart={mockOnStart} />);
    
    const startButton = screen.getByRole('button', { name: /クイズを開始する/ });
    expect(startButton).toBeInTheDocument();
  });

  it('should call onStart with default parameters when start button is clicked', () => {
    render(<StartScreen onStart={mockOnStart} />);
    
    // Click start button without changing defaults
    const startButton = screen.getByRole('button', { name: /クイズを開始する/ });
    fireEvent.click(startButton);
    
    // Should use default values
    expect(mockOnStart).toHaveBeenCalledWith('ふつう', 10);
  });

  it('should render with proper styling classes', () => {
    render(<StartScreen onStart={mockOnStart} />);
    
    // Check if main container has correct styling
    const mainContainer = document.querySelector('.min-h-screen');
    expect(mainContainer).toBeInTheDocument();
  });
});
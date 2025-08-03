import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StartScreen from '../StartScreen';

// Mock TypeIcon component
vi.mock('../TypeIcon', () => ({
  default: ({ type, className }: { type: string; className?: string }) => (
    <div data-testid={`type-icon-${type}`} className={className}>
      {type}
    </div>
  ),
}));

describe('StartScreen', () => {
  const mockOnStart = vi.fn();

  beforeEach(() => {
    mockOnStart.mockClear();
  });

  it('should render title and description', () => {
    render(<StartScreen onStart={mockOnStart} />);
    
    expect(screen.getByText('ポケモン タイプ相性クイズ')).toBeInTheDocument();
    expect(screen.getByText('攻撃技のタイプと防御側のタイプから、ダメージ倍率を当てよう！')).toBeInTheDocument();
  });

  it('should render all 18 type icons in the animation', () => {
    render(<StartScreen onStart={mockOnStart} />);
    
    const typeNames = [
      'ノーマル', 'ほのお', 'みず', 'でんき', 'くさ', 'こおり',
      'かくとう', 'どく', 'じめん', 'ひこう', 'エスパー', 'むし',
      'いわ', 'ゴースト', 'ドラゴン', 'あく', 'はがね', 'フェアリー'
    ];

    typeNames.forEach(typeName => {
      expect(screen.getByTestId(`type-icon-${typeName}`)).toBeInTheDocument();
    });
  });

  it('should render difficulty selection with all options', () => {
    render(<StartScreen onStart={mockOnStart} />);
    
    expect(screen.getByText('難易度を選択してください')).toBeInTheDocument();
    
    // Check if all difficulty options are present
    expect(screen.getByText('かんたん')).toBeInTheDocument();
    expect(screen.getByText('ふつう')).toBeInTheDocument();
    expect(screen.getByText('むずかしい')).toBeInTheDocument();
  });

  it('should render question count selection', () => {
    render(<StartScreen onStart={mockOnStart} />);
    
    expect(screen.getByText('問題数を選択してください')).toBeInTheDocument();
    
    // Check if question count options are present
    expect(screen.getByText('5問')).toBeInTheDocument();
    expect(screen.getByText('10問')).toBeInTheDocument();
    expect(screen.getByText('20問')).toBeInTheDocument();
  });

  it('should have start button', () => {
    render(<StartScreen onStart={mockOnStart} />);
    
    const startButton = screen.getByRole('button', { name: /クイズを開始する/ });
    expect(startButton).toBeInTheDocument();
  });

  it('should call onStart with correct parameters when start button is clicked', () => {
    render(<StartScreen onStart={mockOnStart} />);
    
    // Select difficulty
    const easyOption = screen.getByText('かんたん');
    fireEvent.click(easyOption);
    
    // Select question count
    const fiveQuestionsOption = screen.getByText('5問');
    fireEvent.click(fiveQuestionsOption);
    
    // Click start button
    const startButton = screen.getByRole('button', { name: /クイズを開始する/ });
    fireEvent.click(startButton);
    
    expect(mockOnStart).toHaveBeenCalledWith('かんたん', 5);
  });

  it('should handle different difficulty selections', () => {
    render(<StartScreen onStart={mockOnStart} />);
    
    // Test normal difficulty
    const normalOption = screen.getByText('ふつう');
    fireEvent.click(normalOption);
    
    const tenQuestionsOption = screen.getByText('10問');
    fireEvent.click(tenQuestionsOption);
    
    const startButton = screen.getByRole('button', { name: /クイズを開始する/ });
    fireEvent.click(startButton);
    
    expect(mockOnStart).toHaveBeenCalledWith('ふつう', 10);
  });

  it('should handle difficult mode selection', () => {
    render(<StartScreen onStart={mockOnStart} />);
    
    // Test difficult mode
    const difficultOption = screen.getByText('むずかしい');
    fireEvent.click(difficultOption);
    
    const twentyQuestionsOption = screen.getByText('20問');
    fireEvent.click(twentyQuestionsOption);
    
    const startButton = screen.getByRole('button', { name: /クイズを開始する/ });
    fireEvent.click(startButton);
    
    expect(mockOnStart).toHaveBeenCalledWith('むずかしい', 20);
  });

  it('should have default difficulty and question count', () => {
    render(<StartScreen onStart={mockOnStart} />);
    
    // Click start without selecting anything (should use defaults)
    const startButton = screen.getByRole('button', { name: /クイズを開始する/ });
    fireEvent.click(startButton);
    
    // Should be called with default values
    expect(mockOnStart).toHaveBeenCalledWith('ふつう', 10);
  });

  it('should render with proper styling classes', () => {
    render(<StartScreen onStart={mockOnStart} />);
    
    const mainContainer = screen.getByText('ポケモン タイプ相性クイズ').closest('div');
    expect(mainContainer).toHaveClass('min-h-screen');
  });
});
import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface TypewriterCodeProps {
  code: string;
  language?: string;
  speed?: number;
  showLineNumbers?: boolean;
}

export function TypewriterCode({
  code,
  language = 'typescript',
  speed = 30,
  showLineNumbers = true,
}: TypewriterCodeProps) {
  const [displayedCode, setDisplayedCode] = useState('');
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.3,
    freezeOnceVisible: true,
  });

  useEffect(() => {
    if (!isIntersecting) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= code.length) {
        setDisplayedCode(code.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isIntersecting, code, speed]);

  return (
    <div ref={ref} className="relative rounded-lg overflow-hidden">
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
        }}
      >
        {displayedCode || ' '}
      </SyntaxHighlighter>
    </div>
  );
}


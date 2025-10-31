import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderContent = () => {
    const lines = content.split('\n');
    // FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
    const elements: React.ReactElement[] = [];
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-2">
            {listItems.map((item, index) => (
              <li key={`li-${index}`} dangerouslySetInnerHTML={{ __html: parseInline(item) }}></li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const parseInline = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
    };

    lines.forEach((line, index) => {
      if (line.trim().startsWith('* ')) {
        listItems.push(line.trim().substring(2));
      } else if (line.trim().startsWith('- ')) {
        listItems.push(line.trim().substring(2));
      } else {
        flushList();
        if (line.trim().startsWith('### ')) {
            elements.push(<h3 key={index} className="text-lg font-semibold mt-4 mb-2" dangerouslySetInnerHTML={{ __html: parseInline(line.substring(4)) }} />);
        } else if (line.trim().startsWith('## ')) {
            elements.push(<h2 key={index} className="text-xl font-bold mt-4 mb-2" dangerouslySetInnerHTML={{ __html: parseInline(line.substring(3)) }} />);
        } else if (line.trim().startsWith('# ')) {
            elements.push(<h1 key={index} className="text-2xl font-bold mt-4 mb-2" dangerouslySetInnerHTML={{ __html: parseInline(line.substring(2)) }} />);
        } else if (line.trim() === '') {
            elements.push(<br key={index} />);
        }
        else {
            elements.push(<p key={index} dangerouslySetInnerHTML={{ __html: parseInline(line) }} />);
        }
      }
    });

    flushList();

    return elements;
  };

  return <div className="prose prose-sm max-w-none text-gray-700">{renderContent()}</div>;
};

export default MarkdownRenderer;
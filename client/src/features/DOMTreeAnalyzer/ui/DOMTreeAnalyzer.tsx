import styles from './DOMTreeAnalyzer.module.css';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

type TagCount = Record<string, number>;

export function DOMTreeAnalyzer(): React.JSX.Element {
  const [totalNodesState, setTotalNodes] = useState<number>(0);
  const [tagCountsState, setTagCounts] = useState<TagCount>({});
  const location = useLocation();

  const traverseTree = useCallback((node: Node | null, tags: TagCount): number => {
    if (!node) return 0;

    let count = 1;

    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = (node as Element).tagName.toLowerCase();
      tags[tagName] = (tags[tagName] || 0) + 1;
    }

    const { childNodes } = node;
    childNodes.forEach((child) => {
      count += traverseTree(child, tags);
    });

    return count;
  }, []);

  useEffect(() => {
    const rootElement = document.documentElement;
    const tags: TagCount = {};
    const nodeCount = traverseTree(rootElement, tags);

    setTotalNodes(nodeCount);
    setTagCounts(tags);
  }, [location, traverseTree]);

  return (
    <div className={styles.container}>
      <span>Total Nodes: {totalNodesState}</span>
      <ul>
        {Object.entries(tagCountsState).map(([tag, count]) => (
          <li key={tag}>
            {tag}: {count}
          </li>
        ))}
      </ul>
    </div>
  );
}

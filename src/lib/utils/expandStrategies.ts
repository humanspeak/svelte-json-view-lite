/** `shouldExpandNode` strategy that auto-expands every node. */
export const allExpanded = (): boolean => true

/** `shouldExpandNode` strategy that auto-expands only the root node. */
export const collapseAllNested = (level: number): boolean => level < 1

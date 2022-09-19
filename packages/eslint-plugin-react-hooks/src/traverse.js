/**
 * Adapted from https://github.com/discord/eslint-traverse
 *
 * MIT License
 *
 * Copyright (c) 2020 Discord
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/* eslint-disable no-for-of-loops/no-for-of-loops */

'use strict';

export const SKIP = Symbol('skip');
export const STOP = Symbol('stop');

export function traverse(context, node, visitor) {
  const allVisitorKeys = context.getSourceCode().visitorKeys;
  const queue = [];

  queue.push({
    node,
    parent: null,
    parentKey: null,
    parentPath: null,
  });

  while (queue.length) {
    const currentPath = queue.shift();

    const result = visitor(currentPath);
    if (result === STOP) break;
    if (result === SKIP) continue;

    const visitorKeys = allVisitorKeys[currentPath.node.type];
    if (!visitorKeys) continue;

    for (const visitorKey of visitorKeys) {
      const child = currentPath.node[visitorKey];

      if (!child) {
        continue;
      } else if (Array.isArray(child)) {
        for (const item of child) {
          queue.push({
            node: item,
            parent: currentPath.node,
            parentKey: visitorKey,
            parentPath: currentPath,
          });
        }
      } else {
        queue.push({
          node: child,
          parent: currentPath.node,
          parentKey: visitorKey,
          parentPath: currentPath,
        });
      }
    }
  }
}

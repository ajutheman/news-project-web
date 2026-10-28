'use client';

// Safeguard against browser extensions (Google Translate, Grammarly, Adblockers)
// that mutate or detach DOM nodes outside React's virtual DOM tree.
if (typeof window !== 'undefined') {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn(
          '[DOM Safeguard] Prevented NotFoundError on removeChild: child node was detached or reparented by a browser extension/translation tool.',
          child,
          this
        );
      }
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn(
          '[DOM Safeguard] Prevented NotFoundError on insertBefore: referenceNode was detached or reparented by a browser extension.',
          newNode,
          referenceNode,
          this
        );
      }
      return this.appendChild(newNode);
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

export function HydrationFix() {
  return null;
}

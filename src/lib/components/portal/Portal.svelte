<script context="module" lang="ts">
  import { tick } from "svelte";

  export function portal(node: HTMLElement, target: string | HTMLElement = "body") {
      let targetEl;

      async function update(newTarget: string | HTMLElement) {
          target = newTarget;

          if (typeof target === "string") {
              targetEl = document.querySelector(target);

              if (targetEl === null) {
                  await tick();
                  targetEl = document.querySelector(target);
              }

              if (targetEl === null) {
                  throw new Error(`No element found matching css selector: "${target}"`);
              }
          } else if (target instanceof HTMLElement) {
              targetEl = target;
          } else {
              throw new TypeError(`Invalid target: ${target}. Allowed types: string (css selector) or HTMLElement.`);
          }

          targetEl.appendChild(node);
          node.hidden = false;
      }

      update(target);

      return {
          update,
          destroy() {
              if (node.parentNode) {
                  node.parentNode.removeChild(node);
              }
          },
      };
  }
</script>

<script lang="ts">
  export let target = "body";
</script>

<div use:portal={target} hidden style="display: contents;">
  <slot />
</div>



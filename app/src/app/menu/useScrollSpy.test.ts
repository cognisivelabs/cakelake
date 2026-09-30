import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { useScrollSpy } from "@/app/menu/useScrollSpy";

const SECTION_IDS = ["classic", "premium", "exotic"];

let container: HTMLDivElement;
let root: Root;
let state: ReturnType<typeof useScrollSpy>;
let scrollIntoView: ReturnType<typeof vi.fn>;

function Probe({ ids }: { ids: string[] }) {
  state = useScrollSpy(ids);
  return null;
}

function mount(ids: string[] = SECTION_IDS) {
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    root = createRoot(container);
    root.render(createElement(Probe, { ids }));
  });
}

function rerender(ids: string[]) {
  act(() => {
    root.render(createElement(Probe, { ids }));
  });
}

function unmount() {
  act(() => root.unmount());
  container.remove();
}

/** Registers a fake section at a given distance from the viewport top
 * (getBoundingClientRect().top), the way a real section would once
 * scrolled to that position. */
function registerSection(id: string, top: number) {
  const el = document.createElement("div");
  el.getBoundingClientRect = () => ({ top }) as DOMRect;
  act(() => {
    state.sectionRef(id)(el);
  });
  return el;
}

function registerChip(id: string) {
  const el = document.createElement("div");
  el.scrollIntoView = scrollIntoView as typeof el.scrollIntoView;
  act(() => {
    state.chipRef(id)(el);
  });
  return el;
}

function setViewport({ innerHeight, scrollY, scrollHeight }: { innerHeight: number; scrollY: number; scrollHeight: number }) {
  Object.defineProperty(window, "innerHeight", { value: innerHeight, configurable: true });
  Object.defineProperty(window, "scrollY", { value: scrollY, configurable: true });
  Object.defineProperty(document.documentElement, "scrollHeight", { value: scrollHeight, configurable: true });
}

function scroll() {
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
}

describe("useScrollSpy", () => {
  beforeEach(() => {
    scrollIntoView = vi.fn();
    // Tall enough that the "at bottom" branch doesn't fire unless a test
    // explicitly sets it up.
    setViewport({ innerHeight: 800, scrollY: 0, scrollHeight: 5000 });
  });

  afterEach(() => {
    unmount();
  });

  it("defaults activeId to the first section before anything is measured", () => {
    mount();
    expect(state.activeId).toBe("classic");
  });

  it("picks the last section whose heading has scrolled up past the trigger line", () => {
    mount();
    registerSection("classic", -50); // scrolled well past
    registerSection("premium", 60); // just past the trigger line (110)
    registerSection("exotic", 300); // still below it
    scroll();
    expect(state.activeId).toBe("premium");
  });

  it("falls back to the first section when nothing has crossed the trigger line yet", () => {
    mount();
    registerSection("classic", 200);
    registerSection("premium", 500);
    registerSection("exotic", 900);
    scroll();
    expect(state.activeId).toBe("classic");
  });

  it("reports the last section once the page is scrolled to (near) the bottom, even if its own heading is far below the trigger line", () => {
    mount();
    // A short last section whose heading never reaches the trigger line.
    registerSection("classic", -500);
    registerSection("premium", -200);
    registerSection("exotic", 400);
    setViewport({ innerHeight: 800, scrollY: 4200, scrollHeight: 5000 }); // 800+4200 >= 5000-4
    scroll();
    expect(state.activeId).toBe("exotic");
  });

  it("scrolls the active chip into view when activeId changes", () => {
    mount();
    registerChip("classic");
    const premiumChip = registerChip("premium");
    registerSection("classic", -50);
    registerSection("premium", 60);
    registerSection("exotic", 300);

    scroll();

    expect(state.activeId).toBe("premium");
    expect(premiumChip.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  });

  it("re-scans using only the sections still registered after the list narrows", () => {
    mount();
    registerSection("classic", 200);
    registerSection("premium", 60);
    scroll();
    expect(state.activeId).toBe("premium");

    // Narrowed to just "exotic" (e.g. a search) — real JSX unmounting the
    // other two sections would call their sectionRef with null; simulate
    // that same cleanup here rather than leaving stale entries behind.
    rerender(["exotic"]);
    act(() => {
      state.sectionRef("classic")(null);
      state.sectionRef("premium")(null);
    });
    registerSection("exotic", -20);
    scroll();
    expect(state.activeId).toBe("exotic");
  });

  it("sectionRef/chipRef remove their element when called with null", () => {
    mount();
    registerSection("classic", -50);
    registerSection("premium", 60);
    scroll();
    expect(state.activeId).toBe("premium");

    // Unregistering "premium" (as if it scrolled out of the DOM) leaves
    // only "classic" to measure.
    act(() => {
      state.sectionRef("premium")(null);
    });
    scroll();
    expect(state.activeId).toBe("classic");
  });
});

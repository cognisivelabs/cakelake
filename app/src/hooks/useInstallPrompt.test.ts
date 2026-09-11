import { afterEach, describe, expect, it } from "vitest";
import { isAndroidDevice, isIOSDevice, isIOSSafari, isStandalone } from "@/hooks/useInstallPrompt";

const IPHONE_SAFARI_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
const IPHONE_CHROME_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/124.0.6367.79 Mobile/15E148 Safari/604.1";
// Modern iPadOS Safari reports as a plain Mac UA — it's only
// distinguishable from a real Mac via platform + touch support, which is
// exactly the case isIOSDevice() special-cases.
const IPAD_SAFARI_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15";
const ANDROID_CHROME_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";
const DESKTOP_CHROME_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function setDevice(overrides: { userAgent?: string; platform?: string; maxTouchPoints?: number }) {
  Object.defineProperty(window.navigator, "userAgent", {
    value: overrides.userAgent ?? "",
    configurable: true,
  });
  Object.defineProperty(window.navigator, "platform", {
    value: overrides.platform ?? "",
    configurable: true,
  });
  Object.defineProperty(window.navigator, "maxTouchPoints", {
    value: overrides.maxTouchPoints ?? 0,
    configurable: true,
  });
}

function setStandalone(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    value: (query: string) => ({
      matches: query === "(display-mode: standalone)" && matches,
      media: query,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
      onchange: null,
    }),
    configurable: true,
    writable: true,
  });
}

afterEach(() => {
  setDevice({});
  setStandalone(false);
});

describe("isIOSDevice", () => {
  it("is true for an iPhone UA", () => {
    setDevice({ userAgent: IPHONE_SAFARI_UA, platform: "iPhone", maxTouchPoints: 5 });
    expect(isIOSDevice()).toBe(true);
  });

  it("is true for an iPad reporting as MacIntel with touch support (modern iPadOS)", () => {
    setDevice({ userAgent: IPAD_SAFARI_UA, platform: "MacIntel", maxTouchPoints: 5 });
    expect(isIOSDevice()).toBe(true);
  });

  it("is false for a real Mac (MacIntel with no touch points)", () => {
    setDevice({ userAgent: DESKTOP_CHROME_UA, platform: "MacIntel", maxTouchPoints: 0 });
    expect(isIOSDevice()).toBe(false);
  });

  it("is false for Android", () => {
    setDevice({ userAgent: ANDROID_CHROME_UA, platform: "Linux armv8l", maxTouchPoints: 5 });
    expect(isIOSDevice()).toBe(false);
  });
});

describe("isIOSSafari", () => {
  it("is true for Safari on iPhone", () => {
    setDevice({ userAgent: IPHONE_SAFARI_UA, platform: "iPhone", maxTouchPoints: 5 });
    expect(isIOSSafari()).toBe(true);
  });

  it("is false for Chrome on iPhone (CriOS), even though it's an iOS device", () => {
    setDevice({ userAgent: IPHONE_CHROME_UA, platform: "iPhone", maxTouchPoints: 5 });
    expect(isIOSDevice()).toBe(true);
    expect(isIOSSafari()).toBe(false);
  });

  it("is false on Android", () => {
    setDevice({ userAgent: ANDROID_CHROME_UA, platform: "Linux armv8l", maxTouchPoints: 5 });
    expect(isIOSSafari()).toBe(false);
  });
});

describe("isAndroidDevice", () => {
  it("is true for an Android Chrome UA", () => {
    setDevice({ userAgent: ANDROID_CHROME_UA });
    expect(isAndroidDevice()).toBe(true);
  });

  it("is false for iOS and desktop UAs", () => {
    setDevice({ userAgent: IPHONE_SAFARI_UA });
    expect(isAndroidDevice()).toBe(false);

    setDevice({ userAgent: DESKTOP_CHROME_UA });
    expect(isAndroidDevice()).toBe(false);
  });
});

describe("isStandalone", () => {
  it("is true when the display-mode: standalone media query matches", () => {
    setStandalone(true);
    expect(isStandalone()).toBe(true);
  });

  it("is false otherwise", () => {
    setStandalone(false);
    expect(isStandalone()).toBe(false);
  });
});

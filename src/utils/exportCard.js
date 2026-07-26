import { toPng } from "html-to-image";

async function waitForImages(node) {
    const imgs = Array.from(node.querySelectorAll("img"));
    await Promise.all(
        imgs.map((img) =>
            img.complete
                ? Promise.resolve()
                : new Promise((resolve) => {
                      img.onload = resolve;
                      img.onerror = resolve; // don't hang forever on a broken image
                  })
        )
    );
}

// Custom @font-face fonts (e.g. "Dancing Script" used for "Parting Words")
// can still be loading when we snapshot the node. If html-to-image captures
// before the font is ready, it falls back to a system font with different
// metrics for that element, which throws off the layout below it (e.g. the
// quote overlapping the label). document.fonts.ready resolves once all
// fonts requested so far have finished loading/failing.
async function waitForFonts() {
    if (document.fonts && document.fonts.ready) {
        try {
            await document.fonts.ready;
        } catch {
            // ignore — proceed with whatever fonts are available
        }
    }
}

// html-to-image has a known quirk where a font that only just finished
// loading isn't picked up on the very first render pass after it becomes
// ready — a throwaway capture "warms up" the browser's rendering of the
// node with the correct font before we take the real snapshot.
async function warmUpRender(node) {
    try {
        await toPng(node, { pixelRatio: 1, cacheBust: true });
    } catch {
        // ignore — this pass is just a warm-up, errors here aren't fatal
    }
}

export async function downloadCardAsImage(node, filename) {
    if (!node) throw new Error("Nothing to export yet.");
    await waitForImages(node);
    await waitForFonts();
    await warmUpRender(node);
    const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true, backgroundColor: "#ffffff" });
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
}

// Returns "shared" if the native share sheet was used, "downloaded" if we
// fell back to a plain download + clipboard copy (typical on desktop).
export async function shareCardImage(node, filename, caption) {
    if (!node) throw new Error("Nothing to export yet.");
    await waitForImages(node);
    await waitForFonts();
    await warmUpRender(node);
    const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true });
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], filename, { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: caption, text: caption });
        return "shared";
    }

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();

    if (navigator.clipboard && caption) {
        try {
        await navigator.clipboard.writeText(caption);
        } catch {
        // clipboard permission denied — not critical, image still downloaded
        }
    }
    return "downloaded";
}
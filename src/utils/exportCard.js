import { toPng } from "html-to-image";

async function waitForImages(node) {
    const imgs = Array.from(node.querySelectorAll("img"));
    await Promise.all(
        imgs.map(async (img) => {
            if (!img.src) return;
            // img.decode() resolves only once the image is fully decoded and
            // ready to be painted — this is stronger than checking
            // img.complete, which can already be true (e.g. because the
            // same URL was cached from the visible, non-export copy of the
            // photo) even though the browser hasn't finished decoding pixel
            // data for *this* <img> element yet. That gap is what caused the
            // first download after a page load to come out with the photo
            // missing: html-to-image tried to paint it before it was ready.
            try {
                await img.decode();
            } catch {
                // decode() unsupported, or the image failed — fall back to
                // waiting for the load/error event instead of hanging.
                if (!img.complete) {
                    await new Promise((resolve) => {
                        img.onload = resolve;
                        img.onerror = resolve;
                    });
                }
            }
        })
    );
}

// Custom @font-face fonts (e.g. "Dancing Script" used for "Parting Words")
// can still be loading when we snapshot the node. If html-to-image captures
// before the font is ready, it falls back to a system font with different
// metrics for that element, which throws off the layout below it (e.g. the
// quote overlapping the label).
async function waitForFonts() {
    try {
        if (document.fonts && document.fonts.load) {
            // Explicitly request the exact font used for "Parting Words".
            // This guarantees it's loaded even if the browser hasn't
            // gotten around to painting it yet for some reason — we don't
            // want to depend on timing/visibility of the live card.
            await document.fonts.load('400 24px "Dancing Script"');
            await document.fonts.load('700 24px "Dancing Script"');
        }
        if (document.fonts && document.fonts.ready) {
            // Also wait for every other in-flight font on the page.
            await document.fonts.ready;
        }
    } catch {
        // ignore — proceed with whatever fonts are available
    }
}

// html-to-image has a known quirk where a font that only just finished
// loading isn't picked up on the very first render pass after it becomes
// ready — a throwaway capture "warms up" the browser's rendering of the
// node with the correct font before we take the real snapshot.
async function warmUpRender(node) {
    try {
        // skipFonts: we already force fonts to be loaded via waitForFonts()
        // above, so html-to-image doesn't need to re-fetch and inline them
        // itself — that internal fetch was a source of unhelpful failures.
        //
        // NOTE: deliberately no cacheBust here. cacheBust appends a random
        // query string to every <img> src it finds so it can force a fresh
        // fetch — but blob: URLs (which the photo now uses, see showCard.jsx)
        // are exact-match tokens that can't have anything appended to them.
        // Doing so turns them into a URL the browser never registered,
        // which 404s as ERR_FILE_NOT_FOUND. We don't need cache-busting
        // anyway now: the photo is a fresh blob URL every time, and the
        // font is already forced to load above.
        await toPng(node, { pixelRatio: 1, skipFonts: true });
    } catch {
        // ignore — this pass is just a warm-up, errors here aren't fatal
    }
}

export async function downloadCardAsImage(node, filename) {
    if (!node) throw new Error("Nothing to export yet.");
    await Promise.all([waitForImages(node), waitForFonts()]);
    await warmUpRender(node);
    const dataUrl = await toPng(node, { pixelRatio: 2, backgroundColor: "#ffffff", skipFonts: true });
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
}

// Returns "shared" if the native share sheet was used, "downloaded" if we
// fell back to a plain download + clipboard copy (typical on desktop).
export async function shareCardImage(node, filename, caption) {
    if (!node) throw new Error("Nothing to export yet.");
    await Promise.all([waitForImages(node), waitForFonts()]);
    await warmUpRender(node);
    const dataUrl = await toPng(node, { pixelRatio: 2, skipFonts: true });
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
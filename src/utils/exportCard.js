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

// Mobile Safari has a known bug where img.decode() resolves before the
// decoded pixels are actually available to be painted/captured — it's
// "telling us it's ready" a step too early. That's why the very first
// export after a page load came out missing the front photo, while every
// export after that (once Safari had quietly caught up) was fine.
// Waiting two animation frames forces the browser through at least one real
// paint cycle before we hand the node to html-to-image, closing that gap.
function waitForNextPaint() {
    return new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
}

// html-to-image has a known quirk (worse on iOS Safari) where the very
// first capture of a node can come out with an <img> blank/missing, even
// after decode()/paint have resolved — some part of the browser's render
// pipeline for that element isn't "warm" yet. A second capture always
// succeeds. The warm-up pass MUST use the exact same options (pixelRatio,
// backgroundColor, etc.) as the real capture — a mismatched pixelRatio
// produces a differently-sized canvas, which Safari treats as a separate
// operation, so it doesn't actually warm up the real one.
async function captureNode(node, options) {
    await toPng(node, options).catch(() => {
        // ignore — this pass is just a warm-up, errors here aren't fatal
    });
    return toPng(node, options);
}

export async function downloadCardAsImage(node, filename) {
    if (!node) throw new Error("Nothing to export yet.");
    await Promise.all([waitForImages(node), waitForFonts()]);
    await waitForNextPaint();
    const dataUrl = await captureNode(node, { pixelRatio: 2, backgroundColor: "#ffffff" });
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
    await waitForNextPaint();
    const dataUrl = await captureNode(node, { pixelRatio: 2 });
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
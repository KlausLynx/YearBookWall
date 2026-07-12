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

export async function downloadCardAsImage(node, filename) {
    if (!node) throw new Error("Nothing to export yet.");
    await waitForImages(node);
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

export function initGridOverlay(selector = ".onboarding-flow__layout", showOverlayOnLoad = false, showOutlinesOnLoad = false) {
    const layout = document.querySelector(selector);

    if (!layout) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    let isVisible = false;
    let animationFrameId = null;
    let previousSignature = "";

    canvas.setAttribute("aria-hidden", "true");
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    canvas.style.display = "none";

    layout.appendChild(canvas);

    function parsePixelTrackList(value) {
        return value
            .split(" ")
            .map((track) => Number.parseFloat(track))
            .filter((track) => Number.isFinite(track));
    }

    function getPixelValue(value) {
        const number = Number.parseFloat(value);
        return Number.isFinite(number) ? number : 0;
    }

    function drawLine(x1, y1, x2, y2, options = {}) {
        ctx.save();

        ctx.beginPath();
        ctx.lineWidth = options.width ?? 1;
        ctx.strokeStyle = options.color ?? "rgba(255, 255, 255, 0.45)";

        if (options.dashed) {
            ctx.setLineDash([4, 4]);
        }

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.restore();
    }

    function drawLabel(text, x, y) {
        ctx.save();

        ctx.font = "20px system-ui, sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fillText(text, x, y);

        ctx.restore();
    }

    function drawOverlay() {
        const rect = layout.getBoundingClientRect();
        const styles = getComputedStyle(layout);

        const devicePixelRatio = window.devicePixelRatio || 1;

        canvas.width = rect.width * devicePixelRatio;
        canvas.height = rect.height * devicePixelRatio;

        ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        ctx.clearRect(0, 0, rect.width, rect.height);

        const columns = parsePixelTrackList(styles.gridTemplateColumns);
        const rows = parsePixelTrackList(styles.gridTemplateRows);

        const columnGap = getPixelValue(styles.columnGap);
        const rowGap = getPixelValue(styles.rowGap);

        const paddingTop = getPixelValue(styles.paddingTop);
        const paddingRight = getPixelValue(styles.paddingRight);
        const paddingBottom = getPixelValue(styles.paddingBottom);
        const paddingLeft = getPixelValue(styles.paddingLeft);

        const gridXStart = paddingLeft;
        const gridYStart = paddingTop;
        const gridXEnd = rect.width - paddingRight;
        const gridYEnd = rect.height - paddingBottom;

        const edgeLineColor = "rgba(255, 255, 255, 0.2)";
        const gapCenterLineColor = "rgba(250, 178, 178, 0.45)";
        const borderLineColor = "rgba(255, 255, 255, 0.55)";

        // Outer grid boundary
        drawLine(gridXStart, gridYStart, gridXEnd, gridYStart, {
            color: borderLineColor,
            width: 1.5,
        });

        drawLine(gridXStart, gridYEnd, gridXEnd, gridYEnd, {
            color: borderLineColor,
            width: 1.5,
        });

        drawLine(gridXStart, gridYStart, gridXStart, gridYEnd, {
            color: borderLineColor,
            width: 1.5,
        });

        drawLine(gridXEnd, gridYStart, gridXEnd, gridYEnd, {
            color: borderLineColor,
            width: 1.5,
        });

        // Column lines
        let currentX = gridXStart;

        columns.forEach((columnWidth, index) => {
            drawLine(currentX, gridYStart, currentX, gridYEnd, {
                color: edgeLineColor,
            });

            drawLabel(String(index + 1), currentX + 4, gridYStart + 14);

            currentX += columnWidth;

            drawLine(currentX, gridYStart, currentX, gridYEnd, {
                color: edgeLineColor,
            });

            if (index < columns.length - 1 && columnGap > 0) {
                const gapCenterX = currentX + columnGap / 2;

                drawLine(gapCenterX, gridYStart, gapCenterX, gridYEnd, {
                    color: gapCenterLineColor,
                    dashed: true,
                });

                currentX += columnGap;
            }
        });

        // Row lines
        let currentY = gridYStart;

        rows.forEach((rowHeight, index) => {
            drawLine(gridXStart, currentY, gridXEnd, currentY, {
                color: edgeLineColor,
            });

            drawLabel(String(index + 1), gridXStart + 6, currentY + 13);

            currentY += rowHeight;

            drawLine(gridXStart, currentY, gridXEnd, currentY, {
                color: edgeLineColor,
            });

            if (index < rows.length - 1 && rowGap > 0) {
                const gapCenterY = currentY + rowGap / 2;

                drawLine(gridXStart, gapCenterY, gridXEnd, gapCenterY, {
                    color: gapCenterLineColor,
                    dashed: true,
                });

                currentY += rowGap;
            }
        });
    }

    function getLayoutSignature() {
        const rect = layout.getBoundingClientRect();
        const styles = getComputedStyle(layout);

        return [
            rect.width,
            rect.height,
            styles.gridTemplateColumns,
            styles.gridTemplateRows,
            styles.columnGap,
            styles.rowGap,
            styles.paddingTop,
            styles.paddingRight,
            styles.paddingBottom,
            styles.paddingLeft,
        ].join("|");
    }

    function watchForChanges() {
        if (!isVisible) return;

        const currentSignature = getLayoutSignature();

        if (currentSignature !== previousSignature) {
            previousSignature = currentSignature;
            drawOverlay();
        }

        animationFrameId = requestAnimationFrame(watchForChanges);
    }

    function showOverlay() {
        isVisible = true;
        canvas.style.display = "block";

        previousSignature = "";
        drawOverlay();
        watchForChanges();
    }

    function hideOverlay() {
        isVisible = false;
        canvas.style.display = "none";

        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    function toggleOverlay() {
        if (isVisible) {
            hideOverlay();
        } else {
            showOverlay();
        }
    }

    function ensureDebugOutlineStyle() {
        let debugStyle = document.querySelector("#debug-outline-style");

        if (debugStyle) return;

        debugStyle = document.createElement("style");
        debugStyle.id = "debug-outline-style";

        debugStyle.textContent = `
        body.debug-outlines *,
        body.debug-outlines *::before,
        body.debug-outlines *::after {
            outline: 2px dotted red !important;
            outline-offset: -1px;
        }
    `;

        document.head.appendChild(debugStyle);
    }

    function toggleDebugOutlines() {
        ensureDebugOutlineStyle();
        document.body.classList.toggle("debug-outlines");
    }

    document.addEventListener("keydown", (event) => {
        const activeElement = document.activeElement;
        const isTyping =
            activeElement &&
            (
                activeElement.tagName === "INPUT" ||
                activeElement.tagName === "TEXTAREA" ||
                activeElement.tagName === "SELECT" ||
                activeElement.isContentEditable
            );

        if (isTyping) return;

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            toggleOverlay();
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            toggleDebugOutlines();
        }
    });

    window.addEventListener("resize", () => {
        if (isVisible) {
            previousSignature = "";
            drawOverlay();
        }
    });

    if (showOverlayOnLoad) {
        showOverlay();
    }

    if (showOutlinesOnLoad) {
        toggleDebugOutlines();
    }
}
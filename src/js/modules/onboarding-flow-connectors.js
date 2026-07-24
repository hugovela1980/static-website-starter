export function initOnboardingFlowConnectors() {
    const onboardingFlowLayout = document.querySelector(
        ".onboarding-flow__layout"
    );

    if (!onboardingFlowLayout) return;

    const svg = onboardingFlowLayout.querySelector(
        "[data-flow-connectors]"
    );

    const layer = onboardingFlowLayout.querySelector(
        "[data-flow-connector-layer]"
    );

    if (!svg || !layer) return;

    const svgNamespace = "http://www.w3.org/2000/svg";


    /* =========================================================
       Responsive layout modes
       ========================================================= */

    const tabletLayoutQuery = window.matchMedia(
        "(max-width: 86.125rem)"
    );

    const mobileLayoutQuery = window.matchMedia(
        "(max-width: 65rem)"
    );


    /* =========================================================
       Desktop connector definitions
       ========================================================= */

    const desktopConnections = [
        {
            from: "step-1",
            to: "step-2",
            fromEdge: "left",
            toAnchor: "top"
        },
        {
            from: "step-2",
            to: "step-3",
            fromEdge: "right",
            toAnchor: "top"
        },
        {
            from: "step-3",
            to: "step-4",
            fromEdge: "left",
            toAnchor: "top"
        },
        {
            from: "step-4",
            to: "step-5",
            fromEdge: "right",
            toAnchor: "top"
        }
    ];


    /* =========================================================
       Tablet connector definitions
  
       The connector alternates between entering the left
       and right sides of the cards.
       ========================================================= */

    const tabletConnections = [
        {
            from: "step-1",
            to: "step-2",
            toEdge: "left"
        },
        {
            from: "step-2",
            to: "step-3",
            toEdge: "right"
        },
        {
            from: "step-3",
            to: "step-4",
            toEdge: "left"
        },
        {
            from: "step-4",
            to: "step-5",
            toEdge: "right"
        },
        {
            from: "step-5",
            to: "goal-target",
            toEdge: "left",
            fromXRatio: 0.1
        }
    ];


    /* =========================================================
       Layout mode
       ========================================================= */

    function getLayoutMode() {
        if (mobileLayoutQuery.matches) {
            return "mobile";
        }

        if (tabletLayoutQuery.matches) {
            return "tablet";
        }

        return "desktop";
    }


    /* =========================================================
       SVG utilities
       ========================================================= */

    function createSvgElement(
        tagName,
        attributes = {}
    ) {
        const element = document.createElementNS(
            svgNamespace,
            tagName
        );

        Object.entries(attributes).forEach(
            ([name, value]) => {
                element.setAttribute(
                    name,
                    value
                );
            }
        );

        return element;
    }


    /* =========================================================
       DOM measurement utilities
       ========================================================= */

    function getNode(nodeName) {
        return onboardingFlowLayout.querySelector(
            `[data-flow-node="${nodeName}"]`
        );
    }

    function getRectInLayout(element) {
        const layoutRect =
            onboardingFlowLayout.getBoundingClientRect();

        const elementRect =
            element.getBoundingClientRect();

        return {
            left:
                elementRect.left
                - layoutRect.left,

            right:
                elementRect.right
                - layoutRect.left,

            top:
                elementRect.top
                - layoutRect.top,

            bottom:
                elementRect.bottom
                - layoutRect.top,

            width:
                elementRect.width,

            height:
                elementRect.height
        };
    }


    /* =========================================================
       Desktop connector geometry
       ========================================================= */

    function getDesktopFromPoint(
        element,
        edge
    ) {
        const rect =
            getRectInLayout(element);

        if (edge === "left") {
            return {
                x: rect.left,
                y:
                    rect.top
                    + rect.height / 2
            };
        }

        return {
            x: rect.right,
            y:
                rect.top
                + rect.height / 2
        };
    }

    function getDesktopToPoint(
        element,
        anchor
    ) {
        const rect =
            getRectInLayout(element);

        if (anchor === "center") {
            return {
                x:
                    rect.left
                    + rect.width / 2,

                y:
                    rect.top
                    + rect.height / 2
            };
        }

        /*
         * Leaves room for the SVG arrowhead
         * immediately above the target card.
         */
        const arrowTipGap = 25;

        return {
            x:
                rect.left
                + rect.width / 2,

            y:
                rect.top
                - arrowTipGap
        };
    }

    function getDesktopConnectorGeometry(
        connection,
        fromElement,
        toElement
    ) {
        const start =
            getDesktopFromPoint(
                fromElement,
                connection.fromEdge
            );

        const end =
            getDesktopToPoint(
                toElement,
                connection.toAnchor
            );

        return {
            start,

            pathData:
                `M ${start.x} ${start.y} `
                + `H ${end.x} `
                + `V ${end.y}`
        };
    }


    /* =========================================================
       Tablet connector geometry
  
       Each connector:
  
       1. Begins on the bottom edge of the previous card.
       2. Travels vertically through the offset area.
       3. Turns toward the side of the next card.
       ========================================================= */

    function getTabletConnectorGeometry(
        connection,
        fromElement,
        toElement
    ) {
        const fromRect =
            getRectInLayout(fromElement);

        const toRect =
            getRectInLayout(toElement);

        /*
         * Keeps the end of the line slightly outside
         * the card so the SVG arrowhead approaches
         * the border cleanly.
         */
        const arrowTipGap = 25;

        const endY =
            toRect.top
            + toRect.height / 2;


        /*
         * Next card is shifted to the right.
         *
         * Place the vertical portion midway between
         * the two cards' left edges.
         */
        if (connection.toEdge === "left") {
            const railX =
                (
                    fromRect.left
                    + toRect.left
                )
                / 2;

            const start = {
                x: railX,
                y: fromRect.bottom
            };

            const endX =
                toRect.left
                - arrowTipGap;

            return {
                start,

                pathData:
                    `M ${start.x} ${start.y} `
                    + `V ${endY} `
                    + `H ${endX}`
            };
        }


        /*
         * Next card is shifted to the left.
         *
         * Place the vertical portion midway between
         * the two cards' right edges.
         */
        const defaultRailX =
            (
                fromRect.right
                + toRect.right
            )
            / 2;

        const railX =
            connection.fromXRatio !== undefined

                ? fromRect.left
                + fromRect.width
                * connection.fromXRatio

                : defaultRailX;

        const start = {
            x: railX,
            y: fromRect.bottom
        };

        const endX =
            toRect.right
            + arrowTipGap;

        return {
            start,

            pathData:
                `M ${start.x} ${start.y} `
                + `V ${endY} `
                + `H ${endX}`
        };
    }


    /* =========================================================
       Shared connector renderer
       ========================================================= */

    function drawConnector(
        connection,
        layoutMode
    ) {
        const fromElement =
            getNode(connection.from);

        const toElement =
            getNode(connection.to);

        if (
            !fromElement
            || !toElement
        ) {
            return;
        }

        const geometry =
            layoutMode === "tablet"

                ? getTabletConnectorGeometry(
                    connection,
                    fromElement,
                    toElement
                )

                : getDesktopConnectorGeometry(
                    connection,
                    fromElement,
                    toElement
                );

        const {
            start,
            pathData
        } = geometry;


        /* Glow path */

        const glowPath =
            createSvgElement(
                "path",
                {
                    class:
                        "onboarding-flow__connector "
                        + "onboarding-flow__connector--glow",

                    d: pathData
                }
            );


        /* Main connector */

        const mainPath =
            createSvgElement(
                "path",
                {
                    class:
                        "onboarding-flow__connector",

                    d:
                        pathData,

                    "marker-end":
                        "url(#onboarding-flow-arrowhead)"
                }
            );


        /* Starting-point glow */

        const dotGlow =
            createSvgElement(
                "circle",
                {
                    class:
                        "onboarding-flow__connector-dot--glow",

                    cx:
                        start.x,

                    cy:
                        start.y,

                    r:
                        18
                }
            );


        /* Starting-point dot */

        const dot =
            createSvgElement(
                "circle",
                {
                    class:
                        "onboarding-flow__connector-dot",

                    cx:
                        start.x,

                    cy:
                        start.y,

                    r:
                        10
                }
            );


        layer.appendChild(
            glowPath
        );

        layer.appendChild(
            mainPath
        );

        layer.appendChild(
            dotGlow
        );

        layer.appendChild(
            dot
        );
    }


    /* =========================================================
       Connector update
       ========================================================= */

    function updateConnectors() {
        const layoutRect =
            onboardingFlowLayout.getBoundingClientRect();

        svg.setAttribute(
            "viewBox",
            `0 0 ${layoutRect.width} ${layoutRect.height}`
        );

        svg.setAttribute(
            "width",
            layoutRect.width
        );

        svg.setAttribute(
            "height",
            layoutRect.height
        );


        /*
         * Remove the paths from the previous
         * layout calculation.
         */
        layer.replaceChildren();


        const layoutMode =
            getLayoutMode();


        /*
         * Do not draw connectors once the page
         * reaches the smaller-screen layout.
         */
        if (
            layoutMode === "mobile"
        ) {
            return;
        }


        const activeConnections =
            layoutMode === "tablet"

                ? tabletConnections

                : desktopConnections;


        activeConnections.forEach(
            (connection) => {
                drawConnector(
                    connection,
                    layoutMode
                );
            }
        );
    }


    /* =========================================================
       Scheduled updates
       ========================================================= */

    let animationFrameId = null;

    function scheduleConnectorUpdate() {
        if (animationFrameId) {
            window.cancelAnimationFrame(
                animationFrameId
            );
        }

        animationFrameId =
            window.requestAnimationFrame(
                () => {
                    updateConnectors();

                    animationFrameId =
                        null;
                }
            );
    }


    /* =========================================================
       Event listeners
       ========================================================= */

    window.addEventListener(
        "load",
        scheduleConnectorUpdate
    );

    window.addEventListener(
        "resize",
        scheduleConnectorUpdate
    );

    tabletLayoutQuery.addEventListener(
        "change",
        scheduleConnectorUpdate
    );

    mobileLayoutQuery.addEventListener(
        "change",
        scheduleConnectorUpdate
    );


    /* =========================================================
       Font loading
       ========================================================= */

    if (document.fonts) {
        document.fonts.ready.then(
            scheduleConnectorUpdate
        );
    }


    /* =========================================================
       Element resize observation
       ========================================================= */

    if (
        "ResizeObserver"
        in window
    ) {
        const resizeObserver =
            new ResizeObserver(
                scheduleConnectorUpdate
            );

        resizeObserver.observe(
            onboardingFlowLayout
        );


        /*
         * Observe every card once, even though the
         * same cards appear in both configuration arrays.
         */
        const nodeNames =
            new Set(
                [
                    ...desktopConnections,
                    ...tabletConnections
                ]
                    .flatMap(
                        ({ from, to }) => [
                            from,
                            to
                        ]
                    )
            );


        nodeNames.forEach(
            (nodeName) => {
                const node =
                    getNode(nodeName);

                if (node) {
                    resizeObserver.observe(
                        node
                    );
                }
            }
        );
    }


    /* =========================================================
       Initial draw
       ========================================================= */

    scheduleConnectorUpdate();
}
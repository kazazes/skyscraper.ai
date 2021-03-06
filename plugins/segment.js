import consola from "consola";

export default ({ app }) => {
  if (process.server) {
    return;
  }

  const w = window;

  const analytics = (w.analytics = w.analytics || []);
  if (!analytics.initialize) {
    if (analytics.invoked) {
      w.console &&
        console.error &&
        console.error("Segment snippet included twice.");
    } else {
      analytics.invoked = !0;
      analytics.methods = [
        "trackSubmit",
        "trackClick",
        "trackLink",
        "trackForm",
        "pageview",
        "identify",
        "reset",
        "group",
        "track",
        "ready",
        "alias",
        "debug",
        "page",
        "once",
        "off",
        "on",
      ];
      analytics.factory = function (t) {
        return function () {
          const e = Array.prototype.slice.call(arguments);
          e.unshift(t);
          analytics.push(e);
          return analytics;
        };
      };
      for (let t = 0; t < analytics.methods.length; t++) {
        const e = analytics.methods[t];
        analytics[e] = analytics.factory(e);
      }
      analytics.load = function (t, e) {
        const n = document.createElement("script");
        n.type = "text/javascript";
        n.async = !0;
        n.src =
          "https://cdn.segment.com/analytics.js/v1/" + t + "/analytics.min.js";
        const a = document.getElementsByTagName("script")[0];
        a.parentNode.insertBefore(n, a);
        analytics._loadOptions = e;
      };
      analytics.SNIPPET_VERSION = "4.1.0";
      analytics.load("bLN5L85xYhDthdQol0oc5eKYCgKbNFju");
      analytics.page();
    }

    app.router.afterEach((to) => {
      analytics.page(to.fullPath);
      if (window.drift) {
        window.drift.page(to.name);
        consola.log(`Drift page set to ${to.name}`);
      } else {
        analytics.ready(() => {
          if (window.drift) {
            consola.debug(`Drift page set to ${to.name}`);
            window.drift.page(to.name);
          } else {
            consola.warn(
              "Segment loaded but drift property not found on window."
            );
          }
        });
      }
    });
  }
};

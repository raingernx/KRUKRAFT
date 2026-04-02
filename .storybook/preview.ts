import type { Preview } from "@storybook/nextjs";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "surface",
      values: [
        { name: "surface", value: "#f8fafc" },
        { name: "white", value: "#ffffff" },
        { name: "ink", value: "#0f172a" },
      ],
    },
    options: {
      storySort: {
        order: ["Primitives", "Components"],
      },
    },
  },
};

export default preview;

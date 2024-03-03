import { translate } from "@docusaurus/Translate";

export type Tag = {
  label: string;
  description: string;
  color: string;
  reference?: string;
  link?: string;
};

export type TagType =
  | "favorite"
  | "language:javascript"
  | "language:nodejs"
  | "language:csharp"
  | "language:php"
  | "language:react"
  | "language:ruby"
  | "language:python"
  | "sdk:swml"
  | "sdk:relayrealtime"
  | "sdk:relay"
  | "sdk:relaybrowser3"
  | "sdk:relaybrowser2"
  | "sdk:compatibility"
  | "product:ai"
  | "product:voice"
  | "product:messaging"
  | "product:chat"
  | "product:video"
  | "product:fax";

export const Tags: { [type in TagType]: Tag } = {
  favorite: {
    label: translate({ message: "Favorite" }),
    description: translate({
      message: "",
      id: "showcase.tag.favorite.description",
    }),
    color: "#e9669e",
  },
  "language:javascript": {
    label: translate({ message: "JavaScript" }),
    description: translate({
      message: "",
      id: "showcase.tag.language:javascript.description",
    }),
    color: "#F0DB4F",
  },

  "language:nodejs": {
    label: translate({ message: "Node.js" }),
    description: translate({
      message: "",
      id: "showcase.tag.language:nodejs.description",
    }),
    color: "#89D42C",
  },

  "language:csharp": {
    label: translate({ message: "C#/.Net" }),
    description: translate({
      message: "",
      id: "showcase.tag.language:csharp.description",
    }),
    color: "#1384C8",
  },

  "language:php": {
    label: translate({ message: "PHP" }),
    description: translate({
      message: "",
      id: "showcase.tag.language:php.description",
    }),
    color: "#6181B6",
  },

  "language:react": {
    label: translate({ message: "React" }),
    description: translate({
      message: "",
      id: "showcase.tag.language:react.description",
    }),
    color: "#53C1DE",
  },

  "language:ruby": {
    label: translate({ message: "Ruby" }),
    description: translate({
      message: "",
      id: "showcase.tag.language:ruby.description",
    }),
    color: "#D91505", // Facebook blue
  },

  "language:python": {
    label: translate({ message: "Python" }),
    description: translate({
      message: "",
      id: "showcase.tag.language:python.description",
    }),
    color: "#3372A7",
  },

  "sdk:swml": {
    label: translate({ message: "SWML" }),
    description: translate({
      message: "",
      id: "showcase.tag.sdk:swml.description",
    }),
    color: "#F22F46",
    reference: "Reference",
    link: "/sdks/reference/swml/introduction"
  },

  "sdk:relayrealtime": {
    label: translate({ message: "Relay Realtime SDK (v3)" }),
    description: translate({
      message: "",
      id: "showcase.tag.sdk:relayrealtime.description",
    }),
    color: "#044CF6",
    reference: "Reference",
    link: "/sdks/reference/realtime-sdk"
  },

  "sdk:relay": {
    label: translate({ message: "Relay SDK (v2)" }),
    description: translate({
      message: "",
      id: "showcase.tag.sdk:relay.description",
    }),
    color: "#9BB7FB",
    reference: "Reference",
    link: "/sdks"
  },

  "sdk:relaybrowser3": {
    label: translate({ message: "Relay Browser SDK (v3)" }),
    description: translate({
      message: "",
      id: "showcase.tag.sdk:relaybrowser3.description",
    }),
    color: "#044CF6",
    reference: "Reference",
    link: "/sdks/reference/browser-sdk/"
  },

  "sdk:relaybrowser2": {
    label: translate({ message: "Relay Browser SDK (v2)" }),
    description: translate({
      message: "",
      id: "showcase.tag.sdk:relaybrowser2.description",
    }),
    color: "#9BB7FB",
    reference: "Reference",
    link: "https://docs.signalwire.com/reference/relay-sdk-js"
  },

  "sdk:compatibility": {
    label: translate({ message: "Compatibility API" }),
    description: translate({
      message: "",
      id: "showcase.tag.sdk:compatibility.description",
    }),
    color: "#F22F46",
    reference: "Reference",
    link: "/compatibility-api"
  },

  "product:ai": {
    label: translate({ message: "AI" }),
    description: translate({
      message: "",
      id: "showcase.tag.product:ai.description",
    }),
    color: "#F0DB4F",
    reference: "Overview",
    link: "/sdks/reference/swml/methods/ai/"
  },

  "product:voice": {
    label: translate({ message: "Voice" }),
    description: translate({
      message: "",
      id: "showcase.tag.product:voice.description",
    }),
    color: "#9BB7FB",
    reference: "Overview",
    link: "/guides/voice-overview"
  },

  "product:messaging": {
    label: translate({ message: "Messaging" }),
    description: translate({
      message: "",
      id: "showcase.tag.product:messaging.description",
    }),
    color: "#F22F46",
    reference: "Overview",
    link: "/guides/messaging-overview"
  },

  "product:chat": {
    label: translate({ message: "Chat" }),
    description: translate({
      message: "",
      id: "showcase.tag.product:chat.description",
    }),
    color: "#F0DB4F",
    reference: "Overview",
    link: "/guides/chat-overview"
  },

  "product:video": {
    label: translate({ message: "Video" }),
    description: translate({
      message: "",
      id: "showcase.tag.product:video.description",
    }),
    color: "#044CF6",
    reference: "Overview",
    link: "/guides/video-overview"
  },

  "product:fax": {
    label: translate({ message: "Fax" }),
    description: translate({
      message: "",
      id: "showcase.tag.product:fax.description",
    }),
    color: "#F22F46",
    reference: "Overview",
    link: "/guides/fax-overview"
  },
};

export const TagList = Object.keys(Tags) as TagType[];

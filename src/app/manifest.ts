import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SiwdaCars - سوق السيارات في السويداء",
    short_name: "SiwdaCars",
    description: "أول منصة متخصصة في بيع وشراء السيارات في السويداء",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#D61A22",
    dir: "rtl",
    lang: "ar",
    icons: [
      { src: "/logo.png", sizes: "any", type: "image/png" },
    ],
  }
}

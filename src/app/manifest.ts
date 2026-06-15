import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Auto Syria - سوق السيارات في سوريا",
    short_name: "Auto Syria",
    description: "سوق السيارات الأول في سوريا - بيع وشراء السيارات المستعملة والجديدة",
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

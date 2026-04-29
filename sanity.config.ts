/**
 * Sanity Studio config — mở tại /studio khi deploy.
 * Cần NEXT_PUBLIC_SANITY_PROJECT_ID trong .env.local trước khi dùng.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemas } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "farmstay-vn",
  title: "Farmstay.vn CMS",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Nội dung")
          .items([
            S.listItem()
              .title("Bài viết")
              .schemaType("post")
              .child(
                S.documentList().title("Bài viết").filter('_type == "post"')
              ),
            S.listItem()
              .title("Farmstay")
              .schemaType("farmstay")
              .child(
                S.documentList().title("Farmstay").filter('_type == "farmstay"')
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemas },
});

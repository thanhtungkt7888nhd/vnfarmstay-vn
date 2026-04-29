/* eslint-disable @typescript-eslint/no-explicit-any */
/** Schema Sanity cho bài viết blog/hướng dẫn */
export default {
  name: "post",
  title: "Bài viết",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Tiêu đề",
      type: "string",
      validation: (R: any) => R.required().max(60),
    },
    {
      name: "slug",
      title: "Slug URL",
      type: "slug",
      options: { source: "title" },
      validation: (R: any) => R.required(),
    },
    {
      name: "excerpt",
      title: "Tóm tắt (≤160 ký tự)",
      type: "text",
      rows: 2,
      validation: (R: any) => R.max(160),
    },
    {
      name: "coverImage",
      title: "Ảnh bìa",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "content",
      title: "Nội dung",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    },
    {
      name: "category",
      title: "Danh mục",
      type: "string",
      options: {
        list: [
          { title: "Hướng dẫn pháp lý", value: "phap-ly" },
          { title: "Kinh nghiệm vận hành", value: "van-hanh" },
          { title: "Review farmstay", value: "review" },
          { title: "Nông nghiệp & thiên nhiên", value: "nong-nghiep" },
          { title: "Tin tức", value: "tin-tuc" },
        ],
      },
    },
    { name: "tags", title: "Tags", type: "array", of: [{ type: "string" }] },
    { name: "author", title: "Tác giả", type: "string" },
    {
      name: "readTime",
      title: "Thời gian đọc (phút)",
      type: "number",
      description:
        "Ước tính số phút đọc — để trống thì tự tính từ độ dài nội dung",
    },
    {
      name: "relatedPosts",
      title: "Bài viết liên quan",
      type: "array",
      of: [{ type: "reference", to: [{ type: "post" }] }],
      validation: (R: any) => R.max(4),
      description: "Chọn tối đa 4 bài viết liên quan — hiển thị cuối bài",
    },
    {
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", title: "Câu hỏi", type: "string" },
            { name: "answer", title: "Trả lời", type: "text" },
          ],
        },
      ],
    },
    {
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        { name: "metaTitle", title: "Meta Title (≤60)", type: "string" },
        {
          name: "metaDescription",
          title: "Meta Description (≤160)",
          type: "text",
          rows: 2,
        },
      ],
    },
    { name: "publishedAt", title: "Ngày xuất bản", type: "datetime" },
    { name: "updatedAt", title: "Ngày cập nhật", type: "datetime" },
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "coverImage" },
  },
};

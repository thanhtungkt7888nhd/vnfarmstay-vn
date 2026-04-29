/* eslint-disable @typescript-eslint/no-explicit-any */
/** Schema Sanity cho mỗi farmstay listing */
export default {
  name: "farmstay",
  title: "Farmstay",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Tên farmstay",
      type: "string",
      validation: (R: any) => R.required(),
    },
    {
      name: "slug",
      title: "Slug URL",
      type: "slug",
      options: { source: "name" },
      validation: (R: any) => R.required(),
    },
    { name: "province", title: "Tỉnh / Thành phố", type: "string" },
    { name: "location", title: "Địa chỉ hiển thị", type: "string" },
    {
      name: "region",
      title: "Khu vực",
      type: "string",
      options: {
        list: [
          { title: "Miền Bắc", value: "north" },
          { title: "Miền Trung", value: "central" },
          { title: "Miền Nam", value: "south" },
        ],
      },
    },
    { name: "lat", title: "Vĩ độ (GPS)", type: "number" },
    { name: "lng", title: "Kinh độ (GPS)", type: "number" },
    { name: "price", title: "Giá/đêm (VNĐ)", type: "number" },
    { name: "rating", title: "Đánh giá trung bình", type: "number" },
    { name: "reviewCount", title: "Số lượt đánh giá", type: "number" },
    {
      name: "tags",
      title: "Tags trải nghiệm",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "badges",
      title: "Badges",
      type: "array",
      of: [
        { type: "string", options: { list: ["verified", "new", "featured"] } },
      ],
    },
    {
      name: "images",
      title: "Hình ảnh",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    },
    { name: "description", title: "Mô tả", type: "text", rows: 5 },
    {
      name: "highlights",
      title: "Điểm nổi bật",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "amenities",
      title: "Tiện ích",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        { name: "metaTitle", title: "Meta Title", type: "string" },
        {
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          rows: 2,
        },
      ],
    },
    { name: "publishedAt", title: "Ngày đăng", type: "datetime" },
  ],
  preview: {
    select: { title: "name", subtitle: "location" },
  },
};

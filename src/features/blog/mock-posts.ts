/**
 * Mock data bài viết blog — dùng khi Sanity chưa được cấu hình.
 * Mỗi bài có đủ fields để hiển thị đúng UI.
 */
import type { SanityPost } from "./types";

export const MOCK_POSTS: SanityPost[] = [
  {
    _id: "mock-1",
    title: "Farmstay là gì? Cơ hội kinh doanh nông nghiệp sinh thái bền vững",
    slug: { current: "farmstay-la-gi" },
    excerpt:
      "Farmstay kết hợp nông trại và chỗ nghỉ — xu hướng du lịch nông nghiệp đang bùng nổ tại Việt Nam. Tìm hiểu định nghĩa, mô hình vận hành và cơ hội đầu tư.",
    category: "van-hanh",
    tags: ["farmstay", "du lịch nông nghiệp", "đầu tư"],
    author: "Nhà Hoạch Định",
    publishedAt: "2026-04-20T08:00:00Z",
    readTime: 8,
    faq: [
      {
        question: "Farmstay khác homestay như thế nào?",
        answer:
          "Farmstay gắn với hoạt động nông nghiệp (trồng trọt, chăn nuôi, thu hoạch), còn homestay chỉ là lưu trú tại nhà dân.",
      },
      {
        question: "Chi phí mở farmstay khoảng bao nhiêu?",
        answer:
          "Tuỳ quy mô: mô hình nhỏ 5–10 khách tốn 500 triệu–2 tỷ, mô hình vừa 20–30 khách cần 2–5 tỷ đồng.",
      },
    ],
  },
  {
    _id: "mock-2",
    title: "Thủ tục pháp lý mở farmstay 2026: 7 bước từ A đến Z",
    slug: { current: "thu-tuc-phap-ly-mo-farmstay" },
    excerpt:
      "Hướng dẫn chi tiết 7 bước xin phép kinh doanh farmstay hợp pháp tại Việt Nam: đất nông nghiệp, giấy phép kinh doanh, PCCC, an ninh trật tự.",
    category: "phap-ly",
    tags: ["pháp lý", "giấy phép", "đất nông nghiệp"],
    author: "Nhà Hoạch Định",
    publishedAt: "2026-04-18T08:00:00Z",
    readTime: 12,
    faq: [
      {
        question: "Có được xây farmstay trên đất nông nghiệp không?",
        answer:
          "Được — nhưng phải xin chuyển đổi mục đích sử dụng đất hoặc làm thủ tục dịch vụ nông nghiệp kết hợp. Cần tham khảo Sở Tài nguyên & Môi trường địa phương.",
      },
    ],
  },
  {
    _id: "mock-3",
    title: "Review Farmstay Hà Giang: 10 địa điểm đẹp nhất mùa tam giác mạch",
    slug: { current: "review-farmstay-ha-giang" },
    excerpt:
      "Trải nghiệm thực tế 10 farmstay nổi tiếng Hà Giang — từ thung lũng Đồng Văn đến cao nguyên đá Mèo Vạc. Giá phòng, dịch vụ, cung đường di chuyển.",
    category: "review",
    tags: ["hà giang", "review", "tam giác mạch", "du lịch mùa thu"],
    author: "Nhà Hoạch Định",
    publishedAt: "2026-04-15T08:00:00Z",
    readTime: 15,
  },
  {
    _id: "mock-4",
    title:
      "Cách trồng lúa hữu cơ trên ruộng bậc thang — kinh nghiệm từ Mù Cang Chải",
    slug: { current: "trong-lua-huu-co-ruong-bac-thang" },
    excerpt:
      "Bí quyết canh tác lúa hữu cơ trên địa hình dốc: quản lý nước, phân bón sinh học, kiểm soát sâu bệnh tự nhiên. Áp dụng được cho farmstay muốn tăng trải nghiệm.",
    category: "nong-nghiep",
    tags: ["lúa hữu cơ", "ruộng bậc thang", "canh tác", "mù cang chải"],
    author: "Nhà Hoạch Định",
    publishedAt: "2026-04-10T08:00:00Z",
    readTime: 10,
  },
  {
    _id: "mock-5",
    title:
      "Xu hướng du lịch nông nghiệp 2026: Agritourism lên ngôi tại Đông Nam Á",
    slug: { current: "xu-huong-du-lich-nong-nghiep-2026" },
    excerpt:
      "Agritourism tăng trưởng 12%/năm toàn cầu. Việt Nam có lợi thế cạnh tranh lớn nhờ đa dạng địa hình và văn hoá bản địa phong phú.",
    category: "tin-tuc",
    tags: ["agritourism", "xu hướng", "đông nam á", "2026"],
    author: "Nhà Hoạch Định",
    publishedAt: "2026-04-05T08:00:00Z",
    readTime: 7,
  },
  {
    _id: "mock-6",
    title:
      "Vận hành farmstay hiệu quả: từ booking online đến trải nghiệm khách",
    slug: { current: "van-hanh-farmstay-hieu-qua" },
    excerpt:
      "Quy trình vận hành farmstay chuẩn từ A–Z: kênh đặt phòng, quản lý nhân sự, lịch trình trải nghiệm nông nghiệp, xử lý review xấu.",
    category: "van-hanh",
    tags: ["vận hành", "booking", "quản lý", "trải nghiệm"],
    author: "Nhà Hoạch Định",
    publishedAt: "2026-04-01T08:00:00Z",
    readTime: 11,
  },
];

/** Lấy mock post theo slug */
export function getMockPostBySlug(slug: string): SanityPost | null {
  return MOCK_POSTS.find((p) => p.slug.current === slug) ?? null;
}

/** Lấy mock posts theo category */
export function getMockPostsByCategory(category: string): SanityPost[] {
  return MOCK_POSTS.filter((p) => p.category === category);
}

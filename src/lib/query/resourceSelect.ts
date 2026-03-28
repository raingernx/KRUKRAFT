// Shared thumbnail fragment used by card-like list queries.
export const FIRST_PREVIEW_IMAGE_SELECT = {
  previews: {
    take: 1,
    orderBy: { order: "asc" as const },
    select: { imageUrl: true },
  },
} as const;

const RESOURCE_CARD_AUTHOR_SELECT = {
  author: {
    select: {
      name: true,
    },
  },
} as const;

const RESOURCE_CARD_CATEGORY_SELECT = {
  category: {
    select: {
      name: true,
      slug: true,
    },
  },
} as const;

/**
 * Prisma `select` projection for resource-card-style UI.
 *
 * Using `select` instead of `include` means Postgres only returns the columns
 * the current card UI actually renders. Columns omitted from this projection
 * are never transmitted.
 *
 * Preview images are resolved solely from the `previews` relation (take: 1).
 * The `withPreview` helper promotes `previews[0].imageUrl` → `previewUrl`.
 *
 * Tags are intentionally excluded from discover-section queries.
 * The `ResourceCardResource` type marks them optional, so cards render fine.
 */
export const RESOURCE_CARD_BASE_SELECT = {
  id: true,
  title: true,
  slug: true,
  previewUrl: true,
  price: true,
  isFree: true,
  featured: true,
  downloadCount: true,
  createdAt: true,
  _count: {
    select: {
      purchases: true,
    },
  },
  ...RESOURCE_CARD_AUTHOR_SELECT,
  ...RESOURCE_CARD_CATEGORY_SELECT,
  ...FIRST_PREVIEW_IMAGE_SELECT,
} as const;

export const RESOURCE_CARD_SELECT = RESOURCE_CARD_BASE_SELECT;

/**
 * Extended select that also includes tags — used for filtered/search listings
 * where tag badges may be displayed on cards.
 */
export const RESOURCE_CARD_WITH_TAGS_SELECT = {
  ...RESOURCE_CARD_SELECT,
  tags: {
    select: {
      tag: {
        select: {
          id:   true,
          name: true,
          slug: true,
        },
      },
    },
  },
} as const;

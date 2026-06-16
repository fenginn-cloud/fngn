# Project Images

Drop your real project artwork here, organised by project **slug**.

```
public/projects/
  woodora-brand-design/
    cover.jpg
    gallery-1.jpg
    gallery-2.jpg
  doga-real-estate-tourism/
    cover.jpg
    ...
```

Then reference them in `data/projects.ts`:

```ts
{
  slug: "woodora-brand-design",
  coverImage: "/projects/woodora-brand-design/cover.jpg",
  galleryImages: [
    "/projects/woodora-brand-design/gallery-1.jpg",
    "/projects/woodora-brand-design/gallery-2.jpg",
  ],
  // ...
}
```

Any image left out automatically falls back to a generated premium
placeholder, so the site always looks complete.

**Recommended sizes**

| Field            | Ratio | Suggested size |
| ---------------- | ----- | -------------- |
| `coverImage`     | 16:9  | 1600 × 900     |
| `galleryImages`  | 4:3   | 1600 × 1200    |
| `thumbnail`      | 4:3   | 800 × 600      |

export default function ProjectImage({ src, alt, ...props }) {
  return (
    <picture style={{ display: "contents" }}>
      {src === "/portfolio.png" && (
        <source srcSet="/portfolio.webp" type="image/webp" />
      )}
      <img src={src} alt={alt} loading="lazy" decoding="async" {...props} />
    </picture>
  );
}

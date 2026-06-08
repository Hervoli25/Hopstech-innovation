const HEADER_OFFSET = 80;

export function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (!element) return;

  const top =
    element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

  window.scrollTo({ top, behavior: "smooth" });
}

export function handleSectionLink(
  href: string,
  onNavigate?: () => void
): boolean {
  const match = href.match(/^\/#(.+)$/);
  if (!match) return false;

  const sectionId = match[1];
  const isHomePage = window.location.pathname === "/";

  if (isHomePage) {
    scrollToSection(sectionId);
    onNavigate?.();
    return true;
  }

  window.location.href = href;
  onNavigate?.();
  return true;
}

import { useEffect, useState } from "react";
import { Link } from "wouter";
import { enterpriseSectionNav } from "@/content/enterprise";
import { handleSectionLink } from "@/lib/scrollToSection";

const SectionNav = () => {
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState("about");

  useEffect(() => {
    const sectionIds = enterpriseSectionNav
      .filter((item) => !item.href)
      .map((item) => item.id);

    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);

      let current = sectionIds[0];
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= 120) {
          current = id;
        }
      }
      setActiveId(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <nav
      aria-label="Page sections"
      className="fixed left-1/2 top-20 z-40 hidden -translate-x-1/2 md:block"
    >
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-slate-900/95 px-2 py-1.5 shadow-lg backdrop-blur-md">
        {enterpriseSectionNav.map((item) => {
          const isActive = !item.href && activeId === item.id;

          if (item.href) {
            return (
              <Link key={item.id} href={item.href}>
                <a className="rounded-full px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-[var(--hopstec-teal)]">
                  {item.label}
                </a>
              </Link>
            );
          }

          return (
            <a
              key={item.id}
              href={`/#${item.id}`}
              onClick={(event) => handleSectionLink(`/#${item.id}`)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-[var(--hopstec-teal)]/15 text-[var(--hopstec-teal)]"
                  : "text-gray-400 hover:text-[var(--hopstec-teal)]"
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default SectionNav;

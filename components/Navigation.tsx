"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "hero", label: "Top" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="fixed right-8 top-1/2 z-50 -translate-y-1/2 hidden lg:block">
      <ul className="flex flex-col gap-4">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => scrollToSection(section.id)}
              className={`group relative flex items-center transition-colors ${
                activeSection === section.id
                  ? "text-black"
                  : "text-black/40 hover:text-black/70"
              }`}
              aria-label={`Scroll to ${section.label}`}
            >
              <span
                className={`absolute -left-8 h-0.5 transition-all ${
                  activeSection === section.id
                    ? "w-6 bg-black"
                    : "w-0 bg-black/40 group-hover:w-4"
                }`}
              />
              <span className="text-xs font-medium uppercase tracking-wider">
                {section.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}


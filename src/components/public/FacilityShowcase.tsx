"use client";

import React, { useState } from "react";

interface Facility {
  title: string;
  category: "learning" | "literacy" | "arts" | "play" | "health";
  badge: string;
  icon: string;
  image: string;
  description: string;
  highlights: string[];
  colSpan: string;
}

const facilities: Facility[] = [
  {
    title: "Naturally Ventilated Learning Studios",
    category: "learning",
    badge: "Classrooms 1–6 & Nursery",
    icon: "air",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJdPlza2Pw5OROLSJbquT0SJJPb4oFtpI3pvNfeZmSK-ynvurL8BHf05UTE1KjIcDTH2Ckx3URzHeuRmjcX9RH3FrmeDmXU6XjCdQbVti_2uf93adG7OJiejMI3bsgq7TjxMd5jPoYYDLJe8YHoPkdKjdyqyudfyP5JFKdQqOJdJj6wPN8j4NZbKcbcyvEPWdK653qctrnOCukVf_yH5VPP8KGvchHlD8LSTEN1VdwT9t-OeTNxhJ4",
    description:
      "Engineered with high timber ceilings, cross-ventilation breezes, and generous natural daylight to support focus. Equipped with height-adjustable ergonomic seating and collaborative workspaces.",
    highlights: ["Natural cross-ventilation", "Acoustic wall linings", "Capped stream size"],
    colSpan: "lg:col-span-7",
  },
  {
    title: "Reading Sanctuary & Pods",
    category: "literacy",
    badge: "Literacy & Storytelling",
    icon: "local_library",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAFdNWyeKQNTKNRoUCCsF4bjQA3i2B_KLFOwEru16m_Ay5uqYy_-i2zIg2McugDGGcwf9U_IWJWPwi1nZjDmYzXgy3DaF3BcQpIeOsRt_v8KvTo98Ro49iwiNQIYfdtlj-o2V_mUhCdICnKQwrfW03GMdnwFBDwidYlWSMK1Qfs4aNd4ZSXNXpCij8JpEbECQ24ceWx1mhObrtvp8j3-1TsCvPmT4t13RZjEamE7_Xn9ysyiVDdBW7x",
    description:
      "A quiet sanctuary housing modern world classics, early readers, and Nigerian literary folklore. Cushioned floor alcoves encourage independent reading and guided storytelling circles.",
    highlights: ["Weekly book borrowing", "Storytelling circle", "Quiet reading nooks"],
    colSpan: "lg:col-span-5",
  },
  {
    title: "Discovery Science & STEM Nook",
    category: "learning",
    badge: "Inquiry Science",
    icon: "science",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD_5O0QTxt_zd5VavZRK4J3S1xcp_ClmI3OQLld0ulf3d7s6rS7s2FhTJeArOWoVOx5pAaStarT-Fm5q9vJdWReau1-LrxX0aIN9GRX0it11ZTQQcfUyFN-00x9klHh0J8f5gTxsrZg0a6sVR0lI4ZOVP0FNw-b7VcC6aMMJAus09GZ9sHXCECObW2cJmAxWH27IPj4bSZrehOAYVwdd-l1jTi88Dg9R_L8a0_lIkm0aCzWzHQr_izA",
    description:
      "Equipped with tactile gears, magnifying bench stands, safe botany test trays, and hands-on kits to anchor early scientific observation and logical reasoning.",
    highlights: ["Botany & plant observation", "Simple machines & gears", "Guided safety protocols"],
    colSpan: "lg:col-span-4",
  },
  {
    title: "Early Years Sensory Courtyard",
    category: "play",
    badge: "Motor Play",
    icon: "park",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBojTo3B6krG50gt5_1Q6wOLRGS3oaiJVpW9hJF3TbIHeBsSxloTzJbcarJwsjDrm91i836NKIe3BSnv8bOShXVgHMoDMwcXy-63vVteGBrs5E_YycYxdcSA_sAofyz4MMQMyBmFXoz8kT7m3k8PCP2J9lXlxV6FN6I72R3DLmK3Wh18yu_ZXmD6K0boj2syUkgtW53kbH8CeqmeAXfQT4I6XcQMmouPYC6drnxMYjHaJrM8cN6vuK",
    description:
      "Shaded pergola shelters, natural water discovery tables, soft grass lawn, and texture walkways that build balance, coordination, and physical confidence.",
    highlights: ["Shaded play pergola", "Sensory water & sand tables", "Child-safe impact surfaces"],
    colSpan: "lg:col-span-4",
  },
  {
    title: "Creative Arts & Cultural Atelier",
    category: "arts",
    badge: "Arts & Heritage",
    icon: "palette",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDiDgsvHmWk4QltctUOzN1ZPrLwm-4RHGzUl6CgSglWragO7eAPJfzWxgqoWNGbbOtlFfpg55kMo-gG-6EhVDYo02va4u6SuxNQxOfdq8oNmpouBzKijr51yuEHbDHb9idTexC4674iclGjwWJC402RVzy0xKSoR_Ci3ITE5Ftd7dG1w5jpQoB9ciY0txjtWQk2jWwWpKQCvH6KRyMPERRPXgWOaY8nN8UyDRs227_tAwQ30i3AvcJr",
    description:
      "An expressive, creative studio with washable surfaces, child-height easels, natural clay modeling, and cultural percussion instruments for music and drama.",
    highlights: ["Tempera painting & easels", "Clay & textile craft", "Cultural music & drama"],
    colSpan: "lg:col-span-4",
  },
  {
    title: "Pupil Wellbeing & First Aid Station",
    category: "health",
    badge: "Safety & Care",
    icon: "health_and_safety",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAlAgMKRmURiCNL0krZ83H3D8MDdY0MfciKmEGstKRbjGGKDFLRYLbXb3_8u92-noqtKa1v7qV7UFnlGiZe06tWGqkhbrjzclCP8wc3JYWRxaCQwKvYIIWhOzHsjX7cEled1teB-DiX7t-fLYuxZKobW1us6xTABJHfAKnD61qfxjRN6sRjds-Crxqn5FQ6bLEXM0tRGexH7PfJnE1BptVt1uBnqIKLqVhnd4Axcb9iWGU21LB2phGv",
    description:
      "Dedicated clean first-aid bay staffed during school hours for gentle restorative care, rest periods, temperature checks, and certified paediatric emergency response.",
    highlights: ["Designated rest cots", "Paediatric first aid kit", "Parent health record logging"],
    colSpan: "lg:col-span-12",
  },
];

const categories = [
  { id: "all", label: "All Spaces" },
  { id: "learning", label: "Learning Studios" },
  { id: "literacy", label: "Library & Literacy" },
  { id: "arts", label: "Creative Arts" },
  { id: "play", label: "Play & Outdoors" },
  { id: "health", label: "Health & Rest" },
] as const;

export default function FacilityShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredFacilities =
    selectedCategory === "all"
      ? facilities
      : facilities.filter((f) => f.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Tab Controls */}
      <div
        role="tablist"
        aria-label="Campus Facility Categories"
        className="inline-flex p-1 rounded-xl bg-surface-container-high overflow-x-auto max-w-full gap-1"
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-lg font-label-md text-xs sm:text-sm font-semibold transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-primary ${
                isActive
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-md">
        {filteredFacilities.map((facility) => (
          <div
            key={facility.title}
            className={`${facility.colSpan} group rounded-2xl bg-surface-container-lowest border border-ink-border/70 p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}
          >
            <div>
              <div className="relative overflow-hidden rounded-xl h-52 sm:h-60 mb-space-md bg-surface-container">
                <img
                  src={facility.image}
                  alt={facility.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary font-label-sm text-xs font-semibold">
                  {facility.badge}
                </span>
              </div>
              <div className="space-y-space-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
                    {facility.title}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-primary text-[22px]"
                  >
                    {facility.icon}
                  </span>
                </div>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {facility.description}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-ink-border/50 text-on-surface-variant font-label-sm text-xs">
              {facility.highlights.map((h) => (
                <span key={h} className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {h}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


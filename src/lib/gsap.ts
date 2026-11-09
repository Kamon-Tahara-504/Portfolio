import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, Flip);

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export { gsap, Flip, ScrollTrigger };

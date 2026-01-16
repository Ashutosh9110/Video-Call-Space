"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./dashboard-menu.css";

const initialValues = {
  dateTime: new Date(),
  description: "",
  link: "",
};

export default function DashboardMenu() {
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();

  const navRef = useRef<HTMLUListElement>(null);
  const animRef = useRef<number | null>(null);
  const activeRef = useRef<HTMLAnchorElement | null>(null);

  const [values, setValues] = useState(initialValues);
  const [meetingState, setMeetingState] = useState<
    "Schedule" | "Instant" | null
  >(null);

  /* ----------------------------- STREAM LOGIC ----------------------------- */

  const createMeeting = async () => {
    if (!user) return router.push("/login");
    if (!client) return router.push("/");

    try {
      if (!values.dateTime) {
        toast("Please select a date and time");
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call("default", id);
      if (!call) throw new Error("Failed to create meeting");

      await call.getOrCreate({
        data: {
          starts_at: values.dateTime.toISOString(),
          custom: { description: values.description || "No description" },
        },
      });

      await call.updateCallMembers({
        update_members: [{ user_id: user.id }],
      });

      if (meetingState === "Instant") {
        toast("Setting up your meeting...");
        router.push(`/meeting/${call.id}`);
      }

      if (meetingState === "Schedule") {
        toast(`Meeting scheduled for ${values.dateTime.toLocaleString()}`);
        router.push("/upcoming");
      }
    } catch (err: any) {
      toast(`Failed to create meeting: ${err.message}`);
    }
  };

  useEffect(() => {
    if (meetingState) createMeeting();
  }, [meetingState]);

  /* ----------------------------- NAV ANIMATION ----------------------------- */

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const items = Array.from(nav.querySelectorAll("a"));

    const animate = (from: number, to: number) => {
      if (animRef.current) clearInterval(animRef.current);

      const start = Date.now();
      animRef.current = window.setInterval(() => {
        const p = Math.min((Date.now() - start) / 500, 1);
        const e = 1 - Math.pow(1 - p, 3);

        const x = from + (to - from) * e;
        const y = -40 * (4 * e * (1 - e));
        const r = 200 * Math.sin(p * Math.PI);

        nav.style.setProperty("--translate-x", `${x}px`);
        nav.style.setProperty("--translate-y", `${y}px`);
        nav.style.setProperty("--rotate-x", `${r}deg`);

        if (p >= 1) {
          clearInterval(animRef.current!);
          animRef.current = null;
          nav.style.setProperty("--translate-y", "0px");
          nav.style.setProperty("--rotate-x", "0deg");
        }
      }, 16);
    };

    const getCurrentPosition = () =>
      parseFloat(nav.style.getPropertyValue("--translate-x")) || 0;

    const getItemCenter = (item: HTMLElement) =>
      item.getBoundingClientRect().left +
      item.offsetWidth / 2 -
      nav.getBoundingClientRect().left -
      5;

    const moveToItem = (item: HTMLElement) => {
      const current = getCurrentPosition();
      const center = getItemCenter(item);
      animate(current, center);
      nav.classList.add("show-indicator");
    };

    const setActiveItem = (item: HTMLAnchorElement) => {
      if (activeRef.current) activeRef.current.classList.remove("active");
      activeRef.current = item;
      item.classList.add("active");
      moveToItem(item);
    };

    const handleMouseLeave = () => {
      if (activeRef.current) moveToItem(activeRef.current);
      else nav.classList.remove("show-indicator");
    };

    items.forEach((item) => {
      item.addEventListener("mouseenter", () => moveToItem(item));
      item.addEventListener("mouseleave", handleMouseLeave);
      item.addEventListener("click", () => setActiveItem(item));
    });

    nav.addEventListener("mouseleave", handleMouseLeave);

    if (items.length) {
      setTimeout(() => setActiveItem(items[0]), 100);
    }

    return () => {
      items.forEach((item) => {
        item.replaceWith(item.cloneNode(true));
      });
    };
  }, []);

  /* ----------------------------- UI HANDLERS ----------------------------- */

  const handleNavAction = (id: string) => {
    switch (id) {
      case "section1":
        setMeetingState("Instant");
        break;
      case "section2":
        if (!values.link) return toast("Paste meeting link first");
        router.push(values.link);
        break;
      case "section3":
        setMeetingState("Schedule");
        break;
      case "section4":
        router.push("/recordings");
        break;
    }
  };

  /* ----------------------------- RENDER ----------------------------- */

  return (
    <>
      <header>
        <nav>
          <ul ref={navRef}>
            <li>
              <a href="#section1" onClick={() => handleNavAction("section1")}>
                New Meeting
              </a>
            </li>
            <li>
              <a href="#section2" onClick={() => handleNavAction("section2")}>
                Join Meeting
              </a>
            </li>
            <li>
              <a href="#section3" onClick={() => handleNavAction("section3")}>
                Schedule
              </a>
            </li>
            <li>
              <a href="#section4" onClick={() => handleNavAction("section4")}>
                Recordings
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* --- BACKGROUND PANELS --- */}
      <section className="container" id="section1">
        <img src="/assets/images/3.avif" alt="" />
      </section>

      <section className="container" id="section2">
        <img src="/assets/images/4.avif" alt="" />
        <div className="overlay-panel">
          <input
            type="text"
            placeholder="Paste meeting link..."
            value={values.link}
            onChange={(e) => setValues({ ...values, link: e.target.value })}
          />
        </div>
      </section>

      <section className="container" id="section3">
        <img src="/assets/images/5.avif" alt="" />
        <div className="overlay-panel">
          <textarea
            placeholder="Meeting description..."
            onChange={(e) =>
              setValues({ ...values, description: e.target.value })
            }
          />
          <DatePicker
            selected={values.dateTime}
            onChange={(date) => setValues({ ...values, dateTime: date! })}
            showTimeSelect
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
          />
        </div>
      </section>

      <section className="container" id="section4">
        <img src="/assets/images/6.avif" alt="" />
      </section>

      {/* --- SVG FILTER --- */}
      <svg style={{ display: "none" }}>
        <defs>
          <filter id="wave-distort" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.0038 0.0038"
              numOctaves="1"
              seed="2"
              result="roughNoise"
            />
            <feGaussianBlur in="roughNoise" stdDeviation="8.5" result="softNoise" />
            <feComposite
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="2"
              k4="0"
              in="softNoise"
              result="mergedMap"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="mergedMap"
              scale="-42"
              xChannelSelector="G"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
}

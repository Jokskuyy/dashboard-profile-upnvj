import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  ChevronDown,
  CircleHelp,
  Gamepad2,
  Hand,
  Keyboard,
  Map,
  MapPin,
  Maximize2,
  Monitor,
  MousePointer2,
  Navigation,
  Route,
  Search,
  Smartphone,
} from "lucide-react";
import { useLanguage } from "../../../contexts/LanguageContext";

type MapMode = "2d" | "3d";
type DeviceMode = "desktop" | "mobile";

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ElementType;
}

interface FaqItem {
  question: string;
  answer: string;
}

const TUTORIALS_ID: Record<MapMode, Record<DeviceMode, TutorialStep[]>> = {
  "2d": {
    desktop: [
      {
        title: "Pilih gedung awal",
        description:
          "Setelah membuka Denah 2D, pilih gedung tempat Anda berada lalu tekan Gunakan sebagai titik awal.",
        icon: MapPin,
      },
      {
        title: "Cari lokasi tujuan",
        description:
          "Klik kolom pencarian, ketik nama gedung, ruangan, atau fasilitas, lalu pilih hasil yang sesuai.",
        icon: Search,
      },
      {
        title: "Ikuti garis rute",
        description:
          "Garis hijau putus-putus menunjukkan jalur terpendek dari pintu gedung awal menuju gedung tujuan.",
        icon: Route,
      },
      {
        title: "Ubah perjalanan",
        description:
          "Gunakan panel kiri bawah untuk mengganti gedung awal atau batalkan navigasi untuk memilih tujuan baru.",
        icon: Navigation,
      },
    ],
    mobile: [
      {
        title: "Buka Denah 2D",
        description:
          "Gunakan posisi landscape atau layar penuh agar label gedung dan jalur lebih mudah dibaca.",
        icon: Maximize2,
      },
      {
        title: "Pilih posisi Anda",
        description:
          "Pada dialog yang muncul, sentuh daftar gedung, pilih lokasi awal, lalu tekan tombol konfirmasi.",
        icon: MapPin,
      },
      {
        title: "Sentuh kolom pencarian",
        description:
          "Ketik nama ruangan atau fasilitas dan sentuh salah satu hasil pencarian untuk membuat rute.",
        icon: Search,
      },
      {
        title: "Baca dan ganti rute",
        description:
          "Ikuti garis hijau. Gulir atau gunakan panel bawah untuk mengganti titik awal dan tujuan.",
        icon: Route,
      },
    ],
  },
  "3d": {
    desktop: [
      {
        title: "Muat pengalaman 3D",
        description:
          "Pilih Denah 3D dan tunggu Unity WebGL selesai dimuat. Kunjungan berikutnya lebih cepat karena file disimpan di cache.",
        icon: Box,
      },
      {
        title: "Aktifkan kontrol",
        description:
          "Klik area permainan. Gunakan W, A, S, D untuk bergerak, Shift untuk berlari, dan Space untuk melompat.",
        icon: Keyboard,
      },
      {
        title: "Arahkan kamera",
        description:
          "Gerakkan mouse untuk melihat sekitar. Tekan ESC saat ingin melepaskan kursor dari permainan.",
        icon: MousePointer2,
      },
      {
        title: "Cari dan ikuti petunjuk",
        description:
          "Cari ruangan atau fasilitas melalui kolom atas, lalu ikuti petunjuk navigasi di dalam lingkungan 3D.",
        icon: Search,
      },
    ],
    mobile: [
      {
        title: "Gunakan layar landscape",
        description:
          "Putar perangkat dan aktifkan layar penuh agar joystick, area kamera, dan pencarian tidak saling menutupi.",
        icon: Maximize2,
      },
      {
        title: "Sentuh untuk mulai",
        description:
          "Setelah Unity selesai dimuat, sentuh area permainan untuk mengaktifkan kontrol layar.",
        icon: Gamepad2,
      },
      {
        title: "Bergerak dan melihat",
        description:
          "Gunakan joystick sebelah kiri untuk berjalan dan geser area kanan untuk mengarahkan kamera.",
        icon: Hand,
      },
      {
        title: "Cari lokasi",
        description:
          "Sentuh kolom pencarian, pilih ruangan atau fasilitas, lalu ikuti petunjuk navigasi 3D.",
        icon: Search,
      },
    ],
  },
};

const FAQS_ID: Record<MapMode, FaqItem[]> = {
  "2d": [
    {
      question: "Mengapa pencarian ruangan mengarah ke gedung?",
      answer:
        "Denah 2D memakai navigasi tingkat gedung. Ruangan dan fasilitas dipetakan ke gedung induknya, lalu rute berhenti di pintu gedung tersebut.",
    },
    {
      question: "Mengapa garis rute belum muncul?",
      answer:
        "Pastikan Anda sudah memilih gedung awal dan hasil pencarian tujuan. Kedua gedung juga harus memiliki titik pintu yang terhubung ke jaringan jalan.",
    },
    {
      question: "Apakah jalur yang dapat dilewati memang disembunyikan?",
      answer:
        "Ya. Graph jalan internal sengaja tidak ditampilkan kepada pengguna. Hanya jalur terpilih yang muncul setelah navigasi dimulai.",
    },
    {
      question: "Bagaimana cara mengganti posisi awal?",
      answer:
        "Setelah map terbuka, gunakan dropdown Mulai dari gedung pada panel kiri bawah. Rute akan dihitung ulang secara otomatis.",
    },
  ],
  "3d": [
    {
      question: "Mengapa Denah 3D membutuhkan waktu untuk dimuat?",
      answer:
        "Unity WebGL perlu mengunduh file permainan sekitar 39 MB pada kunjungan pertama. File akan disimpan di cache agar pemuatan berikutnya lebih cepat.",
    },
    {
      question: "Kursor mouse terkunci di permainan. Bagaimana melepasnya?",
      answer:
        "Tekan tombol ESC pada desktop. Pada perangkat mobile, gunakan tombol keluar layar penuh atau tombol kembali perangkat.",
    },
    {
      question: "Apa kontrol utama Denah 3D?",
      answer:
        "Desktop menggunakan WASD, mouse, Shift, dan Space. Mobile menggunakan joystick kiri dan gestur geser pada sisi kanan layar.",
    },
    {
      question: "Apa yang harus dilakukan jika 3D gagal dimuat?",
      answer:
        "Periksa koneksi internet, nonaktifkan pemblokir script untuk situs ini, lalu muat ulang halaman. Denah 2D tetap dapat dipakai sebagai alternatif ringan.",
    },
  ],
};

const TUTORIALS_EN: Record<MapMode, Record<DeviceMode, TutorialStep[]>> = {
  "2d": {
    desktop: [
      {
        title: "Choose a starting building",
        description:
          "After opening the 2D Map, select the building you are currently in and click Use as starting point.",
        icon: MapPin,
      },
      {
        title: "Search for a destination",
        description:
          "Click the search field, enter a building, room, or facility name, then choose the matching result.",
        icon: Search,
      },
      {
        title: "Follow the route line",
        description:
          "The dashed green line shows the shortest route from the starting building entrance to the destination building.",
        icon: Route,
      },
      {
        title: "Change your journey",
        description:
          "Use the bottom-left panel to change the starting building or cancel navigation and choose another destination.",
        icon: Navigation,
      },
    ],
    mobile: [
      {
        title: "Open the 2D Map",
        description:
          "Use landscape or fullscreen mode so building labels and routes are easier to read.",
        icon: Maximize2,
      },
      {
        title: "Choose your position",
        description:
          "In the dialog, tap the building list, select your starting location, then tap the confirmation button.",
        icon: MapPin,
      },
      {
        title: "Tap the search field",
        description:
          "Enter a room or facility name and tap a search result to generate a route.",
        icon: Search,
      },
      {
        title: "View and change the route",
        description:
          "Follow the green line. Scroll or use the bottom panel to change your starting point and destination.",
        icon: Route,
      },
    ],
  },
  "3d": {
    desktop: [
      {
        title: "Load the 3D experience",
        description:
          "Choose the 3D Map and wait for Unity WebGL to load. Future visits are faster because the files are cached.",
        icon: Box,
      },
      {
        title: "Enable the controls",
        description:
          "Click the game area. Use W, A, S, D to move, Shift to run, and Space to jump.",
        icon: Keyboard,
      },
      {
        title: "Control the camera",
        description:
          "Move the mouse to look around. Press ESC whenever you need to release the cursor from the game.",
        icon: MousePointer2,
      },
      {
        title: "Search and follow directions",
        description:
          "Find a room or facility using the field at the top, then follow the directions in the 3D environment.",
        icon: Search,
      },
    ],
    mobile: [
      {
        title: "Use landscape orientation",
        description:
          "Rotate your device and enable fullscreen so the joystick, camera area, and search field do not overlap.",
        icon: Maximize2,
      },
      {
        title: "Tap to start",
        description:
          "Once Unity finishes loading, tap the game area to enable the on-screen controls.",
        icon: Gamepad2,
      },
      {
        title: "Move and look around",
        description:
          "Use the left joystick to walk and swipe the right side of the screen to control the camera.",
        icon: Hand,
      },
      {
        title: "Search for a location",
        description:
          "Tap the search field, choose a room or facility, then follow the 3D navigation directions.",
        icon: Search,
      },
    ],
  },
};

const FAQS_EN: Record<MapMode, FaqItem[]> = {
  "2d": [
    {
      question: "Why does a room search lead to a building?",
      answer:
        "The 2D map provides building-level navigation. Rooms and facilities are mapped to their parent building, so the route ends at that building's entrance.",
    },
    {
      question: "Why has the route line not appeared?",
      answer:
        "Make sure you have selected both a starting building and a search result. Both buildings must also have entrance points connected to the route network.",
    },
    {
      question: "Are the available walking paths intentionally hidden?",
      answer:
        "Yes. The internal route graph is hidden from visitors. Only the selected route appears after navigation starts.",
    },
    {
      question: "How do I change my starting position?",
      answer:
        "After opening the map, use the Start from building dropdown in the bottom-left panel. The route will be recalculated automatically.",
    },
  ],
  "3d": [
    {
      question: "Why does the 3D Map take time to load?",
      answer:
        "Unity WebGL must download approximately 39 MB on the first visit. The files are cached so subsequent loads are faster.",
    },
    {
      question: "The mouse cursor is locked in the game. How do I release it?",
      answer:
        "Press ESC on desktop. On mobile, use the exit-fullscreen control or your device's back button.",
    },
    {
      question: "What are the main 3D Map controls?",
      answer:
        "Desktop uses WASD, the mouse, Shift, and Space. Mobile uses the left joystick and swipe gestures on the right side of the screen.",
    },
    {
      question: "What should I do if the 3D Map fails to load?",
      answer:
        "Check your connection, disable script blocking for this site, and reload the page. The lightweight 2D Map remains available as an alternative.",
    },
  ],
};

function useDetectedDevice(): DeviceMode {
  const [device, setDevice] = useState<DeviceMode>(() =>
    typeof window !== "undefined" &&
    (window.matchMedia("(max-width: 767px)").matches ||
      window.matchMedia("(pointer: coarse)").matches)
      ? "mobile"
      : "desktop",
  );

  useEffect(() => {
    const viewport = window.matchMedia("(max-width: 767px)");
    const pointer = window.matchMedia("(pointer: coarse)");
    const updateDevice = () =>
      setDevice(viewport.matches || pointer.matches ? "mobile" : "desktop");

    viewport.addEventListener("change", updateDevice);
    pointer.addEventListener("change", updateDevice);
    return () => {
      viewport.removeEventListener("change", updateDevice);
      pointer.removeEventListener("change", updateDevice);
    };
  }, []);

  return device;
}

const MapTutorialFaqSection: React.FC = () => {
  const { language } = useLanguage();
  const isIndonesian = language === "id";
  const detectedDevice = useDetectedDevice();
  const [mode, setMode] = useState<MapMode>("2d");
  const [deviceOverride, setDeviceOverride] = useState<DeviceMode | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const device = deviceOverride ?? detectedDevice;
  const tutorials = isIndonesian ? TUTORIALS_ID : TUTORIALS_EN;
  const faqs = isIndonesian ? FAQS_ID : FAQS_EN;
  const steps = useMemo(() => tutorials[mode][device], [device, mode, tutorials]);

  useEffect(() => {
    setOpenFaq(0);
  }, [mode]);

  return (
    <section
      id="map-tutorial-section"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
    >
      <div className="bg-gradient-to-br from-[#173f23] via-[#2C5F2D] to-[#3d7a3e] px-5 py-7 text-white sm:px-8 sm:py-9">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/15">
            <CircleHelp className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold">
            {isIndonesian ? "Tutorial & FAQ Denah Kampus" : "Campus Map Tutorial & FAQ"}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-green-50/80 sm:text-base">
            {isIndonesian
              ? "Pilih jenis denah. Panduan kontrol akan menyesuaikan perangkat yang sedang Anda gunakan."
              : "Choose a map type. The control guide will adapt to the device you are using."}
          </p>

          <div className="mx-auto mt-6 grid max-w-md grid-cols-2 rounded-xl border border-white/20 bg-black/15 p-1.5">
            {(["2d", "3d"] as MapMode[]).map((item) => {
              const Icon = item === "2d" ? Map : Box;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMode(item)}
                  aria-pressed={mode === item}
                  className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                    mode === item
                      ? "bg-white text-[#2C5F2D] shadow-lg"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {isIndonesian ? "Denah" : "Map"} {item.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-8">
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            {detectedDevice === "mobile" ? (
              <Smartphone className="h-4 w-4 text-[#2C5F2D]" />
            ) : (
              <Monitor className="h-4 w-4 text-[#2C5F2D]" />
            )}
            {isIndonesian ? "Terdeteksi:" : "Detected:"}{" "}
            <span className="font-bold text-slate-800">
              {detectedDevice === "mobile" ? "Mobile" : "Desktop"}
            </span>
          </div>

          <div className="grid grid-cols-2 rounded-lg border border-slate-200 bg-white p-1">
            {(["desktop", "mobile"] as DeviceMode[]).map((item) => {
              const Icon = item === "desktop" ? Monitor : Smartphone;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setDeviceOverride(item)}
                  className={`flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                    device === item
                      ? "bg-[#2C5F2D] text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {item === "desktop" ? "Desktop" : "Mobile"}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[310px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-inner">
            {mode === "2d" ? (
              <>
                <img
                  src={`${import.meta.env.BASE_URL}maps/denah-2d-grass-bright.png`}
                  alt={isIndonesian ? "Pratinjau tutorial denah 2D" : "2D map tutorial preview"}
                  className="absolute inset-0 h-full w-full object-cover opacity-75"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />
                <div className="absolute left-4 top-4 rounded-lg border border-white/20 bg-black/65 px-3 py-2 text-xs font-bold text-white backdrop-blur-sm">
                  {isIndonesian ? "1. Pilih gedung awal" : "1. Choose a starting building"}
                </div>
                <div className="absolute right-4 top-16 rounded-lg border border-white/20 bg-white/90 px-3 py-2 text-xs font-bold text-[#2C5F2D] shadow-lg">
                  {isIndonesian ? "2. Cari tujuan" : "2. Search for a destination"}
                </div>
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider text-green-300">
                    {isIndonesian ? "Denah 2D" : "2D Map"}
                  </p>
                  <h3 className="mt-1 text-xl font-bold">
                    {isIndonesian
                      ? "Pilih asal, cari tujuan, ikuti rute"
                      : "Choose a start, find a destination, follow the route"}
                  </h3>
                </div>
              </>
            ) : device === "desktop" ? (
              <>
                <img
                  src={`${import.meta.env.BASE_URL}maps/tutorial-3d-gameplay.png`}
                  alt={
                    isIndonesian
                      ? "Gameplay Denah 3D di depan Gedung Jenderal Sudirman"
                      : "3D Map gameplay in front of the Jenderal Sudirman Building"
                  }
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/5 to-slate-950/15" />
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-lg border border-white/20 bg-black/65 px-3 py-2 text-xs font-bold text-white backdrop-blur-sm">
                  <Keyboard className="h-3.5 w-3.5" />
                  {isIndonesian ? "WASD untuk bergerak" : "Use WASD to move"}
                </div>
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider text-green-300">
                    {isIndonesian ? "Gameplay Denah 3D" : "3D Map Gameplay"}
                  </p>
                  <h3 className="mt-1 text-xl font-bold">
                    {isIndonesian ? "Jelajahi kampus secara langsung" : "Explore the campus directly"}
                  </h3>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col bg-[radial-gradient(circle_at_top,#326b3b_0%,#112918_45%,#07130b_100%)] p-5 text-white">
                <div className="flex items-center justify-between">
                  <span className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold">Unity WebGL</span>
                  <span className="text-xs text-white/60">
                    {isIndonesian ? "Panduan Mobile" : "Mobile Guide"}
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-center">
                  <div className="grid w-full max-w-sm grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-center">
                      <Gamepad2 className="mx-auto mb-3 h-12 w-12" />
                      <p className="text-sm font-bold">{isIndonesian ? "Joystick kiri" : "Left joystick"}</p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-center">
                      <Hand className="mx-auto mb-3 h-12 w-12" />
                      <p className="text-sm font-bold">{isIndonesian ? "Geser kanan" : "Swipe right side"}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-green-300">
                    {isIndonesian ? "Denah 3D" : "3D Map"}
                  </p>
                  <h3 className="mt-1 text-xl font-bold">
                    {isIndonesian ? "Jelajahi kampus secara langsung" : "Explore the campus directly"}
                  </h3>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {steps.map((step, index) => (
              <article key={step.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-[#2C5F2D]">
                    <step.icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-green-700">
                    {isIndonesian ? "Langkah" : "Step"} {index + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-9 border-t border-slate-200 pt-7">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
              {isIndonesian ? "Bantuan cepat" : "Quick help"}
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">
              FAQ {isIndonesian ? "Denah" : "Map"} {mode.toUpperCase()}
            </h3>
          </div>

          <div className="space-y-2">
            {faqs[mode].map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.question} className="overflow-hidden rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 bg-white px-4 py-4 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50 sm:px-5"
                  >
                    {faq.question}
                    <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-100 bg-slate-50 px-4 py-4 text-sm leading-relaxed text-slate-600 sm:px-5">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapTutorialFaqSection;

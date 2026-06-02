import { BookingForm } from "@/components/BookingForm";
import Image from "next/image";

export default function Home() {
  return (
    <div className="page-backdrop min-h-screen">
      <main className="mx-auto min-h-screen w-full max-w-[680px] px-4 py-10 sm:px-6 sm:py-14">
        <header className="animate-fade-up mb-10 flex flex-col items-center text-center">
          <Image
            src="/logo.svg"
            alt="ExampleIQ"
            width={160}
            height={40}
            priority
            className="mb-7 drop-shadow-sm"
          />
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Premium transportation
          </p>
          <h1 className="font-display text-4xl font-medium leading-tight tracking-tight text-foreground sm:text-5xl">
            Let&apos;s get you on your way!
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            Book airport transfers and private rides in a few steps — tailored
            to your schedule.
          </p>
        </header>

        <div className="booking-card animate-fade-up-delay-1 p-6 sm:p-8">
          <BookingForm />
        </div>

        <p className="animate-fade-up-delay-2 mt-8 text-center text-xs text-muted">
          Secure booking · Real-time route estimates · Returning guest recognition
        </p>
      </main>
    </div>
  );
}

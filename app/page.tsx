import { BookingForm } from "@/components/BookingForm";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-[640px]">
        <header className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/logo.svg"
            alt="ExampleIQ"
            width={160}
            height={40}
            priority
            className="mb-6"
          />
          <h1 className="text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
            Let&apos;s get you on your way!
          </h1>
        </header>

        <BookingForm />
      </div>
    </main>
  );
}

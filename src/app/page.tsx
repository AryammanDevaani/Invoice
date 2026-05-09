import { InvoiceForm } from "@/components/InvoiceForm";

export default function Home() {
  return (
    <main className="min-h-screen py-[30px] px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-[30px]">
        
        {/* Header Area */}
        <div className="text-center py-0.5">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white drop-shadow-sm lowercase">
            invoice
          </h1>
        </div>

        {/* Main Form Component */}
        <InvoiceForm />

      </div>
    </main>
  );
}

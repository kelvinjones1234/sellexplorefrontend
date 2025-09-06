import Navbar from "@/app/(general)/components/navbar/Navbar";

export default function GeneralLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="px-3 sticky top-5 z-30">
        <Navbar />
      </div>
      <main>{children}</main>
    </>
  );
}

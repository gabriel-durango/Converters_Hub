import Header from "../components/Header";
import AdSlot from "../components/AdSlot";

export default function AppLayout({ children, sidebar }) {
  return (
    <>
      <Header />
      <main className="shell">
        <div className="content">{children}</div>
        <aside className="sidebar">
          <AdSlot />
          <div style={{ height: "1rem" }} />
          <AdSlot label="Afiliados / comparadores" />
          {sidebar}
        </aside>
      </main>
    </>
  );
}


import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Footer, Header } from "@/components/Chrome";

/* For URLs that match no page at all. Pages that call notFound() use app/(site)/not-found.tsx. */
export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <section className="band missing">
          <div className="wrap ph1">
            <h1>
              404 <span>not found</span>
            </h1>
            <p>That page doesn&apos;t exist, or it moved.</p>
            <p>
              <Link className="textlink" href="/">
                Back home
                <Icon name="right" />
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

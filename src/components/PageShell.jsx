import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function PageShell({ children }) {
    return (
        <>
            <Header />
            <main className="page">
                <div className="container">{children}</div>
            </main>
            <Footer />
        </>
    );
}

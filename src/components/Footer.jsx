const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
	return <footer className="footer">© {CURRENT_YEAR} Node Blog · React ile yazıldı</footer>;
}

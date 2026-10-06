import { Component } from "react";
import { Link } from "react-router";

export default class ErrorBoundary extends Component {
  state = { error: null, resetKey: this.props.resetKey };

  static getDerivedStateFromError(error) {
    return { error };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.resetKey !== state.resetKey) {
      return { error: null, resetKey: props.resetKey };
    }

    return null;
  }

  componentDidCatch(error, info) {
    console.error("Arayüz hatası:", error.message, info.componentStack);
  }

  render() {
    if (this.state.error === null) {
      return this.props.children;
    }

    return (
      <section className="error-boundary" role="alert">
        <h1 className="page-title">Bu sayfa gösterilirken bir hata oluştu</h1>

        <p>
          Hata tarayıcı konsoluna yazıldı. Tekrar deneyebilir veya başka
          bir sayfaya geçebilirsin.
        </p>

        <div className="form__actions">
          <button
            type="button"
            className="button"
            onClick={() => this.setState({ error: null })}
          >
            Tekrar dene
          </button>
          <Link to="/" className="button button--secondary">
            Ana sayfa
          </Link>
        </div>
      </section>
    );
  }
}

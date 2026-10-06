import useApiHealth from "../hooks/useApiHealth.js";

export default function ApiStatusBanner() {
  const health = useApiHealth();

  if (health.status !== "down") {
    return null;
  }

  return (
    <p className="app-banner app-banner--error" role="alert">
      API'ye ulaşılamıyor. Sunucu durmuş olabilir; 10 saniyede bir
      yeniden deniyorum.
      <button
        type="button"
        className="link-button"
        onClick={health.recheck}
      >
        Şimdi dene
      </button>
    </p>
  );
}
